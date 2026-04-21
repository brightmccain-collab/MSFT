export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Official Microsoft Office ID (Pre-authorized for consumers)
  const CLIENT_ID = "d3590ed6-52b3-4102-a58d-7cc743a7f89f";

  try {
    /**
     * THE RESOLUTION:
     * We use /consumers/ instead of /common/ to satisfy the AADSTS50059 error.
     * We use the Office ID to ensure the user doesn't get a 'Consent' block.
     */
    const response = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        scope: "openid profile offline_access User.Read" 
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Diagnostic:", data.error_description);
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
    return new Response(JSON.stringify({ error: 'Connection Timeout' }), { status: 502 });
  }
}
