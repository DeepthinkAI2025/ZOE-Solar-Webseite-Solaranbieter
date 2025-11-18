# 🔌 API Reference & Dokumentation

## 📋 Übersicht

**Version:** v1.0
**Base URL:** `https://zoe-solar.de/api`
**Authentication:** JWT Bearer Token & API Keys
**Rate Limiting:** 100 requests/minute per user
**Documentation Format:** OpenAPI 3.0.3

---

## 🚀 Quick Start

### Authentication
```bash
# Bearer Token Authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://zoe-solar.de/api/customer/profile

# API Key Authentication
curl -H "X-API-Key: YOUR_API_KEY" \
     https://zoe-solar.de/api/products/live
```

### Environment Setup
```typescript
// API Configuration
const API_CONFIG = {
  baseURL: 'https://zoe-solar.de/api',
  version: 'v1',
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
```

---

## 🔐 Authentication & Authorization

### POST `/api/auth/login`
**Beschreibung:** Kunden-Login mit Session-Management

#### Request Body
```json
{
  "email": "max.mustermann@unternehmen.de",
  "password": "securePassword123",
  "rememberMe": true
}
```

#### Response 200
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "max.mustermann@unternehmen.de",
      "firstName": "Max",
      "lastName": "Mustermann",
      "company": "Mustermann GmbH",
      "role": "customer",
      "verified": true
    },
    "session": {
      "token": "jwt_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": 86400,
      "permissions": ["read:profile", "write:projects"]
    }
  },
  "meta": {
    "sessionId": "sess_abc123",
    "lastLogin": "2025-11-17T10:30:00Z"
  }
}
```

#### Response 401
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Ungültige Anmeldedaten",
    "details": {
      "attempts": 3,
      "maxAttempts": 5,
      "lockoutDuration": 900
    }
  }
}
```

### POST `/api/auth/logout`
**Beschreibung:** Session invalidieren und ausloggen

#### Request Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Response 200
```json
{
  "success": true,
  "data": {
    "message": "Erfolgreich ausgeloggt",
    "session invalidated": true
  }
}
```

### POST `/api/auth/refresh`
**Beschreibung:** JWT Token refreshen

#### Request Body
```json
{
  "refreshToken": "refresh_token_here"
}
```

---

## 👤 Customer Management

### GET `/api/customer/profile`
**Beschreibung:** Kundenprofil abrufen

#### Request Headers
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Response 200
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "max.mustermann@unternehmen.de",
    "firstName": "Max",
    "lastName": "Mustermann",
    "company": "Mustermann GmbH",
    "phone": "+49 30 12345678",
    "address": {
      "street": "Musterstraße 1",
      "city": "Berlin",
      "zipCode": "10115",
      "country": "Germany"
    },
    "preferences": {
      "language": "de",
      "currency": "EUR",
      "notifications": {
        "email": true,
        "sms": false,
        "newsletter": true
      }
    },
    "accountType": "business",
    "verified": true,
    "createdAt": "2025-01-15T09:00:00Z",
    "lastActiveAt": "2025-11-17T14:30:00Z"
  }
}
```

### PUT `/api/customer/profile`
**Beschreibung:** Kundenprofil aktualisieren

#### Request Body
```json
{
  "firstName": "Maximilian",
  "lastName": "Mustermann",
  "phone": "+49 30 87654321",
  "address": {
    "street": "Neue Straße 42",
    "city": "Hamburg",
    "zipCode": "20095",
    "country": "Germany"
  },
  "preferences": {
    "notifications": {
      "email": true,
      "sms": true,
      "newsletter": false
    }
  }
}
```

### GET `/api/customer/projects`
**Beschreibung:** Projekte des Kunden auflisten

#### Query Parameters
- `page` (int, optional): Seitennummer (Default: 1)
- `limit` (int, optional): Anzahl pro Seite (Default: 20)
- `status` (string, optional): Filter nach Status (`pending`, `active`, `completed`, `cancelled`)
- `type` (string, optional): Filter nach Projekttyp

#### Response 200
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_456",
        "title": "Photovoltaikanlage Bürodach",
        "type": "photovoltaik",
        "status": "active",
        "power": 250,
        "location": "Berlin",
        "createdAt": "2025-02-01T10:00:00Z",
        "estimatedCompletion": "2025-04-15T00:00:00Z",
        "progress": 65,
        "nextSteps": [
          "Baustellenvorbereitung",
          "Montage der Module",
          "Elektrischer Anschluss"
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### POST `/api/customer/projects`
**Beschreibung:** Neues Projekt anlegen

#### Request Body
```json
{
  "title": "Photovoltaikanlage Werkstatt",
  "type": "photovoltaik",
  "power": 150,
  "location": {
    "street": "Industriestraße 7",
    "city": "München",
    "zipCode": "80686",
    "country": "Germany"
  },
  "estimatedBudget": 75000,
  "timeline": "3-4 Monate",
  "specialRequirements": [
    "Nachrüstung für E-Mobilität",
    "Notstromversorgung"
  ],
  "contactPerson": {
    "name": "Hans Mueller",
    "email": "h.mueller@firma.de",
    "phone": "+49 89 12345678"
  }
}
```

---

## 📦 Product Catalog

### GET `/api/products`
**Beschreibung:** Produktkatalog mit Filterung

#### Query Parameters
- `category` (string, optional): Produktkategorie
- `power_min` (number, optional): Minimale Leistung in kWp
- `power_max` (number, optional): Maximale Leistung in kWp
- `manufacturer` (string, optional): Hersteller filtern
- `price_min` (number, optional): Mindestpreis
- `price_max` (number, optional): Höchstpreis
- `in_stock` (boolean, optional): Nur verfügbare Produkte
- `featured` (boolean, optional): Nur empfohlene Produkte

#### Response 200
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_789",
        "sku": "SOLAR-PRO-450-MAX",
        "name": "SolarPro 450W Mono",
        "category": "solar_panels",
        "manufacturer": "SolarTech",
        "power": 450,
        "efficiency": 22.5,
        "dimensions": {
          "length": 2100,
          "width": 1050,
          "height": 35
        },
        "weight": 21.5,
        "warranty": {
          "product": 15,
          "performance": 25
        },
        "pricing": {
          "basePrice": 289,
          "bulkPrice": 265,
          "currency": "EUR"
        },
        "stock": {
          "available": 1250,
          "reserved": 450,
          "leadTime": "2-3 Werktage"
        },
        "specifications": {
          "cellType": "Monokristallin",
          "voc": 41.2,
          "isc": 11.02,
          "vmp": 34.1,
          "imp": 13.19,
          "tolerance": "+5%",
          "temperature_coefficient": -0.34
        },
        "certifications": ["IEC61215", "IEC61730", "UL1703"],
        "images": [
          {
            "url": "https://cdn.zoe-solar.de/products/solar-pro-450-1.jpg",
            "alt": "SolarPro 450W Vorderansicht",
            "type": "primary"
          },
          {
            "url": "https://cdn.zoe-solar.de/products/solar-pro-450-2.jpg",
            "alt": "SolarPro 450W Rückseite",
            "type": "secondary"
          }
        ],
        "datasheet": "https://cdn.zoe-solar.de/datasheets/solar-pro-450.pdf",
        "featured": true,
        "sustainability": {
          "carbonFootprint": 450,
          "recyclable": 95,
          "rohs": true
        }
      }
    ],
    "filters": {
      "categories": ["solar_panels", "inverters", "batteries", "mounting"],
      "manufacturers": ["SolarTech", "EcoEnergy", "PowerMax", "GreenSun"],
      "powerRange": {
        "min": 300,
        "max": 600
      },
      "priceRange": {
        "min": 150,
        "max": 450
      }
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### GET `/api/products/{id}`
**Beschreibung:** Produkt-Details abrufen

#### Response 200
```json
{
  "success": true,
  "data": {
    // Produkt-Details wie oben, aber für einzelnes Produkt
    "compatibility": {
      "inverters": ["inv_123", "inv_456"],
      "mounting_systems": ["mount_789"],
      "batteries": ["bat_101", "bat_202"]
    },
    "calculations": {
      "annual_production": {
        "optimal": 1125,
        "realistic": 950,
        "conservative": 825
      },
      "co2_savings": {
        "annual": 580,
        "25_years": 14500
      },
      "roi": {
        "conservative": 8.5,
        "realistic": 10.2,
        "optimal": 12.1
      }
    }
  }
}
```

### GET `/api/products/live`
**Beschreibung:** Live-Produktdaten aus Firecrawl-Sync

#### Response 200
```json
{
  "success": true,
  "data": {
    "lastSync": "2025-11-17T08:15:00Z",
    "totalProducts": 156,
    "manufacturers": 12,
    "categories": 8,
    "updates": {
      "new": 5,
      "updated": 12,
      "discontinued": 2
    },
    "products": [
      // Live-Produktdaten mit aktuellen Preisen und Verfügbarkeit
    ]
  },
  "meta": {
    "syncStatus": "completed",
    "nextSync": "2025-11-17T08:15:00Z",
  "providers": ["firecrawl", "manual_scrapers", "openrouter_fallback"]
  }
}
```

---

## 🤖 AI & KI-Services

### POST `/api/ai/chat`
**Beschreibung:** KI-Chat für Solar-Beratung

#### Request Body
```json
{
  "message": "Welche Photovoltaikanlage eignet sich für mein 500m² Büroflachdach in Hamburg?",
  "context": {
    "location": "Hamburg",
    "roofSize": 500,
    "roofType": "flat",
    "consumption": 85000,
    "budget": "50000-80000",
    "preferences": ["high_efficiency", "long_warranty"]
  },
  "session_id": "sess_abc123",
  "history": [
    {
      "role": "assistant",
      "message": "Herzlich willkommen bei ZOE Solar! Wie kann ich Ihnen heute helfen?"
    }
  ]
}
```

#### Response 200
```json
{
  "success": true,
  "data": {
    "message": "Für Ihr 500m² Büroflachdach in Hamburg empfehle ich eine 75kP Anlage...",
    "recommendations": [
      {
        "type": "system",
        "power": 75,
        "estimated_production": 67500,
        "modules": 167,
        "estimated_cost": 62500,
        "roi": 9.2
      }
    ],
    "next_questions": [
      "Welche Module bevorzugen Sie (Monokristallin/Amorph)?",
      "Benötigen Sie eine Batteriespeicher-Lösung?"
    ],
    "context_saved": true,
    "confidence_score": 0.92
  },
  "meta": {
  "model": "mistral-7b-instruct",
    "response_time": 1.2,
    "tokens_used": {
      "input": 145,
      "output": 289
    }
  }
}
```

### POST `/api/ai/recommendation`
**Beschreibung:** Produkt-Empfehlungen generieren

#### Request Body
```json
{
  "requirements": {
    "power_requirement": 50,
    "location": "München",
    "roof_type": "pitched",
    "budget_range": "40000-60000",
    "priorities": ["efficiency", "warranty", "sustainability"]
  },
  "customer_profile": {
    "company_size": "medium",
    "industry": "manufacturing",
    "consumption": 75000
  }
}
```

### POST `/api/ai/roi-calculator`
**Beschreibung:** ROI-Berechnung mit KI-Optimierung

#### Request Body
```json
{
  "system_specification": {
    "power": 60,
    "module_efficiency": 22.5,
    "orientation": "süd",
    "tilt": 30,
    "consumption": 85000
  },
  "financial_parameters": {
    "investment": 55000,
    "electricity_price": 0.32,
    "feed_in_tariff": 0.08,
    "funding_available": true
  },
  "location": "Frankfurt am Main"
}
```

---

## 📊 Admin & Management

### GET `/api/admin/dashboard/kpi`
**Beschreibung:** Admin-Dashboard KPIs

#### Request Headers
```
Authorization: Bearer ADMIN_JWT_TOKEN
X-API-Key: ADMIN_API_KEY
```

#### Response 200
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_customers": 1847,
      "active_projects": 93,
      "completed_projects": 1456,
      "total_revenue": 15750000,
      "conversion_rate": 3.2
    },
    "performance": {
      "avg_project_value": 108000,
      "avg_completion_time": 4.2,
      "customer_satisfaction": 4.7,
      "referral_rate": 0.32
    },
    "marketing": {
      "website_visitors": 45789,
      "lead_to_project": 0.18,
      "cost_per_acquisition": 285,
      "marketing_roi": 3.8
    },
    "operational": {
      "inventory_value": 2450000,
      "supplier_performance": 96.5,
      "maintenance_tickets": 23,
      "avg_response_time": 2.4
    }
  },
  "real_time": {
    "active_sessions": 47,
    "current_requests": 12,
    "system_health": "optimal",
    "last_update": "2025-11-17T15:30:00Z"
  }
}
```

### POST `/api/admin/products/sync`
**Beschreibung:** Produktdaten-Sync auslösen

#### Request Body
```json
{
  "manufacturers": ["all"],
  "force_update": false,
  "notify_on_completion": true,
  "webhook_url": "https://webhook.zoe-solar.de/sync-complete"
}
```

#### Response 202
```json
{
  "success": true,
  "data": {
    "sync_id": "sync_abc123",
    "status": "started",
    "estimated_duration": "15-30 Minuten",
    "manufacturers_count": 12,
    "products_count": "ungefähr 150",
    "monitoring_url": "https://api.zoe-solar.de/admin/sync/status/sync_abc123"
  }
}
```

### GET `/api/admin/analytics/seo`
**Beschreibung:** SEO-Performance Daten

#### Query Parameters
- `date_from` (string): Startdatum (YYYY-MM-DD)
- `date_to` (string): Enddatum (YYYY-MM-DD)
- `metrics` (array): Gewünschte Metriken
- `pages` (array, optional): Spezifische Seiten

#### Response 200
```json
{
  "success": true,
  "data": {
    "period": {
      "from": "2025-10-17",
      "to": "2025-11-17"
    },
    "overview": {
      "total_sessions": 28456,
      "organic_traffic": 18234,
      "conversions": 567,
      "conversion_rate": 3.1
    },
    "keywords": {
      "top_positions": 34,
      "position_gains": 89,
      "position_losses": 12,
      "new_keywords": 156
    },
    "pages": [
      {
        "url": "/service/photovoltaik",
        "sessions": 3456,
        "avg_position": 7.2,
        "clicks": 892,
        "impressions": 12456,
        "ctr": 7.2
      }
    ],
    "technical_seo": {
      "core_web_vitals": "good",
      "mobile_friendly": 98.5,
      "https": 100,
      "pagespeed_score": 92
    }
  }
}
```

---

## 📝 Notion CMS Integration

### GET `/api/notion/content/{type}`
**Beschreibung:** Content aus Notion CMS abrufen

#### Path Parameters
- `type`: Inhaltstyp (`blog`, `products`, `faq`, `team`, `locations`, `gallery`)

#### Query Parameters
- `category` (string, optional): Kategorie-Filter
- `featured` (boolean, optional): Nur featured content
- `published` (boolean, optional): Nur veröffentlichte Inhalte
- `limit` (int, optional): Anzahl limitieren

#### Response 200
```json
{
  "success": true,
  "data": {
    "type": "blog",
    "content": [
      {
        "id": "page_123",
        "title": "Solarenergie Trends 2025",
        "slug": "solarenergie-trends-2025",
        "category": "news",
        "published": true,
        "featured": true,
        "content": "...",
        "excerpt": "Die wichtigsten Solarenergie-Trends für das Jahr 2025...",
        "author": {
          "name": "Anna Schmidt",
          "role": "Content Manager",
          "avatar": "https://cdn.zoe-solar.de/team/anna.jpg"
        },
        "published_at": "2025-11-15T10:00:00Z",
        "updated_at": "2025-11-16T14:30:00Z",
        "tags": ["solarenergie", "trends", "2025"],
        "seo": {
          "title": "Solarenergie Trends 2025 | ZOE Solar",
          "description": "Die wichtigsten Solarenergie-Trends für 2025",
          "keywords": ["solarenergie trends", "photovoltaik zukunft"]
        },
        "image": {
          "url": "https://cdn.zoe-solar.de/blog/solar-trends-2025.jpg",
          "alt": "Solarenergie Trends 2025",
          "caption": "Die Zukunft der Solarenergie"
        },
        "reading_time": 4,
        "views": 1245,
        "likes": 89
      }
    ],
    "meta": {
      "total": 47,
      "categories": ["news", "guides", "case_studies", "technical"],
      "last_sync": "2025-11-17T12:15:00Z"
    }
  }
}
```

### POST `/api/notion/webhook`
**Beschreibung:** Notion Webhook Handler

#### Request Headers
```
X-Notion-Signature: SHA256_SIGNATURE
Content-Type: application/json
```

#### Request Body
```json
{
  "type": "page_updated",
  "page_id": "page_123",
  "database_id": "db_456",
  "timestamp": "2025-11-17T15:30:00Z",
  "changes": {
    "properties": ["title", "status", "published"],
    "content": true
  }
}
```

---

## 🔧 Utilities & Helper APIs

### GET `/api/utils/calculator/roi`
**Beschreibung:** ROI-Rechner

#### Query Parameters
- `power` (required): Systemgröße in kWp
- `investment` (required): Investitionskosten
- `consumption` (required): Jahresverbrauch in kWh
- `electricity_price` (optional): Strompreis (Default: 0.32)
- `feed_in_tariff` (optional): Einspeisevergütung (Default: 0.08)
- `location` (optional): Standort für Sonneneinstrahlung

#### Response 200
```json
{
  "success": true,
  "data": {
    "input": {
      "power": 75,
      "investment": 65000,
      "consumption": 95000,
      "location": "Berlin"
    },
    "results": {
      "annual_production": {
        "kwh": 67500,
        "self_consumption": 48750,
        "fed_into_grid": 18750
      },
      "financials": {
        "annual_savings": 22320,
        "feed_in_revenue": 1500,
        "total_annual_benefit": 23820,
        "amortization_period": 2.7,
        "roi_25_years": 815,
        "net_present_value": 185000
      },
      "environmental": {
        "co2_savings_annual": 34.5,
        "co2_savings_25_years": 862.5,
        "equivalent_trees": 2156
      }
    },
    "assumptions": {
      "degradation_rate": 0.5,
      "electricity_price_increase": 3.2,
      "inflation_rate": 2.0,
      "discount_rate": 4.0
    }
  }
}
```

### GET `/api/utils/location-check`
**Beschreibung:** Standort-Check für Solar-geeignetheit

#### Query Parameters
- `address` (required): Vollständige Adresse
- `roof_size` (optional): Dachfläche in m²
- `consumption` (optional): Jahresverbrauch in kWh

#### Response 200
```json
{
  "success": true,
  "data": {
    "location": {
      "address": "Musterstraße 1, 10115 Berlin, Germany",
      "coordinates": {
        "lat": 52.5459,
        "lng": 13.3533
      },
      "region": "Berlin"
    },
    "solar_potential": {
      "annual_irradiation": 1080,
      "specific_yield": 950,
      "performance_ratio": 88,
      "suitability_score": 9.2
    },
    "recommendations": {
      "optimal_power": 85,
      "estimated_production": 80750,
      "co2_reduction_potential": 41.2
    },
    "regional_benefits": {
      "funding_programs": ["KfW 270", "BAFA-Programm"],
      "local_provider": true,
      "special_tariffs": ["Berliner Stromtarif"]
    },
    "technical_constraints": {
      "grid_capacity": "sufficient",
      "building_permission": "not_required",
      "nature_conservation": "no_restrictions"
    }
  }
}
```

---

## 🔒 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Die Anfrage konnte nicht validiert werden",
    "details": {
      "field": "email",
      "issue": "Invalid email format",
      "value": "invalid-email"
    },
    "request_id": "req_abc123",
    "timestamp": "2025-11-17T15:30:00Z"
  },
  "meta": {
    "retry_possible": true,
    "retry_after": 60
  }
}
```

### Common Error Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Eingabedaten ungültig |
| `UNAUTHORIZED` | 401 | Authentifizierung fehlgeschlagen |
| `FORBIDDEN` | 403 | Keine Berechtigung |
| `NOT_FOUND` | 404 | Ressource nicht gefunden |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate Limit überschritten |
| `INTERNAL_ERROR` | 500 | Interner Serverfehler |
| `SERVICE_UNAVAILABLE` | 503 | Dienst nicht verfügbar |
| `RESOURCE_CONFLICT` | 409 | Ressourcen-Konflikt |
| `PROCESSING_TIMEOUT` | 408 | Verarbeitung zu langsam |

---

## 📊 Rate Limiting

### Limits pro User/IP
- **Standard User:** 100 requests/minute
- **Premium User:** 500 requests/minute
- **Admin User:** 1000 requests/minute
- **API Key:** 1000 requests/minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 73
X-RateLimit-Reset: 1647649200
```

---

## 🔄 Webhooks

### Available Webhooks
- `product.updated`: Produkt-Updates
- `order.created`: Neue Bestellungen
- `customer.registered`: Neue Kunden
- `project.milestone`: Projekt-Meilensteine

### Webhook Configuration
```bash
curl -X POST https://zoe-solar.de/api/webhooks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhook",
    "events": ["product.updated", "order.created"],
    "secret": "webhook_secret",
    "active": true
  }'
```

---

## 📝 API Versioning

### Current Version
- **Version:** v1.0
- **Base URL:** `https://zoe-solar.de/api/v1`
- **Deprecation Policy:** 12 Monate Vorankündigung
- **Backwards Compatibility:** Gewährleistet

### Version History
- **v1.0** (Current): Production-ready Version
- **v0.9** (Beta): Testing Phase completed

---

## 📱 SDKs & Libraries

### Official SDKs
```typescript
// npm install @zoe-solar/api-client
import { ZoeSolarAPI } from '@zoe-solar/api-client';

const api = new ZoeSolarAPI({
  baseURL: 'https://zoe-solar.de/api',
  apiKey: 'your-api-key'
});

const products = await api.products.list({
  category: 'solar_panels',
  power_min: 400
});
```

```python
# pip install zoe-solar-python
from zoe_solar import ZoeSolarAPI

api = ZoeSolarAPI(api_key='your-api-key')
products = api.products.list(category='solar_panels', power_min=400)
```

---

## 🔐 Security Best Practices

### API Key Management
- API-Keys regelmäßig rotieren (empfohlen: 90 Tage)
- API-Keys in Environment Variables speichern
- Keine API-Keys in Client-Code einbetten
- HTTPS für alle API-Anfragen verwenden

### Authentication
- JWT-Tokens sicher aufbewahren
- Session-Timeouts implementieren
- Multi-Factor Authentication für Admin-Zugriffe
- Principle of Least Permission anwenden

---

## 📞 Support & Kontakt

### API Support
- **📧 Email:** api-support@zoe-solar.de
- **📞 Telefon:** +49 (0) 30 - API-SUPPORT
- **💬 Slack:** #api-support
- **📖 Documentation:** https://docs.zoe-solar.de/api

### Status Page
- **Uptime Monitoring:** https://status.zoe-solar.de
- **API Performance:** https://metrics.zoe-solar.de/api
- **Incident History:** https://status.zoe-solar.de/history

---

<div align="center">
  <h3>🚀 ZOE Solar API</h3>
  <p><strong>Enterprise-grade REST API · Production-ready · Full Documentation</strong></p>
  <p>🌞 <em>Komplette Solar-Website-Automatisierung auf Knopfdruck!</em> 🌞</p>
</div>

---

**📊 API Version:** v1.0.0
**🚀 Status:** Production Ready
**📈 Uptime:** 99.9%
**🔒 Security:** Enterprise Level
**📅 Last Update:** 17. November 2025