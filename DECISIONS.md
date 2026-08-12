# Open Question Decision: Investor Profit Share Tracking

## 1. Investor va Rahbariyatga Beriladigan Aniq Savollar
1. **Foydani taqsimlash nisbati:** Investorlar o'rtasida foyda kiritilgan kapital ulushiga ($Equity Ratio$) mutanosib taqsimlanadimi yoki alohida belgilangan kelishuv foizi ($Fixed Dividend \%) bormi?
2. **Hisoblash davriyligi:** Foyda ulushi har oy yakunida hisoblanib zaxiralanadimi ($Accrued Dividend$) yoki faqat yillik/choraklik dividend e'lon qilinganda ($Declared Dividends$) tan olinadimi?
3. **To'lov vs Qayta investitsiya:** Hisoblangan foyda ulushi investorga darhol to'lab beriladimi yoki biznesda reinvestitsiya qilinib kapitalga qo'shiladimi?

## 2. Javob Kutmasdan Qabul Qilingan Qarorlar va Asoslar
* **Qaror:** Birinchi versiyada har oy oxirida Sof Foyda ($Net Profit$) avtomatik ravishda Investorlar ulushiga ko'ra "Bajarilishi kerak bo'lgan dividend majburiyati" ($Dividends Payable$) sifatida emas, balki **Taqsimlanmagan foyda ($Retained Earnings$)** tarkibida saqlanadi.
* **Sababi:** Buxgalteriya standartlariga ko'ra, foyda chiqarish (dividend e'lon qilish) aksionerlar/investorlar yig'ilishining rasmiy qarori bilan amalga oshiriladi. Avtomatik ravishda majburiyatga o'tkazish Balans va Majburiyatlar tenglamasini noto'g'ri ko'rsatishi mumkin.

## 3. Ma'lumotlar Modeli va Hisobotlarga Ta'siri
* **Hisoblar Rejasiga (COA) qo'shiladigan yangi hisoblar:**
  * `3030 - E'lon qilingan dividendlar` (Equity sub-account)
  * `2040 - To'lanadigan dividendlar` (Liability sub-account)
* **Hisobotlarga ta'siri:**
  * **P&L:** Ta'sir qilmaydi (Dividend xarajat emas, foydaning taqsimlanishidir).
  * **Balans:** Equity bo'limida *Investor Kapitali*, *Taqsimlanmagan Foyda* va *Ajratilgan Dividendlar* alohida ko'rinadi.
  * **Pul Oqimi:** Dividend to'lab berilganda **Moliyaviy Chiqim (Financing Cash Outflow)** sifatida aks etadi.

## 4. Birinchi Versiyaga Kiritilmagan Funksiyalar
* Avtomatik dividend to me'yoriy to'lov transferlari.
* Murakkab pog'onali ($Tiered Waterfall$) foyda taqsimoti.
* Soliq ushlanmalarini ($Withholding Tax$) avtomatik ushlash.