# 📋 Notion-Integration Checkliste für ZOE Solar

## 🎯 SCHRITT 1: Notion-Integration erstellen

### 1.1 Notion Developer Account
1. Gehe zu: https://developers.notion.com/
2. Logge dich mit deinem Notion-Account ein
3. Klicke auf "New Integration"
4. Name: `ZOE Solar CMS`
5. Associated workspace: Wähle deinen ZOE Solar Workspace
6. Capabilities:
   - ✅ Read content
   - ✅ Update content  
   - ✅ Insert content
   - ✅ Read user information
7. Klicke "Submit"
8. **Kopiere den API-Schlüssel** (secret_xxxxxxxxx)

### 1.2 Workspace-ID ermitteln
1. Gehe zu deinem Notion Workspace
2. Öffne einen Page/URL
3. Die ID ist der 32-stellige Hex-Code in der URL
4. Beispiel: `https://notion.so/workspace/ABC123def456...` → ID: `abcdef1234567890abcdef1234567890`

## 🎯 SCHRITT 2: Datenbanken erstellen

### 2.1 Blog-Artikel Datenbank
**Database Name:** `ZOE Solar Blog`
**Properties:**
- `Title` (Title) - Erforderlich
- `Category` (Select) - Optionen: Solar, Technik, Nachhaltigkeit, News
- `Featured` (Checkbox)
- `Published` (Checkbox)
- `Published Date` (Date)
- `Tags` (Multi-select)
- `Excerpt` (Text)
- `SEO Title` (Text)
- `SEO Description` (Text)

### 2.2 Produkte Datenbank  
**Database Name:** `ZOE Solar Produkte`
**Properties:**
- `Name` (Title) - Erforderlich
- `Description` (Rich Text)
- `Price` (Number)
- `Category` (Select) - Optionen: Photovoltaik, Speicher, Zubehör, Services
- `Featured` (Checkbox)
- `Active` (Checkbox)
- `SKU` (Text)
- `Image` (Files & media)
- `Specifications` (Rich Text)

### 2.3 FAQ Datenbank
**Database Name:** `ZOE Solar FAQ`
**Properties:**
- `Question` (Title) - Erforderlich
- `Answer` (Rich Text)
- `Category` (Select) - Optionen: Installation, Technik, Preise, Garantie, Wartung
- `Order` (Number) - Für Reihenfolge
- `Published` (Checkbox)
- `Tags` (Multi-select)
- `Related Products` (Relation) → Verknüpfung zu Produkte

### 2.4 Team Datenbank
**Database Name:** `ZOE Solar Team`
**Properties:**
- `Name` (Title) - Erforderlich
- `Position` (Select) - Optionen: Geschäftsführung, Vertrieb, Technik, Planung, Marketing
- `Department` (Text)
- `Email` (Email)
- `Phone` (Phone number)
- `Profile Image` (Files & media)
- `Bio` (Rich Text)
- `Featured` (Checkbox)
- `Active` (Checkbox)

### 2.5 Standorte Datenbank
**Database Name:** `ZOE Solar Standorte`
**Properties:**
- `Name` (Title) - Erforderlich
- `Type` (Select) - Optionen: Hauptsitz, Niederlassung, Vertriebspartner
- `Address` (Text)
- `City` (Text)
- `Region` (Select) - Optionen: Nord, Süd, Ost, West, Mitte
- `Phone` (Phone number)
- `Email` (Email)
- `Opening Hours` (Rich Text)
- `Map` (Files & media)
- `Active` (Checkbox)

### 2.6 Galerie Datenbank
**Database Name:** `ZOE Solar Galerie`
**Properties:**
- `Title` (Title) - Erforderlich
- `Category` (Select) - Optionen: Installationen, Team, Büro, Events
- `Image` (Files & media) - Erforderlich
- `Description` (Rich Text)
- `Date` (Date)
- `Featured` (Checkbox)
- `Published` (Checkbox)
- `Tags` (Multi-select)

### 2.7 Kunden Datenbank
**Database Name:** `ZOE Solar Kunden`
**Properties:**
- `Company Name` (Title) - Erforderlich
- `Contact Person` (Text)
- `Email` (Email)
- `Phone` (Phone number)
- `Project Type` (Select) - Optionen: Privat, Gewerbe, Industrie
- `Location` (Text)
- `Project Value` (Number)
- `Installation Date` (Date)
- `Status` (Select) - Optionen: Angebot, Vertrag, Installation, Abgeschlossen
- `Testimonial` (Rich Text)
- `Project Images` (Files & media)

### 2.8 Artikel Datenbank (Knowledge Base)
**Database Name:** `ZOE Solar Wissen`
**Properties:**
- `Title` (Title) - Erforderlich
- `Content` (Rich Text)
- `Category` (Select) - Optionen: Technik, Rechtlich, Finanzen, Umwelt
- `Difficulty` (Select) - Optionen: Einsteiger, Fortgeschritten, Experte
- `Reading Time` (Number) - Minuten
- `Tags` (Multi-select)
- `Related FAQ` (Relation) → FAQ
- `Related Products` (Relation) → Produkte
- `Published` (Checkbox)

## 🎯 SCHRITT 3: Datenbank-Sharing konfigurieren

### Für jede Datenbank:
1. Öffne die Datenbank in Notion
2. Klicke oben rechts auf "Share"
3. Klicke "Invite"
4. Füge die Integration hinzu: `@ZOE Solar CMS`
5. Setze die Berechtigung auf "Can edit"
6. Bestätige mit "Invite"

## 🎯 SCHRITT 4: Datenbank-IDs sammeln

### Für jede Datenbank:
1. Öffne die Datenbank
2. Kopiere die URL
3. Die ID ist der 32-stellige Hex-Code in der URL
4. Beispiel: `https://notion.so/12345678-abcd-1234-abcd-123456789012` → ID: `12345678abcd1234abcd123456789012`

## 🎯 SCHRITT 5: Webhook einrichten (optional)

### 5.1 Webhook erstellen:
1. Gehe zu: https://developers.notion.com/
2. Öffne deine Integration
3. Gehe zu "Webhooks"
4. Klicke "Create new webhook"
5. URL: `https://your-app.vercel.app/api/webhooks/notion`
6. Events auswählen:
   - ✅ page.created
   - ✅ page.updated  
   - ✅ page.archived
7. "Create webhook" klicken
8. **Webhook Secret kopieren**

### 5.2 Share Webhook mit Datenbanken:
1. Für jede Datenbank: "Share" → "Webhook" hinzufügen

## 🎯 SCHRITT 6: Testdaten erstellen

### 6.1 Blog-Testdaten:
- Erstelle 3-5 Beispiel-Artikel
- Verschiedene Kategorien verwenden
- Einen als Featured markieren

### 6.2 Produkt-Testdaten:
- Erstelle 5-10 Beispiel-Produkte
- Verschiedene Kategorien
- Einige als Featured markieren

### 6.3 FAQ-Testdaten:
- Erstelle 10-15 häufige Fragen
- Verschiedene Kategorien
- Logische Reihenfolge (Order-Feld)

### 6.4 Team-Testdaten:
- Erstelle 5-10 Team-Mitglieder
- Verschiedene Positionen
- Profilbilder hinzufügen

### 6.5 Standort-Testdaten:
- Hauptsitz Berlin
- 2-3 weitere Standorte
- Vollständige Kontaktdaten

## 🎯 SCHRITT 7: Integration testen

### 7.1 API-Test:
```bash
curl -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
     -H "Notion-Version: 2022-06-28" \
     "https://api.notion.com/v1/users/me"
```

### 7.2 Datenbank-Test:
```bash
curl -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
     -H "Notion-Version: 2022-06-28" \
     "https://api.notion.com/v1/databases/YOUR_BLOG_DB_ID"
```

## 🎯 CHECKLISTE - Alles erledigt? ☐

- [ ] Notion-Integration erstellt und API-Key kopiert
- [ ] Workspace-ID ermittelt
- [ ] Alle 8 Datenbanken erstellt
- [ ] Datenbank-Eigenschaften konfiguriert
- [ ] Datenbanken mit Integration geteilt
- [ ] Alle Datenbank-IDs gesammelt
- [ ] Webhook eingerichtet (optional)
- [ ] Testdaten erstellt
- [ ] API-Tests durchgeführt
- [ ] API-Key und IDs in .env.local eingetragen

## ⚠️ WICHTIGE HINWEISE:

1. **Sicherheit:** Bewahre den API-Schlüssel sicher auf -任何人mit dem Schlüssel kann auf deine Notion-Daten zugreifen!

2. **Berechtigungen:** Stelle sicher, dass die Integration "Can edit" Berechtigung für alle Datenbanken hat.

3. **Datenschutz:** Achte darauf, welche Daten du in Notion speicherst - vermeide sensible Informationen in öffentlich zugänglichen Datenbanken.

4. **Backup:** Notion hat sein eigenes Backup-System, aber es ist ratsam, regelmäßige Exporte deiner wichtigen Daten zu machen.

5. **Rate Limits:** Notion API hat Rate Limits - das CMS ist darauf vorbereitet, aber bei sehr hohem Traffic könntest du diese erreichen.

---

**🚀 Nach Abschluss dieser Schritte ist dein Notion-Setup bereit für die Integration!**