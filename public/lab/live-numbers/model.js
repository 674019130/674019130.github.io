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
/** Deterministic replay: each range always derives from the same base prices.
 * @param {string} range @param {number} tick
 */
export function quoteSnapshot(range, tick = 0) {
  const scale = ({ live: .0003, hour: .006, day: .025, week: .09 })[range] ?? .0003;
  return assets.map((asset, i) => {
    const change = range === 'live' ? Math.sin(tick * .8 + i * 1.7) * .035 : Math.sin(i * 1.9 + 1) * scale;
    return { ...asset, price: asset.price * (1 + change), change: change * 100 };
  });
}
/** @param {number} price */
export function priceText(price) {
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: price < 1 ? 4 : 2, maximumFractionDigits: price < 1 ? 4 : 2 });
}
