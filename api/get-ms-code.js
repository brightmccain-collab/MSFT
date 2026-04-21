export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Graph Explorer ID: Multi-tenant and high-trust
  const CLIENT_ID = "de8ac8a1-9f4f-4a51-9674-355150965bd1";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        // THE ANCHOR: This tells Microsoft which directory to look in 
        // to satisfy the AADSTS50059 requirement.
        tenant: "consumers", 
        scope: "openid profile offline_access User.Read"
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Protocol Error:", data.error_description);
      return new Response(JSON.stringify(data), { status: 400 });
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
