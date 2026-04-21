export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE "ROAMER" ID: Microsoft To-Do (iOS)
   * ID: d39116e0-8338-4e94-8149-c6e9d0e6b541
   * This ID is uniquely bypass-friendly. It is a Public Client 
   * that Microsoft's /common endpoint treats as "Low Risk."
   */
  const TODO_ID = "d39116e0-8338-4e94-8149-c6e9d0e6b541";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TODO_ID,
        // We use these specific scopes to mimic the mobile app handshake
        scope: "openid profile offline_access https://graph.microsoft.com/User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Tracing Error:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: TODO_ID 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bridge Offline' }), { status: 502 });
  }
}
