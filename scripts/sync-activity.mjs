import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const source = process.argv.find(arg => arg.startsWith('--source='))?.split('=')[1]
  || process.env.ACTIVITY_SOURCE
  || 'github'
const outputArg = process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1]
const outputPath = resolve(
  outputArg
  || process.env.ACTIVITY_OUTPUT
  || (source === 'tokdash' ? 'data/token-activity.json' : 'data/activity.json'),
)

function isoDate(date) {
  return date.toISOString().slice(0, 10)
}

function dateRange() {
  const to = new Date()
  const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - 6, 1))
  const lastDay = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0)).getUTCDate()
  from.setUTCDate(Math.min(to.getUTCDate(), lastDay))
  from.setUTCDate(from.getUTCDate() + 1)
  return {
    from: `${isoDate(from)}T00:00:00Z`,
    to: `${isoDate(to)}T23:59:59Z`,
  }
}

function githubToken() {
  const token = process.env.PROFILE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token)
    return token

  if (process.env.CI)
    return ''

  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  }
  catch {
    return ''
  }
}

async function githubActivity() {
  const username = process.env.GITHUB_ACTIVITY_USER || '674019130'
  const token = githubToken()
  if (!token)
    throw new Error('No GitHub token is available')

  const range = dateRange()
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'valaxy-activity-sync',
    },
    body: JSON.stringify({
      query: `
        query Activity($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `,
      variables: { login: username, ...range },
    }),
  })

  if (!response.ok)
    throw new Error(`GitHub GraphQL returned ${response.status}`)

  const payload = await response.json()
  if (payload.errors?.length)
    throw new Error(payload.errors.map(error => error.message).join('; '))

  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar)
    throw new Error(`No contribution calendar found for ${username}`)

  const levels = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  }
  const days = calendar.weeks.flatMap(week => week.contributionDays).map(day => ({
    date: day.date,
    count: day.contributionCount,
    level: levels[day.contributionLevel] ?? 0,
  }))

  return {
    source: 'github',
    username,
    generatedAt: new Date().toISOString(),
    period: { from: range.from.slice(0, 10), to: range.to.slice(0, 10) },
    summary: {
      total: calendar.totalContributions,
      activeDays: days.filter(day => day.count > 0).length,
    },
    days,
  }
}

async function tokdashActivity() {
  const baseUrl = (process.env.TOKDASH_URL || 'http://127.0.0.1:55423').replace(/\/$/, '')
  const range = dateRange()
  const years = [...new Set([range.from.slice(0, 4), range.to.slice(0, 4)])]
  const contributions = []

  for (const year of years) {
    const response = await fetch(`${baseUrl}/api/stats?year=${year}`, {
      signal: AbortSignal.timeout(120_000),
    })
    if (!response.ok)
      throw new Error(`Tokdash returned ${response.status} for ${year}`)
    const payload = await response.json()
    contributions.push(...(payload.contributions || []))
  }

  const uniqueDays = new Map()
  for (const day of contributions) {
    if (!day.date || day.date < range.from.slice(0, 10) || day.date > range.to.slice(0, 10))
      continue
    uniqueDays.set(day.date, {
      date: day.date,
      tokens: Math.max(0, Number(day.totals?.tokens) || 0),
    })
  }

  const rawDays = [...uniqueDays.values()].sort((a, b) => a.date.localeCompare(b.date))
  const levelFor = (tokens) => {
    if (tokens <= 0)
      return 0
    if (tokens >= 1_000_000_000)
      return 5
    if (tokens >= 500_000_000)
      return 4
    if (tokens >= 300_000_000)
      return 3
    if (tokens >= 100_000_000)
      return 2
    return 1
  }
  const days = rawDays.map(day => ({
    date: day.date,
    level: levelFor(day.tokens),
  }))
  const activeDays = rawDays.filter(day => day.tokens > 0).length
  const totalTokens = rawDays.reduce((total, day) => total + day.tokens, 0)

  return {
    source: 'tokdash',
    generatedAt: new Date().toISOString(),
    period: { from: range.from.slice(0, 10), to: range.to.slice(0, 10) },
    summary: {
      totalTokens,
      activeDays,
      averageTokensPerActiveDay: activeDays ? Math.round(totalTokens / activeDays) : 0,
    },
    days,
  }
}

async function writeActivity(data) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`Synced ${data.source} activity to ${outputPath}`)
}

try {
  const data = source === 'github'
    ? await githubActivity()
    : source === 'tokdash'
      ? await tokdashActivity()
      : null

  if (!data)
    throw new Error(`Unknown activity source: ${source}`)

  await writeActivity(data)
}
catch (error) {
  try {
    await readFile(outputPath, 'utf8')
    console.warn(`Activity sync skipped: ${error.message}. Keeping the existing snapshot.`)
  }
  catch {
    throw error
  }
}
