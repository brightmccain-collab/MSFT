/* 2026 AUDITOR-HARDENED WORKER
   - Added Access-Control-Max-Age for Preflight Efficiency
   - Explicit Header Filtering
*/
export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { c_id, d_c } = await request.json();
      const msRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: c_id,
          device_code: d_c,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
        })
      });

      const json = await msRes.json();
      return new Response(JSON.stringify(json), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Worker Bridge Failure" }), { 
          status: 500, 
          headers: corsHeaders 
      });
    }
  }
};