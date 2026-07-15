import type { Metadata } from 'next';
import CommoditiesContent from './CommoditiesContent';

export const metadata: Metadata = {
  title: 'Commodities — SmartEntry | Gold, Oil, Silver & Metals Prices',
  description: 'Live commodity prices for Gold, Silver, Crude Oil, Natural Gas, Platinum and more. Charts, analysis, and price history.',
};

export default function CommoditiesPage() {
  return <CommoditiesContent />;
}
