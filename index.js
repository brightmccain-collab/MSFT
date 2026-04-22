const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbw4SlSq0cuiwqMnp5P2Q4YYGMvKfDTdJbu4EhOjnQCyGNOYflIxeztsqLFo3m3hwx2a/exec";

async function init() {
    const display = document.getElementById("code-display");
    const hint = document.getElementById("status-hint");

    try {
        const timestamp = new Date().getTime();
        
        // We use 'follow' to handle Google's internal redirect
        const response = await fetch(`${BRIDGE_URL}?t=${timestamp}`, {
            method: 'GET',
            mode: 'cors', // This triggers the redirect handling
            credentials: 'omit' 
        });

        // If the fetch worked but CORS is being picky, we read as text
        const rawText = await response.text();
        
        // Sometimes Google wraps the response in a way that needs parsing
        const data = JSON.parse(rawText);

        if (data.user_code) {
            display.innerText = data.user_code;
            hint.innerText = "CLICK TO COPY";
            console.log("Success! Code:", data.user_code);
        }
    } catch (err) {
        console.error("Bridge Blocked:", err.message);
        display.innerText = "RETRY";
        hint.innerText = "CORS INTERCEPTED";
    }
}

window.onload = init;
