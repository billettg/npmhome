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

async function render() {
  document.getElementById("content").innerHTML = "";
  var char = "a";
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const host = node.domain_names[0];
    const hostname = host.toString().split(".")[0];
    const domain = host.toString().split(hostname)[1];
    const forwardScheme = node.forward_scheme;
    const url = `${forwardScheme}://${host}`;
    const div = document.createElement("div");
    div.className = "host-box";
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
