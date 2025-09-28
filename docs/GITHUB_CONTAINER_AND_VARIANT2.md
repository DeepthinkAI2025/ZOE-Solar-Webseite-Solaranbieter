# Anleitung: GitHub Container Registry und Variante 2

## GitHub Container Registry nutzen
Die GitHub Container Registry (GHCR) ist eine kostenlose Möglichkeit, Docker-Images zu speichern und zu verwalten. Hier sind die Schritte, um ein Image zu veröffentlichen:

### Voraussetzungen
- GitHub CLI (`gh`) installiert
- Docker installiert und konfiguriert
- Zugriff auf ein GitHub-Repository

### Schritte zur Veröffentlichung eines Images
1. **Einloggen in die GitHub Container Registry:**
   ```bash
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   ```
   Ersetze `USERNAME` durch deinen GitHub-Benutzernamen.

2. **Docker-Image bauen:**
   ```bash
   docker build -t ghcr.io/<OWNER>/<IMAGE_NAME>:<TAG> .
   ```
   - `<OWNER>`: GitHub-Organisation oder Benutzername
   - `<IMAGE_NAME>`: Name des Images
   - `<TAG>`: Versionstag (z. B. `latest`)

3. **Image pushen:**
   ```bash
   docker push ghcr.io/<OWNER>/<IMAGE_NAME>:<TAG>
   ```

4. **Image verwenden:**
   - In GitHub Actions: `ghcr.io/<OWNER>/<IMAGE_NAME>:<TAG>`

---

## Variante 2: Docker-Image im Workflow bauen
Wenn kein öffentliches Docker-Image verfügbar ist, kann das Image direkt im GitHub Actions Workflow gebaut werden.

### Beispiel-Workflow (Stand: automatischer Product-Sync)
```yaml
name: Daily product-sync

on:
  schedule:
    - cron: '15 3 * * *' # Täglich um 03:15 UTC (05:15 MEZ)
  workflow_dispatch: {}

jobs:
  product-sync:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Prepare workspace directories
        run: |
          mkdir -p server/storage
          mkdir -p public/assets/logos
          mkdir -p logs

      - name: Build product-sync container
        run: docker build -t product-sync-runner -f Dockerfile .

      - name: Run Firecrawl product sync
        env:
          FIRECRAWL_MCP_ENDPOINT: https://api.firecrawl.dev/v1/scrape
          FIRECRAWL_MCP_API_KEY: ${{ secrets.FIRECRAWL_MCP_API_KEY }}
        run: |
          set -o pipefail
          docker run --rm \
            -e FIRECRAWL_MCP_ENDPOINT="$FIRECRAWL_MCP_ENDPOINT" \
            -e FIRECRAWL_MCP_API_KEY="$FIRECRAWL_MCP_API_KEY" \
            -v "${{ github.workspace }}/server/storage:/app/server/storage" \
            -v "${{ github.workspace }}/public/assets/logos:/app/public/assets/logos" \
            -v "${{ github.workspace }}/logs:/app/logs" \
            product-sync-runner 2>&1 | tee logs/product-sync.log

      - name: Upload sync logs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: product-sync-log
          path: |
            logs/product-sync.log
            server/storage/products.live.json
```

### Erklärung
1. **Docker-Image bauen:**
   - Der Schritt `Build Docker Image` erstellt das Image direkt im Workflow.
2. **Container ausführen:**
  - Der Schritt `Run Firecrawl product sync` startet den Container auf Basis des lokalen `Dockerfile` und führt darin `npm run product-sync` aus. Alle benötigten Pfade (`server/storage`, Logos, Logs) werden via Volume in den Runner gespiegelt.
  - Falls der Firecrawl-Endpoint nicht erreichbar ist oder keine Daten liefert, greift – sofern `SERVER_GEMINI_API_KEY` konfiguriert ist – automatisch ein Gemini-Fallback, das die Herstellerseite per LLM analysiert und Produkte extrahiert.
3. **Artefakte sichern:**
  - Logs sowie das aktualisierte `server/storage/products.live.json` werden als Workflow-Artefakt hochgeladen.

### Vorteile
- Kein externer Speicher für das Image erforderlich.
- Flexibel und direkt im CI/CD-Prozess integriert.

---

## Fazit
- Verwende die GitHub Container Registry, wenn das Image wiederverwendet werden soll.
- Nutze Variante 2, wenn das Image nur für den Workflow benötigt wird.