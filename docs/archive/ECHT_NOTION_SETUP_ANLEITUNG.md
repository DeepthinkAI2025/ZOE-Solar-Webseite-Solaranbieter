# 🔑 ECHTE NOTION-INTEGRATION ANLEITUNG
## Für funktionierende Datenbanken in Notion

**WICHTIG:** Ohne echte Notion-Integration können wir keine echten Datenbanken erstellen!

---

## 🎯 SCHRITT 1: Notion-Integration erstellen (5 Minuten)

### 1.1 Bei Notion registrieren/anmelden
1. Gehen Sie zu: **https://www.notion.so/my-integrations**
2. Klicken Sie auf **"Log in"** oder **"Add integrations"**
3. Melden Sie sich mit Ihrem Notion-Account an

### 1.2 Neue Integration erstellen
1. Klicken Sie auf **"New Integration"**
2. Füllen Sie aus:
   - **Name:** `ZOE Solar CMS`
   - **Associated workspace:** Wählen Sie Ihren ZOE Solar Workspace
   - **Capabilities:** ✅ Alle ankreuzen:
     - Read content
     - Update content  
     - Insert content
     - Read user information
3. Klicken Sie **"Submit"**
4. **🔑 WICHTIG: Kopieren Sie den API-Schlüssel** (secret_xxxxxxxxx)

### 1.3 Workspace-ID ermitteln
1. Gehen Sie zu Ihrem Notion Workspace
2. Öffnen Sie eine beliebige Seite
3. Die URL sieht so aus: `https://notion.so/IHR_WORKSPACE/...`
4. Die ID ist der 32-stellige Hex-Code nach dem ersten `/`
   - Beispiel: `https://notion.so/abc123def456...` → ID: `abc123def4567890abcdef1234567890`

---

## 🎯 SCHRITT 2: Environment-Datei erstellen

Nachdem Sie API-Token und Workspace-ID haben:

```bash
# Kopieren Sie das Template
cp .env.example .env.local

# Bearbeiten Sie die Datei
nano .env.local
```

Tragen Sie ein:
```env
NOTION_API_KEY=secret_ihr_api_schlüssel_hier
NOTION_WORKSPACE_ID=ihre_32_stellige_workspace_id
```

---

## 🎯 SCHRITT 3: Datenbanken mit Integration teilen

**ERST NACH** dem Setup aus Schritt 1:

1. Öffnen Sie jede Datenbank in Notion
2. Klicken Sie oben rechts auf **"Share"**
3. Klicken Sie **"Invite"**
4. Fügen Sie die Integration hinzu: **"@ZOE Solar CMS"**
5. Setzen Sie Berechtigung: **"Can edit"**
6. Bestätigen mit **"Invite"**

---

## 🎯 SCHRITT 4: Testen

Jetzt können Sie die echte Verbindung testen:

```bash
# Verbindung testen
node scripts/test-notion-connection.cjs

# Datenbanken erstellen  
node scripts/create-notion-databases.cjs

# Testdaten hinzufügen
node scripts/add-notion-test-data.cjs
```

---

## ❓ HÄUFIGE PROBLEME

### Problem: "Unauthorized" Fehler
**Lösung:** Stellen Sie sicher, dass die Integration mit dem Workspace geteilt ist

### Problem: "Forbidden" Fehler  
**Lösung:** Überprüfen Sie die Workspace-Berechtigung (Integration braucht "Can edit")

### Problem: Datenbank kann nicht erstellt werden
**Lösung:** Stellen Sie sicher, dass der API-Token "Create databases" Berechtigung hat

### Problem: API-Token wird nicht erkannt
**Lösung:** Prüfen Sie, dass Sie sich bei der richtigen Notion-Integration angemeldet haben

---

## 🚀 NACH ERFOLGREICHEM SETUP

1. **Echte Datenbanken werden erstellt** in Ihrem Notion Workspace
2. **Testdaten werden eingefügt** (Blog-Artikel, Produkte, FAQ, etc.)
3. **Das System funktioniert vollständig** mit echten Notion-Daten

---

## ⚠️ WICHTIGER HINWEIS

**Sie müssen diese Schritte MANUELL ausführen**, da nur der Workspace-Eigentümer eine Notion-Integration erstellen und verwalten kann. 

**Der technische Teil (Datenbank-Erstellung, Testdaten, Integration) wird dann VOLLSTÄNDIG AUTOMATISCH** durchgeführt.

---

**💡 Sobald Sie die Notion-Integration eingerichtet haben, können wir mit echten, funktionierenden Datenbanken fortfahren!**