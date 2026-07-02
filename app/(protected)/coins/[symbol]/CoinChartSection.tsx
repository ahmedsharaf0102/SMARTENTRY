'use client';

import TradingViewChart from '@/app/components/TradingViewChart';

interface CoinChartSectionProps {
  symbol: string;
}

export default function CoinChartSection({ symbol }: CoinChartSectionProps) {
  return <TradingViewChart symbol={symbol} height={450} />;
}
