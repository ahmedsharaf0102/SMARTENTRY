'use client';

import { useEffect, useRef } from 'react';

interface ScreenerWidgetProps {
  defaultScreen?: 'forex_signal' | 'crypto_mkt_cap' | 'general';
  defaultColumn?: string;
  market?: string;
  height?: number;
}

export default function ScreenerWidget({
  defaultScreen = 'general',
  defaultColumn = 'overview',
  market = 'america',
  height = 550,
}: ScreenerWidgetProps) {
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

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      defaultColumn,
      defaultScreen,
      market,
      showToolbar: true,
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: true,
      support_host: 'https://www.tradingview.com/?aff_id=168777',
    });

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [defaultScreen, defaultColumn, market]);

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden"
      style={{ height: `${height}px`, border: '1px solid var(--border-color)' }} />
  );
}
