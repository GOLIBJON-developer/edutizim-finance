import { JournalEntryModel } from '../models/JournalEntry';
import { COA } from '../models/Account';

export class PostingsService {
  
  // 1. O'quvchi to'lov qilishi (Naqd yoki Bank)
  static async recordStudentPayment(date: Date, amount: number, paymentType: 'CASH' | 'BANK', description: string) {
    const cashAccount = paymentType === 'CASH' ? COA.CASH_HAND : COA.CASH_BANK;
    
    return JournalEntryModel.create({
      date,
      description,
      flowCategory: 'OPERATING',
      lines: [
        { accountCode: cashAccount, debit: amount, credit: 0 },
        { accountCode: COA.DEFERRED_REV, debit: 0, credit: amount }
      ]
    });
  }

  // 2. Oy oxirida dars daromadini tan olish (Accrual Recognition)
  static async recognizeTuitionRevenue(date: Date, amount: number) {
    return JournalEntryModel.create({
      date,
      description: 'Oy oxiri: Darslar o\'tildi va daromad tan olindi',
      flowCategory: 'NON_CASH',
      lines: [
        { accountCode: COA.DEFERRED_REV, debit: amount, credit: 0 },
        { accountCode: COA.TUITION_REV, debit: 0, credit: amount }
      ]
    });
  }

  // 3. Ish haqi hisoblanishi (Oy oxiri)
  static async accrueSalary(date: Date, amount: number) {
    return JournalEntryModel.create({
      date,
      description: 'Oy oxiri: Ish haqi xarajati hisoblandi',
      flowCategory: 'NON_CASH',
      lines: [
        { accountCode: COA.EXP_SALARY, debit: amount, credit: 0 },
        { accountCode: COA.SALARY_PAYABLE, debit: 0, credit: amount }
      ]
    });
  }

  // 4. Ish haqi to'lanishi (Keyingi oyning 5-sanasi)
  static async paySalary(date: Date, amount: number, paymentType: 'CASH' | 'BANK') {
    const cashAccount = paymentType === 'CASH' ? COA.CASH_HAND : COA.CASH_BANK;
    return JournalEntryModel.create({
      date,
      description: 'Ish haqi to\'landi',
      flowCategory: 'OPERATING',
      lines: [
        { accountCode: COA.SALARY_PAYABLE, debit: amount, credit: 0 },
        { accountCode: cashAccount, debit: 0, credit: amount }
      ]
    });
  }

  // 5. Operatsion xarajatlar (Ijara, Kommunal, Marketing)
  static async recordOperationalExpense(date: Date, expAccountCode: string, amount: number, paymentType: 'CASH' | 'BANK', description: string) {
    const cashAccount = paymentType === 'CASH' ? COA.CASH_HAND : COA.CASH_BANK;
    return JournalEntryModel.create({
      date,
      description,
      flowCategory: 'OPERATING',
      lines: [
        { accountCode: expAccountCode, debit: amount, credit: 0 },
        { accountCode: cashAccount, debit: 0, credit: amount }
      ]
    });
  }

  // 6. Kassadan bankka inkassatsiya
  static async recordInkassatsiya(date: Date, amount: number) {
    return JournalEntryModel.create({
      date,
      description: 'Kassadan bankka inkassatsiya',
      flowCategory: 'NON_CASH',
      lines: [
        { accountCode: COA.CASH_BANK, debit: amount, credit: 0 },
        { accountCode: COA.CASH_HAND, debit: 0, credit: amount }
      ]
    });
  }

  // 7. Investor kapital kiritishi
  static async injectCapital(date: Date, amount: number) {
    return JournalEntryModel.create({
      date,
      description: 'Investor kapital kiritdi',
      flowCategory: 'FINANCING',
      lines: [
        { accountCode: COA.CASH_BANK, debit: amount, credit: 0 },
        { accountCode: COA.EQUITY_CAPITAL, debit: 0, credit: amount }
      ]
    });
  }

  // 8. Bank krediti olinishi
  static async receiveLoan(date: Date, amount: number) {
    return JournalEntryModel.create({
      date,
      description: 'Bankdan kredit olindi',
      flowCategory: 'FINANCING',
      lines: [
        { accountCode: COA.CASH_BANK, debit: amount, credit: 0 },
        { accountCode: COA.BANK_LOAN, debit: 0, credit: amount }
      ]
    });
  }

  // 9. Kredit to'lovi (Asosiy qarz + Foiz)
  static async payLoanInstallment(date: Date, principal: number, interest: number) {
    const entries = [];
    if (principal > 0) {
      entries.push(JournalEntryModel.create({
        date,
        description: 'Kredit to\'lovi: Asosiy qarz',
        flowCategory: 'FINANCING',
        lines: [
          { accountCode: COA.BANK_LOAN, debit: principal, credit: 0 },
          { accountCode: COA.CASH_BANK, debit: 0, credit: principal }
        ]
      }));
    }
    if (interest > 0) {
      entries.push(JournalEntryModel.create({
        date,
        description: 'Kredit to\'lovi: Foiz qismi',
        flowCategory: 'OPERATING',
        lines: [
          { accountCode: COA.EXP_INTEREST, debit: interest, credit: 0 },
          { accountCode: COA.CASH_BANK, debit: 0, credit: interest }
        ]
      }));
    }
    return Promise.all(entries);
  }

  // 10. Jihoz sotib olish
  static async purchaseEquipment(date: Date, amount: number) {
    return JournalEntryModel.create({
      date,
      description: 'Jihoz va asosiy vosita xaridi',
      flowCategory: 'INVESTING',
      lines: [
        { accountCode: COA.FIXED_ASSETS, debit: amount, credit: 0 },
        { accountCode: COA.CASH_BANK, debit: 0, credit: amount }
      ]
    });
  }
}