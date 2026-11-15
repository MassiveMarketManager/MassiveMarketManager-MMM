/**
 * Build a map { timestamp -> FNG value } for quick lookup.
 * Assumes each element in fngArr has fields:
 *   - ts: Unix timestamp at 00:00 UTC (start of the day)
 *   - value: Fear & Greed index (0..100)
 *
 * @param {Array<{ts:number, value:number}>} fngArr
 * @returns {Map<number, number>} Map of daily FNG values
 */
export function buildDailyMap(fngArr) {
  const map = new Map();
  for (const d of fngArr) {
    map.set(d.ts, d.value); // each ts is already aligned to 00:00 UTC
  }
  return map;
}

/**
 * Attach Fear & Greed Index (FNG) values to dataset rows by timestamp.
 * 
 * For each row:
 *   - Finds the most recent FNG value (last known at or before row.ts).
 *   - If normalize=true, scales values from [0..100] to [0..1].
 *   - If no FNG data is available yet (ts before first entry), assigns null.
 *
 * @param {Array<{ts:number}>} rows - Dataset rows with timestamps
 * @param {Array<{ts:number, value:number}>} fngArr - Daily FNG values
 * @param {Object} [options]
 * @param {boolean} [options.normalize=false] - Normalize to [0..1]
 * @returns {Array<number|null>} Array of FNG values aligned with rows
 */
export function attachFearGreedToRows(rows, fngArr, { normalize = false } = {}) {
  if (!rows?.length || !fngArr?.length) return rows;

  const day = ts => ts - (ts % 86400); // start of day (UTC aligned)
  const map = buildDailyMap(fngArr);

  // To handle missing days in FNG API data:
  // We use a pointer (j) that tracks the last known FNG value <= current row.ts
  let j = 0; // pointer over fngArr
  const out = new Array(rows.length);

  for (let i = 0; i < rows.length; i++) {
    const ts = rows[i].ts;

    // Advance j while the next FNG timestamp is still <= current row timestamp
    while (j + 1 < fngArr.length && fngArr[j + 1].ts <= ts) j++;

    // Pick the last known value at or before ts
    let val = null;
    if (fngArr[j] && fngArr[j].ts <= ts) {
      val = fngArr[j].value; // last known value
    } else {
      val = null; // before first FNG entry
    }

    // Normalize if requested (0..1 range instead of 0..100)
    out[i] = normalize && val != null ? val / 100 : val;
  }

  // Return aligned series of same length as rows
  return out;
}
