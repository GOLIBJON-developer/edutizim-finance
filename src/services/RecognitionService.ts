import { PostingsService } from './PostingsService';

export class RecognitionService {
  /**
   * Oy oxirida daromadlarni va hisoblangan ish haqini avtomatik tan olish xizmati.
   */
  static async runMonthlyAccruals(year: number, month: number, totalTuitionRevenue: number, totalSalaryExpense: number) {
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // 1. Darslar o'tildi -> Deferred Revenue dan Tuition Revenue ga o'tkazish
    const revenueEntry = await PostingsService.recognizeTuitionRevenue(
      lastDayOfMonth,
      totalTuitionRevenue
    );

    // 2. Ish haqi hisoblandi -> Salary Expense va Salary Payable majburiyatiga o'tkazish
    const salaryEntry = await PostingsService.accrueSalary(
      lastDayOfMonth,
      totalSalaryExpense
    );

    return { revenueEntry, salaryEntry };
  }
}