#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏥 Frontend Health Check${NC}"
echo ""

# Check 1: Node modules installed
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ node_modules exists${NC}"
else
  echo -e "${RED}❌ node_modules missing - run: npm install${NC}"
  exit 1
fi

# Check 2: TypeScript compiles
echo -e "\n${BLUE}Checking TypeScript compilation...${NC}"
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  echo -e "${RED}❌ TypeScript errors found:${NC}"
  npx tsc --noEmit 2>&1 | grep "error TS" | head -10
  exit 1
else
  echo -e "${GREEN}✅ TypeScript compiles without errors${NC}"
fi

# Check 3: Key files exist
echo -e "\n${BLUE}Checking key files...${NC}"

FILES=(
  "src/main.tsx"
  "src/router.tsx"
  "src/theme.ts"
  "src/api/types.ts"
  "src/api/client.ts"
  "src/api/divisions.ts"
  "src/api/matches.ts"
  "src/api/standings.ts"
  "src/pages/HomePage.tsx"
  "src/pages/DivisionsPage.tsx"
  "src/pages/DivisionDetailPage.tsx"
  "src/components/layout/Layout.tsx"
  "src/components/divisions/DivisionCard.tsx"
  "src/components/matches/MatchCard.tsx"
  "src/components/standings/StandingsTable.tsx"
)

MISSING=0
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "  ${GREEN}✅${NC} $file"
  else
    echo -e "  ${RED}❌${NC} $file ${YELLOW}(missing)${NC}"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo -e "\n${RED}❌ $MISSING files missing${NC}"
  exit 1
fi

# Check 4: Build test
echo -e "\n${BLUE}Testing production build...${NC}"
if npm run build > /tmp/build.log 2>&1; then
  echo -e "${GREEN}✅ Production build successful${NC}"
  if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo -e "   Build size: $DIST_SIZE"
  fi
else
  echo -e "${RED}❌ Production build failed${NC}"
  echo "   Check /tmp/build.log for details"
  tail -20 /tmp/build.log
  exit 1
fi

# Check 5: Environment variables
echo -e "\n${BLUE}Checking environment variables...${NC}"
if [ -f ".env.development" ]; then
  echo -e "${GREEN}✅ .env.development exists${NC}"
  echo "   Contents:"
  cat .env.development | sed 's/^/   /'
else
  echo -e "${YELLOW}⚠️  .env.development missing${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All health checks passed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Open browser to: http://100.125.100.17:5173"
echo "  3. Check browser console for errors"
