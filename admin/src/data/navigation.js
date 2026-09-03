export const adminNavigation = [
  { id: 'dashboard', label: '数据大屏', icon: 'dashboard', to: '/dashboard', disabled: false },
  { id: 'profile', label: '个人主页', icon: 'user', to: '/profile', disabled: false },
  { id: 'users', label: '用户管理', icon: 'user', to: '/users', disabled: false },
  { id: 'jobs', label: '岗位数据', icon: 'briefcase', badge: '待建设', disabled: true },
  { id: 'collection', label: '采集管理', icon: 'collection', badge: '待建设', disabled: true },
  { id: 'cleaning', label: '数据清洗', icon: 'clean', badge: '待建设', disabled: true },
  { id: 'dictionary', label: '字典管理', icon: 'dictionary', badge: '待建设', disabled: true },
  {
    id: 'system',
    label: '系统管理',
    icon: 'settings',
    disabled: false,
    children: [
      { id: 'menu-management', label: '菜单管理', icon: 'menu-tree', to: '/system/menu' },
      { id: 'role-management', label: '角色管理', icon: 'roles', to: '/system/role' },
      { id: 'permission-management', label: '权限管理', icon: 'shield', to: '/system/permission' },
    ],
  },
  { id: 'logs', label: '系统日志', icon: 'log', badge: '待建设', disabled: true },
]
