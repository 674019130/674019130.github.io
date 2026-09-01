import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const snapshot = JSON.parse(await readFile(new URL('../data/projects.json', import.meta.url), 'utf8'))

test('featured projects snapshot has a stable public shape', () => {
  assert.equal(snapshot.source, 'github')
  assert.equal(snapshot.username, '674019130')
  assert.equal(snapshot.projects.length, 3)

  for (const project of snapshot.projects) {
    assert.deepEqual(Object.keys(project).sort(), [
      'description',
      'forks',
      'homepage',
      'language',
      'name',
      'stars',
      'updatedAt',
      'url',
    ])
    assert.match(project.url, /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/)
    assert.ok(Number.isInteger(project.stars) && project.stars >= 0)
    assert.ok(Number.isInteger(project.forks) && project.forks >= 0)
  }

  const tokdash = snapshot.projects.find(project => project.name === 'Tokdash')
  assert.equal(tokdash?.url, 'https://github.com/JingbiaoMei/Tokdash')
})
