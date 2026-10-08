async function runE2ETest() {
  console.log('Testing full API & Analytics flow...');

  // 1. Tool start event
  const evtRes = await fetch('http://localhost:3000/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'tool_start', properties: { test: true } }),
  });
  console.log('Analytics event status:', evtRes.status);

  // 2. Rate Calculation
  const rateRes = await fetch('http://localhost:3000/api/rate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service: 'editing video Reels untuk UMKM',
      experience: 'kurang_1_tahun',
      targetClient: 'umkm',
      targetNet: 5000000,
      hoursPerDay: 6,
      proof: 'belum_ada',
    }),
  });
  const rateData = await rateRes.json();
  console.log('Rate API status:', rateRes.status);
  console.log('Service normalized:', rateData.data.serviceParams.serviceName);
  console.log('Standard recommended rate:', rateData.data.pricing.recommended);
  console.log('Paket Perdana promo active:', rateData.data.firstClientPromo?.active);

  // 3. Feedback Submission
  const fbRes = await fetch('http://localhost:3000/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceFeeling: 'pas',
      willUse: 'pasti_pakai',
      feedbackNotes: 'Hitungannya masuk akal banget!',
      service: rateData.data.serviceParams.serviceName,
      recommendedRate: rateData.data.pricing.recommended,
    }),
  });
  console.log('Feedback API status:', fbRes.status);

  // 4. Lead Submission (Waitlist)
  const leadRes = await fetch('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'uqi.freelancer@test.com',
      name: 'Uqi',
      role: 'Video Editor',
      notes: 'Mau coba generator proposal resmi PDF A4',
    }),
  });
  console.log('Lead API status:', leadRes.status);

  // 5. Query Analytics Dashboard Data
  const analyticsRes = await fetch('http://localhost:3000/api/analytics');
  const analyticsData = await analyticsRes.json();
  console.log('Analytics Dashboard Summary:');
  console.log('- Total Events:', analyticsData.data.totalEvents);
  console.log('- Total Leads:', analyticsData.data.totalLeads);
  console.log('- Price Feel Counts:', analyticsData.data.priceFeelCounts);
  console.log('- Will Use Counts:', analyticsData.data.willUseCounts);
  console.log('- Latest Lead:', analyticsData.data.leads[0]?.email);

  if (
    rateRes.ok &&
    fbRes.ok &&
    leadRes.ok &&
    analyticsData.data.totalLeads >= 1
  ) {
    console.log('\n>>> ALL END-TO-END FLOW TESTS PASSED! <<<');
  } else {
    throw new Error('E2E validation failed');
  }
}

runE2ETest().catch((err) => {
  console.error('E2E test error:', err);
  process.exit(1);
});
