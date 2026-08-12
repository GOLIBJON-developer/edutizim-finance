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

## Yuzaga kelgan muammo
```
npm test
```
ni bosganimda shunday err berdi:

```
 npm test
> edutizim-finance@1.0.0 test
> jest --runInBand
 FAIL  tests/scenarios.test.ts (12.532 s)
  ● Buxgalteriya Test Stsenariylari (5.1 - 5.5) › 5.1 Oldindan to'lov stsenariysi
    querySrv ECONNREFUSED _mongodb._tcp.cluster0.nb2k09l.mongodb.net

  ● Buxgalteriya Test Stsenariylari (5.1 - 5.5) › 5.2 Ish haqi stsenariysi
    querySrv ECONNREFUSED _mongodb._tcp.cluster0.nb2k09l.mongodb.net

  ● Buxgalteriya Test Stsenariylari (5.1 - 5.5) › 5.3 Investor kapitali stsenariysi
    querySrv ECONNREFUSED _mongodb._tcp.cluster0.nb2k09l.mongodb.net

  ● Buxgalteriya Test Stsenariylari (5.1 - 5.5) › 5.4 Kredit to'lovi stsenariysi
    querySrv ECONNREFUSED _mongodb._tcp.cluster0.nb2k09l.mongodb.net

  ● Buxgalteriya Test Stsenariylari (5.1 - 5.5) › 5.5 Jihoz xaridi stsenariysi
    querySrv ECONNREFUSED _mongodb._tcp.cluster0.nb2k09l.mongodb.net


  ● Test suite failed to run
    MongooseError: Connection operation buffering timed out after 10000ms

      18 |
      19 |   afterAll(async () => {
    > 20 |     await mongoose.connection.dropDatabase();
         |     ^
      21 |     await mongoose.disconnect();
      22 |   });
      23 |

      at NativeConnection._waitForConnect (node_modules/mongoose/lib/connection.js:869:13)
      at NativeConnection.dropDatabase (node_modules/mongoose/lib/connection.js:947:3)
      at Object.<anonymous> (tests/scenarios.test.ts:20:5)

Test Suites: 1 failed, 1 total
Tests:       5 failed, 5 total
Snapshots:   0 total
Time:        12.78 s
Ran all test suites.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
```

Bu xatolik (querySrv ECONNREFUSED _mongodb._tcp...) to'g'ridan-to'g'ri DNS tarmog'i bilan bog'liq muammo hisoblanadi. Sizning kompyuteringiz yoki internet provayderingiz MongoDB Atlas'ning mongodb+srv:// formatidagi maxsus DNS yozuvlarini o'qiy olmadi. O'zbekistondagi ba'zi internet provayderlarida (ISP) xavfsizlik filtrlari sababli bu holat tez-tez uchrab turadi.


 Muammoni birato'la va professional darajada hal qilish uchun testlarni **Xotiradagi ma'lumotlar bazasiga (`mongodb-memory-server`)** o'tkazishni tavsiya qilaman. Bu internet talab qilmaydi, DNS muammolarini yo'q qiladi va testlar 10 barobar tezroq ishlaydi.

### Asosiy Yechim: `mongodb-memory-server` ni o'rnatish

1. **Kutubxonani o'rnatish:** Faqat test muhiti uchun o'rnatamiz.
Terminalda quyidagi buyruqni bajaring:

```bash
npm install -D mongodb-memory-server

```


2. **scenarios.test.ts faylini yangilash:** Atlas bog'lanishini xotiradagi bazaga almashtiramiz.
`tests/scenarios.test.ts` faylingizdagi `beforeAll` va `afterAll` qismlarini quyidagicha o'zgartiring:

```typescript
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server'; // <--- Yangi import
import { PostingsService } from '../src/services/PostingsService';
import { FinanceEngine } from '../src/services/FinanceEngine';
import { JournalEntryModel } from '../src/models/JournalEntry';

jest.setTimeout(30000);

describe('Buxgalteriya Test Stsenariylari (5.1 - 5.5)', () => {
  let mongoServer: MongoMemoryServer; // <--- O'zgaruvchini e'lon qilamiz

  beforeAll(async () => {
    // Avvalgi .env dan o'qiydigan kod o'rniga, lokal server yaratamiz
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop(); // <--- Serverni to'xtatamiz
  });

  beforeEach(async () => {
    await JournalEntryModel.deleteMany({});
  });

  // ... Testlaringiz (5.1, 5.2 va hokazo) o'zgarishsiz qoladi

```


3. **Testni qayta ishga tushirish:** Tezlik va barqarorlikni tekshiring.
Endi testni yurgizib ko'ring:

```bash
npm test

```