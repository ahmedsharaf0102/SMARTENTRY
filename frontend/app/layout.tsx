import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SmartEntry — Crypto Trading Signals & Insights',
  description: 'Real-time crypto trading signals powered by RSI, MACD, volume analysis. Get actionable BUY, WATCH, and WAIT decisions for top cryptocurrencies.',
  keywords: ['crypto', 'trading signals', 'RSI', 'MACD', 'Bitcoin', 'cryptocurrency', 'technical analysis'],
  openGraph: {
    title: 'SmartEntry — Crypto Trading Signals',
    description: 'Actionable crypto trading insights powered by real-time technical analysis.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}