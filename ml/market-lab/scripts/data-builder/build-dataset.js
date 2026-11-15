
import IndicatorsEngine from './features/indicators/indicators-engine.js';
import { loadOhlcvCsv, saveCsvDataset } from './features/datasetIO.js';

// === File paths ===
// Input: raw OHLCV data (CSV)
// Output: processed dataset with indicators
const INPUT  = './datasets/eth_raw_hour_dataset_arbitrum.csv';        
const OUTPUT = '../data/datasets/eth_hour_dataset_rsi-ema-atr-obv-fng_arbitrum.csv'; 

// === Load raw OHLCV data ===
const rows = loadOhlcvCsv(INPUT);
if (!rows.length) {
  console.error('No data in', INPUT);
  process.exit(1);
}

// === Initialize indicator engine ===
const engine = new IndicatorsEngine({
  mode: "regression_abs",   // target label = absolute future close price
  warmupDays: 2,  // skip first N days to let indicators warm up
  horizonHours: 2,  // prediction horizon (lookahead) in hours
  selected: ['rsi','ema','atr', 'obv', 'fng']   // indicators to compute
});

// === Compute dataset with indicators ===
let dataset = await engine.compute({ rows });

// === Save dataset to CSV ===
saveCsvDataset(OUTPUT, dataset);
console.log('CSV (dataset): ', OUTPUT);
console.log('dataset cols:', Object.keys(dataset[0] || {}));