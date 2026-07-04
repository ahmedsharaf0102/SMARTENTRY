# 🚀 SmartEntry — Phase 1: MVP Launch Plan (News & Markets Portal)

## 📌 الهدف من المرحلة الأولى (MVP)
إطلاق الموقع بأسرع وقت ممكن ليكون منصة مفيدة تجذب الزوار يومياً. التركيز في هذه المرحلة على:
1. نظام تسجيل دخول مجاني وسهل للجميع.
2. لوحة تحكم (Admin Panel) بسيطة لمدير الموقع لنشر الأخبار والمقالات بدون خبرة برمجية.
3. توفير بيانات حية أساسية للأسهم والعملات الرقمية لزيادة تفاعل الزوار.

---

## 1️⃣ نظام تسجيل الدخول (Authentication)
سيكون التسجيل **مجاني بالكامل** لجميع الزوار لزيادة قاعدة المستخدمين.
- **مزود الخدمة:** Supabase Auth.
- **طرق التسجيل المطلوبة:**
  - 📧 البريد الإلكتروني (Email/Password).
  - 🌐 حساب جوجل (Google OAuth).
  - 📘 حساب فيسبوك (Facebook OAuth - يتطلب تفعيل من Supabase).
  - 📱 رقم التليفون (Phone OTP - يتطلب ربط Supabase بخدمة مثل Twilio مستقبلاً، ويمكن تأجيله للخطوة التالية إذا كان معقداً).

---

## 2️⃣ لوحة تحكم الإدارة (Admin Panel & CMS)
بدلاً من استخدام أنظمة معقدة، سنقوم بإنشاء لوحة تحكم مدمجة داخل الموقع (Next.js) مخصصة فقط لمدير الموقع.

### أ- كيف تعمل الصلاحيات (Admin Role)؟
- في قاعدة بيانات Supabase، سنضيف عمود `role` في جدول المستخدمين `profiles`.
- إذا كان الـ `role = 'admin'`، يظهر للمستخدم زر مخفي في الموقع "لوحة التحكم".
- صفحة `/admin` ستكون محمية تماماً ولا يدخلها سوى المدير.

### ب- واجهة كتابة المقالات (Rich Text Editor)
- سيتم استخدام مكتبة مثل `React Quill` أو `TipTap`.
- هذه المكتبة توفر واجهة مشابهة لـ "Microsoft Word" (تكبير الخط، إضافة صور، روابط) بحيث يكتب المدير المقال بسهولة ويضغط "نشر".

---

## 3️⃣ قاعدة البيانات (Database Schema للأخبار)
سنحتاج إلى إنشاء جدول جديد في Supabase مخصص للأخبار:
```sql
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- الرابط النظيف (مثال: /news/bitcoin-hits-100k)
  content TEXT NOT NULL,     -- محتوى المقال (HTML)
  category TEXT NOT NULL,    -- (Crypto, Stocks, Economy, Analysis)
  image_url TEXT,            -- صورة الغلاف
  author_id UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4️⃣ قسم بيانات الأسواق (Markets Data)
بجانب الأخبار، يجب أن يجد الزائر فائدة يومية من الموقع:
- **نظام التحديث:** سنستمر في استخدام `GitHub Actions` لتشغيل كود البايثون (`run.py`) كل 20 دقيقة.
- **البيانات المجانية:**
  - الكريبتو: سحب أسعار (BTC, ETH, SOL) من MEXC API.
  - الأسهم/الذهب: سحب أسعار (S&P 500, Gold, Apple) عبر `yfinance`.
- هذه البيانات ستعرض في صفحة الموقع الرئيسية كجدول بسيط لأسعار السوق (Markets Overview).

---

## 🤖 Prompt for the AI Coder (تعليمات التنفيذ للـ AI)
> **Note to user:** Copy the text below and give it to your AI coding agent.

```text
We are executing "Phase 1 (MVP)" for the SmartEntry Next.js project. The goal is to launch a functional News & Markets portal. Please execute the following tasks:

TASK 1: DATABASE SETUP FOR NEWS (SUPABASE)
- Create a new Supabase SQL migration to add an `articles` table (title, slug, content, category, image_url, author_id, published_at).
- Update the `profiles` table to include a `role` column (default 'user').
- Set up Row Level Security (RLS) so that anyone can SELECT articles, but only users with `role = 'admin'` can INSERT/UPDATE/DELETE articles.

TASK 2: AUTHENTICATION ENHANCEMENT
- Ensure the Login/Signup pages support Email/Password and Google OAuth via Supabase SSR.
- Prepare the UI buttons for Facebook and Phone Auth (we will configure the Supabase provider keys later).

TASK 3: THE ADMIN PANEL (CMS)
- Create a protected route at `app/(protected)/admin/page.tsx`.
- Protect this layout so that ONLY users where `profile.role === 'admin'` can access it (redirect others to `/`).
- Inside `/admin`, build a "Create Article" form.
- Use a Rich Text Editor library (like `react-quill` or `@tiptap/react`) so the non-technical admin can format text, add headers, and insert images easily.
- The form should save the HTML content directly to the Supabase `articles` table.

TASK 4: FRONTEND DISPLAY
- Build `app/(public)/news/page.tsx` to list all published articles (fetch from Supabase).
- Build `app/(public)/news/[slug]/page.tsx` to display the full article content.
- Build a simple "Market Overview" widget on the homepage that fetches the latest prices (Crypto/Stocks) from our existing Supabase database tables.

Please begin with Task 1 and Task 3 (The Admin Panel).
```
