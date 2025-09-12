import {
  SMA, EMA, RSI, MACD, BollingerBands, Stochastic, ATR, ADX, OBV, CCI
} from 'technicalindicators';
import { fetchFearGreedAll, sliceFngByRange } from '../fng/fng-loader.js';
import { attachFearGreedToRows } from '../fng/fng-align.js';

/**
 * Pad an array to length n with null values in the front.
 * Ensures all indicator arrays are aligned with OHLCV rows.
 */
const padToLength = (source, n) => {
  const out = Array(n).fill(null);
  const start = n - source.length;
  for (let i = 0; i < source.length; i++) out[start + i] = source[i];
  return out;
};

/**
 * IndicatorsEngine
 *
 * Compute a wide range of technical indicators on top of OHLCV data.
 * Supports moving averages, RSI, MACD, Bollinger Bands, ATR, ADX, OBV, CCI,
 * as well as Fear & Greed Index (FNG).
 *
 * Can also generate target labels for ML models in classification
 * or regression modes.
 */
export default class IndicatorsEngine {

  /**
   * Create a new IndicatorsEngine instance.
   *
   * @param {Object} [cfg={}] - Configuration object.
   * @param {number} [cfg.horizonHours=4] - Prediction horizon in hours for label generation.
   * @param {number} [cfg.warmupDays=7] - Warmup period (days) to skip before producing rows.
   * @param {Array<string>} [cfg.selected] - List of indicators to compute 
   *        (e.g. ['sma','ema','rsi','macd','atr','adx','obv','cci','fng']).
   * @param {boolean} [cfg.includeTime=false] - If true, include `ts` and `datetime_utc` in output rows.
   * @param {"classification"|"regression_pct"|"regression_abs"|"none"} [cfg.mode="regression_abs"]
   *        - Label generation mode.
   * @param {Array<string>} [cfg.includeOriginal=[]] - Fields from input rows to keep in the output.
   * @param {Object} [cfg.periods] - Custom periods for indicators (overrides defaults).
   * @param {number} [cfg.periods.sma=14] - Period for SMA.
   * @param {number} [cfg.periods.ema=14] - Period for EMA.
   * @param {number} [cfg.periods.rsi=14] - Period for RSI.
   * @param {number} [cfg.periods.atr=14] - Period for ATR.
   * @param {number} [cfg.periods.adx=14] - Period for ADX.
   * @param {number} [cfg.periods.cci=20] - Period for CCI.
   * @param {Object} [cfg.periods.macd] - MACD settings { fast, slow, signal }.
   * @param {Object} [cfg.periods.bb] - Bollinger Bands settings { period, std }.
   * @param {Object} [cfg.periods.stoch] - Stochastic settings { k, d }.
   */
  constructor(cfg = {}) {
    // Default indicator periods
    const defPeriods = {
      sma: 14,
      ema: 14,
      rsi: 14,
      macd: { fast: 12, slow: 26, signal: 9 },
      bb:   { period: 20, std: 2 },
      stoch:{ k: 14, d: 3 },
      atr:  14,
      adx:  14,
      cci:  20,
    };
  
    // Default configuration
    this.cfg = {
      horizonHours: 4,         // lookahead horizon for labels
      warmupDays: 7,           // warmup period before producing rows
      selected: [              // indicators to compute
        'sma','ema','rsi','macd',
        'bbPercentB','stoch','atr','adx','obv','cci','fng'
      ],
      includeTime: false,      // whether to include timestamp & datetime
      mode: "regression_abs",  // label type: classification, regression_pct, regression_abs, none
      includeOriginal: [],     // fields from original rows to keep
      periods: defPeriods,
      ...cfg
    };
  
    // Merge user periods with defaults
    const u = cfg.periods || {};
    this.cfg.periods = {
      sma:   u.sma   ?? defPeriods.sma,
      ema:   u.ema   ?? defPeriods.ema,
      rsi:   u.rsi   ?? defPeriods.rsi,
      atr:   u.atr   ?? defPeriods.atr,
      adx:   u.adx   ?? defPeriods.adx,
      cci:   u.cci   ?? defPeriods.cci,
      macd:  { ...defPeriods.macd,  ...(u.macd  || {}) },
      bb:    { ...defPeriods.bb,    ...(u.bb    || {}) },
      stoch: { ...defPeriods.stoch, ...(u.stoch || {}) },
    };
  }

  /**
   * Compute indicators for a given OHLCV dataset.
   *
   * @param {Object} params
   * @param {Array<{ts:number, open:number, high:number, low:number, close:number, volumeBase?:number}>} params.rows
   * @returns {Promise<Array<Object>>} dataset rows with indicators and optional label
   */
  async compute({ rows }) {
    const n = rows.length;
    const close = rows.map(r => +r.close);
    const high = rows.map(r => +r.high);
    const low = rows.map(r => +r.low);
    const vol = rows.map(r => +r.volumeBase || 0);

    const series = {};

    // === Standard indicators ===
    if (this.cfg.selected.includes('sma')) {
      series.sma = padToLength(SMA.calculate({ period: this.cfg.periods.sma, values: close }), n);
    }
    if (this.cfg.selected.includes('ema')) {
      series.ema = padToLength(EMA.calculate({ period: this.cfg.periods.ema, values: close }), n);
    }
    if (this.cfg.selected.includes('rsi')) {
      series.rsi = padToLength(RSI.calculate({ period: this.cfg.periods.rsi, values: close }), n);
    }
    if (this.cfg.selected.includes('macd')) {
      const m = MACD.calculate({
        values: close,
        fastPeriod: this.cfg.periods.macd.fast,
        slowPeriod: this.cfg.periods.macd.slow,
        signalPeriod: this.cfg.periods.macd.signal,
        SimpleMAOscillator: false,
        SimpleMASignal: false
      });
      series.macd = padToLength(m.map(x => x.MACD),      n);
      series.macdSignal = padToLength(m.map(x => x.signal),    n);
      series.macdHist = padToLength(m.map(x => x.histogram), n);
    }

    // Bollinger Bands (optional width/percentB)
    const wantBB = this.cfg.selected.includes('bb') || this.cfg.selected.includes('bbWidth') || this.cfg.selected.includes('bbPercentB');
    if (wantBB) {
      const bb = BollingerBands.calculate({
        period: this.cfg.periods.bb.period, values: close, stdDev: this.cfg.periods.bb.std
      });
      const upper = padToLength(bb.map(x => x.upper),  n);
      const middle = padToLength(bb.map(x => x.middle), n);
      const lower = padToLength(bb.map(x => x.lower),  n);

      if (this.cfg.selected.includes('bb')) {
        series.bbUpper = upper; series.bbMiddle = middle; series.bbLower = lower;
      }
      if (this.cfg.selected.includes('bbWidth')) {
        series.bbWidth = upper.map((u, i) => (u==null || lower[i]==null) ? null : (u - lower[i]));
      }
      if (this.cfg.selected.includes('bbPercentB')) {
        series.bbPercentB = close.map((c, i) => {
          const u = upper[i], l = lower[i];
          if (u==null || l==null) return null;
          return (c - l) / (u - l);
        });
      }
    }

    // Stochastic oscillator
    if (this.cfg.selected.includes('stoch')) {
      const s = Stochastic.calculate({
        high, low, close,
        period: this.cfg.periods.stoch.k,
        signalPeriod: this.cfg.periods.stoch.d
      });
      series.stochK = padToLength(s.map(x => x.k), n);
      series.stochD = padToLength(s.map(x => x.d), n);
    }

    if (this.cfg.selected.includes('atr')) {
      series.atr = padToLength(ATR.calculate({ high, low, close, period: this.cfg.periods.atr }), n);
    }

    if (this.cfg.selected.includes('adx')) {
      const a = ADX.calculate({ high, low, close, period: this.cfg.periods.adx });
      series.adx    = padToLength(a.map(x => x.adx), n);
      series.adxPDI = padToLength(a.map(x => x.pdi), n);
      series.adxMDI = padToLength(a.map(x => x.mdi), n);
    }

    if (this.cfg.selected.includes('obv')) {
      series.obv = padToLength(OBV.calculate({ close, volume: vol }), n);
    }

    if (this.cfg.selected.includes('cci')) {
      series.cci = padToLength(CCI.calculate({ high, low, close, period: this.cfg.periods.cci }), n);
    }

    // === Fear & Greed Index ===
    if (this.cfg.selected.includes('fng')) {
      const fromTs = rows[0].ts;
      const toTs = rows[n - 1].ts;

      // Fetch and slice FNG series
      const fngAll = await fetchFearGreedAll();          
      const fng = sliceFngByRange(fngAll, fromTs, toTs);

      // Align FNG values to row timestamps
      const fngSeries = attachFearGreedToRows(rows, fng, { normalize: false });
      series.fng = fngSeries; 
    }

    // === Label generation for ML ===
    const H = this.cfg.horizonHours;
    const requireLabel = this.cfg.mode !== "none";
    let label;

    if (requireLabel && this.cfg.mode === "classification") {
      label = close.map((c, i) =>
        (i >= H && Number.isFinite(close[i - H])) ? (c > close[i - H] ? 1 : 0) : null
      );
    } else if (requireLabel && this.cfg.mode === "regression_pct") {
      label = close.map((c, i) => {
        const future = close[i + H];
        return (Number.isFinite(c) && Number.isFinite(future))
          ? ((future - c) / c) * 100
          : null;
      });
    } else if (requireLabel && this.cfg.mode === "regression_abs") {
      label = close.map((c, i) => {
        const future = close[i + H];
        return Number.isFinite(future) ? future : null;
      });
    }

    // === Build final dataset rows ===
    const warmupCutTs = rows[0].ts + this.cfg.warmupDays * 24 * 3600;
    const out = [];
    for (let i = 0; i < n; i++) {
      const ts = rows[i].ts;
      if (ts < warmupCutTs) continue;        // skip warmup period
      if (requireLabel && label[i] == null) continue; // skip missing labels

      const row = {};
      if (this.cfg.includeTime) {
        row.ts = ts;
        row.datetime_utc = new Date(ts * 1000)
          .toISOString().replace('T',' ').replace('Z','').replace(/\.\d+$/, '');
      }

      // Copy selected original fields (if any)
      for (const key of this.cfg.includeOriginal) {
        if (rows[i][key] !== undefined) row[key] = rows[i][key];
      }

      // Copy all computed series values
      for (const key of Object.keys(series)) {
        row[key] = series[key][i];
      }

      // Attach label if required
      if (requireLabel) row.label = label[i];
      out.push(row);
    }

    return out;
  }
}
