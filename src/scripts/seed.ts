import dotenv from 'dotenv';
dotenv.config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS o'rnatish

import mongoose from 'mongoose';
import { JournalEntryModel } from '../models/JournalEntry';
import { PostingsService } from '../services/PostingsService';

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {throw new Error('MONGO_URI .env faylida topilmadi!');}
  await mongoose.connect(mongoUri);
  await JournalEntryModel.deleteMany({});

  console.log('🌱 Seeding boshlandi (3 yillik realistik ma\'lumotlar)...');

  // 1. Kapital va Jihoz xaridi (2023-12-15)
  await PostingsService.injectCapital(new Date('2023-12-15'), 600000000);
  await PostingsService.purchaseEquipment(new Date('2023-12-20'), 250000000);

  // 2. Bank Krediti (2024-01-10)
  await PostingsService.receiveLoan(new Date('2024-01-10'), 300000000);

  // 3 yillik simulyatsiya: 2024, 2025, 2026
  for (let year = 2024; year <= 2026; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === 2026 && month > 8) break; // 2026-08 gacha

      const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

      // a) 500+ O'quvchi to'lovlari (Oy davomida 1-15 sanalarda)
      for (let s = 1; s <= 450; s++) {
        const isMultiMonth = s % 5 === 0;
        const amount = isMultiMonth ? 1800000 : 600000;
        const paymentType = s % 2 === 0 ? 'BANK' : 'CASH';
        const day = (s % 15) + 1;
        await PostingsService.recordStudentPayment(
          new Date(Date.UTC(year, month - 1, day)),
          amount,
          paymentType,
          `Student #${s} tuition payment`
        );
      }

      // b) O'tgan oy ish haqini to'lash (5-sana)
      if (!(year === 2024 && month === 1)) {
        await PostingsService.paySalary(
          new Date(Date.UTC(year, month - 1, 5)),
          120000000, // 20 ta xodim x 6 mln
          'BANK'
        );
      }

      // c) Ijara, Kommunal, Marketing (10-15 sanalar)
      await PostingsService.recordOperationalExpense(new Date(Date.UTC(year, month - 1, 10)), '5020', 25000000, 'BANK', 'Oylik ijara');
      await PostingsService.recordOperationalExpense(new Date(Date.UTC(year, month - 1, 12)), '5030', 6000000, 'BANK', 'Kommunal to\'lovlar');
      await PostingsService.recordOperationalExpense(new Date(Date.UTC(year, month - 1, 15)), '5040', 15000000, 'BANK', 'Marketing va reklama');

      // d) Kredit to'lovi (20-sana)
      await PostingsService.payLoanInstallment(new Date(Date.UTC(year, month - 1, 20)), 8000000, 3500000);

      // e) Inkassatsiya (25-sana) - Naqdni bankka o'tkazish
      await PostingsService.recordInkassatsiya(new Date(Date.UTC(year, month - 1, 25)), 80000000);

      // f) OY OXIRI: Darslar o'tildi (Daromad tan olish)
      await PostingsService.recognizeTuitionRevenue(
        new Date(Date.UTC(year, month - 1, lastDay)),
        270000000 // 450 o'quvchi x 600k
      );

      // g) OY OXIRI: Ish haqi hisoblash (Accrual)
      await PostingsService.accrueSalary(
        new Date(Date.UTC(year, month - 1, lastDay)),
        120000000
      );
    }
  }

  // Ikkinchi investor qo'shimcha kapital kiritishi (2025-06-15)
  await PostingsService.injectCapital(new Date('2025-06-15'), 200000000);

  console.log('✅ Seeding muvaffaqiyatli yakunlandi!');
  await mongoose.disconnect();
}

seed();