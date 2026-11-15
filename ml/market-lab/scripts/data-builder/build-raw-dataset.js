import OHLCVProvider from './OHLC/ohlcv-provider.js';
import { saveCsv } from './features/datasetIO.js';
import dotenv from 'dotenv';
dotenv.config();

// Create OHLCV provider instance for querying The Graph subgraph
const provider = new OHLCVProvider({
  apiKey:    process.env.THEGRAPH_KEY,  // API key for The Graph
  subgraphId: 'CjNKWQWqaVc6m1WL3CYSC4npmvG5kWBLmzFwdqCMBDoN'
});

// Output CSV file path
const OUTPUT = './datasets/eth_raw_hour_dataset_arbitrum.csv';

// Time constants
const YEAR = 60 * 60 * 24 * 365; // seconds in a year
const now  = Math.floor(Date.now() / 1000); // current Unix time (seconds)

// Pool address (example: Uniswap pool on Arbitrum)
const POOL = '0xC6962004f452bE9203591991D15f6b388e09E8D0';

// Get the most recent available hourly timestamp for this pool
const headTs = await provider.getHeadHourTs(POOL);
// Define end timestamp: use the latest available or current time
const toTs = Math.min(now, headTs ?? now);

// Fetch OHLCV data for the pool in hourly intervals over the last 3 years
const {
  opens, highs, lows, closes, raw,
  volumesUSD, volumes0, volumes1, volumesBase
} = await provider.fetchRange({
  pool:   POOL,
  fromTs: now - 3 * YEAR, // 3 years ago
  toTs,                   // up to latest available timestamp
  tf:     'hour',          // hourly data
  invert: true             // invert prices (token1/token0)
});

// Helper: choose timestamp field from raw GraphQL response
const pickTs = r => +(r.periodStartUnix ?? r.hourStartUnix ?? r.date ?? r.timestamp);

// Ensure we don’t exceed the smallest array length (defensive check)
const n = Math.min(
  raw.length, opens.length, highs.length, lows.length, closes.length,
  volumesUSD?.length   ?? raw.length,
  volumes0?.length     ?? raw.length,
  volumes1?.length     ?? raw.length,
  volumesBase?.length  ?? raw.length
);

// Convert fetched arrays into row objects suitable for CSV
let rows = [];
for (let i = 0; i < n; i++) {
  const o = opens[i], h = highs[i], l = lows[i], c = closes[i];
  if (![o,h,l,c].every(Number.isFinite)) continue; // skip invalid rows
  rows.push({
    ts: pickTs(raw[i]),   // timestamp (Unix seconds)
    open:o, high:h, low:l, close:c,
    volumeUSD:  volumesUSD?.[i]  ?? null,
    volume0:    volumes0?.[i]    ?? null,
    volume1:    volumes1?.[i]    ?? null,
    volumeBase: volumesBase?.[i] ?? null,
  });
}

// Sort rows by timestamp (ascending) and remove duplicates
rows.sort((a,b) => a.ts - b.ts);
rows = rows.filter((r,i,a) => i===0 || r.ts !== a[i-1].ts);

// Save processed dataset into CSV file
saveCsv(OUTPUT, rows);
console.log('CSV saved:', OUTPUT);
