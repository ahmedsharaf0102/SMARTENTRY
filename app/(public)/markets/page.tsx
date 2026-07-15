import type { Metadata } from 'next';
import MarketsContent from './MarketsContent';

export const metadata: Metadata = {
  title: 'Markets Overview — SmartEntry',
  description: 'Live overview of global financial markets including stocks, crypto, forex, commodities, and indices. Real-time prices and charts.',
};

export default function MarketsHomePage() {
  return <MarketsContent />;
}
