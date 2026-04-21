export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE TEAMS ANCHOR: Microsoft Teams (Legacy)
   * ID: 1fec8e78-bce4-4aaf-ab1b-5451cc387264
   * This is the "Universal" ID. We are hard-coding the /consumers/ 
   * endpoint to kill the 50059 error once and for all.
   */
  const TEAMS_ID = "1fec8e78-bce4-4aaf-ab1b-5451cc387264";

  try {
    const response = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TEAMS_ID,
        // Using basic scopes to prevent first-party resource blocks
        scope: "openid profile offline_access User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
       // If this hits 700016, we have proven the IP is fully blacklisted
       return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: TEAMS_ID 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Gateway Timeout' }), { status: 502 });
  }
}
