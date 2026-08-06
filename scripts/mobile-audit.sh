#!/bin/zsh
# Mobile regression audit (MOBILE_FIX_PLAN.md §Phase 4).
# Loads every route at phone widths via agent-browser and fails on horizontal
# overflow. Requires the dev server on :3000 (npm run dev) and agent-browser
# (devDependency). Usage: zsh scripts/mobile-audit.sh [width ...]
set -u
BASE="${BASE_URL:-http://localhost:3000}"
WIDTHS=("${@:-360 393 430}")
ROUTES=("/" "/index-alt" "/shop" "/faq" "/products/nad" "/request/practice" "/request/contact" "/request/profile" "/request/additional" "/request/confirmation")
FAIL=0

for width in ${=WIDTHS}; do
  npx agent-browser set viewport "$width" 844 >/dev/null
  echo "── viewport ${width}px ──"
  for route in $ROUTES; do
    npx agent-browser open "$BASE$route" >/dev/null 2>&1
    npx agent-browser wait 1200 >/dev/null 2>&1
    result=$(npx agent-browser eval 'const d=document.documentElement; d.scrollWidth<=d.clientWidth ? "OK" : "OVERFLOW " + d.scrollWidth + ">" + d.clientWidth' 2>/dev/null)
    echo "  $route: $result"
    [[ "$result" == *OVERFLOW* ]] && FAIL=1
  done
done

echo "── console errors ──"
npx agent-browser errors
npx agent-browser close >/dev/null 2>&1
exit $FAIL
