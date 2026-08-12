import React, { useState, useEffect } from 'react';

export default function App() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [pnl, setPnl] = useState<any>(null);
  const [cashFlow, setCashFlow] = useState<any>(null);
  const [balanceSheet, setBalanceSheet] = useState<any>(null);

  const fetchData = async () => {
    const resPnl = await fetch(`http://localhost:5000/api/pnl?year=${year}&month=${month}`);
    const resCf = await fetch(`http://localhost:5000/api/cashflow?year=${year}&month=${month}`);
    const resBs = await fetch(`http://localhost:5000/api/balance-sheet?year=${year}&month=${month}`);

    setPnl(await resPnl.json());
    setCashFlow(await resCf.json());
    setBalanceSheet(await resBs.json());
  };

  useEffect(() => {
    fetchData();
  }, [year, month]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>EduTizim.uz - Moliya Moduli</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>Yil: </label>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <label style={{ marginLeft: '10px' }}>Oy: </label>
        <input type="number" value={month} onChange={(e) => setMonth(Number(e.target.value))} min={1} max={12} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* P&L Table */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>Foyda va Zarar (P&L)</h3>
          {pnl && (
            <table border={1} cellPadding={5} style={{ width: '100%' }}>
              <tbody>
                <tr><td><b>Daromad (Tuition)</b></td><td>{pnl.revenues?.tuition?.toLocaleString()}</td></tr>
                <tr><td>Ish haqi xarajati</td><td>{pnl.expenses?.salary?.toLocaleString()}</td></tr>
                <tr><td>Ijara xarajati</td><td>{pnl.expenses?.rent?.toLocaleString()}</td></tr>
                <tr><td>Kommunal xarajat</td><td>{pnl.expenses?.utilities?.toLocaleString()}</td></tr>
                <tr><td>Marketing xarajati</td><td>{pnl.expenses?.marketing?.toLocaleString()}</td></tr>
                <tr><td>Kredit foizi xarajati</td><td>{pnl.expenses?.interest?.toLocaleString()}</td></tr>
                <tr><td><b>Jami Xarajat</b></td><td><b>{pnl.expenses?.total?.toLocaleString()}</b></td></tr>
                <tr style={{ background: '#e6ffe6' }}><td><b>SOF FOYDA</b></td><td><b>{pnl.netProfit?.toLocaleString()}</b></td></tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Cash Flow Table */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>Pul Oqimi (Cash Flow)</h3>
          {cashFlow && (
            <table border={1} cellPadding={5} style={{ width: '100%' }}>
              <tbody>
                <tr><td>Boshlang'ich Pul</td><td>{cashFlow.beginningCash?.toLocaleString()}</td></tr>
                <tr><td>Operatsion Oqim</td><td>{cashFlow.operatingCashFlow?.toLocaleString()}</td></tr>
                <tr><td>Investitsion Oqim</td><td>{cashFlow.investingCashFlow?.toLocaleString()}</td></tr>
                <tr><td>Moliyaviy Oqim</td><td>{cashFlow.financingCashFlow?.toLocaleString()}</td></tr>
                <tr><td><b>Sof O'zgarish</b></td><td><b>{cashFlow.netCashChange?.toLocaleString()}</b></td></tr>
                <tr style={{ background: '#e6f2ff' }}><td><b>Yakuniy Pul</b></td><td><b>{cashFlow.endingCash?.toLocaleString()}</b></td></tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Balance Sheet Table */}
        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
          <h3>Balans (Balance Sheet)</h3>
          {balanceSheet && (
            <table border={1} cellPadding={5} style={{ width: '100%' }}>
              <tbody>
                <tr><th colSpan={2}>Aktivlar</th></tr>
                <tr><td>Pul va Bank</td><td>{balanceSheet.assets?.cashAndBank?.toLocaleString()}</td></tr>
                <tr><td>Jihozlar</td><td>{balanceSheet.assets?.equipment?.toLocaleString()}</td></tr>
                <tr><td><b>Jami Aktivlar</b></td><td><b>{balanceSheet.assets?.total?.toLocaleString()}</b></td></tr>
                <tr><th colSpan={2}>Majburiyatlar</th></tr>
                <tr><td>Oldindan to'langan darslar</td><td>{balanceSheet.liabilities?.deferredRevenue?.toLocaleString()}</td></tr>
                <tr><td>To'lanmagan ish haqi</td><td>{balanceSheet.liabilities?.unpaidSalary?.toLocaleString()}</td></tr>
                <tr><td>Kredit qarzi</td><td>{balanceSheet.liabilities?.bankLoans?.toLocaleString()}</td></tr>
                <tr><th colSpan={2}>Kapital</th></tr>
                <tr><td>Investor Kapitali</td><td>{balanceSheet.equity?.investorCapital?.toLocaleString()}</td></tr>
                <tr><td>Taqsimlanmagan Foyda</td><td>{balanceSheet.equity?.retainedEarnings?.toLocaleString()}</td></tr>
                <tr style={{ background: '#fff0f0' }}><td><b>Jami Majburiyat + Kapital</b></td><td><b>{balanceSheet.totalLiabilitiesAndEquity?.toLocaleString()}</b></td></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}