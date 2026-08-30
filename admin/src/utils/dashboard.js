export function toPercent(value, total) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, (value / total) * 100))
}

export function toPolylinePoints(values, width, height, padding) {
  if (!Array.isArray(values) || values.length === 0) {
    return ''
  }

  const safeWidth = Number.isFinite(width) ? Math.max(0, width) : 0
  const safeHeight = Number.isFinite(height) ? Math.max(0, height) : 0
  const safePadding = Number.isFinite(padding) ? Math.max(0, padding) : 0
  const plotWidth = Math.max(0, safeWidth - safePadding * 2)
  const plotHeight = Math.max(0, safeHeight - safePadding * 2)
  const numericValues = values.map((value) => (Number.isFinite(value) ? value : 0))
  const minimum = Math.min(...numericValues)
  const maximum = Math.max(...numericValues)
  const range = maximum - minimum
  const midpoint = safePadding + plotHeight / 2

  return numericValues.map((value, index) => {
    const x = numericValues.length === 1
      ? safePadding + plotWidth / 2
      : safePadding + (index / (numericValues.length - 1)) * plotWidth
    const y = range === 0
      ? midpoint
      : safePadding + ((maximum - value) / range) * plotHeight

    return `${x},${y}`
  }).join(' ')
}
