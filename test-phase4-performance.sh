#!/bin/bash

echo "=============================================="
echo "Phase 4: Performance & Regression Testing"
echo "=============================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0

test_case() {
    local description=$1
    local result=$2

    if [ "$result" = "pass" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $description"
        ((PASSED++))
    elif [ "$result" = "skip" ]; then
        echo -e "${YELLOW}⚠️  SKIP${NC}: $description"
    else
        echo -e "${RED}❌ FAIL${NC}: $description"
        ((FAILED++))
    fi
}

echo "Test 4.1: Bundle Size Check"
echo "----------------------------"

# Build for production
echo "Building for production..."
npm run build > /tmp/build-output.txt 2>&1

if [ $? -eq 0 ]; then
    test_case "Production build successful" "pass"

    # Check dist folder size
    if [ -d "dist" ]; then
        DIST_SIZE=$(du -sh dist | cut -f1)
        echo "   Total dist size: $DIST_SIZE"

        # Find main JS bundle
        MAIN_JS=$(find dist/assets -name "index-*.js" -type f 2>/dev/null | head -1)
        if [ -n "$MAIN_JS" ]; then
            JS_SIZE=$(ls -lh "$MAIN_JS" | awk '{print $5}')
            JS_SIZE_BYTES=$(stat -c%s "$MAIN_JS" 2>/dev/null || stat -f%z "$MAIN_JS" 2>/dev/null)
            echo "   Main JS bundle: $JS_SIZE"

            # Check if under reasonable size (< 1MB)
            if [ $JS_SIZE_BYTES -lt 1048576 ]; then
                test_case "Bundle size under 1MB ($JS_SIZE)" "pass"
            else
                test_case "Bundle size under 1MB ($JS_SIZE)" "fail"
            fi
        else
            test_case "Main JS bundle found" "fail"
        fi

        # Check for source maps (should exist in dev build)
        MAP_COUNT=$(find dist/assets -name "*.map" -type f 2>/dev/null | wc -l)
        if [ $MAP_COUNT -gt 0 ]; then
            test_case "Source maps generated ($MAP_COUNT files)" "pass"
        else
            test_case "Source maps generated" "skip"
        fi
    else
        test_case "dist folder exists" "fail"
    fi
else
    test_case "Production build successful" "fail"
    echo "   Build errors (see /tmp/build-output.txt)"
fi

echo ""
echo "Test 4.2: Network Request Optimization"
echo "---------------------------------------"

# Test public mode caching
echo "Testing public mode caching efficiency..."

# Make first request
echo "   Request 1 (cold cache):"
TIME1_START=$(date +%s%3N)
curl -s http://localhost:3000/api/public/divisions > /dev/null
TIME1_END=$(date +%s%3N)
TIME1=$((TIME1_END - TIME1_START))
echo "   Time: ${TIME1}ms"

# Make second request immediately (should benefit from server performance)
echo "   Request 2 (immediate):"
TIME2_START=$(date +%s%3N)
curl -s http://localhost:3000/api/public/divisions > /dev/null
TIME2_END=$(date +%s%3N)
TIME2=$((TIME2_END - TIME2_START))
echo "   Time: ${TIME2}ms"

# Check that server responds quickly
if [ $TIME1 -lt 1000 ] && [ $TIME2 -lt 1000 ]; then
    test_case "API response time < 1s ($TIME1ms, $TIME2ms)" "pass"
else
    test_case "API response time < 1s ($TIME1ms, $TIME2ms)" "fail"
fi

# Test multiple concurrent requests don't overwhelm server
echo ""
echo "   Testing 10 concurrent requests..."
START_TIME=$(date +%s%3N)
for i in {1..10}; do
    curl -s http://localhost:3000/api/public/divisions > /dev/null &
done
wait
END_TIME=$(date +%s%3N)
CONCURRENT_TIME=$((END_TIME - START_TIME))
echo "   Total time: ${CONCURRENT_TIME}ms"

if [ $CONCURRENT_TIME -lt 3000 ]; then
    test_case "10 concurrent requests < 3s (${CONCURRENT_TIME}ms)" "pass"
else
    test_case "10 concurrent requests < 3s (${CONCURRENT_TIME}ms)" "fail"
fi

echo ""
echo "Test 4.3: Code Quality Checks"
echo "------------------------------"

# Re-verify TypeScript
echo "Re-checking TypeScript compilation..."
npx tsc --noEmit > /tmp/tsc-output.txt 2>&1
if [ $? -eq 0 ]; then
    test_case "TypeScript: 0 errors (re-verified)" "pass"
else
    ERROR_COUNT=$(grep -c "error TS" /tmp/tsc-output.txt)
    test_case "TypeScript: 0 errors ($ERROR_COUNT found)" "fail"
fi

# Re-verify ESLint
echo "Re-checking ESLint..."
npm run lint > /tmp/eslint-output.txt 2>&1
if [ $? -eq 0 ]; then
    test_case "ESLint: 0 errors (re-verified)" "pass"
else
    test_case "ESLint: Has errors" "fail"
fi

echo ""
echo "Test 4.4: Regression Testing - Core Features"
echo "---------------------------------------------"

# Test all core API endpoints still work
echo "Testing core API endpoints..."

# Divisions list
RESPONSE=$(curl -s http://localhost:3000/api/public/divisions)
if echo "$RESPONSE" | grep -q '"data"'; then
    test_case "API: GET /api/public/divisions works" "pass"
else
    test_case "API: GET /api/public/divisions works" "fail"
fi

# Get first division ID for further tests
DIVISION_ID=$(echo "$RESPONSE" | node -e "
    try {
        const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
        console.log(data.data[0]?.id || '');
    } catch(e) {
        console.log('');
    }
")

if [ -n "$DIVISION_ID" ]; then
    # Division detail
    RESPONSE=$(curl -s http://localhost:3000/api/public/divisions/$DIVISION_ID)
    if echo "$RESPONSE" | grep -q '"id"'; then
        test_case "API: GET /api/public/divisions/:id works" "pass"
    else
        test_case "API: GET /api/public/divisions/:id works" "fail"
    fi

    # Matches
    RESPONSE=$(curl -s http://localhost:3000/api/public/divisions/$DIVISION_ID/matches)
    if echo "$RESPONSE" | grep -q '"data"'; then
        test_case "API: GET /api/public/divisions/:id/matches works" "pass"
    else
        test_case "API: GET /api/public/divisions/:id/matches works" "fail"
    fi

    # Standings
    RESPONSE=$(curl -s http://localhost:3000/api/public/divisions/$DIVISION_ID/standings)
    if echo "$RESPONSE" | grep -q '"divisionId"'; then
        test_case "API: GET /api/public/divisions/:id/standings works" "pass"
    else
        test_case "API: GET /api/public/divisions/:id/standings works" "fail"
    fi
else
    echo -e "${YELLOW}⚠️  SKIP${NC}: No division found for regression tests"
fi

echo ""
echo "Test 4.5: Frontend Accessibility"
echo "---------------------------------"

# Test homepage
HOMEPAGE=$(curl -s http://localhost:5173)
if echo "$HOMEPAGE" | grep -q "<!doctype html"; then
    test_case "Frontend homepage loads" "pass"
else
    test_case "Frontend homepage loads" "fail"
fi

# Test that React is loaded
if echo "$HOMEPAGE" | grep -q "root"; then
    test_case "React root div present" "pass"
else
    test_case "React root div present" "fail"
fi

# Test that Vite dev server is active
if echo "$HOMEPAGE" | grep -q "@vite/client"; then
    test_case "Vite dev mode active" "pass"
else
    test_case "Vite dev mode active" "fail"
fi

echo ""
echo "Test 4.6: File Structure Integrity"
echo "-----------------------------------"

# Check all key files exist
FILES_TO_CHECK=(
    "src/contexts/QueryConfigContext.tsx"
    "src/components/DevTools.tsx"
    "src/hooks/useDivisions.ts"
    "src/hooks/useDivision.ts"
    "src/hooks/useMatches.ts"
    "src/hooks/useStandings.ts"
    "src/hooks/mutations/useDivisionMutations.ts"
    "src/hooks/admin/useUpdateMatchScore.ts"
    "src/main.tsx"
)

MISSING_FILES=0
for file in "${FILES_TO_CHECK[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}   Missing: $file${NC}"
        ((MISSING_FILES++))
    fi
done

if [ $MISSING_FILES -eq 0 ]; then
    test_case "All ${#FILES_TO_CHECK[@]} key files present" "pass"
else
    test_case "All key files present ($MISSING_FILES missing)" "fail"
fi

# Check no accidental file deletions
HOOK_COUNT=$(find src/hooks -name "*.ts" -type f | wc -l)
if [ $HOOK_COUNT -ge 10 ]; then
    test_case "Hook files count reasonable ($HOOK_COUNT files)" "pass"
else
    test_case "Hook files count reasonable ($HOOK_COUNT files, expected >= 10)" "fail"
fi

echo ""
echo "=============================================="
echo "Phase 4 Summary"
echo "=============================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All Phase 4 tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some Phase 4 tests failed${NC}"
    exit 1
fi
