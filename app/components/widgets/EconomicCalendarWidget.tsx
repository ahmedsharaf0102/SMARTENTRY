'use client';

import { useEffect, useRef } from 'react';

interface EconomicCalendarWidgetProps {
  height?: number;
  colorTheme?: 'dark' | 'light';
  importanceFilter?: string; // "-1,0,1" = all, "0,1" = medium+high, "1" = high only
  countryFilter?: string;
}

export default function EconomicCalendarWidget({
  height = 600,
  colorTheme = 'dark',
  importanceFilter = '-1,0,1',
  countryFilter = 'us,eu,gb,jp,au,ca,ch,nz,cn',
}: EconomicCalendarWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous widget
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = `${height}px`;
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme,
      isTransparent: true,
      width: '100%',
      height: '100%',
      locale: 'en',
      importanceFilter,
      countryFilter,
      support_host: 'https://www.tradingview.com/?aff_id=168777',
    });

    widgetContainer.appendChild(widgetDiv);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [height, colorTheme, importanceFilter, countryFilter]);

  return <div ref={containerRef} style={{ height: `${height}px`, width: '100%' }} />;
}
