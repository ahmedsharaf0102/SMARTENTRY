'use client';

import { useEffect, useRef } from 'react';

interface MarketOverviewProps {
  height?: number;
  tabs?: Array<{
    title: string;
    symbols: Array<{ s: string; d?: string }>;
  }>;
}

const defaultTabs = [
  {
    title: 'Indices',
    symbols: [
      { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
      { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
      { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
      { s: 'INDEX:DAX', d: 'DAX' },
      { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100' },
      { s: 'INDEX:NKY', d: 'Nikkei 225' },
    ],
  },
  {
    title: 'Crypto',
    symbols: [
      { s: 'BITSTAMP:BTCUSD', d: 'Bitcoin' },
      { s: 'BITSTAMP:ETHUSD', d: 'Ethereum' },
      { s: 'BINANCE:SOLUSDT', d: 'Solana' },
      { s: 'BINANCE:BNBUSDT', d: 'BNB' },
      { s: 'BINANCE:XRPUSDT', d: 'XRP' },
      { s: 'BINANCE:ADAUSDT', d: 'Cardano' },
    ],
  },
  {
    title: 'Forex',
    symbols: [
      { s: 'FX:EURUSD', d: 'EUR/USD' },
      { s: 'FX:GBPUSD', d: 'GBP/USD' },
      { s: 'FX:USDJPY', d: 'USD/JPY' },
      { s: 'FX:USDCHF', d: 'USD/CHF' },
      { s: 'FX:AUDUSD', d: 'AUD/USD' },
      { s: 'FX:USDCAD', d: 'USD/CAD' },
    ],
  },
  {
    title: 'Commodities',
    symbols: [
      { s: 'TVC:GOLD', d: 'Gold' },
      { s: 'TVC:SILVER', d: 'Silver' },
      { s: 'TVC:USOIL', d: 'Crude Oil' },
      { s: 'TVC:UKOIL', d: 'Brent Oil' },
      { s: 'TVC:NATGAS', d: 'Natural Gas' },
      { s: 'TVC:PLATINUM', d: 'Platinum' },
    ],
  },
];

export default function MarketOverview({ height = 450, tabs = defaultTabs }: MarketOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = `calc(100% - 32px)`;
    widgetDiv.style.width = '100%';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      dateRange: '1D',
      showChart: true,
      locale: 'en',
      isTransparent: true,
      height: '100%',
      width: '100%',
      showSymbolLogo: true,
      showFloatingTooltip: true,
      tabs,
    });

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden"
      style={{ height: `${height}px`, border: '1px solid var(--border-color)' }} />
  );
}
