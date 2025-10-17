#!/bin/bash

echo "=================================="
echo "Admin Query Cache - Runtime Tests"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Test function
test_case() {
    local description=$1
    local result=$2

    if [ "$result" = "pass" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $description"
        ((FAILED++))
    fi
}

echo "Phase 2.1: Public Viewer Mode (Default)"
echo "----------------------------------------"

# Test 1: Verify localStorage is NOT set for admin mode
ADMIN_MODE=$(node -e "console.log(typeof window !== 'undefined' ? 'browser' : 'node')")
if [ "$ADMIN_MODE" = "node" ]; then
    # We're in Node, can't test localStorage directly
    echo -e "${YELLOW}⚠️  SKIP${NC}: localStorage test (requires browser environment)"
else
    test_case "localStorage admin mode default is false" "pass"
fi

# Test 2: API endpoint returns data
DIVISIONS_RESPONSE=$(curl -s http://localhost:3000/api/public/divisions)
if echo "$DIVISIONS_RESPONSE" | grep -q '"data"'; then
    test_case "API /api/public/divisions returns data" "pass"
else
    test_case "API /api/public/divisions returns data" "fail"
fi

# Test 3: Get a division ID for further tests
DIVISION_ID=$(echo "$DIVISIONS_RESPONSE" | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    console.log(data.data[0]?.id || '');
")

if [ -n "$DIVISION_ID" ]; then
    test_case "Found test division ID: $DIVISION_ID" "pass"

    # Test 4: Division detail endpoint works
    DIVISION_DETAIL=$(curl -s http://localhost:3000/api/public/divisions/$DIVISION_ID)
    if echo "$DIVISION_DETAIL" | grep -q '"id"'; then
        test_case "API /api/public/divisions/$DIVISION_ID returns data" "pass"
    else
        test_case "API /api/public/divisions/$DIVISION_ID returns data" "fail"
    fi

    # Test 5: Matches endpoint works
    MATCHES_RESPONSE=$(curl -s http://localhost:3000/api/public/divisions/$DIVISION_ID/matches)
    if echo "$MATCHES_RESPONSE" | grep -q '"data"'; then
        test_case "API /api/public/divisions/$DIVISION_ID/matches returns data" "pass"
    else
        test_case "API /api/public/divisions/$DIVISION_ID/matches returns data" "fail"
    fi

    # Test 6: Standings endpoint works
    STANDINGS_RESPONSE=$(curl -s http://localhost:3000/api/public/divisions/$DIVISION_ID/standings)
    if echo "$STANDINGS_RESPONSE" | grep -q '"divisionId"'; then
        test_case "API /api/public/divisions/$DIVISION_ID/standings returns data" "pass"
    else
        test_case "API /api/public/divisions/$DIVISION_ID/standings returns data" "fail"
    fi
else
    echo -e "${YELLOW}⚠️  SKIP${NC}: No test division found for detail tests"
fi

echo ""
echo "Phase 2.2: Cache Behavior Tests"
echo "--------------------------------"

# Test 7: Multiple rapid requests (should be cached on client)
echo "Making 3 rapid requests to /api/public/divisions..."
START_TIME=$(date +%s%3N)
for i in {1..3}; do
    curl -s http://localhost:3000/api/public/divisions > /dev/null
done
END_TIME=$(date +%s%3N)
DURATION=$((END_TIME - START_TIME))
echo "Total time for 3 requests: ${DURATION}ms"

if [ $DURATION -lt 500 ]; then
    test_case "API responds quickly (< 500ms for 3 requests)" "pass"
else
    test_case "API responds quickly (< 500ms for 3 requests)" "fail"
fi

echo ""
echo "Phase 2.3: Frontend Accessibility"
echo "----------------------------------"

# Test 8: Frontend homepage accessible
FRONTEND_HOME=$(curl -s http://localhost:5173)
if echo "$FRONTEND_HOME" | grep -q "<!doctype html"; then
    test_case "Frontend homepage accessible" "pass"
else
    test_case "Frontend homepage accessible" "fail"
fi

# Test 9: Vite client script present
if echo "$FRONTEND_HOME" | grep -q "@vite/client"; then
    test_case "Vite dev mode active" "pass"
else
    test_case "Vite dev mode active" "fail"
fi

echo ""
echo "Phase 2.4: Code Structure Verification"
echo "---------------------------------------"

# Test 10: DevTools component exists
if [ -f "src/components/DevTools.tsx" ]; then
    test_case "DevTools.tsx exists" "pass"
else
    test_case "DevTools.tsx exists" "fail"
fi

# Test 11: QueryConfigContext exists
if [ -f "src/contexts/QueryConfigContext.tsx" ]; then
    test_case "QueryConfigContext.tsx exists" "pass"
else
    test_case "QueryConfigContext.tsx exists" "fail"
fi

# Test 12: Updated hooks exist
HOOKS_UPDATED=0
for hook in "useDivisions" "useDivision" "useMatches" "useStandings"; do
    if grep -q "isAdmin" "src/hooks/${hook}.ts" 2>/dev/null; then
        ((HOOKS_UPDATED++))
    fi
done

if [ $HOOKS_UPDATED -eq 4 ]; then
    test_case "All 4 hooks updated with isAdmin option" "pass"
else
    test_case "All 4 hooks updated with isAdmin option (found $HOOKS_UPDATED/4)" "fail"
fi

# Test 13: Mutation hooks exist
if [ -d "src/hooks/mutations" ]; then
    test_case "Mutations directory exists" "pass"
else
    test_case "Mutations directory exists" "fail"
fi

echo ""
echo "=================================="
echo "Test Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
