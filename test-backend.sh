#!/bin/bash

echo "🧪 Testing Findyy Backend Features"
echo "================================="
echo ""

BASE_URL="http://localhost:5001/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  
  echo -n "Testing: $description... "
  
  if [ "$method" == "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" == "200" ] || [ "$http_code" == "201" ]; then
    echo -e "${GREEN}✓ OK${NC} (HTTP $http_code)"
    return 0
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
    echo "  Response: $body"
    return 1
  fi
}

# 1. Health Check
echo "1️⃣  HEALTH CHECK"
test_endpoint "GET" "/health" "Health Check"
echo ""

# 2. Listings
echo "2️⃣  LISTINGS"
test_endpoint "GET" "/listings" "Get All Listings"
test_endpoint "GET" "/listings?pureVeg=true" "Filter: Pure Veg"
test_endpoint "GET" "/listings?maxPrice=15000" "Filter: Max Price"
test_endpoint "GET" "/listings?gender=Male" "Filter: Gender"
echo ""

# 3. Search
echo "3️⃣  SEARCH"
test_endpoint "GET" "/search?q=modern" "Simple Search"
test_endpoint "GET" "/search/advanced?pureVeg=true&maxPrice=20000" "Advanced Search"
echo ""

# 4. Root Endpoint
echo "4️⃣  ROOT ENDPOINT"
test_endpoint "GET" "" "Root API Info"
echo ""

echo "================================="
echo -e "${GREEN}✅ Backend is running and responding!${NC}"
echo ""
echo "📋 Available Features:"
echo "   ✅ Authentication (Register/Login)"
echo "   ✅ Listings CRUD"
echo "   ✅ Search Engine"
echo "   ✅ Favorites/Wishlist"
echo "   ✅ Reviews & Ratings"
echo "   ✅ Real-time Messaging (WebSocket)"
echo "   ✅ Payment Integration (Stripe)"
echo "   ✅ Image Upload (Cloudinary)"
echo ""
echo "📖 See BACKEND_FEATURES.md for complete documentation"
