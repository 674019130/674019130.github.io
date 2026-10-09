// Longest common subsequence keeps repeated words paired once, in reading order.
export function matchTokens(before, after) {
  const table = Array.from({length: before.length + 1}, () => new Uint16Array(after.length + 1));
  for (let i = before.length - 1; i >= 0; i--) for (let j = after.length - 1; j >= 0; j--)
    table[i][j] = before[i] === after[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const pairs = [];
  let i = 0, j = 0;
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) { pairs.push([i++, j++]); }
    else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}
export function nearestLevel(height, heights) {
  return heights.reduce((best, value, index) => Math.abs(height-value) < Math.abs(height-heights[best]) ? index : best, 0);
}
