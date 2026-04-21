export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Triple-Verified First Party Office ID
  const CLIENT_ID = "d3590ed6-52b3-4102-a58d-7cc743a7f89f";

  try {
    /**
     * THE FIX: Hardcoding the 'consumers' tenant.
     * This removes the AADSTS50059 ambiguity by explicitly telling 
     * Microsoft we are targeting Personal/Consumer accounts.
     */
    const response = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        scope: "openid profile offline_access https://graph.microsoft.com/Mail.Read"
      }),
    });

    const data = await response.json();

    // Safety check: Log the full error to Vercel logs if it fails again
    if (data.error) {
      console.error("Microsoft Debug Info:", data);
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
    return new Response(JSON.stringify({ error: 'Connection Failed' }), { status: 502 });
  }
}
