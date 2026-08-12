import { Schema, model, Document } from 'mongoose';

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE'
}

export interface IAccount extends Document {
  code: string;
  name: string;
  type: AccountType;
  category: string;
}

const AccountSchema = new Schema<IAccount>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(AccountType), required: true },
  category: { type: String, required: true }
});

export const AccountModel = model<IAccount>('Account', AccountSchema);

export const COA = {
  CASH_HAND: '1010',      // Kassa (Naqd)
  CASH_BANK: '1020',      // Bank hisob raqami
  FIXED_ASSETS: '1100',   // Asosiy vositalar (Jihozlar)
  DEFERRED_REV: '2010',   // Oldindan to'langan darslar (Majburiyat)
  SALARY_PAYABLE: '2020', // To'lanmagan ish haqi (Majburiyat)
  BANK_LOAN: '2030',      // Bank krediti (Majburiyat)
  EQUITY_CAPITAL: '3010', // Investor kapitali
  RETAINED_EARN: '3020',  // Taqsimlanmagan foyda
  TUITION_REV: '4010',    // Dars berish daromadi
  EXP_SALARY: '5010',     // Ish haqi xarajati
  EXP_RENT: '5020',       // Ijara xarajati
  EXP_UTILITIES: '5030',  // Kommunal xarajatlar
  EXP_MARKETING: '5040',  // Marketing xarajati
  EXP_INTEREST: '5050'    // Kredit foizi xarajati
};