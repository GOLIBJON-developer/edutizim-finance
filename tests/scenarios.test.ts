import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PostingsService } from '../src/services/PostingsService';
import { FinanceEngine } from '../src/services/FinanceEngine';
import { JournalEntryModel } from '../src/models/JournalEntry';

jest.setTimeout(30000);

describe('Buxgalteriya Test Stsenariylari (5.1 - 5.5)', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // In-Memory MongoDB instansiyasini yaratamiz
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await JournalEntryModel.deleteMany({});
  });

  // 5.1. Oldindan to'lov
  test('5.1 Oldindan to\'lov stsenariysi', async () => {
    await PostingsService.recordStudentPayment(new Date('2026-01-10'), 1800000, 'BANK', 'Student 3 month prepayment');
    
    await PostingsService.recognizeTuitionRevenue(new Date('2026-01-31'), 600000);
    await PostingsService.recognizeTuitionRevenue(new Date('2026-02-28'), 600000);
    await PostingsService.recognizeTuitionRevenue(new Date('2026-03-31'), 600000);

    const janPNL = await FinanceEngine.getProfitAndLoss(2026, 1);
    expect(janPNL.revenues.tuition).toBe(600000);

    const janBS = await FinanceEngine.getBalanceSheet(new Date('2026-01-31'));
    expect(janBS.liabilities.deferredRevenue).toBe(1200000);

    const janCF = await FinanceEngine.getCashFlow(2026, 1);
    expect(janCF.operatingCashFlow).toBe(1800000);

    const marBS = await FinanceEngine.getBalanceSheet(new Date('2026-03-31'));
    expect(marBS.liabilities.deferredRevenue).toBe(0);

    const pnlJan = await FinanceEngine.getProfitAndLoss(2026, 1);
    const pnlFeb = await FinanceEngine.getProfitAndLoss(2026, 2);
    const pnlMar = await FinanceEngine.getProfitAndLoss(2026, 3);
    const totalRev = pnlJan.revenues.total + pnlFeb.revenues.total + pnlMar.revenues.total;
    expect(totalRev).toBe(1800000);
  });

  // 5.2. Ish haqi
  test('5.2 Ish haqi stsenariysi', async () => {
    await PostingsService.accrueSalary(new Date('2026-01-31'), 8000000);
    await PostingsService.paySalary(new Date('2026-02-05'), 8000000, 'BANK');

    const janPNL = await FinanceEngine.getProfitAndLoss(2026, 1);
    expect(janPNL.expenses.salary).toBe(8000000);

    const janBS = await FinanceEngine.getBalanceSheet(new Date('2026-01-31'));
    expect(janBS.liabilities.unpaidSalary).toBe(8000000);

    const janCF = await FinanceEngine.getCashFlow(2026, 1);
    expect(janCF.netCashChange).toBe(0);

    const febPNL = await FinanceEngine.getProfitAndLoss(2026, 2);
    expect(febPNL.expenses.salary).toBe(0);

    const febCF = await FinanceEngine.getCashFlow(2026, 2);
    expect(febCF.operatingCashFlow).toBe(-8000000);

    const febBS = await FinanceEngine.getBalanceSheet(new Date('2026-02-28'));
    expect(febBS.liabilities.unpaidSalary).toBe(0);
  });

  // 5.3. Investor kapitali
  test('5.3 Investor kapitali stsenariysi', async () => {
    await PostingsService.injectCapital(new Date('2026-01-05'), 500000000);

    const janPNL = await FinanceEngine.getProfitAndLoss(2026, 1);
    expect(janPNL.revenues.total).toBe(0);
    expect(janPNL.netProfit).toBe(0);

    const janBS = await FinanceEngine.getBalanceSheet(new Date('2026-01-31'));
    expect(janBS.equity.investorCapital).toBe(500000000);

    const janCF = await FinanceEngine.getCashFlow(2026, 1);
    expect(janCF.financingCashFlow).toBe(500000000);
    expect(janCF.operatingCashFlow).toBe(0);
  });

  // 5.4. Kredit to'lovi
  test('5.4 Kredit to\'lovi stsenariysi', async () => {
    await PostingsService.receiveLoan(new Date('2026-02-01'), 200000000);
    await PostingsService.payLoanInstallment(new Date('2026-02-20'), 9000000, 3000000);

    const febPNL = await FinanceEngine.getProfitAndLoss(2026, 2);
    expect(febPNL.expenses.interest).toBe(3000000);

    const febBS = await FinanceEngine.getBalanceSheet(new Date('2026-02-28'));
    expect(febBS.liabilities.bankLoans).toBe(191000000);

    const febCF = await FinanceEngine.getCashFlow(2026, 2);
    expect(febCF.financingCashFlow).toBe(191000000);
    expect(febCF.operatingCashFlow).toBe(-3000000);
  });

  // 5.5. Jihoz xaridi
  test('5.5 Jihoz xaridi stsenariysi', async () => {
    await PostingsService.purchaseEquipment(new Date('2026-01-08'), 240000000);

    const janPNL = await FinanceEngine.getProfitAndLoss(2026, 1);
    expect(janPNL.expenses.total).toBe(0);

    const janBS = await FinanceEngine.getBalanceSheet(new Date('2026-01-31'));
    expect(janBS.assets.equipment).toBe(240000000);

    const janCF = await FinanceEngine.getCashFlow(2026, 1);
    expect(janCF.investingCashFlow).toBe(-240000000);
  });
});