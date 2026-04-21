export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE VISUAL STUDIO BYPASS
   * ID: 829ae552-be59-4621-a3f1-d7790b0270a6
   * This ID is the 'sweet spot'. It is highly trusted but allowed 
   * to roam across Consumer (Hotmail) and Org (SNHU) tenants.
   */
  const VS_ID = "829ae552-be59-4621-a3f1-d7790b0270a6";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: VS_ID,
        // We use a specific Graph scope to trigger the correct trust flow
        scope: "openid profile offline_access https://graph.microsoft.com/User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
       // If this hits 50059, we know common is dead for Vercel
       console.error("Logic Trace:", data.error_description);
       return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: VS_ID 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bridge Offline' }), { status: 502 });
  }
}
