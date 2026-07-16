'use client';

import { useEffect, useRef } from 'react';

interface HeatmapProps {
  dataSource: 'SPX500' | 'NASDAQ100' | 'Crypto';
  height?: number;
}

export default function Heatmap({ dataSource = 'SPX500', height = 500 }: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const isCrypto = dataSource === 'Crypto';
    const scriptUrl = isCrypto
      ? 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js'
      : 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    script.async = true;

    const config: Record<string, any> = {
      width: '100%',
      height: '100%',
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: true,
      hasTopBar: true,
      support_host: 'https://www.tradingview.com/?aff_id=168777',
    };

    if (isCrypto) {
      config.dataSource = 'Crypto';
      config.blockSize = 'market_cap_calc';
      config.blockColor = 'change';
    } else {
      config.dataSource = dataSource;
      config.grouping = 'sector';
      config.blockSize = 'market_cap_basic';
      config.blockColor = 'change';
    }

    script.innerHTML = JSON.stringify(config);

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [dataSource]);

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden"
      style={{ height: `${height}px`, border: '1px solid var(--border-color)' }} />
  );
}
