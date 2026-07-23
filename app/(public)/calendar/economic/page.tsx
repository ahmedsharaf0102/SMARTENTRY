import type { Metadata } from 'next';
import EconomicCalendarContent from './EconomicCalendarContent';

export const metadata: Metadata = {
  title: 'Economic Calendar — SmartEntry | Smart Analysis for Every Event',
  description: 'Smart Economic Calendar with Arabic analysis. Track FOMC, CPI, NFP, GDP and every market-moving event with impact insights for Crypto, Stocks, Forex.',
};

export default function EconomicCalendarPage() {
  return <EconomicCalendarContent />;
}
