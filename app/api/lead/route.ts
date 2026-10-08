import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { trackServerEvent } from '@/lib/server-analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Format email tidak valid.' },
        { status: 400 }
      );
    }

    const saved = dataStore.addLead({
      email,
      name: body.name ? String(body.name).slice(0, 100) : undefined,
      role: body.role ? String(body.role).slice(0, 50) : undefined,
      notes: body.notes ? String(body.notes).slice(0, 300) : undefined,
    });

    trackServerEvent({
      event: 'lead_submit',
      properties: {
        email,
        role: body.role,
      },
    });

    // Optional Google Sheets forward
    const sheetsWebhook = process.env.SHEETS_WEBHOOK_URL;
    if (sheetsWebhook) {
      fetch(sheetsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lead', ...saved }),
      }).catch((e) => console.warn('Sheets forward lead error:', e.message));
    }

    return NextResponse.json({ success: true, id: saved.id });
  } catch (error: any) {
    console.error('Lead error:', error);
    return NextResponse.json({ error: 'Gagal mendaftar waitlist.' }, { status: 500 });
  }
}
