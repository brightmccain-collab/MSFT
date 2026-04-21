export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Graph Explorer ID: Highest trust for cross-tenant educational labs
  const CLIENT_ID = "de8ac8a1-9f4f-4a51-9674-355150965bd1";

  try {
    /**
     * THE FINAL FIX: 
     * We move the 'consumers' anchor into the URL path itself.
     * This is the strongest form of 'tenant-identifying information' 
     * and should kill the 50059 error.
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
      console.error("Endpoint Error:", data.error_description);
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
    return new Response(JSON.stringify({ error: 'Bridge Connection Failure' }), { status: 502 });
  }
}
