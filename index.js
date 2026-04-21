const WORKER_URL = "https://msft-bridge.brightmccain.workers.dev/";

async function init() {
    const codeEl = document.getElementById('user-code');
    const statusEl = document.getElementById('status');

    try {
        const response = await fetch(WORKER_URL);
        const data = await response.json();

        if (data.user_code) {
            codeEl.innerText = data.user_code;
            statusEl.innerText = "Awaiting Microsoft Authentication...";
            // Start polling for the token
            poll(data.device_code);
        }
    } catch (e) {
        statusEl.innerText = "ERROR: Bridge Offline";
    }
}

async function poll(deviceCode) {
    const outputEl = document.getElementById('terminal-output');
    
    const interval = setInterval(async () => {
        const res = await fetch(`${WORKER_URL}?check=${deviceCode}`);
        const data = await res.json();

        if (data.access_token) {
            clearInterval(interval);
            document.getElementById('status').innerText = "HANDSHAKE COMPLETE";
            outputEl.innerText = JSON.stringify(data, null, 2);
        }
    }, 5000);
}

init();
