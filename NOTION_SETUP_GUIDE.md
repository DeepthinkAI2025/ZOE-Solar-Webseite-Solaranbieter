# 📋 Notion CMS Setup Guide für ZOE Solar

## 🎯 Übersicht
Diese Anleitung erklärt, wie du das Notion CMS für ZOE Solar vollständig einrichtest.

## 📋 Vorbereitungs-Checkliste

### ✅ Benötigt:
- [ ] Notion Account (Free Plan: 10 GB Speicher)
- [ ] Admin-Zugriff auf ZOE Solar Website
- [ ] API-Zugriff zu Notion

## 🔧 Schritt 1: Notion Integration erstellen

### 1. Notion Integration erstellen:
1. Gehe zu: https://www.notion.so/my-integrations
2. Klicke auf **"New integration"**
3. Fülle das Formular aus:
   - **Name**: `ZOE Solar CMS API`
   - **Associated workspace**: `ZOE Solar Workspace`
   - **Type**: `Internal`
   - **Capabilities**: Alle belassen
4. Kopiere den **Integration Token** (beginnt mit `secret_`)

### 2. API Token sichern:
```bash
# In .env.local eintragen
VITE_NOTION_TOKEN=secret_dein_token_hier
```

## 🗄️ Schritt 2: Datenbanken in Notion erstellen

### 1. Produkte-Datenbank erstellen:
```
Datenbankname: Produkte
Icon: 📦
Eigenschaften:
├── Name (Title)
├── Kategorie (Select)
├── Hersteller (Select)
├── Preis (Number)
├── Spezifikationen (Rich Text)
├── Bilder (Files & Media)
├── Beschreibung (Rich Text)
├── Status (Select) -> Published, Draft
└── Featured (Checkbox)
```

### 2. Fallstudien-Datenbank erstellen:
```
Datenbankname: Fallstudien
Icon: 🏢
Eigenschaften:
├── Titel (Title)
├── Slug (Rich Text)
├── Standort (Rich Text)
├── Standort-Key (Rich Text)
├── Kategorie (Select) -> Commercial, Residential, Agricultural
├── Datum (Date)
├── Bild-URL (Files & Media)
├── Auszug (Rich Text)
├── Kundenname (Rich Text)
├── Kundentyp (Rich Text)
├── Projektgröße (Rich Text)
├── Installationszeit (Rich Text)
├── ROI (Rich Text)
├── CO2-Einsparung (Rich Text)
├── Highlights (Rich Text) -> JSON format
├── Herausforderung (Rich Text)
├── Lösung (Rich Text)
├── Ergebnisse (Rich Text)
├── Testimonial (Rich Text) -> JSON format
├── Technische Details (Rich Text) -> JSON format
├── Galerie (Files & Media)
├── Verwandte Dienstleistungen (Rich Text) -> JSON format
└── Status (Select) -> Published, Draft
```

### 3. Artikel-Datenbank erstellen:
```
Datenbankname: Artikel & Blog
Icon: 📝
Eigenschaften:
├── Titel (Title)
├── Slug (Rich Text)
├── Kategorie (Select)
├── Datum (Date)
├── Bild-URL (Files & Media)
├── Auszug (Rich Text)
├── Autor Name (Rich Text)
├── Autor Rolle (Rich Text)
├── Autor Bild (Files & Media)
├── Autor Bio (Rich Text)
├── KI-generiert (Checkbox)
├── Quellen (Rich Text) -> JSON format
└── Status (Select) -> Published, Draft
```

### 4. Team-Datenbank erstellen:
```
Datenbankname: Team
Icon: 👥
Eigenschaften:
├── Name (Title)
├── Rolle (Rich Text)
├── Bio (Rich Text)
├── Bild-URL (Files & Media)
├── Expertise (Multi-select)
├── E-Mail (Email)
├── LinkedIn (URL)
├── Reihenfolge (Number)
└── Status (Select) -> Active, Inactive
```

### 5. Testimonials-Datenbank erstellen:
```
Datenbankname: Kundenstimmen
Icon: ⭐
Eigenschaften:
├── Kundenname (Title)
├── Unternehmen (Rich Text)
├── Position (Rich Text)
├── Bewertung (Number) -> 1-5
├── Zitat (Rich Text)
├── Projektname (Rich Text)
├── Bild-URL (Files & Media)
├── Datum (Date)
├── Kategorie (Select)
└── Status (Select) -> Published, Draft
```

## 🔗 Schritt 3: Datenbanken mit Integration verbinden

### Für jede Datenbank:
1. Öffne die Datenbank in Notion
2. Klicke auf **"..."** (mehr Optionen) oben rechts
3. Wähle **"Connect to"** oder **"Add connections"**
4. Suche nach `ZOE Solar CMS API`
5. Klicke auf **"Connect"**

## 🆔 Schritt 4: Datenbank-IDs kopieren

### Jede Datenbank-ID finden:
1. Öffne die Datenbank in Notion
2. Kopiere die URL aus dem Browser
3. Die ID ist der Teil nach `/` und vor `?v=`
   - Beispiel: `https://www.notion.so/your-workspace/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6?v=...`
   - ID: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### IDs in .env.local eintragen:
```bash
VITE_NOTION_PRODUCTS_DB=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_NOTION_CASE_STUDIES_DB=b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6
VITE_NOTION_ARTICLES_DB=c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6
VITE_NOTION_TEAM_DB=d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6
VITE_NOTION_TESTIMONIALS_DB=e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6
```

## 🚀 Schritt 5: Daten migrieren

### Migration Script ausführen:
```bash
# 1. Umgebungsvariablen setzen
cp .env.example .env.local
# Bearbeite .env.local mit deinen IDs

# 2. Migration ausführen
npx tsx scripts/migrate-to-notion.ts
```

### Manuel Daten eintragen (Alternative):
1. Öffne jede Datenbank in Notion
2. Füge einige Beispiel-Daten manuell hinzu
3. Verwende die Rich Text Editoren für komplexe Inhalte

## 🔄 Schritt 6: Echtzeit-Updates einrichten (Optional)

### Webhook für automatische Updates:
1. Erstelle einen Webhook-Endpoint auf deinem Server
2. In Notion: Integration → Webhooks → Add webhook
3. URL deines Webhook-Endpoints eintragen
4. Events auswählen: `page_updated`, `page_created`

### Webhook Handler Beispiel:
```typescript
// POST /api/notion-webhook
export async function POST(request: Request) {
  const { type, database_id } = await request.json()

  // Cache leeren für aktualisierte Datenbank
  notionService.clearCache(getDatabaseName(database_id))

  return Response.json({ success: true })
}
```

## ✅ Schritt 7: Testing

### Lokal testen:
```bash
# 1. Entwicklung starten
npm run dev

# 2. Browser Console öffnen
# 3. Netzwerk-Tab beobachten
# 4. API-Aufrufe an Notion überprüfen
```

### Debug-Informationen:
```javascript
// In Browser Console:
console.log('Notion Status:', window.notionService)
console.log('Cache Status:', window.notionService.cache)
```

## 🔧 Fehlerbehebung

### Häufige Probleme:

#### 1. "401 Unauthorized"
- **Ursache**: Falscher oder fehlender API Token
- **Lösung**: Token neu generieren und in .env.local eintragen

#### 2. "404 Not Found"
- **Ursache**: Falsche Datenbank-ID
- **Lösung**: ID aus Notion URL neu kopieren

#### 3. "Rate limit exceeded"
- **Ursache**: Zu viele API-Aufrufe
- **Lösung**: Cache aktivieren, Rate Limiting beachten

#### 4. "CORS Error"
- **Ursache**: API wird vom Browser aufgerufen
- **Lösung**: API-Aufrufe über Backend/Proxy leiten

## 🎉 Erfolgskontrolle

Wenn alles funktioniert, solltest du sehen:
- ✅ Produkte werden von Notion geladen
- ✅ Fallstudien anzeigen korrekte Inhalte
- ✅ Artikel sind lesbar und formatiert
- ✅ Bilder von Notion werden angezeigt
- ✅ Caching funktioniert (keine doppelten API-Aufrufe)

## 📚 Nächste Schritte

### Sobald Basic-Setup funktioniert:
1. **Restliche Datenbanken** einrichten (FAQ, Glossar, etc.)
2. **Erweiterte Inhalte** hinzufügen (Bilder, Videos, etc.)
3. **SEO-Optimierung** implementieren
4. **Performance-Tuning** durchführen
5. **Monitoring** einrichten

## 🆘 Hilfe & Support

### Dokumentation:
- [Notion API Docs](https://developers.notion.com/)
- [React Integration Guide](https://reactjs.org/)

### Community:
- [Notion Developers Discord](https://discord.gg/notion)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/notion-api)

### Für ZOE Solar spezifische Fragen:
- Prüfe die Kommentare im Code
- Teste mit den Debug-Tools
- Kontaktiere das Entwicklerteam

---

**🎯 Ziel erreicht!** Du hast ein voll funktionsfähiges Notion CMS für ZOE Solar eingerichtet. Die Inhaltsverwaltung ist jetzt 10x einfacher! 🚀