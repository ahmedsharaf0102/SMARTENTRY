'use client';

import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  fullScreen?: boolean;
}

/**
 * TradingView Advanced Chart Widget — FREE embed
 * Includes: real-time data, indicators, drawing tools, all timeframes
 */
export default function TradingViewChart({ symbol, height = 500, fullScreen = false }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    // If symbol already has exchange prefix, use as-is
    const tvSymbol = symbol.includes(':') ? symbol : `BINANCE:${symbol}`;

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

    const wrapper = document.createElement('div');
    wrapper.className = 'tradingview-widget-container__widget';
    wrapper.style.height = '100%';
    wrapper.style.width = '100%';

    containerRef.current.appendChild(wrapper);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  const chartHeight = fullScreen ? 'calc(100vh - 160px)' : `${height}px`;

  return (
    <div
      ref={containerRef}
      className={`tradingview-widget-container overflow-hidden ${fullScreen ? '' : 'rounded-xl'}`}
      style={{ height: chartHeight, width: '100%', minHeight: '500px' }}
    />
  );
}
