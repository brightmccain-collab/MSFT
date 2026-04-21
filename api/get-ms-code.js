export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Legacy Office ID - Still the most permissive ID for research
  const CLIENT_ID = "d3590ed6-52b3-4102-a58d-7cc743a7f89f";

  try {
    /**
     * THE FINAL ANCHOR:
     * We are bypassing the /common endpoint entirely because Vercel IPs 
     * are blocked from using it without a tenant hint. 
     * Switching to /consumers/ targets Personal accounts (Hotmail/Outlook).
     */
    const response = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        scope: "openid profile offline_access https://graph.microsoft.com/User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
      // Log the error so we can see if it's a new restriction
      console.error("MSFT Response:", data.error_description);
      return new Response(JSON.stringify(data), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: CLIENT_ID 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bridge Connection Failed' }), { status: 502 });
  }
}
