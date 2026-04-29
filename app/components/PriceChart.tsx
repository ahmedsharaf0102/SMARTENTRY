'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, type IChartApi } from 'lightweight-charts';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PriceChartProps {
  data: CandleData[];
  height?: number;
}

export default function PriceChart({ data, height = 350 }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        vertLine: { color: 'rgba(51, 102, 255, 0.3)', width: 1, labelBackgroundColor: '#3366ff' },
        horzLine: { color: 'rgba(51, 102, 255, 0.3)', width: 1, labelBackgroundColor: '#3366ff' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.08)',
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    // v5 API: use addSeries with CandlestickSeries
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00d68f',
      downColor: '#ff3d71',
      borderUpColor: '#00d68f',
      borderDownColor: '#ff3d71',
      wickUpColor: '#00d68f',
      wickDownColor: '#ff3d71',
    });

    candleSeries.setData(data as any);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height]);

  if (data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center"
        style={{ height, background: 'var(--bg-tertiary)', borderRadius: '12px', color: 'var(--text-muted)' }}>
        <p className="text-sm">📈 No chart data available yet</p>
      </div>
    );
  }

  return <div ref={chartContainerRef} className="w-full rounded-xl overflow-hidden" />;
}
