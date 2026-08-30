import test from 'node:test'
import assert from 'node:assert/strict'
import {
  clearDemoSession,
  createDemoSession,
  createDemoSessionStore,
  createMemoryStorage,
  isDemoAuthenticated,
  readDemoSession,
} from '../src/utils/demoSession.js'

test('demo session can be created, read, and cleared', () => {
  const storage = createMemoryStorage()
  const session = createDemoSessionStore(storage)
  session.create('admin', true)
  assert.deepEqual(session.read(), { username: 'admin', remember: true })
  session.clear()
  assert.equal(session.read(), null)
})

test('demo session uses persistent or tab storage according to remember choice', () => {
  const localStorage = createMemoryStorage()
  const sessionStorage = createMemoryStorage()
  const previousLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const previousSessionStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')

  Object.defineProperties(globalThis, {
    localStorage: { configurable: true, value: localStorage },
    sessionStorage: { configurable: true, value: sessionStorage },
  })

  try {
    createDemoSession('admin', true)
    assert.deepEqual(readDemoSession(), { username: 'admin', remember: true })
    assert.equal(sessionStorage.getItem('goworking-admin-demo-session'), null)

    createDemoSession('operator', false)
    assert.deepEqual(readDemoSession(), { username: 'operator', remember: false })
    assert.equal(localStorage.getItem('goworking-admin-demo-session'), null)
    assert.equal(isDemoAuthenticated(), true)

    clearDemoSession()
    assert.equal(isDemoAuthenticated(), false)
  } finally {
    if (previousLocalStorage) {
      Object.defineProperty(globalThis, 'localStorage', previousLocalStorage)
    } else {
      delete globalThis.localStorage
    }

    if (previousSessionStorage) {
      Object.defineProperty(globalThis, 'sessionStorage', previousSessionStorage)
    } else {
      delete globalThis.sessionStorage
    }
  }
})
