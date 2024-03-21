var config, serverHost, serverPort, identity, secret, showForwarding, showDisabled, data;
const toggleDisabledIconOn = `<i class="fa-solid fa-ban fa-xl"></i>`;
const toggleDisabledIconOff = `<i class="fa-regular fa-circle fa-xl"></i>`;
const toggleForwardingIconOn = '<i class="fa-solid fa-eye fa-xl"></i>';
const toggleForwardingIconOff = '<i class="fa-solid fa-eye-slash fa-xl"></i>';

window.onload = async function () {
    const response = await fetch("./config.json");
    config = await response.json();
    serverHost = config.server.host;
    serverPort = config.server.port;
    identity = config.server.email;
    secret = config.server.password;
    showForwarding = config.appearance.showforwarding;
    showDisabled = config.appearance.showdisabled;
    document.documentElement.setAttribute('data-theme', config.appearance.darkmode ? 'dark' : 'light');
    if (!config.appearance.showheader) document.getElementById("header").style.display = 'none';
    if (!config.appearance.showfooter) document.getElementById("footer").style.display = 'none';
    getProxyHosts();
}

async function getToken() {
    try {
        document.getElementById("serverInfo").innerHTML = `<i id="connectionIcon" class="fa-solid fa-hourglass-start fa-xl"></i>`;
        const response = await fetch(`http://${serverHost}:${serverPort}/api/tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identity: identity,
                secret: secret
            })
        });
        document.getElementById("serverInfo").innerHTML = `<i id="connectionIcon" class="fa-solid fa-plug fa-xl connectionIcon"></i>`;
        //document.getElementById("connectionIcon").style.color = "green";
        const data = await response.json();
        return data.token;
    } catch (error) {
        document.getElementById("serverInfo").innerHTML = `<i id="connectionIcon" class="fa-solid fa-plug-circle-xmark fa-xl"></i>`;
        document.getElementById("connectionIcon").style.color = "rgb(153, 39, 39)";
        console.error(error);
        throw error;
    }
}

async function getProxyHosts() {
    try {
        const bearerToken = await getToken();
        const response = await fetch(`http://${serverHost}:${serverPort}/api/nginx/proxy-hosts`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
        if (response.ok) {
            data = await response.json();
            render();
        } else {
            console.log('Error fetching proxy hosts:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function render() {
    document.getElementById("main").innerHTML = "";
    data.forEach(host => {
        if (host.enabled == 1 || (host.enabled == 0 && showDisabled)) {
            var fqdn = host.domain_names[0];
            var forwardHostPort = host.forward_host + ":" + host.forward_port;
            var hostname = fqdn.toString().split('.')[0];
            var domain = fqdn.toString().split(hostname)[1];
            var forwardScheme = host.forward_scheme;
            const div = document.createElement("div");
            div.innerHTML += `<span class="hostname"> ${hostname}</span><span class="domain">${domain}</span>`
            if (showForwarding) div.innerHTML += `<span class="forwardingInfo"> >> ${forwardScheme}://${forwardHostPort}</span></a>`;
            div.className = "host-container";
            if (host.enabled == 0 && showDisabled) div.classList.add("disabled");
            document.getElementById("main").appendChild(div);
            div.addEventListener('click', function(e) {
                window.open(`${forwardScheme}://${fqdn}`);
            })
        }
    });
    document.getElementById("showForwardingContainer").innerHTML = showForwarding ? toggleForwardingIconOn : toggleForwardingIconOff;
    document.getElementById("showDisabledContainer").innerHTML = showDisabled ? toggleDisabledIconOn : toggleDisabledIconOff;
}

document.getElementById("showForwardingContainer").addEventListener('click', function(e) {
    if (showForwarding) { 
        showForwarding = false;
    } else {
        showForwarding = true
    }
    render();
});

document.getElementById("showDisabledContainer").addEventListener('click', function(e) {
    if (showDisabled) { 
        showDisabled = false;
    } else {
        showDisabled = true
    }
    render();
});

document.getElementById("controlThemeContainer").addEventListener('click', function(e) {
    var theme;
    if (document.documentElement.getAttribute('data-theme') == 'dark') {
        theme = 'light';
    } else {
        theme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
});