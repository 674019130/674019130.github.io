// @ts-check
export const assets = [
  { name: 'Paper Moon', symbol: 'MOON', price: 65873.70 },
  { name: 'Quiet Orbit', symbol: 'ORBT', price: 3474.32 },
  { name: 'Pixel Bloom', symbol: 'PXBL', price: 185.75 },
  { name: 'Tiny Comet', symbol: 'COMT', price: .6101 },
  { name: 'Moss Garden', symbol: 'MOSS', price: .4586 },
  { name: 'Sunday Club', symbol: 'SNDY', price: .1712 },
  { name: 'Silver Finch', symbol: 'FNCH', price: 14.88 },
];
/** Each asset trades on its own cadence (every 2–4 ticks, offset per row), so a tick moves
 * one or two rows rather than the whole table, and each move stays within the last digits.
 * @param {number} i @param {number} tick */
export function tradeIndex(i, tick) {
  const every = 2 + (i * 5) % 3;
  return Math.floor((tick + i * 3) / every);
}
/** Deterministic replay: each range always derives from the same base prices.
 * @param {string} range @param {number} tick
 */
export function quoteSnapshot(range, tick = 0) {
  const scale = ({ live: .012, hour: .006, day: .025, week: .09 })[range] ?? .012;
  return assets.map((asset, i) => {
    const open = Math.sin(i * 1.9 + 1) * scale;          // the day's move so far
    const k = tradeIndex(i, tick);
    const wobble = range === 'live' ? (Math.sin(k * 1.37 + i) * .0009 + Math.sin(k * .53 + i * 2.1) * .0006) : 0;
    const change = open + wobble;
    return { ...asset, price: asset.price * (1 + change), change: change * 100 };
  });
}
/** @param {number} price */
export function priceText(price) {
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: price < 1 ? 4 : 2, maximumFractionDigits: price < 1 ? 4 : 2 });
}
