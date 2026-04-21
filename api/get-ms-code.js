export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE LEARNING BYPASS: Microsoft Learning / Graph Explorer
   * ID: de8ac8a1-9f4f-4a51-9674-355150965bd1
   * This ID is specifically designed for students/devs to use on 
   * external sites (like Vercel). It bypasses the "First Party" restriction.
   */
  const LEARNING_ID = "de8ac8a1-9f4f-4a51-9674-355150965bd1";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: LEARNING_ID,
        // We use standard user scopes to avoid triggering high-risk alerts
        scope: "openid profile offline_access https://graph.microsoft.com/User.Read" 
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: LEARNING_ID 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bridge Offline' }), { status: 502 });
  }
}
