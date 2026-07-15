import type { Metadata } from 'next';
import StocksContent from './StocksContent';

export const metadata: Metadata = {
  title: 'Stock Market — SmartEntry | Live Quotes, Heatmaps & Screener',
  description: 'Track S&P 500, NASDAQ, Dow Jones and global stock markets. Live heatmaps, stock screener, and real-time quotes.',
};

export default function StocksPage() {
  return <StocksContent />;
}
