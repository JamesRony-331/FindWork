export function isClientAuthenticated(storage) {
  const targetStorage = storage ?? (typeof localStorage === 'undefined' ? null : localStorage);
  return Boolean(targetStorage?.getItem('token')?.trim());
}

export function getAuthRedirect(path, authenticated) {
  if (authenticated && (path === '/login' || path === '/register')) return '/user/dashboard';
  if (!authenticated && (path === '/profile' || path.startsWith('/user/'))) return '/login';
  return null;
}
