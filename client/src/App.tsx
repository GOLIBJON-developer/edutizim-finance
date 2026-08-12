import React, { useState, useEffect } from 'react';

export default function App() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [pnl, setPnl] = useState<any>(null);
  const [cashFlow, setCashFlow] = useState<any>(null);
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPnl, resCf, resBs] = await Promise.all([
        fetch(`http://localhost:5000/api/pnl?year=${year}&month=${month}`),
        fetch(`http://localhost:5000/api/cashflow?year=${year}&month=${month}`),
        fetch(`http://localhost:5000/api/balance-sheet?year=${year}&month=${month}`)
      ]);

      setPnl(await resPnl.json());
      setCashFlow(await resCf.json());
      setBalanceSheet(await resBs.json());
    } catch (err) {
      console.error("API ulanishida xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [year, month]);

  const fmt = (val: number) => val ? val.toLocaleString() + " so'm" : "0 so'm";

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>🎓 EduTizim.uz — Moliya va Buxgalteriya Paneli</h1>
          <p style={{ margin: '5px 0 0', color: '#64748b' }}>Ikki yoqlama yozuv (Double-Entry) asosidagi avtomatik hisobotlar</p>
        </div>

        {/* Date Selector */}
        <div style={{ backgroundColor: '#fff', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: '#334155' }}>Yil:</label>
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))} 
            style={{ width: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
          />
          <label style={{ fontWeight: 600, color: '#334155' }}>Oy:</label>
          <input 
            type="number" 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))} 
            min={1} max={12} 
            style={{ width: '60px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
          />
        </div>
      </div>

      {loading && <p style={{ color: '#0284c7', fontWeight: 600 }}>Ma'lumotlar yuklanmoqda...</p>}

      {/* Top Metric Cards */}
      {pnl && cashFlow && balanceSheet && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
          <div style={cardStyle('#ecfdf5', '#047857')}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: 700 }}>Sof Foyda (P&L)</span>
            <h2 style={{ margin: '8px 0 0', fontSize: '20px' }}>{fmt(pnl.netProfit)}</h2>
          </div>
          <div style={cardStyle('#eff6ff', '#1d4ed8')}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: 700 }}>Bank va Kassadagi Pul</span>
            <h2 style={{ margin: '8px 0 0', fontSize: '20px' }}>{fmt(cashFlow.endingCash)}</h2>
          </div>
          <div style={cardStyle('#f3e8ff', '#6b21a8')}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: 700 }}>Jami Aktivlar</span>
            <h2 style={{ margin: '8px 0 0', fontSize: '20px' }}>{fmt(balanceSheet.assets?.total)}</h2>
          </div>
          <div style={cardStyle('#fff7ed', '#c2410c')}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', fontWeight: 700 }}>Kelajak Dars Majburiyati</span>
            <h2 style={{ margin: '8px 0 0', fontSize: '20px' }}>{fmt(balanceSheet.liabilities?.deferredRevenue)}</h2>
          </div>
        </div>
      )}

      {/* Main Reports Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        
        {/* P&L */}
        <div style={boxStyle}>
          <h3 style={boxTitleStyle('#10b981')}>📊 Foyda va Zarar (P&L)</h3>
          {pnl && (
            <table style={tableStyle}>
              <tbody>
                <tr><td>Daromad (O'tilgan darslar)</td><td style={{ fontWeight: 600 }}>{fmt(pnl.revenues?.tuition)}</td></tr>
                <tr><td>Ish haqi xarajati</td><td>{fmt(pnl.expenses?.salary)}</td></tr>
                <tr><td>Ijara xarajati</td><td>{fmt(pnl.expenses?.rent)}</td></tr>
                <tr><td>Kommunal xarajat</td><td>{fmt(pnl.expenses?.utilities)}</td></tr>
                <tr><td>Marketing xarajati</td><td>{fmt(pnl.expenses?.marketing)}</td></tr>
                <tr><td>Kredit foizi xarajati</td><td>{fmt(pnl.expenses?.interest)}</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td><b>Jami Xarajatlar</b></td><td><b>{fmt(pnl.expenses?.total)}</b></td></tr>
                <tr style={{ backgroundColor: '#f0fdf4', color: '#166534' }}><td><b>SOF FOYDA</b></td><td><b>{fmt(pnl.netProfit)}</b></td></tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Cash Flow */}
        <div style={boxStyle}>
          <h3 style={boxTitleStyle('#3b82f6')}>💵 Pul Oqimi (Cash Flow)</h3>
          {cashFlow && (
            <table style={tableStyle}>
              <tbody>
                <tr><td>Boshlang'ich Naqd Pul</td><td>{fmt(cashFlow.beginningCash)}</td></tr>
                <tr><td>Operatsion Oqim (Kirim-Chiqim)</td><td>{fmt(cashFlow.operatingCashFlow)}</td></tr>
                <tr><td>Investitsion Oqim</td><td>{fmt(cashFlow.investingCashFlow)}</td></tr>
                <tr><td>Moliyaviy Oqim (Kredit/Dividend)</td><td>{fmt(cashFlow.financingCashFlow)}</td></tr>
                <tr style={{ borderTop: '2px solid #e2e8f0' }}><td><b>Sof Pul O'zgarishi</b></td><td><b>{fmt(cashFlow.netCashChange)}</b></td></tr>
                <tr style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}><td><b>Yakuniy Pul (Bank+Kassa)</b></td><td><b>{fmt(cashFlow.endingCash)}</b></td></tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Balance Sheet */}
        <div style={boxStyle}>
          <h3 style={boxTitleStyle('#8b5cf6')}>⚖️ Balans Hisoboti (Balance Sheet)</h3>
          {balanceSheet && (
            <table style={tableStyle}>
              <tbody>
                <tr style={{ backgroundColor: '#f8fafc' }}><th colSpan={2} style={{ textAlign: 'left', color: '#64748b' }}>AKTIVLAR</th></tr>
                <tr><td>Pul va Bank accounts</td><td>{fmt(balanceSheet.assets?.cashAndBank)}</td></tr>
                <tr><td>Jihozlar va Asbob-uskunalar</td><td>{fmt(balanceSheet.assets?.equipment)}</td></tr>
                <tr style={{ fontWeight: 700, color: '#0f172a' }}><td>Jami Aktivlar</td><td>{fmt(balanceSheet.assets?.total)}</td></tr>
                
                <tr style={{ backgroundColor: '#f8fafc' }}><th colSpan={2} style={{ textAlign: 'left', color: '#64748b' }}>MAJBURIZATLAR</th></tr>
                <tr><td>Oldindan to'langan darslar</td><td>{fmt(balanceSheet.liabilities?.deferredRevenue)}</td></tr>
                <tr><td>To'lanmagan ish haqi</td><td>{fmt(balanceSheet.liabilities?.unpaidSalary)}</td></tr>
                <tr><td>Kredit qarzlari</td><td>{fmt(balanceSheet.liabilities?.bankLoans)}</td></tr>

                <tr style={{ backgroundColor: '#f8fafc' }}><th colSpan={2} style={{ textAlign: 'left', color: '#64748b' }}>KAPITAL</th></tr>
                <tr><td>Investor Kapitali</td><td>{fmt(balanceSheet.equity?.investorCapital)}</td></tr>
                <tr><td>Taqsimlanmagan Foyda</td><td>{fmt(balanceSheet.equity?.retainedEarnings)}</td></tr>
                <tr style={{ backgroundColor: '#fef2f2', color: '#991b1b', borderTop: '2px solid #fecaca' }}>
                  <td><b>Jami Majburiyat + Kapital</b></td>
                  <td><b>{fmt(balanceSheet.totalLiabilitiesAndEquity)}</b></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

// Inline Styles
const boxStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  border: '1px solid #e2e8f0'
};

const boxTitleStyle = (color: string): React.CSSProperties => ({
  margin: '0 0 15px 0',
  fontSize: '16px',
  color: '#1e293b',
  borderBottom: `3px solid ${color}`,
  paddingBottom: '8px'
});

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px'
};

const cardStyle = (bgColor: string, textColor: string): React.CSSProperties => ({
  backgroundColor: bgColor,
  color: textColor,
  padding: '16px',
  borderRadius: '10px',
  border: `1px solid ${textColor}22`
});