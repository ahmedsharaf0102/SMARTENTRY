'use client';

import { useEffect, useRef } from 'react';

interface TickerTapeProps {
  colorTheme?: 'dark' | 'light';
}

const defaultSymbols = [
  { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
  { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq' },
  { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
  { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
  { proName: 'TVC:GOLD', title: 'Gold' },
  { proName: 'TVC:SILVER', title: 'Silver' },
  { proName: 'TVC:USOIL', title: 'Crude Oil' },
  { proName: 'FX_IDC:GBPUSD', title: 'GBP/USD' },
  { proName: 'FX_IDC:USDJPY', title: 'USD/JPY' },
];

export default function TickerTape({ colorTheme = 'dark' }: TickerTapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: defaultSymbols,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme,
      locale: 'en',
    });

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [colorTheme]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden" style={{ height: '46px' }} />
  );
}
