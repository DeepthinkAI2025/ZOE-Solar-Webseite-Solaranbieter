# 🚀 ZOE Solar - Quick Start Guide

## ⚡ Schnellstart in 3 Minuten

### 1️⃣ Notion Integration freigeben
Gehen Sie zu Ihrem ZOE Solar Workspace:
- Settings & Members → Connections
- Finden Sie "ZOE Solar Conversion System"
- Klicken Sie auf **"Connect"** → **"Allow access"**

### 2️⃣ Token setzen und Setup ausführen
```bash
# Token setzen
export NOTION_TOKEN=your_notion_api_token_here

# Setup ausführen
npm run setup:notion
```

### 3️⃣ Testen und starten
```bash
# Integration testen
npm run test:notion

# Anwendung starten
npm run dev
```

🎉 **Fertig!** Ihr System ist unter https://zoe-solar.de/admin erreichbar.

---

## 🔧 Ihre Notion Integration Details

- **Name**: ZOE Solar Conversion System
- **Workspace**: ZOE Solar
- **Token**: `your_notion_api_token_here`
- **Funktionsbereich**: Nur Workspace "ZOE Solar"

---

## 📱 Zugänge nach Setup

### Admin Dashboard
- **URL**: http://localhost:3000/admin
- **Test-User**: `admin@zoe-solar.de`
- **Passwort**: Wird beim ersten Login festgelegt

### A/B Testing Dashboard
- **URL**: http://localhost:3000/admin/ab-testing
- **Funktion**: Erstellen und verwalten Sie A/B Tests

### Notion Datenbanken
- **A/B Testing**: Automatisch erstellt
- **Users**: Mit Test-Benutzern vorbefüllt
- **Roles**: Berechtigungsstrukturen eingerichtet

---

## ❌ Probleme?

**Token nicht gefunden?**
```bash
export NOTION_TOKEN=your_notion_api_token_here
```

**Verbindung fehlgeschlagen?**
- Integration im Workspace freigeben
- Token überprüfen
- Netzwerkverbindung prüfen

**Detailliertes Troubleshooting**: Siehe [NOTION_SETUP_GUIDE.md](./NOTION_SETUP_GUIDE.md)

---

## 🎯 Nächste Schritte

1. **Ersten A/B Test erstellen** im Dashboard
2. **Benutzer verwalten** mit Rollen
3. **Marketing Assets** hochladen
4. **Conversion-Raten** analysieren

**Viel Erfolg!** 🌟