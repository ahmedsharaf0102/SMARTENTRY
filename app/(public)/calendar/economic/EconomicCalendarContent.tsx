'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/* ── Types ──────────────────────────────────────────────── */
interface CalendarEvent {
  id: string;
  event_name: string;
  event_time: string;
  country: string;
  currency: string;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
  previous_revised: string | null;
  target_market: string;
  affected_assets: string;
  impact_analysis: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Upcoming' | 'Released' | 'Revised';
  description: string | null;
  data_period: string | null;
  official_source_name: string | null;
  official_source_url: string | null;
  unit: string | null;
}

type MarketFilter = 'all' | 'Crypto & Stocks' | 'Forex & Gold' | 'Forex' | 'Stocks' | 'All Markets' | 'Crypto' | 'Commodities';

/* ── Country Flags ──────────────────────────────────────── */
const FLAG_MAP: Record<string, string> = {
  US: '🇺🇸', EU: '🇪🇺', EMU: '🇪🇺', GB: '🇬🇧', UK: '🇬🇧', JP: '🇯🇵',
  AU: '🇦🇺', CA: '🇨🇦', CH: '🇨🇭', NZ: '🇳🇿', CN: '🇨🇳', DE: '🇩🇪',
  FR: '🇫🇷', IT: '🇮🇹', ES: '🇪🇸',
};

const CURRENCY_COLORS: Record<string, string> = {
  USD: '#22c55e', EUR: '#3b82f6', GBP: '#a855f7', JPY: '#ef4444',
  AUD: '#eab308', CAD: '#f97316', CHF: '#06b6d4', NZD: '#10b981',
  CNY: '#ef4444',
};

/* ── Filter Tabs ────────────────────────────────────────── */
const MARKET_TABS: { label: string; value: MarketFilter; icon: string; color: string }[] = [
  { label: 'All Events', value: 'all', icon: '🌍', color: 'var(--accent-blue)' },
  { label: 'All Markets', value: 'All Markets', icon: '🏛️', color: 'var(--accent-purple)' },
  { label: 'Crypto & Stocks', value: 'Crypto & Stocks', icon: '₿', color: 'var(--accent-yellow)' },
  { label: 'Forex & Gold', value: 'Forex & Gold', icon: '💱', color: 'var(--accent-green)' },
  { label: 'Stocks', value: 'Stocks', icon: '📈', color: 'var(--accent-green)' },
  { label: 'Forex', value: 'Forex', icon: '💹', color: 'var(--accent-blue)' },
  { label: 'Commodities', value: 'Commodities', icon: '🛢️', color: '#f97316' },
];

const CURRENCY_OPTIONS = ['ALL', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'CNY'];

/* ── Sub-Components ─────────────────────────────────────── */
function ImportanceBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    HIGH: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: '🔴 High' },
    MEDIUM: { bg: 'rgba(234,179,8,0.15)', color: '#eab308', label: '🟡 Med' },
    LOW: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', label: '⚪ Low' },
  };
  const s = map[level] || map.MEDIUM;
  return (
    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Upcoming: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
    Released: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    Revised: { bg: 'rgba(168,85,247,0.15)', color: '#a855f7' },
  };
  const s = map[status] || map.Upcoming;
  return (
    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color }}>{status}</span>
  );
}

function CurrencyBadge({ currency }: { currency: string }) {
  const color = CURRENCY_COLORS[currency] || 'var(--text-muted)';
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
      style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>{currency}</span>
  );
}

function ExpectationBadge({ actual, forecast }: { actual: string | null; forecast: string | null }) {
  if (!actual || !forecast) return null;
  const a = parseFloat(actual.replace('%', '').replace(',', ''));
  const f = parseFloat(forecast.replace('%', '').replace(',', ''));
  if (isNaN(a) || isNaN(f)) return null;

  let label: string, color: string, bg: string;
  if (a > f) { label = '▲ Above Expectations'; color = '#22c55e'; bg = 'rgba(34,197,94,0.12)'; }
  else if (a < f) { label = '▼ Below Expectations'; color = '#ef4444'; bg = 'rgba(239,68,68,0.12)'; }
  else { label = '● In Line'; color = '#94a3b8'; bg = 'rgba(100,116,139,0.12)'; }

  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: bg, color }}>{label}</span>
  );
}

function AssetChips({ assets }: { assets: string }) {
  if (!assets) return null;
  const list = assets.split(',').map(a => a.trim()).filter(Boolean);
  const getColor = (asset: string) => {
    const u = asset.toUpperCase();
    if (u === 'USD') return '#22c55e';
    if (u.includes('/')) return 'var(--accent-blue)';
    if (u.includes('XAU') || u.includes('GOLD')) return '#eab308';
    if (u.includes('OIL') || u.includes('CRUDE') || u.includes('BRENT')) return '#f97316';
    if (['BTC', 'ETH', 'SOL'].includes(u)) return 'var(--accent-yellow)';
    if (['S&P 500', 'NASDAQ', 'DOW JONES', 'FTSE 100', 'DAX', 'NIKKEI 225', 'ASX 200', 'EURO STOXX 50'].some(x => u.includes(x))) return 'var(--accent-green)';
    if (u.includes('BOND')) return 'var(--accent-purple)';
    if (u.includes('STOCK') || u.includes('(')) return 'var(--accent-green)';
    return 'var(--text-muted)';
  };
  return (
    <div className="flex flex-wrap gap-1">
      {list.map((asset, i) => (
        <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
          style={{ background: `color-mix(in srgb, ${getColor(asset)} 12%, transparent)`, color: getColor(asset) }}>{asset}</span>
      ))}
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────── */
function formatEventDate(d: string) { return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
function formatEventTime(d: string) { return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' }); }
function getDateKey(d: string) { return new Date(d).toISOString().split('T')[0]; }
function isToday(d: string) { return getDateKey(d) === new Date().toISOString().split('T')[0]; }

/* ── Event Card (Professional Layout) ───────────────────── */
function EventCard({ event, expanded, onToggle }: { event: CalendarEvent; expanded: boolean; onToggle: () => void }) {
  const isPast = new Date(event.event_time) < new Date();
  const flag = FLAG_MAP[event.country] || '🌐';

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${expanded ? 'var(--accent-blue)' : 'var(--border-color)'}`,
        opacity: isPast && event.status === 'Upcoming' ? 0.5 : 1,
      }}>

      {/* ── Header Row ── */}
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3 md:p-4 text-left transition-colors hover:brightness-110">
        {/* Flag + Time */}
        <div className="flex-shrink-0 text-center" style={{ minWidth: '65px' }}>
          <div className="text-lg mb-0.5">{flag}</div>
          <div className="text-[10px] font-mono font-bold"
            style={{ color: isToday(event.event_time) ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
            {formatEventTime(event.event_time).split(' ').slice(0, 1).join('')}
          </div>
        </div>

        <div className="w-px h-10 flex-shrink-0" style={{ background: 'var(--border-color)' }} />

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{event.event_name}</span>
            {event.unit && <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>({event.unit})</span>}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <CurrencyBadge currency={event.currency || 'USD'} />
            <StatusBadge status={event.status || 'Upcoming'} />
            {event.data_period && (
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                {event.data_period}
              </span>
            )}
            {event.status === 'Released' && <ExpectationBadge actual={event.actual} forecast={event.forecast} />}
          </div>
        </div>

        {/* Values Table (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
          <div className="text-center px-2 py-1 rounded" style={{ background: 'var(--bg-tertiary)', minWidth: '55px' }}>
            <div className="text-[8px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Actual</div>
            <div className="text-xs font-mono font-bold"
              style={{ color: event.actual ? 'var(--accent-green)' : 'var(--text-muted)' }}>
              {event.actual || '—'}
            </div>
          </div>
          <div className="text-center px-2 py-1 rounded" style={{ background: 'var(--bg-tertiary)', minWidth: '55px' }}>
            <div className="text-[8px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Forecast</div>
            <div className="text-xs font-mono font-bold">{event.forecast || '—'}</div>
          </div>
          <div className="text-center px-2 py-1 rounded" style={{ background: 'var(--bg-tertiary)', minWidth: '55px' }}>
            <div className="text-[8px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Previous</div>
            <div className="text-xs font-mono">
              {event.previous_revised ? (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: 4 }}>{event.previous}</span>
                  <span style={{ color: 'var(--accent-green)' }}>{event.previous_revised}</span>
                </>
              ) : (event.previous || '—')}
            </div>
          </div>
        </div>

        {/* Importance + Arrow */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ImportanceBadge level={event.importance} />
          <span className="text-xs transition-transform duration-200"
            style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
        </div>
      </button>

      {/* ── Expanded Panel ── */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Mobile Values Table */}
          <div className="flex lg:hidden gap-2">
            <div className="flex-1 p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="text-[8px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Actual</div>
              <div className="text-sm font-mono font-bold"
                style={{ color: event.actual ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                {event.actual || '—'}
              </div>
            </div>
            <div className="flex-1 p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="text-[8px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Forecast</div>
              <div className="text-sm font-mono font-bold">{event.forecast || '—'}</div>
            </div>
            <div className="flex-1 p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="text-[8px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Previous</div>
              <div className="text-sm font-mono">
                {event.previous_revised ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{event.previous}</span>{' '}
                    <span style={{ color: 'var(--accent-green)' }}>{event.previous_revised}</span>
                  </>
                ) : (event.previous || '—')}
              </div>
            </div>
          </div>

          {event.status === 'Released' && (
            <div className="flex lg:hidden">
              <ExpectationBadge actual={event.actual} forecast={event.forecast} />
            </div>
          )}

          {/* Meta Row */}
          <div className="flex items-center gap-3 flex-wrap text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <span>⏰ {formatEventTime(event.event_time)}</span>
            <span>{FLAG_MAP[event.country] || '🌐'} {event.country}</span>
            {event.data_period && <span>📊 {event.data_period}</span>}
            {event.official_source_name && (
              <a href={event.official_source_url || '#'} target="_blank" rel="noopener noreferrer"
                className="underline hover:opacity-80 transition-opacity" style={{ color: 'var(--accent-blue)' }}>
                📎 {event.official_source_name}
              </a>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-purple)' }}>
              <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--accent-purple)' }}>📖 What is this?</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{event.description}</p>
            </div>
          )}

          {/* Affected Assets */}
          {event.affected_assets && (
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-yellow)' }}>
              <div className="text-[10px] uppercase font-bold mb-2" style={{ color: 'var(--accent-yellow)' }}>🎯 Affected Assets</div>
              <AssetChips assets={event.affected_assets} />
            </div>
          )}

          {/* Smart Analysis */}
          {event.impact_analysis && (
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-blue)' }}>
              <div className="text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--accent-blue)' }}>📊 Impact Analysis</div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{event.impact_analysis}</p>
            </div>
          )}

          {/* Alert Button (UI only) */}
          {event.importance === 'HIGH' && (
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
              style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.3)' }}
              onClick={(e) => { e.stopPropagation(); }}>
              🔔 Set Alert for This Event
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function EconomicCalendarContent() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMarket, setActiveMarket] = useState<MarketFilter>('all');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');
  const [importanceFilter, setImportanceFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('economic_calendar')
        .select('*')
        .gte('event_time', new Date(Date.now() - 86400000).toISOString())
        .order('event_time', { ascending: true })
        .limit(500);

      if (error) console.error('Calendar fetch error:', error);
      else setEvents(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  // Filters
  const filtered = events.filter((e) => {
    if (activeMarket !== 'all' && e.target_market !== activeMarket) return false;
    if (currencyFilter !== 'ALL' && e.currency !== currencyFilter) return false;
    if (importanceFilter !== 'ALL' && e.importance !== importanceFilter) return false;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    const key = getDateKey(ev.event_time);
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();

  // Stats
  const highCount = filtered.filter(e => e.importance === 'HIGH').length;
  const releasedCount = filtered.filter(e => e.status === 'Released').length;
  const currencies = [...new Set(events.map(e => e.currency).filter(Boolean))];

  return (
    <div className="fade-in">
      {/* ── HERO ── */}
      <section className="py-12 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📅</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#06b6d4' }} />LIVE
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Economic <span style={{ color: '#06b6d4' }}>Calendar</span>
          </h1>
          <p className="text-lg max-w-3xl mb-6" style={{ color: 'var(--text-secondary)' }}>
            Global economic events with smart impact analysis. Track FOMC, CPI, NFP, ECB, BOE, BOJ and every market-moving event across 9 countries.
          </p>

          {/* Quick Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="px-4 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Total Events</div>
              <div className="text-xl font-bold">{filtered.length}</div>
            </div>
            <div className="px-4 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>High Impact</div>
              <div className="text-xl font-bold" style={{ color: '#ef4444' }}>{highCount}</div>
            </div>
            <div className="px-4 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Released</div>
              <div className="text-xl font-bold" style={{ color: '#22c55e' }}>{releasedCount}</div>
            </div>
            <div className="px-4 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Currencies</div>
              <div className="text-xl font-bold">{currencies.length || '—'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTERS BAR ── */}
      <section className="py-4 px-4 sticky top-16 z-20" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Market Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {MARKET_TABS.map((tab) => (
              <button key={tab.value} onClick={() => setActiveMarket(tab.value)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  background: activeMarket === tab.value ? `color-mix(in srgb, ${tab.color} 20%, transparent)` : 'var(--bg-tertiary)',
                  color: activeMarket === tab.value ? tab.color : 'var(--text-muted)',
                  border: activeMarket === tab.value ? `1px solid ${tab.color}` : '1px solid transparent',
                }}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>

          {/* Second Row: Currency + Importance */}
          <div className="flex gap-2 flex-wrap items-center">
            {/* Currency Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Currency:</span>
              <select value={currencyFilter} onChange={(e) => setCurrencyFilter(e.target.value)}
                className="text-xs font-semibold px-2 py-1.5 rounded-lg outline-none cursor-pointer"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c === 'ALL' ? '🌍 All Currencies' : `${FLAG_MAP[Object.keys(COUNTRY_CURRENCY_LOOKUP).find(k => COUNTRY_CURRENCY_LOOKUP[k] === c) || ''] || '🌐'} ${c}`}</option>)}
              </select>
            </div>

            <div className="w-px h-5" style={{ background: 'var(--border-color)' }} />

            {/* Importance */}
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
              <button key={level} onClick={() => setImportanceFilter(level)}
                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                style={{
                  background: importanceFilter === level ? 'var(--bg-tertiary)' : 'transparent',
                  color: importanceFilter === level ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: importanceFilter === level ? '1px solid var(--border-color)' : '1px solid transparent',
                }}>
                {level === 'ALL' ? '🔹 All' : level === 'HIGH' ? '🔴 High' : level === 'MEDIUM' ? '🟡 Med' : '⚪ Low'}
              </button>
            ))}

            <div className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{filtered.length} events</div>
          </div>
        </div>
      </section>

      {/* ── EVENTS LIST ── */}
      <section className="py-8 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="space-y-4">{[...Array(8)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No Events Found</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {events.length === 0
                  ? 'The calendar is being set up. Events appear after the GitHub Actions pipeline runs.'
                  : 'No events match your filters. Try changing the market, currency, or importance filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((dateKey) => (
                <div key={dateKey}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        background: isToday(dateKey + 'T00:00:00Z') ? 'rgba(6,182,212,0.15)' : 'var(--bg-tertiary)',
                        border: isToday(dateKey + 'T00:00:00Z') ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                      }}>
                      <span className="text-sm font-bold"
                        style={{ color: isToday(dateKey + 'T00:00:00Z') ? '#06b6d4' : 'var(--text-primary)' }}>
                        {isToday(dateKey + 'T00:00:00Z') ? '📌 Today' : formatEventDate(dateKey + 'T00:00:00Z')}
                      </span>
                    </div>
                    <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{grouped[dateKey].length} events</span>
                  </div>
                  <div className="space-y-2">
                    {grouped[dateKey].map((ev) => (
                      <EventCard key={ev.id} event={ev} expanded={expandedId === ev.id}
                        onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LEGEND ── */}
      <section className="py-8 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="card p-6">
            <h3 className="font-bold mb-4 text-sm">📖 How to Use This Calendar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🔴 Impact Levels</p>
                <p>High = Major market mover. Medium = Moderate volatility. Low = Usually minimal impact.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>📊 Actual vs Forecast</p>
                <p>▲ Above Expectations = actual beat forecast. ▼ Below = actual missed. Big gaps = big moves.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🎯 Affected Assets</p>
                <p>Shows exactly which assets move when this event is released — stocks, forex pairs, crypto, or commodities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Helper for currency dropdown labels */
const COUNTRY_CURRENCY_LOOKUP: Record<string, string> = {
  US: 'USD', EU: 'EUR', GB: 'GBP', JP: 'JPY', AU: 'AUD', CA: 'CAD', CH: 'CHF', NZ: 'NZD', CN: 'CNY',
};
