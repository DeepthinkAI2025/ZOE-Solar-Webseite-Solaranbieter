# 🔌 ZOE Solar API Documentation

## 📋 Overview

Die **ZOE Solar Enterprise API** bietet umfassenden Zugriff auf alle Funktionalitäten der Solar-Plattform, einschließlich Kundenmanagement, KI-Services, Admin-Dashboard und Content-Management.

### 🚀 Quick Start

```bash
# Base URL
https://zoe-solar.de/api

# Authentication Header
Authorization: Bearer YOUR_JWT_TOKEN

# Content-Type
Content-Type: application/json
```

### 🎯 API Versions

- **v1.0.0** - Aktuelle Version (Production Ready)
- **v1.1.0** - Beta (neue Features)
- **v2.0.0** - Alpha (Experimentelle Features)

## 🛡️ Authentication

### JWT Authentication
```bash
# Login
curl -X POST https://zoe-solar.de/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "max.mustermann@unternehmen.de",
    "password": "SecurePassword123!"
  }'
```

### API Key Authentication
```bash
# Using API Key
curl -X GET https://zoe-solar.de/api/products \
  -H "X-API-Key: YOUR_API_KEY"
```

## 📚 API Endpoints

### 🔐 Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | User Login |
| `/auth/register` | POST | User Registration |
| `/auth/refresh` | POST | Refresh Token |
| `/auth/logout` | POST | User Logout |
| `/auth/verify-email` | POST | Email Verification |

### 👤 Customer Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/customer/profile` | GET/PUT | Customer Profile |
| `/customer/projects` | GET/POST | Customer Projects |
| `/customer/projects/{id}` | GET | Project Details |
| `/customer/analytics` | GET | Customer Analytics |
| `/customer/preferences` | GET/PUT | Preferences |

### 🤖 AI Services
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ai/chat` | POST | AI Chat Assistant |
| `/ai/recommendations` | POST | AI Recommendations |
| `/ai/roi-calculator` | POST | ROI Calculator |
| `/ai/solar-potential` | POST | Solar Potential Analysis |
| `/ai/market-analysis` | POST | Market Analysis |

### 📊 Admin & Analytics
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/dashboard/kpi` | GET | Dashboard KPIs |
| `/admin/users` | GET/POST | User Management |
| `/admin/analytics/seo` | GET | SEO Analytics |
| `/admin/reports` | GET | Reports |

### 📝 Notion CMS
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/notion/content/{type}` | GET | Content by Type |
| `/notion/webhook` | POST | Webhook Handler |
| `/notion/search` | GET | Content Search |
| `/notion/sync` | POST | Content Sync |

### 🔧 Public Utilities
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/utils/calculator/roi` | GET | ROI Calculator |
| `/utils/location-check` | GET | Location Check |
| `/sitemap.xml` | GET | Sitemap |
| `/robots.txt` | GET | Robots.txt |

## 💡 Quick Examples

### Customer Login
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  const { data } = await response.json();
  localStorage.setItem('token', data.tokens.token);
  return data;
};
```

### Get User Profile
```javascript
const getProfile = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/customer/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  return await response.json();
};
```

### AI Chat Message
```javascript
const sendMessage = async (message, context = {}) => {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      context,
      sessionId: 'session_123',
      options: {
        model: 'mistral-7b-instruct',
        temperature: 0.7,
        includeCalculations: true
      }
    })
  });

  return await response.json();
};
```

### ROI Calculator
```javascript
const calculateROI = async (systemSpec, financialParams) => {
  const response = await fetch('/api/ai/roi-calculator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemSpec,
      financialParameters,
      location: {
        address: 'Musterstraße 1, Berlin',
        irradiation: 1080
      },
      analysisOptions: {
        analysisPeriod: 25,
        scenarios: ['conservative', 'realistic', 'optimistic']
      }
    })
  });

  return await response.json();
};
```

## 📊 Rate Limiting

### Rate Limits
| User Type | Requests/Minute | Requests/Hour |
|-----------|----------------|---------------|
| Standard | 100 | 5,000 |
| Premium | 500 | 25,000 |
| Admin | 1,000 | 50,000 |
| API Key | 1,000 | 50,000 |

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 73
X-RateLimit-Reset: 1647649200
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid",
    "details": {
      "field": "email",
      "value": "invalid-email"
    },
    "request_id": "req_abc123",
    "timestamp": "2025-11-17T15:30:00Z"
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## 🔧 SDKs & Libraries

### JavaScript/TypeScript
```bash
npm install @zoe-solar/api-client
```

```javascript
import { ZoeSolarAPI } from '@zoe-solar/api-client';

const api = new ZoeSolarAPI({
  baseURL: 'https://zoe-solar.de/api',
  apiKey: process.env.ZOE_API_KEY
});

// Authentication
const auth = await api.auth.login('email@example.com', 'password');

// AI Services
const response = await api.ai.chat('Welche Solaranlage für 100m²?');

// Customer Management
const profile = await api.customer.getProfile();
const projects = await api.customer.getProjects();
```

### Python
```bash
pip install zoe-solar-python
```

```python
from zoe_solar import ZoeSolarAPI

api = ZoeSolarAPI(
    base_url='https://zoe-solar.de/api',
    api_key='your_api_key'
)

# Authentication
auth = api.auth.login('email@example.com', 'password')

# AI Services
response = api.ai.chat('Welche Solaranlage für 100m²?')

# Customer Management
profile = api.customer.get_profile()
projects = api.customer.get_projects()
```

### Postman Collection
Download the complete Postman collection:
- [ZOE Solar API Collection](./examples/zoe-solar-api-collection.json)
- Includes all endpoints with example requests
- Pre-configured with authentication
- Environment variables included

## 📊 Analytics & Monitoring

### API Health Check
```bash
curl https://zoe-solar.de/api/health
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "ai_services": "healthy",
    "cache": "healthy",
    "external_apis": "healthy"
  },
  "performance": {
    "response_time_ms": 45,
    "uptime_seconds": 1234567,
    "requests_per_minute": 23
  }
}
```

### API Usage Dashboard
- **URL**: `/admin/analytics/api-usage`
- **Metrics**: Request volume, response times, error rates
- **Time Range**: Real-time, hourly, daily, monthly

## 🔒 Security

### Security Best Practices
1. **Use HTTPS** - All requests must use HTTPS
2. **Token Security** - Never expose tokens in client-side code
3. **Rate Limiting** - Respect rate limits to avoid blocking
4. **Input Validation** - Validate all input data
5. **Error Handling** - Never expose sensitive information in error messages

### Token Management
```javascript
// Token Storage (Client-side)
const tokenStorage = {
  get: () => localStorage.getItem('zoe_token'),
  set: (token) => localStorage.setItem('zoe_token', token),
  remove: () => localStorage.removeItem('zoe_token'),

  // Check if token is expired
  isExpired: (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true; // Invalid token
    }
  }
};
```

## 📞 Support

### API Support
- **Email**: api-support@zoe-solar.de
- **Phone**: +49 (0) 30 - API-SUPPORT
- **Slack**: #api-support
- **Documentation**: https://docs.zoe-solar.de/api

### Reporting Issues
Please report bugs and feature requests via:
- **GitHub Issues**: [Project Issues](https://github.com/zoe-solar/api/issues)
- **Email**: api-bugs@zoe-solar.de

---

**📊 API Version:** 1.0.0
**🚀 Status:** Production Ready
**📈 Uptime:** 99.9% SLA
**🔒 Security:** Enterprise Level
**📅 Last Update:** 17. November 2025