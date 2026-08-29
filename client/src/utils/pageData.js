export function filterRows(rows, query, keys) {
  const needle = String(query ?? '')
    .trim()
    .toLowerCase();
  if (!needle) return [...rows];
  return rows.filter((row) =>
    keys.some((key) =>
      String(row[key] ?? '')
        .toLowerCase()
        .includes(needle),
    ),
  );
}

export function paginateRows(rows, page, pageSize) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page: safePage,
    pageCount,
  };
}

export function resetObject(target, defaults) {
  Object.assign(target, defaults);
  return target;
}
