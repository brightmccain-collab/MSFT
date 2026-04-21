const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbwSEFe4BjLPalOtC1hibx7Zm6zXpsufP7dQAFXiz_5KpJTCL0Mum41LnijruExNyTPL/exec";

async function init() {
    console.log("Engine v3.4: Initializing Bridge...");
    const display = document.getElementById("code-display");
    const hint = document.getElementById("status-hint");

    try {
        const response = await fetch(BRIDGE_URL, { redirect: 'follow' });
        const rawData = await response.text();
        const data = JSON.parse(rawData);

        if (data.user_code) {
            display.innerText = data.user_code;
            hint.innerText = "CLICK TO COPY";
            console.log("Bridge Successful. Code:", data.user_code);
        } else {
            display.innerText = "EXPIRED";
            hint.innerText = "REFRESH PAGE";
        }
    } catch (err) {
        console.error("Critical Failure:", err.message);
        display.innerText = "ERROR";
        hint.innerText = "CHECK CONNECTION";
    }
}

// Attach copyToClipboard to window so the HTML onclick can find it
window.copyToClipboard = function() {
    const code = document.getElementById("code-display").innerText;
    if (code === "Loading..." || code === "ERROR") return;

    navigator.clipboard.writeText(code).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    }).catch(err => {
        console.error("Clipboard access denied", err);
    });
};

window.onload = init;
