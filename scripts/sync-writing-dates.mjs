import { readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const dates = {}
for (const filename of (await readdir(new URL('pages/posts/', root))).sort()) {
  if (!filename.endsWith('.md')) continue
  const source = await readFile(new URL(`pages/posts/${filename}`, root), 'utf8')
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1]
  // This site's explicit ISO date fields; never use filesystem or build dates.
  const date = frontmatter?.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?)['"]?\s*$/m)?.[1]
  if (date && Number.isFinite(Date.parse(date.replace(' ', 'T'))))
    dates[`/posts/${filename.slice(0, -3)}`] = date
}
const output = new URL('data/writing-dates.json', root)
await writeFile(output, `${JSON.stringify(dates, null, 2)}\n`)
console.log(`Synced ${Object.keys(dates).length} explicit publication dates to ${fileURLToPath(output)}`)
