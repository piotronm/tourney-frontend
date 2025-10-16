#!/bin/bash

echo "🔍 Verifying Frontend Imports..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if src/api/types.ts exists
if [ ! -f "src/api/types.ts" ]; then
  echo -e "${RED}❌ src/api/types.ts not found!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ src/api/types.ts exists${NC}"

# Extract all exported interfaces from types.ts
echo ""
echo "📋 Exported types from api/types.ts:"
grep "export interface" src/api/types.ts | sed 's/export interface /  - /' | sed 's/ {.*//'

echo ""
echo "🔍 Checking component imports..."

# Find all files that import from @/api/types
FILES=$(grep -r "from '@/api/types'" src/ --include="*.tsx" --include="*.ts" -l 2>/dev/null)

if [ -z "$FILES" ]; then
  echo -e "${YELLOW}⚠️  No files importing from @/api/types${NC}"
else
  for file in $FILES; do
    echo ""
    echo "  File: $file"
    # Show what's being imported
    grep "from '@/api/types'" "$file" | sed 's/^/    /'
  done
fi

echo ""
echo "🔍 Checking for TypeScript errors..."
npx tsc --noEmit 2>&1 | head -20

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Import verification complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
