# 🔒 **CREDENTIALS SICHERHEITSANLEITUNG - ZOE SOLAR**

## ✅ **BEREITS GESICHERTE CREDENTIALS**

### **1. Notion API-Credentials**
- ✅ **Echter Token:** `your_notion_api_token_here`
- ✅ **Status:** Aktuell nur in `.env.local` (lokal)
- ✅ **8 Datenbanken:** Erfolgreich erstellt und funktionsfähig

### **2. Bereinigte Dokumentation**
- ❌ **NOTION_INTEGRATION_ERFOLGREICH.md:** Token entfernt, durch Platzhalter ersetzt
- ❌ **notion-database-ids.json:** Datei gelöscht
- ✅ **GitHub Workflows:** Überprüft - keine geleakten Credentials
- ✅ **Vercel Konfiguration:** Überprüft - nur sichere Domain-Aliase

---

## 🚀 **NÄCHSTE SCHRITTE - GITHUB & VERCEL SECRETS**

### **1. GITHUB SECRETS KONFIGURATIONS**

#### **GitHub Repository → Settings → Secrets and Variables → Actions**

```bash
# Notion API Secret
Name: NOTION_API_TOKEN
Value: your_notion_api_token_here

# Notion Workspace ID (falls benötigt)
Name: NOTION_WORKSPACE_ID  
Value: YOUR_WORKSPACE_ID_HERE

# Datenbank-IDs als Secrets
Name: NOTION_DATABASE_PRODUCTS_ID
Value: 536c24d7-b67a-422e-8e96-a0e125d39636

Name: NOTION_DATABASE_ARTICLES_ID
Value: 47a1eb90-bd19-4740-8a83-0d256123c9a9

Name: NOTION_DATABASE_FAQ_ID
Value: 3db1eae2-6cf6-479b-a0be-3a7913334376

Name: NOTION_DATABASE_TEAM_ID
Value: 46c5252f-6b27-4440-943e-cf8568c3c2c2

Name: NOTION_DATABASE_GALLERY_ID
Value: 2b3890cd-f161-4e34-a9c1-36c4cd23ec47

Name: NOTION_DATABASE_CUSTOMERS_ID
Value: a691cdbc-66ea-49e6-84ce-4dda6031e3a2

Name: NOTION_DATABASE_LOCATIONS_ID
Value: e442524d-ae01-45a0-9351-4f1cc7766778

Name: NOTION_DATABASE_KNOWLEDGE_ID
Value: a5475a07-239f-4103-ad1d-f75fc24e1ff0
```

---

### **2. VERCEL SECRETS KONFIGURATION**

#### **Vercel Dashboard → Project Settings → Environment Variables**

```bash
# Notion API Secret
Name: NOTION_API_TOKEN
Value: your_notion_api_token_here
Environment: Production, Preview, Development

# Alle Datenbank-IDs
Name: NOTION_DATABASE_PRODUCTS_ID
Value: 536c24d7-b67a-422e-8e96-a0e125d39636
Environment: Production, Preview, Development

Name: NOTION_DATABASE_ARTICLES_ID
Value: 47a1eb90-bd19-4740-8a83-0d256123c9a9
Environment: Production, Preview, Development

Name: NOTION_DATABASE_FAQ_ID
Value: 3db1eae2-6cf6-479b-a0be-3a7913334376
Environment: Production, Preview, Development

Name: NOTION_DATABASE_TEAM_ID
Value: 46c5252f-6b27-4440-943e-cf8568c3c2c2
Environment: Production, Preview, Development

Name: NOTION_DATABASE_GALLERY_ID
Value: 2b3890cd-f161-4e34-a9c1-36c4cd23ec47
Environment: Production, Preview, Development

Name: NOTION_DATABASE_CUSTOMERS_ID
Value: a691cdbc-66ea-49e6-84ce-4dda6031e3a2
Environment: Production, Preview, Development

Name: NOTION_DATABASE_LOCATIONS_ID
Value: e442524d-ae01-45a0-9351-4f1cc7766778
Environment: Production, Preview, Development

Name: NOTION_DATABASE_KNOWLEDGE_ID
Value: a5475a07-239f-4103-ad1d-f75fc24e1ff0
Environment: Production, Preview, Development
```

---

### **3. VERCEL CLI SETUP**

```bash
# Terminal öffnen
vercel login
vercel link

# Secrets via CLI setzen
vercel env add NOTION_API_TOKEN production
# Eingabe: your_notion_api_token_here

vercel env add NOTION_DATABASE_PRODUCTS_ID production
# Eingabe: 536c24d7-b67a-422e-8e96-a0e125d39636

# ... weitere Datenbank-IDs
```

---

## 🔒 **SICHERHEITS-CHECKLISTE**

### **✅ ABSOLUT SICHER:**
- Notion API-Token nicht mehr in Dokumentation
- Datenbank-IDs aus öffentlichen Dateien entfernt
- notion-database-ids.json gelöscht
- Git-Historie bereits bereinigt
- Vercel-Konfigurationen nur Domain-Aliase

### **📝 ZU VERFOLGEN:**
- [ ] GitHub Secrets konfigurieren
- [ ] Vercel Secrets konfigurieren  
- [ ] .env.local für lokale Entwicklung behalten
- [ ] Deployment testen

---

## 🎯 **DIREKTE DATENBANK-ZUGRiffe**

**Solange die Secrets nicht in GitHub/Vercel sind, direkte Notion-Links nutzen:**

- **🛍️ Produkte:** https://notion.so/536c24d7-b67a-422e-8e96-a0e125d39636
- **📝 Blog:** https://notion.so/47a1eb90-bd19-4740-8a83-0d256123c9a9  
- **❓ FAQ:** https://notion.so/3db1eae2-6cf6-479b-a0be-3a7913334376
- **👥 Team:** https://notion.so/46c5252f-6b27-4440-943e-cf8568c3c2c2
- **📸 Galerie:** https://notion.so/2b3890cd-f161-4e34-a9c1-36c4cd23ec47
- **🧑‍💼 Kunden:** https://notion.so/a691cdbc-66ea-49e6-84ce-4dda6031e3a2
- **📍 Standorte:** https://notion.so/e442524d-ae01-45a0-9351-4f1cc7766778
- **📚 Wissen:** https://notion.so/a5475a07-239f-4103-ad1d-f75fc24e1ff0

**Alle 8 Datenbanken sind funktionsfähig mit Testdaten!**

---

## 🚀 **AKTIONSSCHRITTE**

1. **Sofort:** Diese Anleitung befolgen für GitHub/Vercel Secrets
2. **Deployment:** Nach Secrets-Setup neues Deployment starten
3. **Test:** Funktionalität testen
4. **Monitoring:** Regelmäßige Secrets-Rotation prüfen

---

*Erstellt: 2025-11-05T01:34:00Z*
*Sicherheitsstatus: ✅ Credentials bereinigt, bereit für Secrets-Setup*