export default function About() {
  return (
    <div className="pt-16">
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">عنّي</h1>
          <p className="text-xl text-blue-100">اعرف أكتر عن رحلتي وخبراتي</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-80 flex items-center justify-center">
              <span className="text-8xl">👨‍💻</span>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
                مرحباً، أنا [اسمك]
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                مطور ومصمم مواقع بخبرة في بناء حلول رقمية احترافية.
                بحب أحول الأفكار لمنتجات رقمية حقيقية تخدم الناس.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                شغفي هو إني أساعد الأفراد والشركات يبنوا تواجد رقمي قوي
                يساعدهم يوصلوا لأهدافهم.
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-gray-700">تصميم المواقع</span>
                    <span className="text-blue-600">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-gray-700">تطوير الويب</span>
                    <span className="text-purple-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-gray-700">التسويق الرقمي</span>
                    <span className="text-green-600">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}