import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'MyWebsite - موقعي الاحترافي',
  description: 'موقع احترافي مبني بأحدث التقنيات',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}