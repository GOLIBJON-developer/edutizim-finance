import { JournalEntryModel } from '../models/JournalEntry';
import { COA } from '../models/Account';

export class FinanceEngine {

  // 1. Foyda va Zarar Hisoboti (P&L) - Ma'lum oy uchun
  static async getProfitAndLoss(year: number, month: number) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const entries = await JournalEntryModel.find({
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    let revenues = { tuition: 0, total: 0 };
    let expenses = {
      salary: 0,
      rent: 0,
      utilities: 0,
      marketing: 0,
      interest: 0,
      total: 0
    };

    for (const entry of entries) {
      for (const line of entry.lines) {
        if (line.accountCode === COA.TUITION_REV) {
          revenues.tuition += (line.credit - line.debit);
        } else if (line.accountCode === COA.EXP_SALARY) {
          expenses.salary += (line.debit - line.credit);
        } else if (line.accountCode === COA.EXP_RENT) {
          expenses.rent += (line.debit - line.credit);
        } else if (line.accountCode === COA.EXP_UTILITIES) {
          expenses.utilities += (line.debit - line.credit);
        } else if (line.accountCode === COA.EXP_MARKETING) {
          expenses.marketing += (line.debit - line.credit);
        } else if (line.accountCode === COA.EXP_INTEREST) {
          expenses.interest += (line.debit - line.credit);
        }
      }
    }

    revenues.total = revenues.tuition;
    expenses.total = expenses.salary + expenses.rent + expenses.utilities + expenses.marketing + expenses.interest;
    const netProfit = revenues.total - expenses.total;

    return {
      period: `${year}-${String(month).padStart(2, '0')}`,
      revenues,
      expenses,
      netProfit
    };
  }

  // 2. Pul Oqimi Hisoboti (Cash Flow) - Ma'lum oy uchun
  static async getCashFlow(year: number, month: number) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Oy boshidagi pul balansi (1010 + 1020)
    const startBalanceEntries = await JournalEntryModel.find({
      date: { $lt: startDate }
    }).lean();

    let beginningCash = 0;
    for (const e of startBalanceEntries) {
      for (const l of e.lines) {
        if (l.accountCode === COA.CASH_HAND || l.accountCode === COA.CASH_BANK) {
          beginningCash += (l.debit - l.credit);
        }
      }
    }

    // Shu oydagi pul harakatlari
    const monthEntries = await JournalEntryModel.find({
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    let operatingCashFlow = 0;
    let investingCashFlow = 0;
    let financingCashFlow = 0;

    for (const entry of monthEntries) {
      let cashImpact = 0;
      for (const line of entry.lines) {
        if (line.accountCode === COA.CASH_HAND || line.accountCode === COA.CASH_BANK) {
          cashImpact += (line.debit - line.credit);
        }
      }

      if (cashImpact !== 0) {
        if (entry.flowCategory === 'OPERATING') operatingCashFlow += cashImpact;
        else if (entry.flowCategory === 'INVESTING') investingCashFlow += cashImpact;
        else if (entry.flowCategory === 'FINANCING') financingCashFlow += cashImpact;
      }
    }

    const netCashChange = operatingCashFlow + investingCashFlow + financingCashFlow;
    const endingCash = beginningCash + netCashChange;

    return {
      period: `${year}-${String(month).padStart(2, '0')}`,
      beginningCash,
      operatingCashFlow,
      investingCashFlow,
      financingCashFlow,
      netCashChange,
      endingCash
    };
  }

  // 3. Balans Hisoboti (Balance Sheet) - Berilgan sana holatiga
  static async getBalanceSheet(asOfDate: Date) {
    const endOfDay = new Date(Date.UTC(
      asOfDate.getUTCFullYear(),
      asOfDate.getUTCMonth(),
      asOfDate.getUTCDate(),
      23, 59, 59, 999
    ));

    const entries = await JournalEntryModel.find({
      date: { $lte: endOfDay }
    }).lean();

    let assets = {
      cashAndBank: 0,
      equipment: 0,
      total: 0
    };

    let liabilities = {
      deferredRevenue: 0,
      unpaidSalary: 0,
      bankLoans: 0,
      total: 0
    };

    let equity = {
      investorCapital: 0,
      retainedEarnings: 0,
      total: 0
    };

    for (const e of entries) {
      for (const l of e.lines) {
        // Assets
        if (l.accountCode === COA.CASH_HAND || l.accountCode === COA.CASH_BANK) {
          assets.cashAndBank += (l.debit - l.credit);
        } else if (l.accountCode === COA.FIXED_ASSETS) {
          assets.equipment += (l.debit - l.credit);
        }
        // Liabilities
        else if (l.accountCode === COA.DEFERRED_REV) {
          liabilities.deferredRevenue += (l.credit - l.debit);
        } else if (l.accountCode === COA.SALARY_PAYABLE) {
          liabilities.unpaidSalary += (l.credit - l.debit);
        } else if (l.accountCode === COA.BANK_LOAN) {
          liabilities.bankLoans += (l.credit - l.debit);
        }
        // Equity
        else if (l.accountCode === COA.EQUITY_CAPITAL) {
          equity.investorCapital += (l.credit - l.debit);
        }
        // Cumulative P&L -> Retained Earnings
        else if (l.accountCode === COA.TUITION_REV) {
          equity.retainedEarnings += (l.credit - l.debit);
        } else if (
          l.accountCode === COA.EXP_SALARY ||
          l.accountCode === COA.EXP_RENT ||
          l.accountCode === COA.EXP_UTILITIES ||
          l.accountCode === COA.EXP_MARKETING ||
          l.accountCode === COA.EXP_INTEREST
        ) {
          equity.retainedEarnings -= (l.debit - l.credit);
        }
      }
    }

    assets.total = assets.cashAndBank + assets.equipment;
    liabilities.total = liabilities.deferredRevenue + liabilities.unpaidSalary + liabilities.bankLoans;
    equity.total = equity.investorCapital + equity.retainedEarnings;

    return {
      asOfDate: endOfDay.toISOString().split('T')[0],
      assets,
      liabilities,
      equity,
      totalLiabilitiesAndEquity: liabilities.total + equity.total
    };
  }
}