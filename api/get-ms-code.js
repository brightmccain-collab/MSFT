export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE RESILIENCE KEY: Microsoft CLI
   * ID: 04b07795-8ddb-461a-bbee-02f9e1bf7b46
   * This ID is designed for cross-platform CLI tools and is 
   * allowed to roam between all tenant types.
   */
  const CLI_ID = "04b07795-8ddb-461a-bbee-02f9e1bf7b46";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLI_ID,
        // We use 'consumers' as a hint to avoid the 50059 error
        tenant: "consumers",
        scope: "openid profile offline_access User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: CLI_ID 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bridge Timeout' }), { status: 502 });
  }
}
