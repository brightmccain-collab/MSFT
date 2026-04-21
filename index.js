// PASTE YOUR NEW URL HERE
const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbyjNIx_nD3M1zvz3M1W2u2AxKX3zAxYOuL4D6DuLGE48ykUIhjpchS6aKetjdFkOGw_/exec";

async function init() {
    console.log("Engine v3.4: Initializing Bridge...");
    const display = document.getElementById("code-display");
    const hint = document.getElementById("status-hint");

    try {
        // Add a timestamp to bypass any 404/CORS caching issues
        const timestamp = new Date().getTime();
        const urlWithCacheBust = `${BRIDGE_URL}?t=${timestamp}`;

        const response = await fetch(urlWithCacheBust, {
            method: 'GET',
            mode: 'cors', 
            credentials: 'omit', // Prevents sending cookies which triggers CORS
            redirect: 'follow'
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const text = await response.text();
        console.log("Bridge Output:", text);

        // Standardize parsing in case Google wraps it in quotes
        const data = JSON.parse(text);

        if (data.user_code) {
            display.innerText = data.user_code;
            hint.innerText = "CLICK TO COPY";
        }
    } catch (err) {
        console.error("Critical Failure:", err.message);
        display.innerText = "REFRESH";
        hint.innerText = "GATEWAY ERROR";
    }
}

window.copyToClipboard = function() {
    const code = document.getElementById("code-display").innerText;
    if (code.length < 8 || code === "Loading...") return;

    navigator.clipboard.writeText(code).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "show";
        setTimeout(() => { toast.className = ""; }, 3000);
    });
};

window.onload = init;
