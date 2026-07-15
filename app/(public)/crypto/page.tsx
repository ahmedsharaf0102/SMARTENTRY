import type { Metadata } from 'next';
import CryptoContent from './CryptoContent';

export const metadata: Metadata = {
  title: 'Crypto Market — SmartEntry | Bitcoin, Ethereum & Altcoin Prices',
  description: 'Live cryptocurrency prices, market cap rankings, heatmaps, and crypto screener. Track Bitcoin, Ethereum, Solana, and 100+ altcoins.',
};

export default function CryptoPage() {
  return <CryptoContent />;
}
