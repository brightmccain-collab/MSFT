// USE THE NEW URL FROM STEP 1
const SCRIPT_URL = "https://script.google.com/macros/s/AKfy.../exec";

async function init() {
    console.log("Engine v3.4: Initializing...");
    
    // Safety Check: Ensure the element exists before writing to it
    const display = document.getElementById("code-display");
    if (!display) {
        console.error("Critical: Could not find HTML element 'code-display'");
        return;
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'GET',
            mode: 'cors', // Explicitly set mode
            redirect: 'follow'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const rawData = await response.text();
        console.log("Raw Response:", rawData);

        // Google sometimes wraps response in HTML if there's an error
        if (rawData.includes("<!DOCTYPE")) {
            console.error("Bridge Error: Google returned HTML instead of JSON. Check your deployment settings.");
            return;
        }

        const data = JSON.parse(rawData);
        if (data.user_code) {
            display.innerText = data.user_code;
            console.log("SUCCESS! Code generated.");
        } else {
            console.error("Microsoft Error:", data.error_description || "Unknown error");
        }

    } catch (err) {
        console.error("Bridge Failure:", err.message);
        display.innerText = "Error: Check Console";
    }
}

// Run after page load
window.onload = init;
