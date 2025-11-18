# SEO Monitoring System für ZOE Solar

Dieses System überwacht kontinuierlich die Suchmaschinen-Performance von ZOE Solar und stellt die Daten in einem interaktiven Dashboard dar.

## 🚀 Features

### 📊 Dashboard (`/seo-monitoring`)
- **Keyword Rankings**: Verfolgung wichtiger Suchbegriffe und deren Positionen
- **Core Web Vitals**: LCP, FID, CLS Metriken in Echtzeit
- **Strukturierte Daten**: Validierung von Schema.org Markup
- **Backlink-Profil**: Überwachung der Link-Popularität
- **AI-Suchmaschinen**: Sichtbarkeit in Google Bard, ChatGPT, Perplexity, Bing AI

### 🤖 Automatische Überwachung
- **Tägliche Reports**: GitHub Actions sammelt täglich um 8:00 MEZ neue Daten
- **Alert-System**: Benachrichtigungen bei signifikanten Ranking-Verlusten
- **Historische Daten**: 7 Tage Verlauf für Trend-Analysen

## 📁 Dateistruktur

```
data/seo-monitoring/
├── seo-report-2025-09-25.json    # Tägliche Reports
├── latest-summary.json           # Aktuellste Daten für Dashboard
└── latest-alerts.json            # Aktuelle Alerts

scripts/
├── seo-monitoring.cjs            # Haupt-Monitoring Script
└── seo-alerts.cjs                # Alert-System

.github/workflows/
└── seo-monitoring.yml            # GitHub Actions Workflow
```

## 🛠️ Verwendung

### Manuelles Monitoring
```bash
# Einzelne Metriken sammeln
npm run seo-monitor

# Alerts überprüfen
npm run seo-alerts
```

### Dashboard aufrufen
Besuche `/seo-monitoring` auf der Website, um das interaktive Dashboard zu sehen.

## ⚙️ Konfiguration

### Keywords überwachen
Bearbeite `scripts/seo-monitoring.cjs` und aktualisiere das `CONFIG.keywords` Array:

```javascript
keywords: [
  'Agri-PV Deutschland',
  'Photovoltaik Landwirtschaft',
  'Solaranlage Brandenburg',
  // ... weitere Keywords
]
```

### Alert-Schwellen
Passe die Alert-Parameter in `scripts/seo-alerts.cjs` an:

```javascript
alertThresholds: {
  rankingDrop: 5,     // Alert bei 5+ Positionen Verlust
  backlinksLost: 3,   // Alert bei 3+ verlorenen Backlinks
  coreWebVitals: {
    lcp: 3.0,        // Alert bei LCP > 3s
    fid: 200,        // Alert bei FID > 200ms
    cls: 0.2         // Alert bei CLS > 0.2
  }
}
```

## 🔧 Technische Details

### Datenquellen
- **Rankings**: Simuliert (in Produktion: SERP APIs wie Google Search Console, SEMrush, Ahrefs)
- **Core Web Vitals**: Simuliert (in Produktion: Google PageSpeed Insights API, Web Vitals Library)
- **Strukturierte Daten**: Live-Validierung der Website
- **Backlinks**: Simuliert (in Produktion: Ahrefs, Moz, Majestic APIs)
- **AI-Search**: Simuliert (in Produktion: Brand Monitoring Tools)

### Erweiterungen
Für den Produktiveinsatz sollten folgende APIs integriert werden:
- **Google Search Console API** für echte Ranking-Daten
- **PageSpeed Insights API** für Core Web Vitals
- **Ahrefs/Moz APIs** für Backlink-Daten
- **Brand Monitoring Tools** für AI-Suchmaschinen

## 📈 Dashboard Features

### Rankings-Tabelle
- Position, Trend-Indikatoren, Suchvolumen
- Farbkodierung: Grün (1-3), Gelb (4-10), Rot (11+)

### Core Web Vitals
- Echtzeit-Anzeige mit Soll-Werten
- Automatische Bewertung (Good/Needs Improvement/Poor)

### Zeitraum-Filter
- 7 Tage, 30 Tage, 90 Tage Ansichten
- Trend-Analysen und Vergleiche

### Alert-Integration
- Dashboard zeigt aktive Alerts an
- Historische Alert-Daten verfügbar

## 🚨 Alert-System

Das System überwacht kontinuierlich:
- **Ranking-Verluste**: Signifikante Positionsverschlechterungen
- **Core Web Vitals**: Performance-Probleme
- **Backlink-Verluste**: Negative Veränderungen im Link-Profil

Alerts werden in der GitHub Actions Summary angezeigt und in `latest-alerts.json` gespeichert.

## 🔄 Automatisierung

### GitHub Actions
Das Monitoring läuft täglich automatisch:
- **Zeitplan**: Täglich 8:00 MEZ
- **Manueller Start**: Über GitHub Actions Tab möglich
- **Berichterstattung**: Automatische Commits mit neuen Daten

### Daten-Updates
- Neue Reports werden automatisch committed
- Dashboard lädt Daten aus `latest-summary.json`
- Historische Daten bleiben für Analysen erhalten

## 📊 Berichte

### Tägliche Zusammenfassung
Jeder Report enthält:
- Zeitstempel der Messung
- Alle überwachten Metriken
- Vergleich mit Vortag
- Alert-Status

### Dashboard-Integration
Das Dashboard zeigt:
- Aktuelle Werte aller Metriken
- Trend-Indikatoren
- Historische Vergleiche
- Handlungsempfehlungen

## 🔐 Sicherheit

- Monitoring-Daten sind öffentlich (keine sensiblen Informationen)
- API-Keys sollten als GitHub Secrets gespeichert werden
- Dashboard ist nicht für Suchmaschinen indexiert (`noindex,nofollow`)

## 📈 Nächste Schritte

1. **API-Integration**: Echte Datenquellen anstatt simulierter Daten
2. **Erweiterte Alerts**: E-Mail/Slack-Benachrichtigungen
3. **Mehr Metriken**: Local Pack Rankings, Featured Snippets
4. **Reporting**: Monatliche PDF-Reports generieren
5. **A/B-Testing**: SEO-Experimente tracken

---

**Hinweis**: Dieses System verwendet derzeit simulierte Daten für Demonstration. Für den Produktiveinsatz müssen echte APIs integriert werden.