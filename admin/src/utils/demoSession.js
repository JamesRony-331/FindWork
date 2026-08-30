const SESSION_KEY = 'goworking-admin-demo-session'

export function createMemoryStorage() {
  const values = new Map()

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
    removeItem(key) {
      values.delete(key)
    },
  }
}

export function createDemoSessionStore(storage) {
  return {
    create(username, remember) {
      const session = { username, remember: Boolean(remember) }
      storage.setItem(SESSION_KEY, JSON.stringify(session))
      return session
    },
    read() {
      try {
        const value = JSON.parse(storage.getItem(SESSION_KEY))
        return value && typeof value.username === 'string' && typeof value.remember === 'boolean'
          ? { username: value.username, remember: value.remember }
          : null
      } catch {
        return null
      }
    },
    clear() {
      storage.removeItem(SESSION_KEY)
    },
  }
}

const fallbackStorage = createMemoryStorage()

function getStorage(name) {
  try {
    const storage = globalThis[name]
    return storage && typeof storage.getItem === 'function' ? storage : fallbackStorage
  } catch {
    return fallbackStorage
  }
}

function getSessionStores() {
  return {
    local: createDemoSessionStore(getStorage('localStorage')),
    session: createDemoSessionStore(getStorage('sessionStorage')),
  }
}

export function createDemoSession(username, remember) {
  const stores = getSessionStores()
  stores.local.clear()
  stores.session.clear()

  return (remember ? stores.local : stores.session).create(username, remember)
}

export function readDemoSession() {
  const stores = getSessionStores()
  return stores.local.read() ?? stores.session.read()
}

export function clearDemoSession() {
  const stores = getSessionStores()
  stores.local.clear()
  stores.session.clear()
}

export function isDemoAuthenticated() {
  return Boolean(readDemoSession()?.username)
}
