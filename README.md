# EduTizim.uz — Moliya Moduli

Ushbu loyiha o'quv markazining uchta asosiy moliyaviy hisobotini (P&L, Cash Flow, Balance Sheet) aniq va 100% matematik moslikda chiqarib beruvchi moliya modulidir.

## Ma'lumotlar Modeli Tanlovi (Data Model Rationale)

Biz **Double-Entry General Ledger (Ikki yo'lama buxgalteriya yozuvi)** modelini tanladik.
* **Nima uchun?** Har bir moliyaviy hodisa kamida bitta *Debit* va bitta *Credit* yozuviga ega bo'ladi ($\sum Debit = \sum Credit$).
* **Afzalligi:** Bu model uchta buxgalteriya tenglamasining ($Assets = Liabilities + Equity$) har qanday sharoitda va istalgan vaqtda **nol farq (0.00)** bilan bajarilishini matematik jihatdan kafolatlaydi. Sun'iy tuzatuvchi qatorlarga ehtiyoj qolmaydi.

## Ishga Tushirish Ko'rsatmasi

1. **Kutubxonalarni o'rnatish:**
   ```bash
   npm install