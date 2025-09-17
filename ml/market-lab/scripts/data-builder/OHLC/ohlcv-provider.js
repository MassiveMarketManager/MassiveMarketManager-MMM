import { GraphQLClient, gql } from 'graphql-request';

/**
 * OHLCVProvider
 *
 * Utility class for fetching OHLCV (Open, High, Low, Close, Volume) data
 * from The Graph subgraphs (e.g., Uniswap/Sushiswap pools).
 *
 * Supports both hourly and daily timeframes with pagination.
 * Can also invert price data (useful for token1/token0 perspective).
 */
export default class OHLCVProvider {
  constructor({ apiKey, subgraphId }) {
    // Initialize a GraphQL client with The Graph endpoint for a given subgraph
    this.client = new GraphQLClient(
      `https://gateway.thegraph.com/api/${apiKey}/subgraphs/id/${subgraphId}`
    );
  }

  /**
   * Fetch the latest available hourly timestamp for a given pool.
   *
   * @param {string} pool - Pool address (Uniswap/Sushi/etc.)
   * @returns {Promise<number|null>} - The most recent hour timestamp (Unix), or null if no data exists.
   */
  async getHeadHourTs(pool) {
    // Define a GraphQL query to get the most recent poolHourDatas record
    const q = gql`
      query LastHour($pool:String!) {
        poolHourDatas(
          first: 1                         // only the latest record
          orderBy: periodStartUnix         // order by the hour start timestamp
          orderDirection: desc             // descending (latest first)
          where: { pool: $pool }           // filter by pool address
        ) { 
          periodStartUnix                  // only return the timestamp
        }
      }
    `;
  
    // Execute the query against The Graph, forcing pool address to lowercase
    const { poolHourDatas } = await this.client.request(q, { pool: pool.toLowerCase() });
  
    // Return the most recent timestamp, or null if there are no records
    return poolHourDatas.length ? Number(poolHourDatas[0].periodStartUnix) : null;
  }

  /**
   * Fetch OHLCV (Open, High, Low, Close, Volume) data for a given pool
   * from The Graph subgraph using pagination.
   *
   * @param {string} pool - Pool address on DEX
   * @param {number} fromTs - Start timestamp (Unix)
   * @param {number} [toTs] - End timestamp (optional, Unix)
   * @param {'hour'|'day'} [tf='hour'] - Timeframe: hourly or daily
   * @param {number} [step=1000] - Page size for GraphQL query
   * @param {boolean} [invert=false] - Whether to invert prices (useful for token1/token0 pair inversion)
   */
  async fetchRange({ pool, fromTs, toTs = undefined, tf = 'hour', step = 1000, invert = false }) {
    // Metadata for timeframe: which entity to query and which timestamp field to use
    const meta = {
      hour: { entity: 'poolHourDatas', time: 'periodStartUnix', increment: 3600 },
      day:  { entity: 'poolDayDatas',  time: 'date',            increment: 86400 }
    }[tf];
    if (!meta) throw new Error("tf must be 'hour' or 'day'");

    // Lowercase pool address (Graph requires lowercase addresses)
    const poolLc = pool.toLowerCase();

    // Arrays to store OHLC and volume data
    const opens = [], highs = [], lows = [], closes = [];
    const volumesUSD = [], volumes0 = [], volumes1 = [], volumesBase = [];

    let cursor = fromTs; // current timestamp cursor for pagination

    // Define GraphQL query template
    const query = gql`
      query ohlc($pool:String!, $cursor:Int!, $first:Int!) {
        ${meta.entity}(
          first: $first
          orderBy: ${meta.time}
          orderDirection: asc
          where: { pool: $pool, ${meta.time}_gte: $cursor }
        ) {
          id
          ${meta.time}
          open
          high
          low
          close
          volumeUSD
          volumeToken0
          volumeToken1
        }
      }
    `;

    let safety = 0; // safety counter to avoid infinite loops
    while (true) {
      // Stop if we already passed the end timestamp
      if (toTs != null && cursor > toTs) break;
      if (++safety > 20000) throw new Error('Pagination safety stop');

      // Request one page of OHLC data
      const resp = await this.client.request(query, {
        pool: poolLc,
        cursor,
        first: step
      });

      const page = resp[meta.entity];
      if (!page.length) break; // no more data

      // Extract OHLC data as numbers
      let o = page.map(r => +r.open);
      let h = page.map(r => +r.high);
      let l = page.map(r => +r.low);
      let c = page.map(r => +r.close);

      // Extract volumes
      const vUSD = page.map(r => +r.volumeUSD    || 0);
      const v0   = page.map(r => +r.volumeToken0 || 0);
      const v1   = page.map(r => +r.volumeToken1 || 0);

      // If inverted pair is needed (e.g. token1/token0 instead of token0/token1)
      if (invert) {
        const inv = x => 1 / x;
        o = o.map(inv);
        const h0 = h.map(inv);
        const l0 = l.map(inv);
        h = l0;  // swap high/low after inversion
        l = h0;
        c = c.map(inv);
      }

      // Append data to arrays
      opens.push(...o); 
      highs.push(...h); 
      lows.push(...l); 
      closes.push(...c);
      volumesUSD.push(...vUSD); 
      volumes0.push(...v0); 
      volumes1.push(...v1);
      volumesBase.push(...(invert ? v1 : v0)); // choose volume depending on inverted mode

      // Move cursor to the next time period
      const lastTs = Number(page.at(-1)[meta.time]);
      cursor = lastTs + meta.increment;

      // Stop if we passed the end timestamp
      if (toTs != null && cursor > toTs) break;
    }

    // Return structured OHLCV data
    return {
      opens, highs, lows, closes,
      volumesUSD, volumes0, volumes1, volumesBase
    };
  }
}
