'use client';

import PriceChart from '@/app/components/PriceChart';

interface CoinChartSectionProps {
  data: { time: string; open: number; high: number; low: number; close: number }[];
}

export default function CoinChartSection({ data }: CoinChartSectionProps) {
  return <PriceChart data={data} height={350} />;
}
