import type { Metadata } from 'next';
import ForexContent from './ForexContent';

export const metadata: Metadata = {
  title: 'Forex Market — SmartEntry | Live Currency Rates & Cross Rates',
  description: 'Live forex rates, currency cross rates table, and forex screener. Track EUR/USD, GBP/USD, USD/JPY and 50+ currency pairs.',
};

export default function ForexPage() {
  return <ForexContent />;
}
