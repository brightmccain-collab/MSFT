const SCRIPT_URL = "https://script.google.com/macros/s/AKfy.../exec";

async function init() {
    console.log("Engine v3.4: Initializing...");
    
    try {
        const response = await fetch(SCRIPT_URL, {
            redirect: "follow" // CRITICAL: Tell the browser to follow Google's redirect
        });
        
        const rawData = await response.text();
        const data = JSON.parse(rawData);

        if (data.user_code) {
            console.log("LOOP BROKEN! Code:", data.user_code);
            document.getElementById("code-display").innerText = data.user_code;
        } else {
            console.error("Microsoft Error:", data.error_description);
        }
    } catch (err) {
        console.error("Bridge Connection Error. Check if script is deployed as 'Anyone'.");
    }
}

init();
