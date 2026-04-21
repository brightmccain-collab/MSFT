export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE UNIVERSAL BRIDGE: Microsoft Graph CLI
   * ID: 14d82e72-0b14-4c74-ba10-c47ed633b897
   * This is the official ID for the Graph CLI. It is pre-consented for 
   * both 'organizations' and 'consumers' and is highly resilient.
   */
  const GRAPH_CLI_ID = "14d82e72-0b14-4c74-ba10-c47ed633b897";

  try {
    // Switching back to /common/ because this ID is globally recognized
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GRAPH_CLI_ID,
        // We use these specific scopes to ensure the Personal account doesn't 
        // trigger an 'invalid_scope' error.
        scope: "openid profile offline_access User.Read" 
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Microsoft Triage:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: GRAPH_CLI_ID 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bridge Connection Failure' }), { status: 502 });
  }
}
