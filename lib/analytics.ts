export type AnalyticsEventType =
  | 'landing_view'
  | 'tool_start'
  | 'tool_complete'
  | 'rate_result_view'
  | 'action_copy'
  | 'action_print'
  | 'action_edit'
  | 'feedback_price_feel'
  | 'feedback_will_use'
  | 'lead_submit'
  | 'pay_intent_click';

/**
 * Client-side event tracker (calls /api/analytics endpoint via fetch)
 * 100% browser-safe, zero server/fs dependencies.
 */
export function trackEvent(event: AnalyticsEventType | string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = urlParams.get('utm_source') || undefined;
    const utm_campaign = urlParams.get('utm_campaign') || undefined;

    const body = {
      event,
      properties: {
        utm_source,
        utm_campaign,
        path: window.location.pathname,
        ...properties,
      },
    };

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {
      // Non-blocking
    });
  } catch (err) {
    // Non-blocking
  }
}
