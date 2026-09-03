export function normalizeUserPage(data) {
  const userList = data?.VOList ?? data?.volist
  return {
    pageNum: Number(data?.pageNum) || 1,
    pageSize: Number(data?.pageSize) || 10,
    totalPages: Math.max(1, Number(data?.total) || 1),
    totalCount: Number(data?.totalCount) || 0,
    rows: Array.isArray(userList) ? userList : [],
  }
}

export function formatUserSex(sex) {
  if (sex == null || sex === '') return '未知'
  if (Number(sex) === 1) return '男'
  if (Number(sex) === 0) return '女'
  return '未知'
}

export function formatUserStatus(isDelete) {
  return Number(isDelete) === 1 ? '已停用' : '正常'
}

export function formatUserDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date)
}
