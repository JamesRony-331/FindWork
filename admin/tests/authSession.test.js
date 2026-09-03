import test from 'node:test'
import assert from 'node:assert/strict'
import { createAuthSessionStore, createMemoryStorage } from '../src/utils/authSession.js'

test('auth session stores the administrator profile and raw token', () => {
  const storage = createMemoryStorage()
  const session = createAuthSessionStore(storage)
  const loginData = { nickname: 'admin', email: 'admin', avatar: null, token: 'jwt-token' }

  session.create(loginData, true)

  assert.deepEqual(session.read(), { user: loginData, token: 'jwt-token', remember: true })
  assert.equal(session.token(), 'jwt-token')
  session.clear()
  assert.equal(session.read(), null)
})

test('auth session rejects malformed persisted values', () => {
  const storage = createMemoryStorage()
  storage.setItem('goworking-admin-session', JSON.stringify({ token: '', user: null }))

  assert.equal(createAuthSessionStore(storage).read(), null)
})
