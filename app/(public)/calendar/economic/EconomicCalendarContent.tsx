'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/* ── Types ──────────────────────────────────────────────── */
interface CalendarEvent {
  id: string;
  event_name: string;
  event_time: string;
  country: string;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
  target_market: string;
  affected_assets: string;
  impact_analysis: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
}

type MarketFilter = 'all' | 'Crypto & Stocks' | 'Forex & Gold' | 'Forex' | 'Stocks' | 'All Markets' | 'Crypto';

/* ── Filter Tabs ────────────────────────────────────────── */
const TABS: { label: string; value: MarketFilter; icon: string; color: string }[] = [
  { label: 'All Events', value: 'all', icon: '🌍', color: 'var(--accent-blue)' },
  { label: 'All Markets', value: 'All Markets', icon: '🏛️', color: 'var(--accent-purple)' },
  { label: 'Crypto & Stocks', value: 'Crypto & Stocks', icon: '₿📈', color: 'var(--accent-yellow)' },
  { label: 'Forex & Gold', value: 'Forex & Gold', icon: '💱🥇', color: 'var(--accent-green)' },
  { label: 'Stocks', value: 'Stocks', icon: '📈', color: 'var(--accent-green)' },
  { label: 'Forex', value: 'Forex', icon: '💱', color: 'var(--accent-blue)' },
];

/* ── Importance Badge ───────────────────────────────────── */
function ImportanceBadge({ level }: { level: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    HIGH: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
    MEDIUM: { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308' },
    LOW: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8' },
  };
  const s = styles[level] || styles.MEDIUM;
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}>
      {level}
    </span>
  );
}

/* ── Market Tag ─────────────────────────────────────────── */
function MarketTag({ market }: { market: string }) {
  const colorMap: Record<string, string> = {
    'All Markets': 'var(--accent-purple)',
    'Crypto & Stocks': 'var(--accent-yellow)',
    'Forex & Gold': 'var(--accent-green)',
    'Stocks': 'var(--accent-green)',
    'Forex': 'var(--accent-blue)',
    'Forex & Stocks': 'var(--accent-blue)',
    'Crypto': 'var(--accent-yellow)',
    'Commodities': '#f97316',
  };
  const color = colorMap[market] || 'var(--text-muted)';
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
      {market}
    </span>
  );
}

/* ── Asset Chips ────────────────────────────────────────── */
function AssetChips({ assets }: { assets: string }) {
  if (!assets) return null;
  const list = assets.split(',').map(a => a.trim()).filter(Boolean);

  // Color coding for asset types
  const getColor = (asset: string) => {
    const upper = asset.toUpperCase();
    if (upper === 'USD') return '#22c55e';
    if (upper === 'EUR/USD' || upper === 'GBP/USD' || upper === 'USD/JPY' || upper.includes('/')) return 'var(--accent-blue)';
    if (upper === 'GOLD' || upper === 'GOLD (XAU)' || upper.includes('XAU')) return '#eab308';
    if (upper.includes('OIL') || upper.includes('CRUDE') || upper.includes('BRENT')) return '#f97316';
    if (upper === 'BTC' || upper === 'ETH' || upper === 'SOL') return 'var(--accent-yellow)';
    if (upper.includes('S&P') || upper.includes('NASDAQ') || upper.includes('DOW') || upper.includes('FTSE') || upper.includes('DAX') || upper.includes('NIKKEI') || upper.includes('ASX')) return 'var(--accent-green)';
    if (upper.includes('BOND')) return 'var(--accent-purple)';
    if (upper.includes('STOCK') || upper.includes('(')) return 'var(--accent-green)';
    return 'var(--text-muted)';
  };

  return (
    <div className="flex flex-wrap gap-1">
      {list.map((asset, i) => (
        <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
          style={{ background: `color-mix(in srgb, ${getColor(asset)} 12%, transparent)`, color: getColor(asset) }}>
          {asset}
        </span>
      ))}
    </div>
  );
}

/* ── Format Date Helpers ────────────────────────────────── */
function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
function formatEventTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function getDateKey(dateStr: string) {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}
function isToday(dateStr: string) {
  return getDateKey(dateStr) === new Date().toISOString().split('T')[0];
}

/* ── Event Card ─────────────────────────────────────────── */
function EventCard({ event, expanded, onToggle }: { event: CalendarEvent; expanded: boolean; onToggle: () => void }) {
  const isPast = new Date(event.event_time) < new Date();

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${expanded ? 'var(--accent-blue)' : 'var(--border-color)'}`,
        opacity: isPast ? 0.6 : 1,
      }}>
      {/* Header Row */}
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:brightness-110">
        {/* Time */}
        <div className="flex-shrink-0 text-center" style={{ minWidth: '55px' }}>
          <div className="text-xs font-mono font-bold"
            style={{ color: isToday(event.event_time) ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
            {formatEventTime(event.event_time)}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 flex-shrink-0" style={{ background: 'var(--border-color)' }} />

        {/* Event Name + Tags */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{event.event_name}</div>
          <div className="flex items-center gap-2 mt-1">
            <MarketTag market={event.target_market} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>🇺🇸 {event.country}</span>
          </div>
        </div>

        {/* Data Columns (desktop) */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {event.forecast && (
            <div className="text-center" style={{ minWidth: '50px' }}>
              <div className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Forecast</div>
              <div className="text-xs font-mono font-bold">{event.forecast}</div>
            </div>
          )}
          {event.previous && (
            <div className="text-center" style={{ minWidth: '50px' }}>
              <div className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Previous</div>
              <div className="text-xs font-mono">{event.previous}</div>
            </div>
          )}
          {event.actual && (
            <div className="text-center" style={{ minWidth: '50px' }}>
              <div className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Actual</div>
              <div className="text-xs font-mono font-bold" style={{ color: 'var(--accent-green)' }}>{event.actual}</div>
            </div>
          )}
        </div>

        {/* Importance + Arrow */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ImportanceBadge level={event.importance} />
          <span className="text-xs transition-transform duration-200"
            style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            ▼
          </span>
        </div>
      </button>

      {/* Expanded Panel */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Affected Assets */}
          {event.affected_assets && (
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-yellow)' }}>
              <div className="text-[10px] uppercase font-bold mb-2" style={{ color: 'var(--accent-yellow)' }}>
                🎯 Affected Assets
              </div>
              <AssetChips assets={event.affected_assets} />
            </div>
          )}

          {/* Smart Analysis */}
          {event.impact_analysis && (
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-blue)' }}>
              <div className="text-[10px] uppercase font-bold mb-2" style={{ color: 'var(--accent-blue)' }}>
                📊 Smart Analysis
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {event.impact_analysis}
              </p>
            </div>
          )}

          {/* Mobile data */}
          <div className="flex md:hidden gap-3">
            {event.forecast && (
              <div className="flex-1 p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Forecast</div>
                <div className="text-xs font-mono font-bold">{event.forecast}</div>
              </div>
            )}
            {event.previous && (
              <div className="flex-1 p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Previous</div>
                <div className="text-xs font-mono">{event.previous}</div>
              </div>
            )}
            {event.actual && (
              <div className="flex-1 p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>Actual</div>
                <div className="text-xs font-mono font-bold" style={{ color: 'var(--accent-green)' }}>{event.actual}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function EconomicCalendarContent() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MarketFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [importanceFilter, setImportanceFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  useEffect(() => {
    async function fetchEvents() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('economic_calendar')
        .select('*')
        .gte('event_time', new Date().toISOString().split('T')[0])
        .order('event_time', { ascending: true })
        .limit(200);

      if (error) {
        console.error('Calendar fetch error:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // Filter events
  const filtered = events.filter((e) => {
    if (activeTab !== 'all' && e.target_market !== activeTab) return false;
    if (importanceFilter !== 'ALL' && e.importance !== importanceFilter) return false;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const key = getDateKey(event.event_time);
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="py-12 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📅</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#06b6d4' }} />
              LIVE
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Economic <span style={{ color: '#06b6d4' }}>Calendar</span>
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Smart analysis for every market-moving event. Click any event to see which assets are affected and how the result could impact the market.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 sticky top-16 z-20" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Market Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  background: activeTab === tab.value ? `color-mix(in srgb, ${tab.color} 20%, transparent)` : 'var(--bg-tertiary)',
                  color: activeTab === tab.value ? tab.color : 'var(--text-muted)',
                  border: activeTab === tab.value ? `1px solid ${tab.color}` : '1px solid transparent',
                }}>
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Importance Filter */}
          <div className="flex gap-2 mt-3">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setImportanceFilter(level)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all"
                style={{
                  background: importanceFilter === level ? 'var(--bg-tertiary)' : 'transparent',
                  color: importanceFilter === level ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: importanceFilter === level ? '1px solid var(--border-color)' : '1px solid transparent',
                }}>
                {level === 'ALL' ? '🔹 All' : level === 'HIGH' ? '🔴 High' : level === 'MEDIUM' ? '🟡 Medium' : '⚪ Low'}
              </button>
            ))}
            <div className="ml-auto text-xs self-center" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} events
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-8 px-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No Events Found</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {events.length === 0
                  ? 'The economic calendar is being set up. Events will appear after the next GitHub Actions pipeline run.'
                  : 'No events match your current filters. Try changing the market tab or importance filter.'}
              </p>
              {events.length === 0 && (
                <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                  💡 Run the migration SQL in Supabase first, then trigger the GitHub Actions workflow manually.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((dateKey) => (
                <div key={dateKey}>
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        background: isToday(dateKey + 'T00:00:00Z') ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-tertiary)',
                        border: isToday(dateKey + 'T00:00:00Z') ? '1px solid #06b6d4' : '1px solid var(--border-color)',
                      }}>
                      <span className="text-sm font-bold"
                        style={{ color: isToday(dateKey + 'T00:00:00Z') ? '#06b6d4' : 'var(--text-primary)' }}>
                        {isToday(dateKey + 'T00:00:00Z') ? '📌 Today' : formatEventDate(dateKey + 'T00:00:00Z')}
                      </span>
                    </div>
                    <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {grouped[dateKey].length} events
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-2">
                    {grouped[dateKey].map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        expanded={expandedId === event.id}
                        onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="card p-6">
            <h3 className="font-bold mb-4 text-sm">📖 How to Use This Calendar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🔴 High Impact</p>
                <p>Events that significantly move markets. FOMC, CPI, NFP — plan your trades around these.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🎯 Affected Assets</p>
                <p>Click any event to see exactly which assets will be impacted — USD, Gold, BTC, specific stocks, or forex pairs.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>🟡 Forecast vs Actual</p>
                <p>When the actual number differs significantly from the forecast, expect strong market movement.</p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>⏰ Time Zones</p>
                <p>All times shown in your local timezone. Most US events are released between 8:30 AM - 2:00 PM ET.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
