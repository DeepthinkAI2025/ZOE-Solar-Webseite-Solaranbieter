# ZOE Solar - Complete API Documentation for n8n Integration

## 📋 Overview

Dieses Dokument enthält alle API-Endpunkte für die ZOE Solar Website, die mit n8n und anderen externen Programmen genutzt werden können. Die API ermöglicht vollständiges Datenmanagement für Blog-Artikel, FAQ, Projekte, Produkte und Hersteller.

**Last Updated:** 2025-11-01
**API Version:** 1.0.0
**Base URL:** `http://localhost:5001/api`

## 🔐 Authentication

**Für alle schreibenden Operationen (POST, PUT, DELETE) wird ein API-Key benötigt:**

```bash
API-Key: test-key-123
Header: X-API-Key: test-key-123
```

**Beispiel für Authentifizierung:**
```bash
curl -X POST "http://localhost:5001/api/articles" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key-123" \
  -d '{"title": "Neuer Artikel", "content": "Inhalt"}'
```

---

## 📝 Blog-Artikel API (`/api/articles`)

### Alle Artikel abrufen
```bash
GET /api/articles
```
**Query Parameter:**
- `category` - Filter nach Kategorie (z.B. `?category=Technik`)
- `limit` - Anzahl pro Seite (default: 20)
- `offset` - Seiten-Offset (default: 0)

**Response:**
```json
{
  "articles": [
    {
      "id": "1",
      "title": "Test Artikel 1",
      "slug": "test-artikel-1",
      "category": "Technik",
      "content": "Dies ist ein Testartikel...",
      "date": "2025-01-01",
      "author": "Test Author"
    }
  ],
  "total": 2,
  "hasMore": false
}
```

### Einzelnen Artikel abrufen
```bash
GET /api/articles/1
```

### Neuen Artikel erstellen
```bash
POST /api/articles
```
**Required Fields:** `title`, `content`
**Optional:** `category`, `author`

**Request Body:**
```json
{
  "title": "Neuer Blog-Artikel",
  "content": "Vollständiger Inhalt des Artikels...",
  "category": "Technik",
  "author": "Autor Name"
}
```

### Artikel aktualisieren
```bash
PUT /api/articles/1
```

### Artikel löschen
```bash
DELETE /api/articles/1
```

### Kategorien abrufen
```bash
GET /api/articles/categories
```

---

## ❓ FAQ API (`/api/faq`)

### Alle FAQ-Einträge abrufen
```bash
GET /api/faq
```
**Query Parameter:**
- `category` - Filter nach Kategorie
- `region` - Filter nach Region
- `limit` - Anzahl pro Seite (default: 50)
- `offset` - Seiten-Offset

**Response:**
```json
{
  "faq": [
    {
      "id": "1",
      "question": "Was ist Photovoltaik?",
      "answer": "Photovoltaik ist die Umwandlung von Licht in elektrische Energie.",
      "category": "Allgemein"
    }
  ],
  "total": 2,
  "hasMore": false
}
```

### Neuen FAQ-Eintrag erstellen
```bash
POST /api/faq
```
**Required Fields:** `question`, `answer`
**Optional:** `category`, `regions`

### FAQ aktualisieren
```bash
PUT /api/faq/1
```

### FAQ löschen
```bash
DELETE /api/faq/1
```

### FAQ-Kategorien abrufen
```bash
GET /api/faq/categories
```

---

## 🏗️ Projekte API (`/api/projects`)

### Alle Projekte abrufen
```bash
GET /api/projects
```
**Query Parameter:**
- `type` - Filter nach Projekttyp
- `location` - Filter nach Standort
- `limit` - Anzahl pro Seite
- `offset` - Seiten-Offset

**Response:**
```json
{
  "projects": [
    {
      "id": "1",
      "title": "Muster Projekt GmbH",
      "slug": "muster-projekt-gmbh",
      "type": "Dachanlage",
      "power": "500 kWp",
      "location": "Berlin",
      "date": "2024-12-01"
    }
  ],
  "total": 2,
  "hasMore": false
}
```

### Neues Projekt erstellen
```bash
POST /api/projects
```
**Required Fields:** `title`, `type`
**Optional:** `power`, `location`, `description`

### Projekt-Typen abrufen
```bash
GET /api/projects/types
```

### Projekt-Standorte abrufen
```bash
GET /api/projects/locations
```

---

## 🛍️ Produkte API (`/api/products`)

### Alle Produkte abrufen
```bash
GET /api/products
```
**Query Parameter:**
- `category` - Filter nach Kategorie
- `manufacturer` - Filter nach Hersteller
- `minPrice` - Mindestpreis
- `maxPrice` - Höchstpreis
- `limit` - Anzahl pro Seite
- `offset` - Seiten-Offset

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Jinko Solar JKM450M-7RL3-V",
      "category": "Module",
      "manufacturerSlug": "jinko-solar",
      "manufacturerName": "Jinko Solar",
      "imageUrl": "/images/products/jinko-solar-module.jpg",
      "description": "Hochleistungsmodul mit 450 Wp",
      "basePrice": 150,
      "stock": 150,
      "available": true,
      "specs": {
        "power": "450Wp",
        "efficiency": "22.6%",
        "warranty": "25 Jahre"
      },
      "keyFeatures": ["Hohe Effizienz", "25 Jahre Garantie", "PID-frei"]
    }
  ],
  "total": 5,
  "hasMore": false
}
```

### **⭐ PRODUKT BEARBEITEN**
```bash
PUT /api/products/1
```
**Request Body:**
```json
{
  "name": "Updated Product Name",
  "basePrice": 200,
  "description": "Updated description",
  "stock": 100,
  "available": true,
  "specs": {
    "power": "500Wp",
    "efficiency": "23.0%"
  }
}
```

### Neues Produkt erstellen
```bash
POST /api/products
```
**Required Fields:** `name`, `category`, `manufacturerSlug`
**Optional:** `basePrice`, `description`, `specs`, `stock`, `available`

**Request Body:**
```json
{
  "name": "Neues Solar-Modul",
  "category": "Module",
  "manufacturerSlug": "jinko-solar",
  "basePrice": 180,
  "description": "Beschreibung des neuen Produkts",
  "specs": {
    "power": "500Wp",
    "efficiency": "23.5%"
  },
  "stock": 50,
  "available": true
}
```

### Produkt löschen
```bash
DELETE /api/products/1
```

### Produkt-Kategorien abrufen
```bash
GET /api/products/categories
```

**Response:**
```json
{
  "categories": [
    "Module",
    "Wechselrichter",
    "Speicher",
    "Ladestationen",
    "Unterkonstruktion",
    "Elektrokomponenten",
    "Zubehör",
    "Leistungsoptimierer"
  ]
}
```

### Produkt nach ID abrufen
```bash
GET /api/products/1
```

### Verfügbarkeit abfragen
```bash
GET /api/products/available
```

### Produkte mit niedrigem Lagerbestand
```bash
GET /api/products/low-stock?threshold=10
```

### Produktsuche
```bash
GET /api/products/search?q=solar
```

---

## 👥 Hersteller API (`/api/manufacturers`)

### Alle Hersteller abrufen
```bash
GET /api/manufacturers
```

**Response:**
```json
{
  "manufacturers": [
    {
      "slug": "jinko-solar",
      "name": "Jinko Solar",
      "logoUrl": "/images/manufacturers/jinko-solar-logo.png",
      "category": ["Module"],
      "description": "Einer der größten Hersteller von Solarmodulen weltweit",
      "whyWeTrust": ["Top-Qualität", "Weltweiter Marktführer"],
      "country": "China",
      "founded": "2006"
    }
  ]
}
```

### Hersteller-Details abrufen
```bash
GET /api/manufacturers/jinko-solar
```

### Produkte eines Herstellers abrufen
```bash
GET /api/manufacturers/jinko-solar/products
```

### Hersteller nach Kategorie
```bash
GET /api/manufacturers/by-category/Module
```

---

## 🔍 Search API (`/api/search`)

### Volltextsuche über alle Entitäten
```bash
GET /api/search?q=photovoltaik
```
**Query Parameter:**
- `q` - Suchbegriff (required)
- `type` - Filter auf Entitätstyp (`articles`, `faq`, `projects`)
- `limit` - Maximale Anzahl (default: 10)

**Response:**
```json
{
  "query": "photovoltaik",
  "results": {
    "articles": [
      {
        "id": "1",
        "title": "Photovoltaik Grundlagen",
        "content": "..."
      }
    ],
    "faq": [
      {
        "id": "1",
        "question": "Was ist Photovoltaik?",
        "answer": "Photovoltaik ist..."
      }
    ],
    "projects": []
  },
  "total": 2,
  "hasMore": false
}
```

---

## 📊 API Status & Statistiken

### API Status abrufen
```bash
GET /api/status
```

### Produktstatistiken
```bash
GET /api/products/stats
```

---

## 🔧 n8n Workflow Beispiele

### Beispiel 1: Neuen Blog-Artikel erstellen
**n8n HTTP Request Node:**
```json
{
  "method": "POST",
  "url": "http://localhost:5001/api/articles",
  "headers": {
    "Content-Type": "application/json",
    "X-API-Key": "test-key-123"
  },
  "body": {
    "title": "{{ $json.title }}",
    "content": "{{ $json.content }}",
    "category": "{{ $json.category }}",
    "author": "{{ $json.author }}"
  }
}
```

### Beispiel 2: Produkt aktualisieren
**n8n HTTP Request Node:**
```json
{
  "method": "PUT",
  "url": "http://localhost:5001/api/products/{{ $json.id }}",
  "headers": {
    "Content-Type": "application/json",
    "X-API-Key": "test-key-123"
  },
  "body": {
    "basePrice": "{{ $json.newPrice }}",
    "stock": "{{ $json.newStock }}",
    "description": "{{ $json.description }}"
  }
}
```

### Beispiel 3: FAQ durchsuchen
**n8n HTTP Request Node:**
```json
{
  "method": "GET",
  "url": "http://localhost:5001/api/faq",
  "qs": {
    "category": "Allgemein",
    "limit": 10
  }
}
```

### Beispiel 4: Neue Produkte abrufen und melden
**n8n Workflow:**
1. **HTTP Request** → `GET /api/products/low-stock?threshold=10`
2. **IF Node** → Prüfe ob `total > 0`
3. **HTTP Request** → `POST https://webhook.site/your-webhook` mit Produktdaten

---

## 🚨 Error Handling

### Authentifizierungsfehler (401)
```json
{
  "error": "Unauthorized - Invalid API key"
}
```

### Validierungsfehler (400)
```json
{
  "error": "Missing required fields: title, content"
}
```

### Nicht gefunden (404)
```json
{
  "error": "Product not found"
}
```

### Serverfehler (500)
```json
{
  "error": "Internal server error"
}
```

---

## 📈 Rate Limiting & Best Practices

### Empfehlungen für n8n Integration:
1. **Rate Limiting**: Maximal 10 Requests pro Minute
2. **Pagination**: Nutze `limit` und `offset` für große Datenmengen
3. **Caching**: Kategorie-Listen können lokal gecached werden
4. **Error Handling**: Prüfe HTTP Status Codes in n8n
5. **Batch Processing**: Führe mehrere Updates in einzelnen Requests aus

### n8n Node Konfiguration:
```json
{
  "timeout": 30000,
  "retryOnFail": true,
  "maxRetries": 3,
  "retryDelay": 1000
}
```

---

## 🔍 Testing & Debugging

### API mit curl testen:
```bash
# Test Status
curl http://localhost:5001/api/status

# Test mit Authentifizierung
curl -X GET http://localhost:5001/api/articles \
  -H "X-API-Key: test-key-123"

# Test POST
curl -X POST http://localhost:5001/api/articles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key-123" \
  -d '{"title":"Test","content":"Test content"}'
```

### Logging aktivieren:
API-Requests werden im Server-Log angezeigt mit Details zu Status und Errors.

---

## 📞 Support

Bei Fragen zur API-Integration:
1. Prüfe den API Status: `GET /api/status`
2. Konsultiere die Error-Messages
3. Validiere Request-Body und Headers
4. Prüfe API-Key Authentifizierung

---

**🎉 Ready for n8n Integration!**

Alle 35+ API-Endpunkte sind getestet und bereit für die n8n-Integration. Beginne mit einfachen READ-Operationen und implementiere dann schrittweise die CRUD-Operationen für deine automatisierten Workflows.