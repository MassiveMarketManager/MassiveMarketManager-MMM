/**
 * Fetch full history of Fear & Greed Index (FNG) from alternative.me API.
 *
 * @returns {Promise<Array<{ts:number, value:number}>>}
 *   - ts: Unix timestamp (seconds)
 *   - value: FNG value (0..100)
 */
export async function fetchFearGreedAll() {
  const url = 'https://api.alternative.me/fng/?limit=0&format=json'; // request all available records
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FNG fetch failed: ${res.status} ${res.statusText}`);
  
  const json = await res.json();
  // Example response: json.data = [
  //   { value:"46", value_classification:"Neutral", timestamp:"1694304000", time_until_update:"..." }, ...
  // ]

  const items = (json?.data ?? [])
    .map(d => ({ ts: Number(d.timestamp), value: Number(d.value) }))
    .filter(d => Number.isFinite(d.ts) && Number.isFinite(d.value)) // drop invalid entries
    .sort((a, b) => a.ts - b.ts); // ascending by timestamp

  return items;
}

/**
 * Fetch the latest Fear & Greed Index (FNG) value.
 *
 * @returns {Promise<number|null>} - Latest FNG value (0..100), or null if unavailable
 */
export async function fetchLatestFng() {
  const url = 'https://api.alternative.me/fng/?limit=1&format=json';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FNG fetch failed: ${res.status} ${res.statusText}`);
  
  const json = await res.json();
  const d = json?.data?.[0];
  
  // Return latest numeric value, or null if API response is malformed
  return d ? Number(d.value) : null;
}

/**
 * Slice an array of FNG entries by time range, with 1-day padding.
 *
 * @param {Array<{ts:number, value:number}>} fngArr - Full FNG history
 * @param {number} fromTs - Start timestamp (Unix seconds)
 * @param {number} toTs - End timestamp (Unix seconds)
 * @returns {Array<{ts:number, value:number}>} Subset of FNG values within range
 */
export function sliceFngByRange(fngArr, fromTs, toTs) {
  // Include one extra day before and after to cover edge alignment
  return fngArr.filter(d => d.ts >= fromTs - 86400 && d.ts <= toTs + 86400);
}
