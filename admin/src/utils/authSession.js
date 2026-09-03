const SESSION_KEY = 'goworking-admin-session'

export function createMemoryStorage() {
  const values = new Map()
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  }
}

export function createAuthSessionStore(storage) {
  return {
    create(user, remember) {
      const session = { user, token: user.token, remember: Boolean(remember) }
      storage.setItem(SESSION_KEY, JSON.stringify(session))
      return session
    },
    read() {
      try {
        const value = JSON.parse(storage.getItem(SESSION_KEY))
        return value?.user && typeof value.token === 'string' && value.token
          ? value
          : null
      } catch {
        return null
      }
    },
    token() {
      return this.read()?.token ?? null
    },
    clear() {
      storage.removeItem(SESSION_KEY)
    },
  }
}

const fallbackStorage = createMemoryStorage()

function storage(name) {
  try {
    return globalThis[name]?.getItem ? globalThis[name] : fallbackStorage
  } catch {
    return fallbackStorage
  }
}

function stores() {
  return {
    local: createAuthSessionStore(storage('localStorage')),
    session: createAuthSessionStore(storage('sessionStorage')),
  }
}

export function createAuthSession(user, remember) {
  const current = stores()
  current.local.clear()
  current.session.clear()
  return (remember ? current.local : current.session).create(user, remember)
}

export function readAuthSession() {
  const current = stores()
  return current.local.read() ?? current.session.read()
}

export function getAuthToken() {
  return readAuthSession()?.token ?? null
}

export function clearAuthSession() {
  const current = stores()
  current.local.clear()
  current.session.clear()
}

export function isAdminAuthenticated() {
  return Boolean(getAuthToken())
}
