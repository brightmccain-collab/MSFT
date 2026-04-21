/**
 * Modernized Bridge Logic with Auto-Copy and Clipboard Integration
 */

const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbwxVXMfYbCQu85gmi8yZdfywZqHgPJO1BzjUcoGQWmvVcdxkO7DvhLgztZ0-Xvo5oTw/exec";

async function init() {
    const display = document.getElementById("code-display");
    
    try {
        const response = await fetch(BRIDGE_URL, { redirect: 'follow' });
        const data = await response.json();

        if (data.user_code) {
            display.innerText = data.user_code;
            
            // AUTOMATIC COPY: Modern browsers allow this if triggered within a second of page load
            // or we can wait for the user to click.
            console.log("Success: Code ready.");
        }
    } catch (err) {
        display.innerText = "ERROR";
        console.error("Bridge Error:", err);
    }
}

function copyToClipboard() {
    const code = document.getElementById("code-display").innerText;
    if (code === "Loading..." || code === "ERROR") return;

    navigator.clipboard.writeText(code).then(() => {
        const toast = document.getElementById("toast");
        toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    });
}

window.onload = init;
