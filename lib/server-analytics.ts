import { dataStore } from './store';

export interface ServerAnalyticsPayload {
  event: string;
  properties?: Record<string, any>;
}

/**
 * Server-side event recorder (used in API routes)
 */
export async function trackServerEvent(payload: ServerAnalyticsPayload) {
  try {
    dataStore.addEvent({
      event: payload.event,
      properties: payload.properties,
    });

    const sheetsWebhook = process.env.SHEETS_WEBHOOK_URL;
    if (sheetsWebhook) {
      fetch(sheetsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event',
          ...payload,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => console.warn('Sheets webhook forward failed:', err.message));
    }
  } catch (err) {
    console.warn('trackServerEvent error:', err);
  }
}
