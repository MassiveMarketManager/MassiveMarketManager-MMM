import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';

/**
 * DatasetIO
 *
 * Utility class for saving and loading OHLCV datasets
 * (Open, High, Low, Close, Volume) in CSV format.
 */
export default class DatasetIO {

    /**
     * Save OHLCV data to CSV file in a standardized format.
     * Includes optional volume fields if they exist in the rows.
     *
     * @param {string} path - File path to save CSV
     * @param {Array<Object>} rows - Array of OHLCV objects with fields:
     *   { ts, open, high, low, close, volumeUSD?, volume0?, volume1?, volumeBase? }
     */
    saveCsv(path, rows) {
        // If no rows, just write the default header
        if (!Array.isArray(rows) || rows.length === 0) {
          writeFileSync(path, 'timestamp,datetime_utc,open,high,low,close\n', 'utf8');
          return;
        }

        // Determine which volume fields are present in the dataset
        const volumeFields = ['volumeUSD', 'volume0', 'volume1', 'volumeBase']
          .filter(k => rows.some(r => r[k] != null));

        // Build CSV header line dynamically
        const header = ['timestamp', 'datetime', 'open', 'high', 'low', 'close', ...volumeFields].join(',') + '\n';

        // Build CSV body: one line per row
        const body = rows.map(r => {
          // Convert Unix timestamp to human-readable UTC datetime
          const dtUtc = new Date(r.ts * 1000)
            .toISOString()
            .replace('T', ' ')
            .replace('Z', '')
            .replace(/\.\d+$/, '');

          // Base OHLC fields
          const base = [r.ts, dtUtc, r.open, r.high, r.low, r.close];

          // Collect volumes if present, otherwise empty string
          const vols = volumeFields.map(k => r[k] ?? '');

          return [...base, ...vols].join(',');
        }).join('\n');

        // Write header + body to file
        writeFileSync(path, header + body + '\n', 'utf8');
    }

    /**
     * Load OHLCV data from a CSV file.
     * Supports optional volume fields (if present in header).
     *
     * @param {string} path - Path to CSV file
     * @returns {Array<Object>} Array of rows sorted by timestamp
     */
    loadOhlcvCsv(path) {
        const text = readFileSync(path, 'utf8').trim();
        if (!text) return [];

        // Split file into header + data lines
        const lines = text.split(/\r?\n/);
        const header = lines.shift();
        const cols = header.split(',');

        // Helper to get column index by name
        const idx = (name) => cols.indexOf(name);

        // Column indices
        const iTs       = idx('timestamp');
        const iOpen     = idx('open');
        const iHigh     = idx('high');
        const iLow      = idx('low');
        const iClose    = idx('close');
        const iVolUSD   = idx('volumeUSD');
        const iVol0     = idx('volume0');
        const iVol1     = idx('volume1');
        const iVolBase  = idx('volumeBase');

        const out = [];

        // Parse each line into a row object
        for (const line of lines) {
          if (!line) continue;
          const parts = line.split(',');

          const ts    = Number(parts[iTs]);
          const open  = Number(parts[iOpen]);
          const high  = Number(parts[iHigh]);
          const low   = Number(parts[iLow]);
          const close = Number(parts[iClose]);

          // Skip invalid rows
          if (![ts, open, high, low, close].every(Number.isFinite)) continue;

          const row = {
            ts, open, high, low, close,
            volumeUSD:  iVolUSD  !== -1 ? this.num(parts[iVolUSD]) : null,
            volume0:    iVol0    !== -1 ? this.num(parts[iVol0])   : null,
            volume1:    iVol1    !== -1 ? this.num(parts[iVol1])   : null,
            volumeBase: iVolBase !== -1 ? this.num(parts[iVolBase]): null,
          };
          out.push(row);
        }

        // Ensure rows are sorted by timestamp and remove duplicates
        out.sort((a,b) => a.ts - b.ts);
        return out.filter((r,i,a) => i===0 || r.ts !== a[i-1].ts);
    }

    /**
     * Convert a string to a number or null if invalid/empty.
     *
     * @param {string} x - Input string
     * @returns {number|null}
     */
    num(x) {
        if (x === '' || x == null) return null;
        const v = Number(x);
        return Number.isFinite(v) ? v : null;
    }

    /**
     * Save a dataset with arbitrary fields to CSV.
     * Unlike saveCsv(), this does not assume OHLC format.
     *
     * @param {string} path - File path
     * @param {Array<Object>} rows - Array of objects with consistent keys
     */
    saveCsvDataset(path, rows) {
        // If dataset is empty, just create an empty file
        if (!Array.isArray(rows) || rows.length === 0) {
          writeFileSync(path, '', 'utf8');
          return;
        }

        // Extract headers dynamically from first row
        const headers = Object.keys(rows[0]);
        const headerLine = headers.join(',') + '\n';

        // Create CSV lines for each row
        const lines = rows.map(r =>
          headers.map(h => (r[h] == null ? '' : r[h])).join(',')
        ).join('\n');

        // Write to file
        writeFileSync(path, headerLine + lines + '\n', 'utf8');
    }
}
