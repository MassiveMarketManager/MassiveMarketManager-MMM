import fs from 'fs/promises';
import path from 'path';
import SingleOnnxPredictor from './SingleOnnxPredictor.js';
import PositionManager from './PositionManager.js';

// ===== Config =====
const START_USD = 1_000;          // Initial USD balance
const FEE = 0.0005;               // 0.05% exchange fee
const SLIPPAGE = 0.0005;          // 0.05% slippage assumption
const MODEL_PATH = './artifacts/Random_Forest_2h.onnx';
const SCALER_PATH = './artifacts/scaler_params_2h.json';
const CSV_PATH = '../data-builder/datasets/eth_hour_dataset_rsi-ema-atr-obv-fng_arbitrum.csv';
const TIME_CANDIDATES = ['time','timestamp','ts','date','datetime'];
const N_LAST = 1400;             // Limit number of candles for backtest

// ===== CSV Parsing =====
function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(s => s.trim());
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));

  // Detect time column if exists
  const timeKey = TIME_CANDIDATES.find(k => k in idx) ?? null;
  const out = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < header.length) continue;
    const obj = {};
    for (const h of header) {
      obj[h] = parts[idx[h]];
    }
    if (timeKey) obj[timeKey] = parts[idx[timeKey]].trim();
    out.push(obj);
  }
  return { rows: out, timeKey };
}

// ===== Main Backtest =====
(async () => {
  // Load ONNX predictor and CSV data
  const predictor = await SingleOnnxPredictor.load({ modelPath: MODEL_PATH, scalerPath: SCALER_PATH });
  const csvText = await fs.readFile(CSV_PATH, 'utf8');
  let { rows, timeKey } = parseCsv(csvText);

  // Limit dataset length
  if (rows.length > N_LAST) {
    rows = rows.slice(-N_LAST);
  }

  // Extract close prices and synthetic time indices
  const closes = rows.map(r => +r['close']); 
  const times  = rows.map((r, i) => String(i));

  // Initialize balances and stats
  let usd = START_USD, btc = 0;
  let totalTrades = 0, winTrades = 0, loseTrades = 0;
  const buyMarkers = [], sellMarkers = [], equityCurve = [];
  let winProfits = [], loseLosses = [];

  // Create position manager with trading rules
  const manager = new PositionManager();
  manager.setLossLimit(0.10);            // 10% stop-loss
  manager.setIncomeLimit(0.02);          // 2% take-profit
  manager.setPotentialIncomeLimit(0.002) // 0.2% entry condition

  // Backtest loop
  for (let i = 1; i < rows.length - 1; i++) {
    const curPrice = closes[i];
    const pred = await predictor.predict(rows[i]);
    const { decision } = manager.decide(pred, curPrice);

    // BUY logic
    if (decision === 1 && usd > 0) {
      const tradeSize = usd;
      const buyPrice = curPrice * (1 + SLIPPAGE);
      const btcBought = (tradeSize * (1 - FEE)) / buyPrice;
      btc += btcBought;
      usd -= tradeSize;
      buyMarkers.push({ x: times[i], y: curPrice });

    // SELL logic
    } else if (decision === -1 && btc > 0) {
      const sellPrice = curPrice * (1 - SLIPPAGE);
      const sellValue = btc * sellPrice * (1 - FEE);
      const tradeReturnPct = ((sellPrice - manager.boughtPrice) / manager.boughtPrice) * 100;
      usd += sellValue;
      btc = 0;
      sellMarkers.push({ x: times[i], y: curPrice });
      totalTrades++;

      // Track wins/losses
      if (curPrice > manager.boughtPrice) {
        winTrades++;
        winProfits.push(tradeReturnPct);
      } else {
        loseTrades++;
        loseLosses.push(tradeReturnPct);
      }
    }

    // Track equity curve (USD + BTC*price)
    equityCurve.push({ time: times[i], total: usd + btc * curPrice });
  }

  // Final balance
  const lastPrice = closes.at(-1);
  const finalTotal = usd + btc * lastPrice;
  console.log(`💰 Final balance: $${finalTotal.toFixed(2)}`);

  // Buy & Hold benchmark
  const buyHoldBtc = START_USD / closes[0];
  const buyHoldFinal = (buyHoldBtc * lastPrice) + START_USD;
  console.log(`📊 Buy & Hold balance: $${buyHoldFinal.toFixed(2)}`);

  // Trade statistics
  const winrate = totalTrades > 0 ? (winTrades / totalTrades * 100).toFixed(2) : 0;
  console.log(`📊 Trades: ${totalTrades}, ✅ Wins: ${winTrades}, ❌ Losses: ${loseTrades}, 🏆 Winrate: ${winrate}%`);

  // Average profit/loss per trade type
  const avgWin = winProfits.length > 0 ? (winProfits.reduce((a,b) => a+b, 0) / winProfits.length) : 0;
  const avgLoss = loseLosses.length > 0 ? (loseLosses.reduce((a,b) => a+b, 0) / loseLosses.length) : 0;

  console.log(`📈 Average profit of winning trades: ${avgWin.toFixed(2)}%`);
  console.log(`📉 Average loss of losing trades: ${avgLoss.toFixed(2)}%`);
  // console.log(`⏱ Average duration of winning trades: ${avgWinDuration.toFixed(1)} hours`);

  // Save equity curve as CSV
  await fs.mkdir('artifacts', { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g,'-');
  const csvPath = path.join('artifacts', `rf_strategy_${stamp}.csv`);
  const lines = [['time','total','signal']].concat(
    equityCurve.map(r => [r.time, r.total, ''].join(','))
  );
  await fs.writeFile(csvPath, lines.join('\n'),'utf8');
  console.log(`✅ Saved CSV: ${csvPath}`);

  // Save interactive HTML plot with Plotly
  const html = buildPlotHtml({
    title: `Random Forest Strategy`,
    x: times,
    closes,
    buys: buyMarkers,
    sells: sellMarkers,
    equity: equityCurve.map(r => r.total)
  });
  const htmlPath = path.join('artifacts', `rf_strategy_${stamp}.html`);
  await fs.writeFile(htmlPath, html, 'utf8');
  console.log(`📈 Saved Plot: ${htmlPath}`);
})().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

// ===== Plotly HTML generator =====
function buildPlotHtml({ title, x, closes, buys, sells, equity }) {
  const data = [
    { x, y: closes, type:'scatter', mode:'lines', name:'Close' },
    { x, y: equity, type:'scatter', mode:'lines', name:'Equity', yaxis:'y2',
      line: { color: 'rgba(0, 0, 255, 0.4)', width: 2 } },
    { x: buys.map(p => p.x), y: buys.map(p => p.y), type:'scatter', mode:'markers', name:'BUY',
      marker:{symbol:'triangle-up', size:10, color:'green'} },
    { x: sells.map(p => p.x), y: sells.map(p => p.y), type:'scatter', mode:'markers', name:'SELL',
      marker:{symbol:'triangle-down', size:10, color:'red'} },
  ];

  const layout = {
    title,
    xaxis: { title:'Time' },
    yaxis: { title:'Price' },
    yaxis2: { title:'Equity', overlaying:'y', side:'right' },
    legend: { orientation:'h', y:-0.3 }
  };

  return `
<!doctype html><html><head><meta charset="utf-8"/>
<title>${escapeHtml(title)}</title>
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
</head><body>
<div id="plot" style="width:100%;height:100vh;"></div>
<script>
const data = ${JSON.stringify(data)};
const layout = ${JSON.stringify(layout)};
Plotly.newPlot('plot', data, layout, {responsive:true});
</script></body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"'`=\/]/g, c => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;',
    '/':'&#x2F;', '`':'&#x60;', '=':'&#x3D;'
  })[c]);
}
