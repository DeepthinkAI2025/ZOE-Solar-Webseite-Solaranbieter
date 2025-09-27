# Setup: GitHub Secrets & Scheduled Product-Sync

Dieses Dokument erklärt, wie die Secrets konfiguriert werden und bestätigt, dass der tägliche Product-Sync unabhängig vom Vercel-Deployment ausgeführt wird.

## Voraussetzungen
- Du hast Admin-Rechte im Repository `DeepthinkAI2025/ZOE-Solar-Webseite-Solaranbieter`.
- `gh` (GitHub CLI) ist optional, Web-UI funktioniert ebenfalls.

## 1) Repository Secret setzen (Web UI)
1. Öffne das Repository → Settings → Secrets and variables → Actions → New repository secret
2. Name: `FIRECRAWL_MCP_API_KEY`
3. Value: `<DEIN_API_KEY>` (z. B. `fc-de7f726043a4457c92193028581ead59`)
4. Save

> Tipp: Für Produktions-Keys kannst du zusätzlich ein `production` Environment anlegen und dort das Secret hinterlegen. Jobs, die `environment: production` verwenden, nutzen dann diese Secrets.

## 2) Repository Secret setzen (GitHub CLI)
```bash
# Beispiel: setze Repository Secret
echo -n "fc-de7f726043a4457c92193028581ead59" | gh secret set FIRECRAWL_MCP_API_KEY --repo DeepthinkAI2025/ZOE-Solar-Webseite-Solaranbieter

# Optional: env-scoped
echo -n "fc-de7f726043a4457c92193028581ead59" | gh secret set FIRECRAWL_MCP_API_KEY --repo DeepthinkAI2025/ZOE-Solar-Webseite-Solaranbieter --env production
```

## 3) Cron-Workflow: Wie und wann er läuft
- Die Datei `.github/workflows/product-sync.yml` ist bereits im Repo und enthält eine `schedule`-Trigger (Standard: `15 3 * * *` UTC → täglich um 03:15 UTC).
- GitHub Actions läuft unabhängig von Vercel. Das heißt:
  - Der Workflow startet automatisch in GitHub-Runnern, die GitHub bereitstellt. Dein lokaler Rechner oder Vercel müssen nicht laufen.
  - Der Workflow kann temporär einen Firecrawl-Container starten (im Runner), `npm run product-sync` ausführen und die Ergebnisse an euer Backend pushen.

## 4) Verifikation nach Secret-Setup
1. Öffne: Actions → `Daily product-sync` → Run history
2. Starte manuell: `Run workflow` (rechts oben) → wähle Branch `main` → Run workflow
3. Prüfe Logs: der Step `Run product sync` sollte mit 0 exit code enden.

## 5) Vercel Integration
- Vercel hostet euer Frontend-Static-Build. Die GitHub Actions-Job ist unabhängig — er aktualisiert Backend-Daten (z. B. `server/storage/products.live.json`) oder ruft euer Admin-API auf.
- Optional: Workflow kann nach erfolgreichem Sync ein kurzes `curl` an Vercel's Revalidate/Deploy-Webhook senden, um Caches zu invalidieren oder Preview-Deploys zu triggern.

## 6) Troubleshooting
- Action fails: Prüfe Actions logs → meistens Health-Probe oder fehlende Secrets.
- Firecrawl-Container startet nicht: Stelle sicher, dass das Image im Workflow vorhanden ist oder die `build`-Variante verwendet wird.

---

Wenn du willst, schreibe ich jetzt noch ein kleines `scripts/set-github-secrets.sh` Template, das du lokal ausführen kannst (benötigt `gh` und angemeldeten Benutzer).