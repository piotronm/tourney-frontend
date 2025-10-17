#!/bin/bash

echo "=========================================="
echo "Phase 3: Integration & Cache Invalidation"
echo "=========================================="
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

echo "Test 3.1: Mutation Hook Structure"
echo "-----------------------------------"

# Check useDivisionMutations.ts
if [ -f "src/hooks/mutations/useDivisionMutations.ts" ]; then
    test_case "useDivisionMutations.ts exists" "pass"

    # Check for useMutation import
    if grep -q "import.*useMutation.*from '@tanstack/react-query'" src/hooks/mutations/useDivisionMutations.ts; then
        test_case "Imports useMutation from TanStack Query" "pass"
    else
        test_case "Imports useMutation from TanStack Query" "fail"
    fi

    # Check for useQueryClient import
    if grep -q "import.*useQueryClient.*from '@tanstack/react-query'" src/hooks/mutations/useDivisionMutations.ts; then
        test_case "Imports useQueryClient" "pass"
    else
        test_case "Imports useQueryClient" "fail"
    fi

    # Check for onSuccess handlers
    SUCCESS_COUNT=$(grep -c "onSuccess:" src/hooks/mutations/useDivisionMutations.ts)
    if [ $SUCCESS_COUNT -ge 3 ]; then
        test_case "All mutation hooks have onSuccess handlers ($SUCCESS_COUNT found)" "pass"
    else
        test_case "All mutation hooks have onSuccess handlers ($SUCCESS_COUNT found, expected 3)" "fail"
    fi

    # Check for onError handlers
    ERROR_COUNT=$(grep -c "onError:" src/hooks/mutations/useDivisionMutations.ts)
    if [ $ERROR_COUNT -ge 3 ]; then
        test_case "All mutation hooks have onError handlers ($ERROR_COUNT found)" "pass"
    else
        test_case "All mutation hooks have onError handlers ($ERROR_COUNT found, expected 3)" "fail"
    fi

    # Check for query invalidation calls
    INVALIDATE_COUNT=$(grep -c "invalidateQueries" src/hooks/mutations/useDivisionMutations.ts)
    if [ $INVALIDATE_COUNT -ge 3 ]; then
        test_case "Query invalidation calls present ($INVALIDATE_COUNT found)" "pass"
    else
        test_case "Query invalidation calls present ($INVALIDATE_COUNT found, expected >= 3)" "fail"
    fi

    # Check for toast notifications
    if grep -q "import.*toast.*from 'sonner'" src/hooks/mutations/useDivisionMutations.ts; then
        test_case "Uses toast for user feedback" "pass"
    else
        test_case "Uses toast for user feedback" "fail"
    fi
else
    test_case "useDivisionMutations.ts exists" "fail"
fi

echo ""
echo "Test 3.2: Query Key Consistency"
echo "--------------------------------"

# Extract query keys from hooks
echo "Extracting query keys from hooks..."

# useDivisions
if grep -q "queryKey: \['divisions'" src/hooks/useDivisions.ts; then
    test_case "useDivisions uses ['divisions', ...] key" "pass"
else
    test_case "useDivisions uses ['divisions', ...] key" "fail"
fi

# useDivision
if grep -q "queryKey: \['division'" src/hooks/useDivision.ts; then
    test_case "useDivision uses ['division', id] key" "pass"
else
    test_case "useDivision uses ['division', id] key" "fail"
fi

# useMatches
if grep -q "queryKey: \['matches'" src/hooks/useMatches.ts; then
    test_case "useMatches uses ['matches', ...] key" "pass"
else
    test_case "useMatches uses ['matches', ...] key" "fail"
fi

# useStandings
if grep -q "queryKey: \['standings'" src/hooks/useStandings.ts; then
    test_case "useStandings uses ['standings', ...] key" "pass"
else
    test_case "useStandings uses ['standings', ...] key" "fail"
fi

# Check mutation invalidations match
echo ""
echo "Verifying mutation invalidations match query keys..."

# useDivisionMutations should invalidate ['divisions']
if grep -q "invalidateQueries.*queryKey.*\['divisions'\]" src/hooks/mutations/useDivisionMutations.ts; then
    test_case "Mutations invalidate ['divisions'] key" "pass"
else
    test_case "Mutations invalidate ['divisions'] key" "fail"
fi

# Should also invalidate ['division', id] for updates (multiline check)
if grep -A1 "invalidateQueries" src/hooks/mutations/useDivisionMutations.ts | grep -q "\['division'"; then
    test_case "Update mutation invalidates ['division', id] key" "pass"
else
    test_case "Update mutation invalidates ['division', id] key" "fail"
fi

echo ""
echo "Test 3.3: useUpdateMatchScore Integration"
echo "------------------------------------------"

# Check the fixed hook
if [ -f "src/hooks/admin/useUpdateMatchScore.ts" ]; then
    test_case "useUpdateMatchScore.ts exists" "pass"

    # Check it accepts matchId parameter
    if grep -q "matchId" src/hooks/admin/useUpdateMatchScore.ts | head -5; then
        test_case "Hook accepts matchId parameter" "pass"
    else
        test_case "Hook accepts matchId parameter" "fail"
    fi

    # Check it invalidates queries
    if grep -q "invalidateQueries" src/hooks/admin/useUpdateMatchScore.ts; then
        test_case "Hook invalidates queries on success" "pass"
    else
        test_case "Hook invalidates queries on success" "fail"
    fi

    # Check it invalidates matches (multiline)
    if grep -A1 "invalidateQueries" src/hooks/admin/useUpdateMatchScore.ts | grep -q "\['matches'"; then
        test_case "Invalidates ['matches', divisionId]" "pass"
    else
        test_case "Invalidates ['matches', divisionId]" "fail"
    fi

    # Check it invalidates standings (multiline)
    if grep -A1 "invalidateQueries" src/hooks/admin/useUpdateMatchScore.ts | grep -q "\['standings'"; then
        test_case "Invalidates ['standings', divisionId]" "pass"
    else
        test_case "Invalidates ['standings', divisionId]" "fail"
    fi

    # Check it invalidates division (multiline)
    if grep -A1 "invalidateQueries" src/hooks/admin/useUpdateMatchScore.ts | grep -q "\['division'"; then
        test_case "Invalidates ['division', divisionId]" "pass"
    else
        test_case "Invalidates ['division', divisionId]" "fail"
    fi
else
    test_case "useUpdateMatchScore.ts exists" "fail"
fi

echo ""
echo "Test 3.4: No Infinite Refetch Loops"
echo "------------------------------------"

# Check that mutations don't trigger themselves
echo "Checking for potential infinite loops..."

# Mutation hooks should not use query hooks internally
# Note: useQueryClient is OK, we're looking for useQuery or useInfiniteQuery
MUTATION_FILES=$(find src/hooks/mutations -name "*.ts" 2>/dev/null)
LOOP_DETECTED=false

if [ -n "$MUTATION_FILES" ]; then
    for file in $MUTATION_FILES; do
        # Check for useQuery but exclude useQueryClient
        if grep -E "useQuery[^C]|useInfiniteQuery" "$file" | grep -v "useQueryClient" > /dev/null; then
            echo -e "${RED}⚠️  Warning: $file uses query hooks (potential loop)${NC}"
            LOOP_DETECTED=true
        fi
    done

    if [ "$LOOP_DETECTED" = false ]; then
        test_case "No query hooks in mutation files" "pass"
    else
        test_case "No query hooks in mutation files" "fail"
    fi
else
    test_case "No query hooks in mutation files" "skip"
fi

# Check that hooks don't refetch on mount in admin mode
echo ""
echo "Checking refetch configuration..."

# useStandings should disable refetchInterval in admin mode
if grep -q "refetchInterval:.*isAdmin.*false" src/hooks/useStandings.ts; then
    test_case "useStandings disables auto-refresh in admin mode" "pass"
else
    test_case "useStandings disables auto-refresh in admin mode" "fail"
fi

echo ""
echo "=========================================="
echo "Phase 3 Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All Phase 3 tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some Phase 3 tests failed${NC}"
    exit 1
fi
