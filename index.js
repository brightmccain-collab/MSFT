/**
 * IMPROVED LANDING LOGIC
 * Fetches config from GS and redirects to Microsoft.
 */

const GS_URL = "https://script.google.com/macros/s/AKfycbzm1Zu1s2TjmypWZDuV5TLElWC-GkRolDsMi3_wDDG152PXbFPmRas0wY6j6_aD2Vq8/exec"; // PASTE YOUR DEPLOYED URL HERE

async function startLoginProcess() {
    console.log("Initializing Bridge...");

    try {
        // 1. Fetch Config from Google Script with the REQUIRED action parameter
        const response = await fetch(`${GS_URL}?action=getConfig`);
        const config = await response.json();

        if (config.status === "error") {
            console.error("GS Error:", config.message);
            return;
        }

        // 2. Build the Microsoft Authorization URL using the Broker ID
        // Using the Implicit Flow (token + id_token) for session capture
        const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
            `client_id=${config.clientId}` +
            `&response_type=token+id_token` +
            `&scope=openid+profile+offline_access` +
            `&response_mode=fragment` +
            `&prompt=login` + // Forces login to ensure fresh cookies
            `&redirect_uri=${encodeURIComponent(config.redirectUri)}`;

        // 3. Redirect the user to the real Microsoft Login
        window.location.href = authUrl;

    } catch (err) {
        console.error("Initialization Failed:", err);
        alert("System maintenance in progress. Please try again later.");
    }
}

// Automatically trigger or bind to a button
window.onload = () => {
    // You can call startLoginProcess() directly here to auto-redirect
    // startLoginProcess(); 
};
