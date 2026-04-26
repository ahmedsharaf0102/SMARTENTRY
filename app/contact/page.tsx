'use client';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('شكراً! رسالتك وصلت 🎉');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-16">
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">تواصل معايا</h1>
          <p className="text-xl text-blue-100">عندك مشروع أو فكرة؟ كلمني!</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">الاسم</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="اكتب اسمك"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">الإيميل</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">الرسالة</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="اكتب رسالتك هنا..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              ابعت الرسالة ✉️
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold text-gray-800">الإيميل</h3>
              <p className="text-gray-500 mt-1">info@mywebsite.com</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-gray-800">الموبايل</h3>
              <p className="text-gray-500 mt-1">+20 123 456 7890</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-gray-800">الموقع</h3>
              <p className="text-gray-500 mt-1">القاهرة، مصر</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}