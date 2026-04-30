'use client';

import { useEffect, useState } from 'react';
import PriceChart from '@/app/components/PriceChart';

interface CoinChartSectionProps {
  symbol: string;
}

export default function CoinChartSection({ symbol }: CoinChartSectionProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandles() {
      try {
        const res = await fetch(`/api/candles/${symbol}?interval=1h&limit=100`);
        if (res.ok) {
          const candles = await res.json();
          setData(candles);
        }
      } catch (err) {
        console.error('Failed to fetch candles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCandles();
  }, [symbol]);

  if (loading) {
    return (
      <div className="w-full h-[350px] rounded-xl skeleton flex items-center justify-center"
        style={{ background: 'var(--bg-tertiary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading chart...</p>
      </div>
    );
  }

  return <PriceChart data={data} height={350} />;
}
