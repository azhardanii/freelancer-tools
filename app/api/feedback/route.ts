import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { trackServerEvent } from '@/lib/server-analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const priceFeeling = body.priceFeeling;
    if (!['kemurahan', 'pas', 'kemahalan'].includes(priceFeeling)) {
      return NextResponse.json(
        { error: 'priceFeeling harus salah satu dari kemurahan, pas, kemahalan' },
        { status: 400 }
      );
    }

    const willUse = body.willUse || 'mungkin';

    const saved = dataStore.addFeedback({
      priceFeeling,
      willUse,
      feedbackNotes: String(body.feedbackNotes || '').slice(0, 500),
      service: body.service,
      recommendedRate: body.recommendedRate ? Number(body.recommendedRate) : undefined,
    });

    trackServerEvent({
      event: 'feedback_submitted',
      properties: {
        priceFeeling,
        willUse,
        service: body.service,
      },
    });

    // Optional Google Sheets forward
    const sheetsWebhook = process.env.SHEETS_WEBHOOK_URL;
    if (sheetsWebhook) {
      fetch(sheetsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', ...saved }),
      }).catch((e) => console.warn('Sheets forward feedback error:', e.message));
    }

    return NextResponse.json({ success: true, id: saved.id });
  } catch (error: any) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan feedback.' }, { status: 500 });
  }
}
