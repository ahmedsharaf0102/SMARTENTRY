import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* ========== Hero Section ========== */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
        {/* خلفية ديكورية */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto fade-in">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
            🚀 أهلاً بيك في موقعي الاحترافي
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            نبني أفكارك
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              في العالم الرقمي
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            نقدم حلول رقمية احترافية تساعدك تحقق أهدافك.
            من التصميم للتطوير للتسويق - كل اللي تحتاجه في مكان واحد.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              ابدأ مشروعك الآن ←
            </Link>
            <Link href="/portfolio" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
              شوف أعمالنا
            </Link>
          </div>

          {/* إحصائيات */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">+50</div>
              <div className="text-blue-200 text-sm mt-1">مشروع مكتمل</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">+30</div>
              <div className="text-blue-200 text-sm mt-1">عميل سعيد</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">+3</div>
              <div className="text-blue-200 text-sm mt-1">سنوات خبرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Services Preview ========== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
              خدماتنا
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات الرقمية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* خدمة 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تصميم المواقع</h3>
              <p className="text-gray-500 leading-relaxed">
                تصميمات عصرية وجذابة تعكس هوية علامتك التجارية وتجذب عملائك.
              </p>
            </div>

            {/* خدمة 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                💻
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تطوير التطبيقات</h3>
              <p className="text-gray-500 leading-relaxed">
                تطبيقات ويب وموبايل بأحدث التقنيات تعمل بسرعة وكفاءة عالية.
              </p>
            </div>

            {/* خدمة 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                📈
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">التسويق الرقمي</h3>
              <p className="text-gray-500 leading-relaxed">
                استراتيجيات تسويقية فعالة تزيد مبيعاتك وتوصلك لعملائك المستهدفين.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/services" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              كل الخدمات ←
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CTA Section ========== */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            جاهز تبدأ مشروعك؟
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            تواصل معانا النهارده واحصل على استشارة مجانية لمشروعك الرقمي
          </p>
          <Link href="/contact" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            تواصل معانا الآن ←
          </Link>
        </div>
      </section>
    </div>
  );
}