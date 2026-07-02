import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SmartEntry — Financial Markets, Signals & Analysis',
  description: 'Your comprehensive financial portal — crypto trading signals, stock market data, economic calendar, and expert analysis. All in one place.',
  keywords: ['crypto', 'trading signals', 'stock market', 'economic calendar', 'financial analysis', 'RSI', 'MACD', 'Bitcoin', 'gold'],
  openGraph: {
    title: 'SmartEntry — Financial Markets, Signals & Analysis',
    description: 'Crypto signals, stock data, economic calendar, and expert analysis — your financial command center.',
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