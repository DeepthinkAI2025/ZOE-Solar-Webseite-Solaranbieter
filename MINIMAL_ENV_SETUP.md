# 🎯 MINIMALE ENVIRONMENT VARIABLES FÜR ZOE SOLAR

## 🔑 ECHT BENÖTIGTE API KEYS (Nur 3!)

### 1. Google Cloud API Key (1 Key für alles!)
```bash
vercel env add GOOGLE_API_KEY production
# Einziger Key für:
# - OpenRouter (Mistral) API (KI Content)
# - Google Vision AI (Bilderkennung)
# - Google Maps (Standortkarte)
# - Google Geocoding (Adressen)
# - Google Places (Standorte)

# Kostenlos mit Google Cloud $300 Gratis-Guthaben
# Nach $300: Nur bei hoher Nutzung kostenpflichtig
```

### 2. OpenRouter API Key (kostenlos!)
```bash
vercel env add OPENROUTER_API_KEY production
# Kostenlos registrieren auf openrouter.ai
# Model: minimax:m2 (100% kostenlos!)
# Unbegrenzte Anfragen möglich
```

### 3. JWT Secret (selbst generiert)
```bash
vercel env add JWT_SECRET production
# Für API-Sicherheit
# Generieren mit: openssl rand -base64 32
```

---

## 🚀 OPTIONALE ABER NÜTZLICHE (KOSTENLOS)

### Base Configuration
```bash
vercel env add NEXT_PUBLIC_BASE_URL production
# Value: https://zoe-solar-vercel.app

vercel env add NEXT_PUBLIC_ORGANIZATION_NAME production
# Value: "ZOE Solar GmbH"

vercel env add NEXT_PUBLIC_DEFAULT_CITY production
# Value: "Berlin"
```

### Features (alle kostenlos)
```bash
vercel env add NEXT_PUBLIC_ENABLE_AI_CHAT production
# Value: true

vercel env add NEXT_PUBLIC_FREE_ANALYTICS production
# Value: true

vercel env add NEXT_PUBLIC_ENABLE_STRUCTURED_DATA production
# Value: true
```

---

## ❌ NICHT BENÖTIGTE KOSTENPFLICHTIGE DIENSTE

### Weglassen können:
- Ahrefs API ($99/Monat) → Google Search Console (kostenlos)
- SEMrush API ($100/Monat) → Google Analytics (kostenlos)
- Moz API ($80/Monat) → Lighthouse (kostenlos)
- OpenAI API ($5/Monat) → OpenRouter minimax:m2 (kostenlos)
- Google Maps Premium ($200/Monat) → Free Limits (28.500/Monat)
- Google Business Profile API → Manuelles Management

---

## 💰 GESAMTKOSTEN PRO MONAT

### Komplett kostenlos:
```bash
✅ Google Cloud API (im Free Tier): $0
✅ OpenRouter minimax:m2: $0
✅ Vercel Hosting: $0
✅ Google Analytics: $0
✅ Alle Features aktiv: $0

🎉 GESAMT: €0/MONAT!
```

### Nur bei extrem hohem Traffic:
```bash
Wenn >28.500 Kartenaufrufe/Monat: $10-20
Wenn >60 OpenRouter-Anfragen/Minute: $5-10 (abhängig vom OpenRouter-Plan und Modell)
Wenn Google Cloud $300 überschritten: $20-50

→ Unwahrscheinlich für Solar-Website!
```

---

## 🏆 FAZIT

**Nur 3 API Keys werden wirklich benötigt:**
1. Google Cloud API Key (1x für alles)
2. OpenRouter API Key (kostenlos)
3. JWT Secret (selbst generiert)

**Alles andere sind optionale Features oder überflüssige Kostenfresser!**