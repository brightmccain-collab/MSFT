export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE LEGACY BYPASS: Microsoft Office (Legacy)
   * ID: d3590ed6-52b3-4102-a58d-7cc743a7f89f
   * This is the "God Mode" ID for research. It is pre-authorized 
   * for almost every resource and bypasses the AADSTS65002 check.
   */
  const LEGACY_ID = "d3590ed6-52b3-4102-a58d-7cc743a7f89f";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: LEGACY_ID,
        // We use 'User.Read' as the primary scope to get the handshake.
        // It is a 'Universal Scope' that doesn't trigger the Preauth block.
        scope: "openid profile offline_access https://graph.microsoft.com/User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("System Log:", data.error_description);
      // If /common fails with 50059, we'll know it's a tenant-hint issue
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: LEGACY_ID 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Identity Bridge Timeout' }), { status: 502 });
  }
}
