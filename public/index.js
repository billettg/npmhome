var config,
  serverHost,
  serverPort,
  serverIdentity,
  serverSecret,
  serverBaseURL,
  data,
  theme;

const iconDark = `<img class="icon theme" src="icons/dark.png"></img>`;
const iconLight = `<img class="icon theme" src="icons/light.png"></img>`;
const iconLoading = `<img class="icon" src="icons/loading.png"></img>`;
const iconConnectionError = `<i id="icon-connection-error" class="fa-solid fa-plug-circle-xmark fa-xl"></
i>`; // online

window.onload = async function () {
  const response = await fetch("./config.json");
  config = await response.json();

  serverHost = config.server.host;
  serverPort = config.server.port;
  serverIdentity = config.server.email;
  serverSecret = config.server.password;
  serverBaseURL = `http://${serverHost}:${serverPort}`;

  setTheme(config.appearance.darkmode ? "dark" : "light");

  if (!config.appearance.showheader)
    document.getElementById("header").style.display = "none";
  if (!config.appearance.showfooter)
    document.getElementById("footer").style.display = "none";

  getProxyHosts();
};

async function getToken() {
  try {
    document.getElementById("server-info").innerHTML = iconLoading;
    const response = await fetch(`${serverBaseURL}/api/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: serverIdentity,
        secret: serverSecret,
      }),
    });
    document.getElementById("server-info-box").style.display = "none";
    const data = await response.json();
    return data.token;
  } catch (error) {
    document.getElementById("server-info").innerHTML = iconConnectionError;
  }
}

async function getProxyHosts() {
  try {
    const bearerToken = await getToken();
    const response = await fetch(`${serverBaseURL}/api/nginx/proxy-hosts`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.ok) {
      data = await response.json();
      render();
    } else {
      console.log("Error fetching proxy hosts:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function nextChar(c) {
  return String.fromCharCode(c.charCodeAt() + 1);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.getElementById("theme-box").innerHTML =
    theme == "dark" ? iconDark : iconLight;
}

async function getFavicon(url, hostname) {
  const corsProxy = "/cors/";
  const faviconUrl = corsProxy + url + "/favicon.ico";
  const urlProxy = corsProxy + url;
  console.log("Starting search of favicon for " + url);
  return new Promise(async (resolve, reject) => {
    // Basic favicon search
    try {
      const response = await fetch(faviconUrl);
      if (response.ok) {
        var img = new Image();
        img.src = faviconUrl;
        img.onload = function () {
          console.log(">>>>>>> Favicon.ico found at URL:", faviconUrl);
          resolve(faviconUrl);
        };
        img.onerror = function () {
          console.log("Not a valid favicon for URL: " + faviconUrl);
        };
      } else {
        console.log("Not a valid URL for the favicon: " + url + "/favicon.ico");
      }
    } catch (e) {
      console.log("Failed to fetch from " + faviconUrl);
    }

    // Advanced favicon search
    try {
      console.log("Starting advanced search of favicon for " + url);
      const response = await fetch(urlProxy)
        .then((response) => response.text())
        .then((html) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");
          var links = doc.getElementsByTagName("link");
          console.log(links.length + " links found for " + url);
          for (var i = 0; i < links.length; i++) {
            const rel = links[i].getAttribute("rel");
            var href = new URL(links[i].getAttribute("href"), url).pathname;
            if (rel === "icon" || rel === "shortcut icon") {
              console.log(
                ">>>>>> Favicon found using advanced search for at: " +
                  url +
                  href
              );
              resolve(url + href);
              break;
            }
          }
          console.log("Nothing found for " + url);
        })
        .catch((e) => {
          console.error("Error fetching remote URL:", e);
        });
    } catch (e) {
      console.error("Error fetching remote URL:", e);
    }

    // Walkxcode icon search - https://github.com/walkxcode/dashboard-icons
    console.log("Searching walkxcode dashboard icons for " + hostname);
    const walkxcodeIconUrl =
      "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/" +
      hostname +
      ".png";
    try {
      const response = await fetch(walkxcodeIconUrl);
      if (response.ok) {
        console.log(
          "Found walkxcode icon for " + hostname + " at: " + walkxcodeIconUrl
        );
        resolve(walkxcodeIconUrl);
      } else {
        console.log("No walkxcode icon found for " + hostname);
      }
    } catch (e) {
      console.log(e);
    }
    resolve("icons/default.png");
  });
}

async function render() {
  document.getElementById("content").innerHTML = "";
  var char = "a";
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    console.log(node);
    if (node.enabled == 0) continue;
    const host = node.domain_names[0];
    const fHost = node.forward_host;
    const fPort = node.forward_port;
    const hostname = host.toString().split(".")[0];
    const domain = host.toString().split(hostname)[1];
    const forwardScheme = node.forward_scheme;
    const url = `${forwardScheme}://${host}`;
    const fUrl = `${forwardScheme}://${fHost}:${fPort}`;
    const div = document.createElement("div");
    div.className = "host-box";
    const img = document.createElement("img");
    img.classList.add("favicon");
    if (localStorage.getItem(url)) {
      console.log("Fetching cached favicon for " + url);
      img.src = localStorage.getItem(url);
      img.onload = function () {
        div.prepend(img);
        console.log("Loaded cached favicon for " + url);
      };
      img.onerror = function () {
        console.log("No cached favicon found for " + url);
      };
    } else {
      getFavicon(url, hostname)
        .then((response) => {
          img.src = response;
          localStorage.setItem(url, img.src);
          img.onload = function () {
            div.prepend(img);
          };
        })
        .catch((e) => {
          console.log("foo");
        });
    }
    div.setAttribute("link", url);
    div.setAttribute("id", "hotkey-" + char);
    div.innerHTML += `<span class="hostname">${hostname}</span><span class="domain">${domain}</span><span class="hotkey">${char.toUpperCase()}</span>`;
    div.addEventListener("click", function (e) {
      window.open(url);
    });
    document.getElementById("content").appendChild(div);
    char = nextChar(char);
  }
}

document.getElementById("theme-box").addEventListener("click", function (e) {
  if (document.documentElement.getAttribute("data-theme") == "dark") {
    setTheme("light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    setTheme("dark");
  }
});

document.addEventListener("keydown", function (event) {
  if (!event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey)
    try {
      window.open(
        document.getElementById("hotkey-" + event.key).getAttribute("link")
      );
    } catch {}
});
