# Task 3 report — dashboard demonstration data and helpers

## Scope delivered

- Added `admin/src/data/dashboard.js` with the dashboard metadata and all eight requested static datasets: metrics, seven-day collection trend, source share, city ranking, quality summary, collection tasks, recent activities, and alerts.
- Added `admin/src/utils/dashboard.js` with `toPercent` and `toPolylinePoints`.
- Added `admin/tests/dashboardData.test.js` covering stable dataset identifiers, metric/trend sizes, percentage clamping, and SVG point generation.
- Marked the data as demonstration content with `dashboardMeta.isDemo = true` and the explicit update timestamp `2026-08-30T09:30:00+08:00`.

## TDD evidence

1. Added the dashboard contract test before either production module existed.
2. Ran `cd admin && node --test tests/dashboardData.test.js`.
   - Result: expected failure with `ERR_MODULE_NOT_FOUND` for `src/data/dashboard.js`.
3. Implemented the static datasets and pure helpers.
4. Re-ran the focused test successfully.

## Verification

Executed from `admin/`:

```text
node --test tests/dashboardData.test.js
# pass 2, fail 0

node --test tests/*.test.js
# pass 6, fail 0

npm run build
# vite build completed successfully; 21 modules transformed
```

`git diff --check` is clean for the scoped changes.

## Design notes

- Dataset records use stable kebab-case identifiers and Chinese labels matching the dashboard specification.
- Collection task statuses are limited to `running`, `success`, `warning`, and `failed`.
- `toPercent` returns `0` for invalid or non-positive totals and clamps valid ratios to `0–100`.
- `toPolylinePoints` maps values to the padded plot rectangle and uses a midpoint for single-value or flat series, avoiding division by zero.

## Concerns

None within the requested Task 3 scope.
