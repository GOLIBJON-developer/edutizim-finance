
# AI Workflows & Prompt Log

Ushbu loyihani yaratishda sun'iy intellekt (AI) arxitektura rejalashtiruvchisi hamda kod va test generatsiyasi yordamchisi sifatida ishlatildi.

## Ishlatilgan AI Vositalari
* **Claude 3.5 Sonnet / ChatGPT / Gemini Advanced**: Buxgalteriya mantiqini tekshirish va Double-Entry Ledger modelini loyihalash.

## Eng Foydali Promptlar (Top Prompts)

### 1-Prompt: Accounting Model Selection
> "I am building a finance engine for an educational center CRM using Node.js and MongoDB. I need to output P&L, Cash Flow, and Balance Sheet with a strict requirement that Assets = Liabilities + Equity always holds true with 0 difference. Should I use separate collections for each report or a unified Double-Entry Journal Entry model? Explain the mathematical advantages."

### 2-Prompt: Reconciliation Mathematical Proof
> "Write a TypeScript function that verifies the 3 financial invariants: 1) BS Balance, 2) CF Net change connection, 3) Retained Earnings vs P&L Net Profit. Ensure it aggregates entries directly from MongoDB journal entries."

### 3-Prompt: Synthetic Ledger Seed Data Generator
> "Generate a Node.js seeding script that simulates 3 years of school operations: 500 students with prepayments, 20 teachers paid on the 5th of next month, loan interest splits, and equipment purchases. Ensure all double-entry debits and credits balance to zero."