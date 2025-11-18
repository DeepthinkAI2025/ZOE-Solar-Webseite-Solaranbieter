# 🚀 TeraBox + Notion Bidirectional Sync - Universal Starter Kit

**State-of-the-Art bidirectional synchronization between a specific TeraBox folder and Notion workspace with AI-powered file analysis**

## 📋 Inhaltsverzeichnis

- [✨ Features](#-features)
- [🎯 Use Cases](#-use-cases)
- [🏗️ Architektur](#️-architektur)
- [🛠️ Schnellstart](#️-schnellstart)
- [⚙️ Konfiguration](#️-konfiguration)
- [🔄 Sync Modi](#-sync-modi)
- [🤖 OCR Integration](#-ocr-integration)
- [🔧 Konfliktlösung](#-konfliktlösung)
- [📊 Monitoring](#-monitoring)
- [🔒 Sicherheit](#-sicherheit)
- [🐛 Fehlerbehebung](#-fehlerbehebung)

## ✨ Features

### 🔄 **Bidirektionale Synchronisation**
- **Spezifischer Ordner**: Nur ein ausgewählter TeraBox-Ordner wird synchronisiert
- **Spezifischer Workspace**: Nur ein ausgewählter Notion-Workspace wird verwendet
- **Echtzeit-Updates**: Änderungen werden sofort in beide Richtungen synchronisiert
- **Automatische Konfliktlösung**: Intelligente Lösung bei gleichzeitigen Änderungen

### 🤖 **KI-gestützte Dateianalyse**
- **DeepSeek OCR Integration**: Kostenlose Texterkennung für Dokumente
- **Automatische Kategorisierung**: Intelligente Sortierung basierend auf Inhalt
- **Extrahierte Daten**: Beträge, Daten, Rechnungsnummern werden automatisch erkannt
- **Spracherkennung**: Unterstützt Deutsch, Englisch und weitere Sprachen

### 📁 **Intelligente Dateiverwaltung**
- **Automatische Ordnerstruktur**: Dateien werden basierend auf Inhalt sortiert
- **Smart Tags**: Automatische Verschlagwortung
- **Volltextsuche**: Suche über alle extrahierten Inhalte
- **Metadaten-Management**: Umfassende Datei-Informationen

### 🌐 **Web-basiertes Interface**
- **Setup-Assistent**: Grafische Einrichtung der Synchronisation
- **Monitoring Dashboard**: Echtzeit-Status und Metriken
- **Konfliktmanagement**: Manuelle Konfliktlösung bei Bedarf
- **Health Monitoring**: Systemüberwachung und Benachrichtigungen

## 🎯 Use Cases

### 🏢 **Business & Finance**
- **Rechnungs-Management**: Automatische Sortierung und Extraktion von Rechnungsdaten
- **Vertrags-Verwaltung**: Intelligente Organisation von Verträgen und Dokumenten
- **Beleg-Verarbeitung**: Automatische Erfassung von Quittungen und Belegen
- **Bank-Dokumente**: Strukturierte Ablage von Kontoauszügen

### 👥 **Team Collaboration**
- **Gemeinsame Datei-Workspaces**: Sync von Team-Dokumenten
- **Versionskontrolle**: Vermeidung von Konflikten bei Team-Arbeit
- **Bereitstellung**: Dateien automatisch im richtigen Workspace verfügbar
- **Zugriffssteuerung**: Beschränkung auf spezifische Ordner und Workspaces

### 🎨 **Content Management**
- **Medien-Bibliotheken**: Organisation von Bildern, Videos, Dokumenten
- **Web-Integration**: Direct Links für die Verwendung in Webseiten
- **SEO-Optimierung**: Automatische Alt-Texte und Metadaten
- **Asset-Management**: Zentrale Verwaltung aller Digital Assets

## 🏗️ Architektur

```
📁 TeraBox Ordner "Terabox Cloud Storage und Notion CMS"
         ↕️ (Bidirectional Sync Engine)
🗃️ Notion Workspace mit spezifischer Datenbank
         ↕️ (Change Detection & Conflict Resolution)
🤖 DeepSeek OCR für KI-Analyse
         ↕️ (Automatische Kategorisierung)
📊 Web Dashboard für Monitoring & Management
```

### **Core Components**

1. **TeraBox Client**: API-Anbindung mit Fokus auf spezifischen Ordner
2. **Notion Client**: Workspace-spezifische Datenbank-Verwaltung
3. **Sync Engine**: Bidirektionale Synchronisations-Logik
4. **Conflict Resolver**: Intelligente Konfliktlösung
5. **OCR Integration**: DeepSeek OCR für Dokumentenanalyse
6. **Web Interface**: Setup, Monitoring und Management

## 🛠️ Schnellstart

### 1. **Voraussetzungen**

```bash
# Node.js 18+ benötigt
node --version

# Installation der Abhängigkeiten
npm install
```

### 2. **Setup starten**

```bash
# Build des Projekts
npm run build

# Setup-Assistent starten
npm run setup

# Oder direkt das Web-Interface öffnen
open setup/workspace-selector.html
```

### 3. **Konfiguration über Web-Interface**

1. **TeraBox Konfiguration**:
   - Benutzername und Passwort eingeben
   - Ziel-Ordner festlegen (Standard: `/Terabox Cloud Storage und Notion CMS`)
   - Verbindung testen

2. **Notion Konfiguration**:
   - Notion Integration Token erstellen und eingeben
   - Workspace-ID angeben
   - Datenbank-Name festlegen

3. **Sync-Einstellungen**:
   - Sync-Modus wählen
   - Konfliktlösungs-Strategie festlegen
   - OCR aktivieren (optional)

### 4. **Start der Synchronisation**

```bash
# Start des Sync-Systems
npm start

# Oder mit spezifischer Konfigurationsdatei
npm start -- --config ./config/my-config.json
```

### 5. **Monitoring Dashboard**

Nach dem Start ist das Monitoring verfügbar unter:
```
http://localhost:3000
```

## ⚙️ Konfiguration

### **Environment Variables**

```bash
# TeraBox Konfiguration
TERABOX_BASE_URL=https://nephobox.com
TERABOX_USERNAME=your-username
TERABOX_PASSWORD=your-password
TERABOX_TARGET_FOLDER=/Terabox Cloud Storage und Notion CMS
TERABOX_WATCH_SUBFOLDERS=true

# Notion Konfiguration
NOTION_TOKEN=secret_...
NOTION_WORKSPACE_ID=your-workspace-id
NOTION_DATABASE_NAME=TeraBox File Sync
NOTION_RESTRICT_TO_WORKSPACE=true

# Sync Konfiguration
SYNC_MODE=bidirectional
CONFLICT_RESOLUTION=latest_wins
SYNC_AUTO_RETRY=true

# OCR Konfiguration
OCR_ENABLED=true
OCR_BASE_URL=https://your-deepseek-ocr-space.hf.space
OCR_LANGUAGES=de,en

# Logging
LOG_LEVEL=info
LOG_FILE=sync.log
```

### **Konfigurationsdatei**

`config/sync-config.json` enthält alle Einstellungen:

```json
{
  "terabox": {
    "baseURL": "https://nephobox.com",
    "targetFolder": "/Terabox Cloud Storage und Notion CMS",
    "watchSubfolders": true,
    "pollingInterval": 30000
  },
  "notion": {
    "token": "secret_...",
    "workspaceId": "your-workspace-id",
    "databaseName": "TeraBox File Sync",
    "restrictToWorkspace": true
  },
  "sync": {
    "mode": "bidirectional",
    "conflictResolution": "latest_wins",
    "autoRetry": true
  },
  "ocr": {
    "enabled": true,
    "baseURL": "https://your-deepseek-ocr-space.hf.space",
    "languages": ["de", "en"]
  }
}
```

## 🔄 Sync Modi

### **Bidirectional (Vollautomatisch)**
- Änderungen in TeraBox → Notion
- Änderungen in Notion → TeraBox
- Vollautomatische Konfliktlösung

### **TeraBox → Notion**
- Nur einseitige Synchronisation
- TeraBox ist primäre Datenquelle
- Keine Änderungen von Notion übernehmen

### **Notion → TeraBox**
- Nur einseitige Synchronisation
- Notion ist primäre Datenquelle
- Keine Änderungen von TeraBox übernehmen

## 🤖 OCR Integration

### **Unterstützte Dateitypen**
- **PDF-Dokumente**: Texterkennung und Tabellenextraktion
- **Bilder**: JPG, PNG, TIFF, BMP, GIF
- **Größe**: Bis zu 50MB pro Datei

### **Extrahierte Daten**
- **Text**: Vollständiger Textinhalt
- **Daten**: Datumserkennung in verschiedenen Formaten
- **Beträge**: Finanzielle Informationen mit Währungen
- **Rechnungsnummern**: Automatische Erkennung
- **Firmen**: Unternehmensnamen und Logos

### **Sprachen**
- **Deutsch**: Optimiert für deutsche Dokumente
- **Englisch**: Umfassende Unterstützung
- **Auto**: Automatische Spracherkennung

### **DeepSeek OCR Setup**

```bash
# DeepSeek OCR Starter Kit kopieren
cp -r ../deepseek-ocr-starter-kit ./deepseek-ocr

# OCR Service starten
cd deepseek-ocr
python app.py

# Oder auf HuggingFace Spaces deployen
# Siehe deepseek-ocr-starter-kit/README.md
```

## 🔧 Konfliktlösung

### **Konflikt-Typen**

1. **Simultaneous Edit**: Datei in beiden Systemen geändert
2. **Delete Conflict**: In einem System gelöscht, im anderen geändert
3. **Move Conflict**: In beide Systeme verschoben
4. **Hash Mismatch**: Unterschiedlicher Inhalt bei gleichem Namen
5. **Naming Conflict**: Gleichnamige Dateien mit unterschiedlichem Inhalt

### **Lösungs-Strategien**

1. **Latest Wins**: Neueste Version gewinnt
2. **TeraBox Wins**: TeraBox Version hat Priorität
3. **Notion Wins**: Notion Version hat Priorität
4. **Keep Both**: Beide Versionen behalten
5. **Manual Resolve**: Manuelle Lösung erforderlich

### **Automatische Lösung**

- **Zeitstempel-basiert**: Neueste Änderung gewinnt
- **Intelligent**: Kontextabhängige Entscheidung
- **Benachrichtigung**: Bei kritischen Konflikten benachrichtigen

## 📊 Monitoring

### **Web Dashboard**

```bash
# Monitoring Dashboard starten
npm run monitor

# Oder automatisch nach Start
# http://localhost:3000
```

### **Metriken**

- **Sync Status**: Erfolgreiche/fehlgeschlagene Operationen
- **OCR Stats**: Verarbeitete Dateien, Konfidenz, Queue-Status
- **Performance**: Durchschnittliche Sync-Zeit, Erfolgsrate
- **Storage**: Speichernutzung in beiden Systemen

### **Health Check**

```bash
# System-Status prüfen
curl http://localhost:3000/health

# Detaillierte Metriken
curl http://localhost:3000/metrics
```

### **Benachrichtigungen**

- **Webhooks**: Externe Benachrichtigungen
- **Email**: Fehler- und Status-Benachrichtigungen
- **In-App**: Dashboard-Benachrichtigungen

## 🔒 Sicherheit

### **Anmeldeinformationen**
- **Verschlüsselte Speicherung**: Passwörter und Tokens lokal verschlüsselt
- **Keine Cloud-Übertragung**: Credentials verlassen das System nicht
- **API-Key Rotation**: Unterstützung für regelmäßige Key-Änderungen

### **Daten-Sicherheit**
- **Lokale Verarbeitung**: OCR-Analyse läuft lokal
- **SSL/TLS**: Verschlüsselte Kommunikation
- **Access Control**: Beschränkung auf spezifische Ordner/Workspaces

### **Privacy**
- **Keine Telemetrie**: Keine Nutzungsdatenerfassung
- **Open Source**: Vollständiger Code-Transparenz
- **Self-Hosted**: Volle Kontrolle über Ihre Daten

## 🐛 Fehlerbehebung

### **Häufige Probleme**

#### **TeraBox Connection Issues**
```bash
# Verbindung testen
curl -I https://nephobox.com

# Credentials prüfen
# Falls API nicht verfügbar: Browser-Automation prüfen
```

#### **Notion API Issues**
```bash
# Token überprüfen
# Notion Integration permissions prüfen
# Workspace-Zugriff verifizieren
```

#### **OCR Processing Issues**
```bash
# DeepSeek OCR Service prüfen
curl http://localhost:7860/health

# Dateigröße prüfen (max 50MB)
# Unterstützte Formate verifizieren
```

### **Logs**

```bash
# Sync Logs
tail -f sync.log

# Debug Modus starten
LOG_LEVEL=debug npm start

# OCR Queue Status
curl http://localhost:3000/metrics
```

### **Performance**

```bash
# Sync Performance optimieren
# pollingInterval erhöhen
# batchSize anpassen
# OCR für große Dateien deaktivieren
```

## 📁 Projektstruktur

```
terabox-notion-bidirectional-sync/
├── src/
│   ├── core/                    # Core Komponenten
│   │   ├── terabox-client.ts    # TeraBox API
│   │   ├── notion-client.ts     # Notion API
│   │   ├── sync-engine.ts       # Bidirectional Sync
│   │   ├── conflict-resolver.ts # Konfliktlösung
│   │   └── ocr-integration.ts   # OCR Integration
│   └── index.ts                 # Main Entry Point
├── config/                      # Konfigurations-Dateien
│   ├── sync-config.template.json
│   └── classification-rules.json
├── setup/                       # Setup Interface
│   └── workspace-selector.html
├── monitoring/                  # Web Dashboard
├── docs/                        # Dokumentation
└── scripts/                     # Utilities
```

## 🤝 Contributing

1. **Fork** das Repository
2. **Feature Branch** erstellen: `git checkout -b feature/amazing-feature`
3. **Changes** committen: `git commit -m 'Add amazing feature'`
4. **Push** to Branch: `git push origin feature/amazing-feature`
5. **Pull Request** erstellen

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/terabox-notion-bidirectional-sync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/terabox-notion-bidirectional-sync/discussions)
- **Wiki**: [Dokumentation](https://github.com/your-username/terabox-notion-bidirectional-sync/wiki)

---

**🎉 Vielen Dank für die Nutzung des TeraBox + Notion Bidirectional Sync Starter-Kits!**

Made with ❤️ für die Open Source Community