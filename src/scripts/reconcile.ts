import dotenv from 'dotenv';
dotenv.config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS o'rnatish
import mongoose from 'mongoose';
import { FinanceEngine } from '../services/FinanceEngine';
import { JournalEntryModel } from '../models/JournalEntry';

async function reconcile() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {throw new Error('MONGO_URI .env faylida topilmadi!');}
  await mongoose.connect(mongoUri);

  // Bazadagi eng birinchi va eng oxirgi tranzaksiya sanasini topamiz
  const firstEntry = await JournalEntryModel.findOne().sort({ date: 1 }).lean();
  const lastEntry = await JournalEntryModel.findOne().sort({ date: -1 }).lean();

  if (!firstEntry || !lastEntry) {
    console.log('Baza bo\'sh! Avval npm run seed buyrug\'ini bajaring.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const startYear = firstEntry.date.getUTCFullYear();
  const startMonth = firstEntry.date.getUTCMonth() + 1;
  const endYear = lastEntry.date.getUTCFullYear();
  const endMonth = lastEntry.date.getUTCMonth() + 1;

  let totalMonthsTested = 0;
  let balanceSheetMismatches = 0;
  let cashFlowMismatches = 0;
  let profitMismatches = 0;

  console.log(`\n=== TEKSHIRUV BOSHLANDI (${startYear}-${startMonth} dan ${endYear}-${endMonth} gacha) ===\n`);

  let currentYear = startYear;
  let currentMonth = startMonth;

  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    totalMonthsTested++;
    const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    const pnl = await FinanceEngine.getProfitAndLoss(currentYear, currentMonth);
    const cashFlow = await FinanceEngine.getCashFlow(currentYear, currentMonth);
    
    const lastDayOfMonth = new Date(Date.UTC(currentYear, currentMonth, 0));
    const balanceSheet = await FinanceEngine.getBalanceSheet(lastDayOfMonth);

    // 1-Tenglik: Assets = Liabilities + Equity
    const bsDiff = Math.abs(balanceSheet.assets.total - balanceSheet.totalLiabilitiesAndEquity);
    if (bsDiff > 0.001) {
      balanceSheetMismatches++;
      console.error(`❌ [${monthStr}] Balans buzilgan! Farq: ${bsDiff}`);
    }

    // 2-Tenglik: Beginning Cash + Net Change = Ending Cash
    const cfCalculatedEnding = cashFlow.beginningCash + cashFlow.netCashChange;
    const cfDiff = Math.abs(cfCalculatedEnding - cashFlow.endingCash);
    if (cfDiff > 0.001) {
      cashFlowMismatches++;
      console.error(`❌ [${monthStr}] Pul oqimi buzilgan! Farq: ${cfDiff}`);
    }

    // 3-Tenglik: Net Profit = Retained Earnings change of this month
    const prevMonthLastDay = new Date(Date.UTC(currentYear, currentMonth - 1, 0));
    const prevBalanceSheet = await FinanceEngine.getBalanceSheet(prevMonthLastDay);
    const retainedEarnChange = balanceSheet.equity.retainedEarnings - prevBalanceSheet.equity.retainedEarnings;
    const profitDiff = Math.abs(pnl.netProfit - retainedEarnChange);
    if (profitDiff > 0.001) {
      profitMismatches++;
      console.error(`❌ [${monthStr}] Foyda bog'lanishi buzilgan! Farq: ${profitDiff}`);
    }

    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  console.log(`--------------------------------------------------`);
  console.log(`Tekshirilgan jami oylar: ${totalMonthsTested}`);
  console.log(`Balans tenglamasi mos kelmagan oylar: ${balanceSheetMismatches}`);
  console.log(`Pul oqimi bog'lanishi mos kelmagan oylar: ${cashFlowMismatches}`);
  console.log(`Foyda bog'lanishi mos kelmagan oylar: ${profitMismatches}`);
  console.log(`--------------------------------------------------`);

  await mongoose.disconnect();

  if (balanceSheetMismatches === 0 && cashFlowMismatches === 0 && profitMismatches === 0) {
    console.log('✅ BARCHA 3 TA TENGLIK NOL (0) FARQ BILAN TOZATDAN UTDI!');
    process.exit(0);
  } else {
    console.error('❌ RECONCILIATION XATOLIK BILAN TUGADI.');
    process.exit(1);
  }
}

reconcile();