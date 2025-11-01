FROM node:25-bookworm-slim

ENV NODE_ENV=production \
		NPM_CONFIG_UPDATE_NOTIFIER=false \
		NPM_CONFIG_FUND=false \
		NPM_CONFIG_LEGACY_PEER_DEPS=true

# Systemabhängigkeiten für HTTPS/Fetch & Zertifikate
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates \
		curl \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Nur package-Dateien kopieren und produktive Dependencies installieren
COPY package*.json ./
RUN npm ci --omit=dev

# Projektdateien kopieren
COPY . .

# Sicherstellen, dass notwendige Verzeichnisse vorhanden sind
RUN mkdir -p server/storage logs public/assets/logos

# Dev-Abhängigkeiten bereinigen (falls über transitive Pfade installiert)
RUN npm prune --omit=dev || true

# Standardkommando: Produktdaten-Sync über Firecrawl MCP anstoßen
CMD ["npm", "run", "product-sync"]