Mana loyihangiz uchun tayyorlangan, xalqaro dasturlash standartlariga javob beradigan va GitHub uchun moslashtirilgan **`README.md`** fayli kodi:

```markdown
# 🎓 EduTizim.uz — Moliya va Buxgalteriya Moduli

Ushbu loyiha o'quv markazlarining moliyaviy faoliyatini avtomatlashtirish, har qanday tranzaksiyani xalqaro buxgalteriya standartlari asosida yuritish hamda uchta asosiy moliyaviy hisobotni (**P&L**, **Cash Flow**, **Balance Sheet**) 100% matematik aniqlikda shakllantirish uchun mo'ljallangan to'liq (Full-Stack) tizimdir.

---

## 📌 Loyiha Haqida

Tizim o'quv markazidagi talabalar to'lovlari, o'qituvchilar va xodimlar ish haqi, ijara, marketing va boshqa operatsion xarajatlarni real vaqt rejimida hisoblab boradi. Tizimning barcha hisobotlari bir-biri bilan uzviy bog'langan bo'lib, inson omili tufayli yuzaga kelishi mumkin bo'lgan moliyaviy tafovutlarni nolga tushiradi.

### Asosiy Imkoniyatlar:
* **Foyda va Zarar Hisoboti (P&L):** Haqiqiy o'tilgan darslar bo'yicha tan olingan daromadlar va operatsion xarajatlar tahlili.
* **Pul Oqimi Hisoboti (Cash Flow):** Kassa va bankdagi naqd pul harakati (Operatsion, Investitsion, Moliyaviy).
* **Balans Hisoboti (Balance Sheet):** Markazning aktivlari, majburiyatlari va xususiy kapitalining real vaqtdagi holati.
* **0-Farq Kafolati (Automated Reconciliation):** Barcha hisobotlar o'rtasida $0.00$ so'm farq bo'lishini avtomatik tekshirish mexanizmi.

---

## 💡 Ma'lumotlar Modeli Tanlovi (Data Model Rationale)

Loyiha arxitekturasida **Double-Entry General Ledger (Ikki yo'lama buxgalteriya yozuvi)** modeli qo me'moriy asos qilib olingan.

* **Nima uchun bu model?**
  Har bir moliyaviy operatsiya kamida bitta *Debit* va bitta *Credit* hisobvarag'ida aks ettiriladi:
  $$\sum \text{Debit} = \sum \text{Credit}$$

* **Matematik Kafolat:**
  Ushbu model asosiy buxgalteriya tenglamasining har qanday sharoitda va istalgan vaqtda **nol farq (0.00)** bilan bajarilishini matematik jihatdan kafolatlaydi:
  $$\text{Aktivlar} = \text{Majburiyatlar} + \text{Kapital}$$

Tizimda hech qanday sun'iy tuzatuvchi qatorlar yoki statistik taxminlar ishlatilmaydi — barcha raqamlar Bosh Daftardagi (*Journal Entries*) qat'iy tranzaksiyalardan kelib chiqadi.

---

## 🛠 Texnologik Stek

* **Backend:** Node.js, Express.js, TypeScript, Mongoose
* **Frontend:** React, TypeScript
* **Ma'lumotlar Bazasi:** MongoDB Atlas (Cloud Database)
* **Testlash va Skriptlar:** ts-node, ts-node-dev, Jest / Supertest

---

## 📁 Loyiha Strukturasi

```text
edutizim-finance/
├── client/                   # Frontend (React + TypeScript)
│   ├── public/               # Static fayllar (index.html)
│   └── src/                  # App.tsx va UI komponentlar
├── src/                      # Backend (Node.js + Express + TypeScript)
│   ├── config/               # Database va tizim sozlamalari
│   ├── models/               # MongoDB Mongoose sxemalari
│   ├── routes/               # API marshrutlari
│   ├── scripts/              # Seed va Reconcile avtomatlashtirish skriptlari
│   ├── services/             # Moliya va buxgalteriya mantiq xizmatlari
│   └── app.ts                # Express serverining kirish nuqtasi
├── .env                      # Atrof-muhit o'zgaruvchilari
├── tsconfig.json             # TypeScript sozlamalari
└── package.json              # Backend bog'liqliklari va skriptlar

```

---

## 🚀 Ishga Tushirish Qo'llanmasi

### 1. Oldindan Talab Qilinadigan Vositalar

* **Node.js:** v18 yoki undan yuqori
* **npm:** v9 yoki undan yuqori
* **MongoDB Atlas Account:** Ulanish havolasi (*Connection String*) bilan

---

### 2. Atrof-muhit Faylini Sozlash (`.env`)

Loyiha ildiz papkasida `.env` faylini yarating va MongoDB Atlas ulanish ma'lumotlarini kiriting:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.abcde.mongodb.net/edutizim_finance?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development

```

---

### 3. Backend-ni Sozlash va Ishga Tushirish

1. **Kutubxonalarni o'rnatish:**
```bash
npm install

```


2. **Atlas bazasiga 3 yillik sinov ma'lumotlarini yuklash (Seeding):**
```bash
npm run seed

```


3. **Moliyaviy tenglamalarni 0 farqga tekshirish (Reconciliation):**
```bash
npm run reconcile

```


4. **Avtomatik testlarni yurgizish:**
```bash
npm test

```


5. **Backend Serverni development rejimida ishga tushirish:**
```bash
npm run dev

```


*Server `http://localhost:5000` manzilida ishga tushadi.*

---

### 4. Frontend-ni Sozlash va Ishga Tushirish

Yangi terminal oynasini oching va `client` papkasiga o'ting:

1. **Frontend papkasiga o'tish:**
```bash
cd client

```


2. **Kutubxonalarni o'rnatish:**
```bash
npm install

```


3. **React dasturini ishga tushirish:**
```bash
npm start

```


*Ilova avtomatik ravishda brauzerda `http://localhost:3000` manzilida ochiladi.*

---

## 📡 API Marshrutlari Overview

Backend xizmati quyidagi asosiy REST API endpoint-larini taqdim etadi:

| Metod | Endpoint | Tavsif |
| --- | --- | --- |
| `GET` | `/health` | Server va bazaning ishchi holatini tekshirish |
| `GET` | `/api/pnl?year=2026&month=1` | Berilgan oy uchun Foyda va Zarar hisoboti |
| `GET` | `/api/cashflow?year=2026&month=1` | Berilgan oy uchun Pul Oqimi hisoboti |
| `GET` | `/api/balance-sheet?year=2026&month=1` | Berilgan oy oxiridagi Balans hisoboti |

---

## 🧪 Avtomatlashtirilgan Tekshiruv (Reconciliation Engine)

`npm run reconcile` skripti 2023-yildan 2026-yilgacha bo'lgan barcha 33 oylik moliyaviy ma'lumotlarni tekshirib chiqadi va quyidagi tengliklarni tasdiqlaydi:

1. $\text{Aktivlar} - (\text{Majburiyatlar} + \text{Kapital}) = 0.00$
2. $\text{Yakuniy Pul (Balance Sheet)} - \text{Yakuniy Pul (Cash Flow)} = 0.00$
3. $\text{Taqsimlanmagan Foyda (Equity)} - \sum \text{Oylik Sof Foydalar} = 0.00$

Aks holda skript xatolik qaytaradi va pipeline to'xtaydi.