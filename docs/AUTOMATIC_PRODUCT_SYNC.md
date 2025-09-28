# Automatische Produkt-Synchronisation

## Übersicht

Das automatische Produkt-Synchronisationssystem führt täglich eine vollständige Synchronisation der Hersteller- und Produktdaten durch, um die Website mit den neuesten Informationen zu aktualisieren.

## Funktionen

- **Tägliche Synchronisation**: Automatische Ausführung jeden Tag um 02:00 Uhr
- **Umfassende Datenaktualisierung**: Synchronisiert alle Hersteller und Produkte
- **Fehlerbehandlung**: Robuste Fehlerbehandlung mit detaillierten Logs
- **Hintergrundbetrieb**: Läuft als Cron-Job im Hintergrund

## Verwendung

### Lokale Entwicklung

```bash
# Cron-Job starten
npm run auto-product-sync

# Manuelle Synchronisation (einmalig)
npm run product-sync
```

### Produktionsumgebung

#### Option 1: Systemd Service (Linux)

Erstelle eine Service-Datei `/etc/systemd/system/zoe-product-sync.service`:

```ini
[Unit]
Description=ZOE Solar Product Sync
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/your/app
ExecStart=/usr/bin/npm run auto-product-sync
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Service aktivieren und starten
sudo systemctl enable zoe-product-sync
sudo systemctl start zoe-product-sync
sudo systemctl status zoe-product-sync
```

#### Option 2: PM2 Process Manager

```bash
# PM2 installieren (falls nicht vorhanden)
npm install -g pm2

# Cron-Job als PM2-Prozess starten
pm2 start npm --name "zoe-product-sync" -- run auto-product-sync

# PM2 Konfiguration speichern
pm2 save
pm2 startup
```

#### Option 3: Docker Container

```yaml
# docker-compose.yml
version: '3.8'
services:
  product-sync:
    build: .
    command: npm run auto-product-sync
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

#### Option 4: Cloud Scheduler (z.B. Google Cloud Scheduler, AWS EventBridge)

Konfiguriere einen Cloud Scheduler, der täglich eine HTTP-Anfrage an deinen Server sendet oder einen Container-Job ausführt.

## Konfiguration

### Cron-Schedule anpassen

Bearbeite `scripts/auto-product-sync.js`:

```javascript
// Ändere den Schedule (aktuell: 0 2 * * * = täglich 02:00)
cron.schedule('0 2 * * *', () => { // jeden Tag um 02:00
cron.schedule('0 */6 * * *', () => { // alle 6 Stunden
cron.schedule('0 9 * * 1', () => { // jeden Montag um 09:00
```

### Zeitzone

```javascript
timezone: "Europe/Berlin" // An deine Zeitzone anpassen
```

## Monitoring

### Logs überwachen

```bash
# PM2 Logs
pm2 logs zoe-product-sync

# Systemd Logs
sudo journalctl -u zoe-product-sync -f

# Docker Logs
docker logs -f container-name
```

### Health Checks

Falls du einen Health-Check-Endpunkt brauchst, kannst du das erweiterte Server-Skript verwenden:

```javascript
// Zusätzliche Endpoints für Monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'OK', lastSync: new Date().toISOString() });
});
```

## Datenstruktur

Die Synchronisation aktualisiert folgende Dateien:

- `server/storage/products.live.json` - Live-Produktdaten
- `server/storage/asset-whitelist.json` - Erlaubte Assets
- Verschiedene Cache-Dateien für Performance

## Fehlerbehebung

### Häufige Probleme

1. **Firecrawl nicht verfügbar**: Überprüfe `FIRECRAWL_MCP_ENDPOINT`
2. **Zeitzonenprobleme**: Stelle sicher, dass die Server-Zeitzone korrekt ist
3. **Speicherprobleme**: Bei großen Datenmengen RAM erhöhen
4. **Netzwerk-Timeouts**: Timeout-Werte in der Konfiguration anpassen

### Debug-Modus

```bash
# Mit Debug-Ausgabe
DEBUG=* npm run product-sync
```

## Sicherheit

- Führe den Cron-Job mit minimalen Berechtigungen aus
- Verwende Umgebungsvariablen für sensible Konfigurationen
- Regelmäßige Überprüfung der Logs auf Anomalien
- Backup der Produktdaten vor jeder Synchronisation

## Erweiterte Konfiguration

### Mehrere Synchronisationszeiten

```javascript
// Mehrere Cron-Jobs
cron.schedule('0 2 * * *', () => { /* Tägliche Sync */ });
cron.schedule('0 */4 * * *', () => { /* Alle 4 Stunden */ });
```

### Bedingte Synchronisation

```javascript
// Nur synchronisieren wenn Änderungen vorhanden
if (await checkForUpdates()) {
  runProductSync();
}
```