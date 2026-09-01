import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const username = process.env.GITHUB_PROJECT_USER || '674019130'
const repositories = (process.env.GITHUB_FEATURED_PROJECTS || [
  'JingbiaoMei/Tokdash',
  `${username}/learn-real-claude-code`,
  `${username}/shadow-reading`,
].join(',')).split(',').map((reference) => {
  const parts = reference.trim().split('/').filter(Boolean)
  if (parts.length === 1)
    return { owner: username, name: parts[0] }
  if (parts.length === 2)
    return { owner: parts[0], name: parts[1] }
  throw new Error(`Invalid repository reference: ${reference}`)
}).filter(repository => repository.name)
const outputPath = resolve(process.env.PROJECTS_OUTPUT || 'data/projects.json')
const token = process.env.PROFILE_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN

async function fetchRepository({ owner, name }) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'valaxy-project-sync',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token)
    headers.Authorization = `Bearer ${token}`

  const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers })
  if (!response.ok)
    throw new Error(`GitHub REST returned ${response.status} for ${name}`)

  const repository = await response.json()
  return {
    name: repository.name,
    description: repository.description || '',
    url: repository.html_url,
    homepage: repository.homepage || null,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    language: repository.language || null,
    updatedAt: repository.updated_at,
  }
}

async function writeProjects(projects) {
  const snapshot = {
    source: 'github',
    username,
    generatedAt: new Date().toISOString(),
    projects,
  }
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`Synced ${projects.length} GitHub projects to ${outputPath}`)
}

try {
  await writeProjects(await Promise.all(repositories.map(fetchRepository)))
}
catch (error) {
  try {
    await readFile(outputPath, 'utf8')
    console.warn(`Project sync skipped: ${error.message}. Keeping the existing snapshot.`)
  }
  catch {
    throw error
  }
}
