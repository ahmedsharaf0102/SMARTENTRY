import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              MyWebsite
            </h3>
            <p className="text-gray-400 leading-relaxed">
              موقع احترافي مبني بأحدث التقنيات.
              نقدم أفضل الحلول الرقمية.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">الرئيسية</Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">عنّي</Link>
              <Link href="/services" className="block text-gray-400 hover:text-white transition-colors">خدماتي</Link>
              <Link href="/portfolio" className="block text-gray-400 hover:text-white transition-colors">أعمالي</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">تواصل معايا</Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">تواصل معانا</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 info@mywebsite.com</p>
              <p>📱 +20 123 456 7890</p>
              <p>📍 القاهرة، مصر</p>
            </div>
            <div className="flex space-x-4 space-x-reverse mt-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span>f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                <span>t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                <span>ig</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© 2025 MyWebsite. جميع الحقوق محفوظة ❤️</p>
        </div>
      </div>
    </footer>
  );
}