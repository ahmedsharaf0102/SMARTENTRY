import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Radio, Filter } from 'lucide-react';

export default async function SignalsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const actionFilter = params.action?.toUpperCase();
  const page = parseInt(params.page || '1', 10);
  const perPage = 20;

  let query = supabase
    .from('signals')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (actionFilter && ['BUY', 'WATCH', 'WAIT'].includes(actionFilter)) {
    query = query.eq('action', actionFilter);
  }

  const { data: signals, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  const filters = [
    { label: 'All', value: '', count: null },
    { label: 'BUY', value: 'BUY', color: 'var(--accent-green)' },
    { label: 'WATCH', value: 'WATCH', color: 'var(--accent-yellow)' },
    { label: 'WAIT', value: 'WAIT', color: 'var(--accent-red)' },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)' }}>
            <Radio size={28} style={{ color: 'var(--accent-blue)' }} />
            Trading Signals
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {count || 0} signals found {actionFilter && `• Filtered by ${actionFilter}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => {
          const isActive = (actionFilter || '') === f.value;
          return (
            <Link
              key={f.label}
              href={f.value ? `/signals?action=${f.value}` : '/signals'}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: isActive ? 'var(--accent-blue-dim)' : 'var(--bg-card)',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Signals Table */}
      {!signals || signals.length === 0 ? (
        <div className="card p-12 text-center">
          <Filter size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold mb-1">No signals found</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Signals will appear after the analysis engine runs.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Coin</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Signal</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Action</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Strength</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Price</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => {
                  const actionClass = signal.action === 'BUY' ? 'badge-buy' : signal.action === 'WATCH' ? 'badge-watch' : 'badge-wait';
                  const timeAgo = getTimeAgo(signal.created_at);
                  return (
                    <tr key={signal.id}
                      className="transition-colors hover:bg-white/5"
                      style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-6 py-4">
                        <Link href={`/coins/${signal.symbol}`}
                          className="flex items-center gap-3 hover:underline">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                            {signal.symbol.replace('USDT', '').slice(0, 3)}
                          </div>
                          <span className="font-semibold text-sm">{signal.symbol}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {signal.signal_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={actionClass}>{signal.action}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                            <div className="h-full rounded-full" style={{
                              width: `${signal.strength}%`,
                              background: signal.strength >= 70 ? 'var(--accent-green)' :
                                signal.strength >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)',
                            }} />
                          </div>
                          <span className="text-sm font-medium">{signal.strength}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        ${signal.price_at_signal?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {timeAgo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {signals.map((signal) => {
              const actionClass = signal.action === 'BUY' ? 'badge-buy' : signal.action === 'WATCH' ? 'badge-watch' : 'badge-wait';
              return (
                <Link key={signal.id} href={`/coins/${signal.symbol}`}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                      {signal.symbol.replace('USDT', '').slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{signal.symbol}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {signal.signal_type.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{signal.strength}</span>
                    <span className={actionClass}>{signal.action}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link href={`/signals?action=${actionFilter || ''}&page=${page - 1}`}
              className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              ← Prev
            </Link>
          )}
          <span className="text-sm px-3" style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/signals?action=${actionFilter || ''}&page=${page + 1}`}
              className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
