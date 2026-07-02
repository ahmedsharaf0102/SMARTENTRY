import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
