export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE "EXPLORER" BYPASS: Microsoft Graph Explorer
   * ID: de8ac8a1-9f4f-4a51-9674-355150965bd1
   * This ID is the standard for educational labs. It is allowed to bridge
   * between Enterprise and Consumer accounts.
   */
  const EXPLORER_ID = "de8ac8a1-9f4f-4a51-9674-355150965bd1";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: EXPLORER_ID,
        // Using common scopes to avoid "Invalid Scope" errors on Personal accounts
        scope: "openid profile offline_access User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Diagnostic:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: EXPLORER_ID 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bridge Offline' }), { status: 502 });
  }
}
