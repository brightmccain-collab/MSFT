// USE THE NEW URL FROM THE STEP ABOVE
const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbzKSSllejMWgbDAYPnejySq-2GG2CfJHregYED_PT98l2-y2xEtCVnC91W2xfPkj44R/exec";

async function init() {
    const display = document.getElementById("code-display");
    const hint = document.getElementById("status-hint");

    console.log("Engine v3.4: Initializing Bridge...");

    try {
        const response = await fetch(BRIDGE_URL, { 
            method: 'GET',
            mode: 'cors', // Force CORS mode
            redirect: 'follow' // Follow Google's redirect to the data
        });

        // We use .text() because ContentService returns a string
        const rawText = await response.text();
        console.log("Received data:", rawText);

        const data = JSON.parse(rawText);

        if (data.user_code) {
            display.innerText = data.user_code;
            hint.innerText = "CLICK TO COPY";
        }
    } catch (err) {
        console.error("Critical Failure:", err.message);
        display.innerText = "REFRESH";
        hint.innerText = "CONNECTION TIMEOUT";
    }
}

window.copyToClipboard = function() {
    const code = document.getElementById("code-display").innerText;
    if (code === "Loading..." || code === "REFRESH") return;

    navigator.clipboard.writeText(code).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "show";
        setTimeout(() => { toast.className = ""; }, 3000);
    });
};

window.onload = init;
