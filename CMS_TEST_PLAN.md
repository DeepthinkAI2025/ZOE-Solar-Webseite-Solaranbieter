# 🧪 Funktions-Tests für ZOE Solar Notion CMS

## 🎯 Test-Plan nach Notion-Integration

### Schritt 1: Notion-Setup validieren
```bash
# Test 1: API-Verbindung prüfen
curl -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
     -H "Notion-Version: 2022-06-28" \
     "https://api.notion.com/v1/users/me"

# Erwartung: JSON-Response mit Benutzer-Informationen
```

```bash
# Test 2: Datenbank-Zugriff prüfen
curl -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
     -H "Notion-Version: 2022-06-28" \
     "https://api.notion.com/v1/databases/YOUR_BLOG_DB_ID"

# Erwartung: JSON-Response mit Datenbank-Struktur
```

### Schritt 2: Lokale Tests

#### 2.1 Setup-Script testen
```bash
# 1. Environment-Datei erstellen
cp .env.example .env.local
# Befülle alle Felder mit deinen echten Notion-Daten

# 2. Setup ausführen
chmod +x scripts/setup.sh
./scripts/setup.sh --check-only  # Nur System-Checks

# 3. Vollständiges Setup
./scripts/setup.sh
```

#### 2.2 Build-Test durchführen
```bash
# 1. Dependencies installieren
npm install

# 2. TypeScript-Check
npx tsc --noEmit

# 3. Build-Test
npm run build

# 4. Linting
npm run lint
```

### Schritt 3: Entwicklungsumgebung starten

#### 3.1 Lokaler Server
```bash
# Development-Server starten
npm run dev

# Browser öffnen: http://localhost:3000
```

#### 3.2 API-Tests im Browser
Gehe zu folgenden URLs und prüfe, ob Daten geladen werden:

**Blog-Tests:**
- `http://localhost:3000/api/notion/blog`
- `http://localhost:3000/api/notion/blog?category=Solar`
- `http://localhost:3000/api/notion/blog?featured=true`

**Produkt-Tests:**
- `http://localhost:3000/api/notion/products`
- `http://localhost:3000/api/notion/products?category=Photovoltaik`
- `http://localhost:3000/api/notion/products?featured=true`

**FAQ-Tests:**
- `http://localhost:3000/api/notion/faq`
- `http://localhost:3000/api/notion/faq?category=Installation`

**Weitere APIs:**
- `http://localhost:3000/api/notion/team`
- `http://localhost:3000/api/notion/locations`
- `http://localhost:3000/api/notion/gallery`

#### 3.3 Erwartete Responses
**Erfolgreiche Response (200 OK):**
```json
{
  "results": [
    {
      "object": "page",
      "id": "...",
      "created_time": "...",
      "properties": {
        "Title": {
          "title": [
            {
              "text": {
                "content": "Test-Artikel"
              }
            }
          ]
        }
        // ... weitere Eigenschaften
      }
    }
  ],
  "has_more": false,
  "next_cursor": null
}
```

**Fehler-Response (404/500):**
```json
{
  "error": "Datenbank nicht gefunden",
  "details": "Invalid database ID"
}
```

### Schritt 4: Frontend-Komponenten testen

#### 4.1 Blog-Seite testen
1. Gehe zu `http://localhost:3000/blog`
2. Prüfe ob Artikel geladen werden
3. Teste Kategorie-Filter
4. Teste "Featured"-Filter
5. Prüfe Paginierung (falls implementiert)

#### 4.2 Produkt-Seite testen
1. Gehe zu `http://localhost:3000/produkte`
2. Prüfe ob Produkte geladen werden
3. Teste Kategorie-Filter
4. Prüfe Featured-Produkte
5. Teste Preisanzeige

#### 4.3 FAQ-Seite testen
1. Gehe zu `http://localhost:3000/faq`
2. Prüfe ob Fragen geladen werden
3. Teste Kategorie-Filter
4. Teste Suchfunktion (falls implementiert)
5. Prüfe Accordion/Expand-Funktion

#### 4.4 Team-Seite testen
1. Gehe zu `http://localhost:3000/team`
2. Prüfe ob Team-Mitglieder geladen werden
3. Teste Abteilungs-Filter
4. Prüfe Profilbilder
5. Teste Kontakt-Informationen

#### 4.5 Standorte-Seite testen
1. Gehe zu `http://localhost:3000/standorte`
2. Prüfe ob Standorte geladen werden
3. Teste Region-Filter
4. Prüfe Kontakt-Informationen
5. Teste Karte-Integration (falls implementiert)

### Schritt 5: Cache-Tests

#### 5.1 Cache-Funktionalität prüfen
```bash
# 1. Erste Anfrage (Cache-Miss)
curl http://localhost:3000/api/notion/blog
# Notiere Response-Zeit

# 2. Zweite Anfrage (Cache-Hit)
curl http://localhost:3000/api/notion/blog
# Response-Zeit sollte deutlich schneller sein
```

#### 5.2 Cache-Invalidierung testen
```bash
# 1. Erstelle neuen Blog-Artikel in Notion
# 2. Prüfe ob er sofort in der API erscheint
curl http://localhost:3000/api/notion/blog
```

### Schritt 6: Webhook-Tests (falls eingerichtet)

#### 6.1 Webhook-Endpoint testen
```bash
# Test-Webhook senden
curl -X POST http://localhost:3000/api/webhooks/notion \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "test-event-123",
    "event_type": "page.created",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "data": {
      "object": "page",
      "id": "test-page-id"
    }
  }'

# Erwartung: 200 OK mit Cache-Invalidierung
```

### Schritt 7: Performance-Tests

#### 7.1 Core Web Vitals prüfen
Öffne die Browser-Konsole (F12) und gehe zu "Lighthouse":
1. Führe Lighthouse-Audit durch
2. Prüfe Performance-Score (sollte >90 sein)
3. Prüfe Core Web Vitals:
   - LCP < 2.5s
   - FID < 100ms  
   - CLS < 0.1

#### 7.2 Bundle-Größe prüfen
```bash
# Build-Größe analysieren
npm run build
npx @next/bundle-analyzer

# Erwartung: JS-Bundle < 250KB (konfiguriert in .env)
```

### Schritt 8: Security-Tests

#### 8.1 API-Schlüssel-Schutz prüfen
```bash
# Ohne API-Schlüssel (sollte 401/403 zurückgeben)
curl http://localhost:3000/api/notion/blog

# Mit falschem Schlüssel
curl -H "Authorization: Bearer invalid-key" \
     http://localhost:3000/api/notion/blog
```

#### 8.2 Rate-Limiting testen
```bash
# Mehrere schnelle Anfragen senden
for i in {1..10}; do
  curl http://localhost:3000/api/notion/blog &
done
# Prüfe ob Rate-Limiting aktiviert wird
```

### Schritt 9: Error-Handling-Tests

#### 9.1 Fehlende Datenbanken
1. Lösche eine Datenbank-ID aus .env.local
2. Versuche auf die entsprechende Seite zuzugreifen
3. Prüfe Error-Handling und Fallback-Messages

#### 9.2 Notion-API-Fehler simulieren
```bash
# Setze ungültige API-Key in .env.local
# Starte Server neu
# Prüfe Error-Handling
```

### Schritt 10: Deployment-Test

#### 10.1 Vercel-Deployment
```bash
# Vercel-Setup
vercel login
vercel link

# Build für Production
npm run build

# Deployment testen
vercel --prod

# Erwartung: Erfolgreiche URL
```

#### 10.2 Live-Website testen
1. Öffne die Live-URL
2. Teste alle Seiten
3. Prüfe Performance (Lighthouse)
4. Teste API-Endpunkte
5. Prüfe Mobile-Responsivität

---

## 📋 Test-Checkliste

### Grundfunktionalität
- [ ] Notion API-Verbindung funktioniert
- [ ] Alle 8 Datenbanken sind erreichbar
- [ ] Blog-Seite zeigt Artikel an
- [ ] Produkt-Seite zeigt Produkte an
- [ ] FAQ-Seite zeigt Fragen an
- [ ] Team-Seite zeigt Mitglieder an
- [ ] Standorte-Seite zeigt Orte an
- [ ] Galerie zeigt Bilder an

### Filter & Suche
- [ ] Blog-Kategorie-Filter funktioniert
- [ ] Produkt-Kategorie-Filter funktioniert
- [ ] FAQ-Kategorie-Filter funktioniert
- [ ] Featured-Filter funktioniert
- [ ] Suchfunktion funktioniert (falls implementiert)

### Performance
- [ ] Cache funktioniert (zweite Anfrage schneller)
- [ ] Lighthouse Performance >90
- [ ] Core Web Vitals im grünen Bereich
- [ ] Bundle-Größe < Konfiguriertes Limit

### Sicherheit
- [ ] API-Schlüssel-Schutz aktiv
- [ ] Rate-Limiting funktioniert
- [ ] Error-Messages sind sicher (keine internen Details)
- [ ] CORS-Headers sind korrekt

### UI/UX
- [ ] Mobile-Responsivität
- [ ] Loading-States werden angezeigt
- [ ] Error-States werden korrekt behandelt
- [ ] Navigation funktioniert
- [ ] SEO-Tags sind vorhanden

### Deployment
- [ ] Vercel-Deployment erfolgreich
- [ ] Environment-Variablen korrekt gesetzt
- [ ] Build ohne Fehler
- [ ] Live-Website lädt korrekt
- [ ] API-Endpunkte sind erreichbar

---

## 🚨 Fehlerbehebung

### Häufige Probleme:

#### "Datenbank nicht gefunden"
- Prüfe Datenbank-ID in .env.local
- Stelle sicher, dass Integration Zugriff auf Datenbank hat
- Prüfe Datenbank-URL-Struktur

#### "API-Schlüssel ungültig"
- Prüfe NOTION_API_KEY in .env.local
- Stelle sicher, dass Integration "Can edit" Berechtigung hat
- Teste API-Schlüssel mit curl

#### Build-Fehler
- Prüfe TypeScript-Errors: `npx tsc --noEmit`
- Prüfe ESLint-Errors: `npm run lint`
- Prüfe fehlende Dependencies: `npm install`

#### Performance-Probleme
- Prüfe Notion API Rate Limits
- Prüfe Cache-Konfiguration
- Prüfe Bundle-Größe mit Analyzer

#### Webhook-Fehler
- Prüfe Webhook-Secret in Notion
- Prüfe Webhook-URL-Konfiguration
- Teste Webhook manuell mit curl

---

**🎯 Nach Abschluss aller Tests ist das System produktionsbereit!**