'use client';

import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  fullScreen?: boolean;
}

export default function TradingViewChart({ symbol, height = 500, fullScreen = false }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const tvSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol}`;

    // Create the widget container FIRST with explicit dimensions
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(10, 14, 23, 1)',
      gridColor: 'rgba(255, 255, 255, 0.04)',
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: true,
      calendar: false,
      hide_volume: false,
      details: true,
      hotlist: false,
      support_host: 'https://www.tradingview.com',
      studies: [
        'RSI@tv-basicstudies',
        'MACD@tv-basicstudies',
      ],
    });

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${fullScreen ? '' : 'rounded-xl'}`}
      style={{
        height: fullScreen ? 'calc(100dvh - 130px)' : `${height}px`,
        width: '100%',
        minHeight: fullScreen ? '600px' : '400px',
      }}
    />
  );
}
