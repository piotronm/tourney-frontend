#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 TypeScript Error Checker${NC}"
echo ""

# Run TypeScript compiler
echo -e "${YELLOW}Running: npx tsc --noEmit${NC}"
echo ""

OUTPUT=$(npx tsc --noEmit 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ No TypeScript errors found!${NC}"
  echo ""
  echo "All files are type-safe and ready to deploy."
  exit 0
else
  echo -e "${RED}❌ TypeScript errors found:${NC}"
  echo ""
  echo "$OUTPUT"
  echo ""

  # Count errors
  ERROR_COUNT=$(echo "$OUTPUT" | grep -c "error TS")
  echo -e "${YELLOW}Total errors: $ERROR_COUNT${NC}"
  echo ""

  # Show most common errors
  echo -e "${YELLOW}Most common errors:${NC}"
  echo "$OUTPUT" | grep "error TS" | sed 's/.*error //' | sort | uniq -c | sort -rn | head -5

  exit 1
fi
