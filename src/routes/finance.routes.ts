import { Router, Request, Response } from 'express';
import { FinanceEngine } from '../services/FinanceEngine';

const router = Router();

// GET /api/pnl?year=2026&month=1
router.get('/pnl', async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const data = await FinanceEngine.getProfitAndLoss(year, month);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cashflow?year=2026&month=1
router.get('/cashflow', async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const data = await FinanceEngine.getCashFlow(year, month);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/balance-sheet?year=2026&month=1
router.get('/balance-sheet', async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const asOfDate = new Date(Date.UTC(year, month, 0));
    const data = await FinanceEngine.getBalanceSheet(asOfDate);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;