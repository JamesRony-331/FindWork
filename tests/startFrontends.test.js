import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'

const scriptUrl = new URL('../start-frontends.sh', import.meta.url)

test('startup script launches both Vue projects on fixed ports', () => {
  const script = readFileSync(scriptUrl, 'utf8')

  assert.match(script, /client/)
  assert.match(script, /admin/)
  assert.match(script, /--port 5173 --strictPort/)
  assert.match(script, /--port 5172 --strictPort/)
})

test('startup script installs missing dependencies and cleans up child processes', () => {
  const script = readFileSync(scriptUrl, 'utf8')

  assert.match(script, /node_modules/)
  assert.match(script, /npm install/)
  assert.match(script, /trap .*EXIT/)
  assert.match(script, /wait/)
  assert.ok(statSync(scriptUrl).mode & 0o100, 'script should be executable')
})
