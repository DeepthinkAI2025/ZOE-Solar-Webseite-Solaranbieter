FROM node:20-alpine

# Setze Arbeitsverzeichnis
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm ci

# Installiere Firecrawl MCP (falls verfügbar)
RUN npm install -g firecrawl-mcp || echo "Firecrawl MCP not available as npm package"

# Kopiere den Rest des Projekts
COPY . .

# Exponiere Port für Firecrawl MCP
EXPOSE 3000

# Starte Firecrawl MCP im Hintergrund und führe product-sync aus
CMD ["sh", "-c", "firecrawl-mcp start & sleep 10 && npm run product-sync"]