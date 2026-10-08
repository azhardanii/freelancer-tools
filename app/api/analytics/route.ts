import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';
import { trackServerEvent } from '@/lib/server-analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.event) {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    await trackServerEvent({
      event: body.event,
      properties: body.properties || {},
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const summary = dataStore.getAnalyticsSummary();
    return NextResponse.json({ success: true, data: summary });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
