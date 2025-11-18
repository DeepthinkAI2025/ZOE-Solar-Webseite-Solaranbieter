#!/bin/bash

# Script to add all essential environment variables to Vercel
cd /Users/jeremyschulze/_Development/ZOE-Solar-Webseite-Solaranbieter-main

echo "Adding essential environment variables to Vercel..."

# Notion API
vercel env add NOTION_API_KEY production << 'EOF'
YOUR_NOTION_API_KEY_HERE
EOF

vercel env add NOTION_TOKEN production << 'EOF'
YOUR_NOTION_TOKEN_HERE
EOF

# Google APIs
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production << 'EOF'
YOUR_GOOGLE_MAPS_API_KEY
EOF

vercel env add VITE_GOOGLE_MAPS_API_KEY production << 'EOF'
YOUR_GOOGLE_MAPS_API_KEY
EOF

# Site URLs
vercel env add NEXT_PUBLIC_SITE_URL production << 'EOF'
https://zoe-solar.de
EOF

vercel env add NEXT_PUBLIC_API_URL production << 'EOF'
https://zoe-solar.de
EOF

# Analytics (placeholder)
vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production << 'EOF'
G-YOUR_PRODUCTION_GA_ID
EOF

# Site metadata
vercel env add NEXT_PUBLIC_SITE_NAME production << 'EOF'
ZOE Solar GmbH
EOF

vercel env add NEXT_PUBLIC_SITE_DESCRIPTION production << 'EOF'
Ihr Partner für nachhaltige Solarlösungen und Photovoltaik
EOF

# Feature flags
vercel env add NEXT_PUBLIC_ENABLE_BLOG production << 'EOF'
true
EOF

vercel env add NEXT_PUBLIC_ENABLE_PRODUCTS production << 'EOF'
true
EOF

vercel env add NEXT_PUBLIC_ENABLE_AI_CHAT production << 'EOF'
false
EOF

echo "All essential environment variables have been added to Vercel!"
echo "You can update the Google Analytics ID and other placeholders in the Vercel dashboard."