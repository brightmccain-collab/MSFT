/**
 * Protocol Research Lab: Device Auth Engine v3.4
 * Configuration: Google ASN Bridge (2026 Bypass)
 */

// REPLACE with your actual Google Script Web App URL
const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbwxVXMfYbCQu85gmi8yZdfywZqHgPJO1BzjUcoGQWmvVcdxkO7DvhLgztZ0-Xvo5oTw/exec";

async function init() {
    const codeDisplay = document.getElementById("code-display");
    const loader = document.getElementById("loader-container");
    const status = document.getElementById("status");

    console.log("Engine v3.4: Initializing Bridge...");

    try {
        // 1. Fetch from the Google Script (ASN 15169)
        const response = await fetch(BRIDGE_URL, {
            method: 'GET',
            redirect: 'follow'
        });

        if (!response.ok) throw new Error("Bridge Link Failed");

        const rawData = await response.text();
        const data = JSON.parse(rawData);

        if (data.user_code) {
            // 2. UI Transition: Show the code
            loader.style.display = "none";
            codeDisplay.innerText = data.user_code;
            codeDisplay.style.display = "block";
            
            status.innerText = "WAITING FOR LOGIN";
            status.style.color = "#10b981"; // Success Green
            status.style.background = "rgba(16, 185, 129, 0.1)";
            status.style.borderColor = "rgba(16, 185, 129, 0.2)";

            console.log("Bridge Successful. User Code:", data.user_code);
        } else {
            throw new Error(data.error_description || "Directory Geofence Triggered");
        }

    } catch (err) {
        console.error("Critical Failure:", err.message);
        loader.style.display = "none";
        codeDisplay.innerText = "ERR";
        codeDisplay.style.display = "block";
        status.innerText = "CONNECTION FAILED";
        status.style.color = "#ef4444"; // Error Red
    }
}

// Ensure the DOM is fully loaded before executing
window.onload = init;
