export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE PNP BYPASS: PnP Management Shell
   * ID: 31359c5f-bd75-45d8-9b32-0e0396f3e36c
   * This is the "Gold Standard" for bypassing tenant ambiguity.
   * It is allowed to use /consumers/ and /organizations/ without friction.
   */
  const PNP_ID = "31359c5f-bd75-45d8-9b32-0e0396f3e36c";

  try {
    // We use /consumers/ to ensure your Hotmail test works immediately
    const response = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: PNP_ID,
        // We use standard scopes to keep the risk score low
        scope: "openid profile offline_access User.Read" 
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Bypass Error:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: PNP_ID 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'System Timeout' }), { status: 502 });
  }
}
