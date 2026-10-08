'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation, Footer } from '@/components/Navigation';
import {
  BarChart3Icon,
  UsersIcon,
  TrendingUpIcon,
  RefreshCwIcon,
  CoinsIcon,
  CheckIcon,
  CopyIcon,
  ClockIcon,
} from '@/components/icons';

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Gagal mengambil data analytics');
      setData(json.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check URL query param ?key=uqi2026 or ?secret=uqi or stored session
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const secret = params.get('key') || params.get('secret');
      const stored = sessionStorage.getItem('uqi_vault_authenticated');

      if (secret === 'uqi2026' || secret === 'uqi' || stored === 'true') {
        setIsAuthenticated(true);
        sessionStorage.setItem('uqi_vault_authenticated', 'true');
        fetchAnalytics();
      } else {
        setLoading(false);
      }
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === 'uqi2026' || pinInput.trim().toLowerCase() === 'uqi') {
      setIsAuthenticated(true);
      setPinError(false);
      sessionStorage.setItem('uqi_vault_authenticated', 'true');
      fetchAnalytics();
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('uqi_vault_authenticated');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleExportCSV = () => {
    if (!data?.leads || data.leads.length === 0) {
      alert('Belum ada data lead untuk diexport.');
      return;
    }

    const headers = ['Email', 'Role', 'Waktu', 'Catatan'];
    const rows = data.leads.map((l: any) => [
      l.email,
      l.role || '-',
      new Date(l.timestamp).toLocaleString('id-ID'),
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e: any[]) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_ratefreelance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const funnel = data?.funnel || {
    landing_view: 0,
    tool_start: 0,
    rate_result_view: 0,
    action_copy: 0,
    feedback_submitted: 0,
    lead_submit: 0,
  };

  const landingCount = funnel.landing_view || 1;
  const startPct = ((funnel.tool_start / landingCount) * 100).toFixed(1);
  const resultPct = funnel.tool_start > 0 ? ((funnel.rate_result_view / funnel.tool_start) * 100).toFixed(1) : '0';
  const actionPct = funnel.rate_result_view > 0 ? ((funnel.action_copy / funnel.rate_result_view) * 100).toFixed(1) : '0';
  const leadPct = funnel.rate_result_view > 0 ? ((funnel.lead_submit / funnel.rate_result_view) * 100).toFixed(1) : '0';

  const totalFeedback =
    (data?.priceFeelCounts?.kemurahan || 0) +
    (data?.priceFeelCounts?.pas || 0) +
    (data?.priceFeelCounts?.kemahalan || 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FBFA]">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#CBE5E1] shadow-card p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5F3] border border-[#CBE5E1] flex items-center justify-center mx-auto mb-4 text-[#0A3638]">
              <LockIcon className="w-7 h-7 text-[#0A3638]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A3638] tracking-tight mb-2">
              Uqi Analytics Vault
            </h1>
            <p className="text-xs text-[#526A6B] leading-relaxed mb-6">
              Halaman metrik & validasi ini bersifat rahasia. Masukkan PIN keamanan untuk membuka akses.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Masukkan PIN Akses..."
                  className="w-full px-4 py-3 rounded-xl border border-[#CBE5E1] bg-[#F8FBFA] focus:bg-white focus:outline-none focus:border-[#0A3638] text-center text-sm font-bold text-[#0A3638] tracking-widest placeholder:tracking-normal placeholder:font-normal"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    PIN tidak valid. Silakan coba lagi.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0A3638] hover:bg-[#07282A] text-white text-xs font-bold transition-all shadow-xs"
              >
                Buka Kunci Dashboard
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E2ECE9] text-[11px] text-[#526A6B]">
              <span>💡 Tips: Kamu juga bisa bookmark URL rahasia langsung dengan parameter: </span>
              <code className="text-[#0A3638] font-bold bg-[#E8F5F3] px-1.5 py-0.5 rounded">?key=uqi2026</code>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFA]">
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E2ECE9] gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5F3] text-[#0A3638] text-xs font-semibold mb-2 border border-[#CBE5E1]">
              <BarChart3Icon className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Real-time Validation Dashboard · Private</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A3638]">
              Dashboard Analytics & Validasi
            </h1>
            <p className="text-xs sm:text-sm text-[#526A6B]">
              Pantau funnel konversi, persepsi harga pengguna, dan daftar email waitlist Pro.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLock}
              className="px-3 py-2 text-xs font-medium text-[#526A6B] hover:text-[#0A3638] bg-white hover:bg-[#F8FBFA] rounded-xl border border-[#CBE5E1] transition-colors"
              title="Kunci Dashboard"
            >
              🔒 Kunci
            </button>
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-bold text-[#0A3638] bg-white hover:bg-[#F8FBFA] rounded-xl border border-[#CBE5E1] shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCwIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#0A3638] hover:bg-[#07282A] rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CopyIcon className="w-3.5 h-3.5" />
              <span>Export CSV Lead</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs mb-6">
            {error}
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle">
            <span className="text-xs text-[#526A6B] font-medium block mb-1">Total Kunjungan</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A3638]">
              {funnel.landing_view}
            </div>
            <span className="text-[10px] text-[#526A6B] mt-1 block">Landing page views</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle">
            <span className="text-xs text-[#526A6B] font-medium block mb-1">Rate Dihitung</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A3638]">
              {funnel.rate_result_view}
            </div>
            <span className="text-[10px] text-[#0D9488] font-semibold mt-1 block">
              {resultPct}% dari mulai isi
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle">
            <span className="text-xs text-[#526A6B] font-medium block mb-1">Aksi Disalin</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0A3638]">
              {funnel.action_copy}
            </div>
            <span className="text-[10px] text-[#526A6B] mt-1 block">Salin rate / script</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F5F3] border-2 border-[#0A3638] shadow-subtle">
            <span className="text-xs text-[#0A3638] font-bold block mb-1">Waitlist Pro Lead</span>
            <div className="text-2xl sm:text-3xl font-black text-[#0A3638]">
              {data?.totalLeads || 0}
            </div>
            <span className="text-[10px] text-[#0D9488] font-bold mt-1 block">
              {leadPct}% conversion
            </span>
          </div>
        </div>

        {/* Funnel Visualizer */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle mb-8">
          <h2 className="text-base font-bold text-[#0A3638] mb-4 flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4 text-[#0D9488]" />
            <span>Funnel Konversi Validasi</span>
          </h2>

          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div>
              <div className="flex justify-between font-semibold text-[#0A3638] mb-1">
                <span>1. Landing Page View</span>
                <span>{funnel.landing_view} ({startPct}% lanjut ke form)</span>
              </div>
              <div className="w-full h-3 bg-[#E8F5F3] rounded-full overflow-hidden">
                <div className="h-full bg-[#0A3638] w-full" />
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex justify-between font-semibold text-[#0A3638] mb-1">
                <span>2. Buka Tool Form (Tool Start)</span>
                <span>{funnel.tool_start}</span>
              </div>
              <div className="w-full h-3 bg-[#E8F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0D9488]"
                  style={{ width: `${Math.min(100, (funnel.tool_start / (landingCount || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex justify-between font-semibold text-[#0A3638] mb-1">
                <span>3. Selesai Hitung Rate (Result View)</span>
                <span>{funnel.rate_result_view}</span>
              </div>
              <div className="w-full h-3 bg-[#E8F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#14B8A6]"
                  style={{ width: `${Math.min(100, (funnel.rate_result_view / (landingCount || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex justify-between font-semibold text-[#0A3638] mb-1">
                <span>4. Aksi Salin / Interaksi (Action Taken)</span>
                <span>{funnel.action_copy}</span>
              </div>
              <div className="w-full h-3 bg-[#E8F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2DD4BF]"
                  style={{ width: `${Math.min(100, (funnel.action_copy / (landingCount || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Step 5 */}
            <div>
              <div className="flex justify-between font-semibold text-[#0A3638] mb-1">
                <span>5. Daftar Waitlist Versi Pro</span>
                <span className="font-bold text-[#0A3638]">{data?.totalLeads || 0}</span>
              </div>
              <div className="w-full h-3 bg-[#E8F5F3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A3638]"
                  style={{ width: `${Math.min(100, ((data?.totalLeads || 0) / (landingCount || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Price Feel */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle">
            <h3 className="font-bold text-sm text-[#0A3638] mb-1">
              Persepsi Harga Rate ({totalFeedback} respons)
            </h3>
            <p className="text-[11px] text-[#526A6B] mb-4">
              Apakah tarif rekomendasi dianggap pas atau berlebihan?
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Kemurahan</span>
                  <span className="font-bold">{data?.priceFeelCounts?.kemurahan || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: totalFeedback > 0 ? `${((data?.priceFeelCounts?.kemurahan || 0) / totalFeedback) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Pas / Realistis</span>
                  <span className="font-bold text-emerald-700">{data?.priceFeelCounts?.pas || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: totalFeedback > 0 ? `${((data?.priceFeelCounts?.pas || 0) / totalFeedback) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Kemahalan</span>
                  <span className="font-bold text-amber-700">{data?.priceFeelCounts?.kemahalan || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{
                      width: totalFeedback > 0 ? `${((data?.priceFeelCounts?.kemahalan || 0) / totalFeedback) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Will Use Intent */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle">
            <h3 className="font-bold text-sm text-[#0A3638] mb-1">
              Niat Penggunaan (Usage Intent)
            </h3>
            <p className="text-[11px] text-[#526A6B] mb-4">
              Apakah user benar-benar akan memakai angka rate ini ke calon klien?
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Pasti Pakai</span>
                  <span className="font-bold text-emerald-700">{data?.willUseCounts?.pasti_pakai || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600"
                    style={{
                      width: totalFeedback > 0 ? `${((data?.willUseCounts?.pasti_pakai || 0) / totalFeedback) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Mungkin / Jadi Acuan</span>
                  <span className="font-bold text-blue-700">{data?.willUseCounts?.mungkin || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: totalFeedback > 0 ? `${((data?.willUseCounts?.mungkin || 0) / totalFeedback) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Tidak Yakin</span>
                  <span className="font-bold text-gray-700">{data?.willUseCounts?.tidak_yakin || 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400"
                    style={{
                      width: totalFeedback > 0 ? `${((data?.willUseCounts?.tidak_yakin || 0) / totalFeedback) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#0A3638]">
                Daftar Pendaftar Waitlist Versi Pro ({data?.leads?.length || 0})
              </h3>
              <p className="text-xs text-[#526A6B]">
                Email calon pengguna yang berminat pada generator proposal resmi.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="text-xs font-bold text-[#0D9488] hover:underline"
            >
              Unduh CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2ECE9] text-[#526A6B] bg-[#F8FBFA]">
                <tr>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2ECE9]">
                {data?.leads && data.leads.length > 0 ? (
                  data.leads.map((l: any) => (
                    <tr key={l.id} className="hover:bg-[#F8FBFA]">
                      <td className="py-2.5 px-3 font-semibold text-[#0A3638]">{l.email}</td>
                      <td className="py-2.5 px-3 text-[#526A6B]">
                        {new Date(l.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-3 text-[#526A6B] max-w-xs truncate">
                        {l.notes || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-[#526A6B] italic">
                      Belum ada lead masuk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events Stream */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2ECE9] shadow-subtle">
          <h3 className="font-bold text-base text-[#0A3638] mb-1">
            Live Stream Event Terakhir ({data?.recentEvents?.length || 0})
          </h3>
          <p className="text-xs text-[#526A6B] mb-4">
            Aktivitas interaksi pengunjung secara real-time.
          </p>

          <div className="max-h-72 overflow-y-auto space-y-2 text-xs divide-y divide-[#E2ECE9]">
            {data?.recentEvents && data.recentEvents.length > 0 ? (
              data.recentEvents.map((evt: any) => (
                <div key={evt.id} className="pt-2 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-bold text-[#0A3638] font-mono">{evt.event}</span>
                    {evt.properties && Object.keys(evt.properties).length > 0 && (
                      <div className="text-[11px] text-[#526A6B] mt-0.5 font-mono">
                        {JSON.stringify(evt.properties)}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#526A6B] whitespace-nowrap">
                    {new Date(evt.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-[#526A6B] italic">Belum ada event tercatat.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
