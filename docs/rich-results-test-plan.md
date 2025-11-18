# Rich Results Test – ZOE Solar Website

## 📋 Test-Plan für strukturierte Daten

### **1. Google Rich Results Test**
**URL:** https://search.google.com/test/rich-results

**Zu testende URLs:**
```
https://www.zoe-solar.de/ (Homepage - FAQ + Speakable)
https://www.zoe-solar.de/photovoltaik (Pillar Page - FAQ + Speakable)
https://www.zoe-solar.de/service/photovoltaik (Service Page - FAQ + Speakable)
https://www.zoe-solar.de/preise (Preise - FAQ + Speakable)
https://www.zoe-solar.de/kontakt (Kontakt - FAQ + Speakable)
https://www.zoe-solar.de/standort/berlin (Regional - LocalBusiness + FAQ)
https://www.zoe-solar.de/standort/muenchen (Regional - LocalBusiness + FAQ)
https://www.zoe-solar.de/standort/zuerich (Regional - LocalBusiness + FAQ)
```

### **2. Erwartete Rich Results**

#### **FAQ Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "name": "FAQ Titel",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Frage?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Antwort..."
      }
    }
  ]
}
```

#### **Speakable Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Seitentitel",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-headline", ".pillar-intro"]
  }
}
```

#### **LocalBusiness Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ZOE Solar GmbH Berlin",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Berlin",
    "postalCode": "10115",
    "addressCountry": "DE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 52.520008,
    "longitude": 13.404954
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 52.520008,
      "longitude": 13.404954
    },
    "geoRadius": 180000
  }
}
```

### **3. Test-Checkliste**

#### **Vor jedem Test:**
- [ ] Seite im Browser laden
- [ ] Entwicklertools öffnen (F12)
- [ ] "Application" → "Local Storage" → "Structured Data" prüfen
- [ ] HTML-Source anzeigen und nach `application/ld+json` suchen

#### **Rich Results Test Schritte:**
1. [ ] URL in Google's Rich Results Test eingeben
2. [ ] Auf "Test URL" klicken
3. [ ] Ergebnisse analysieren:
   - [ ] "Valid items detected" sollte angezeigt werden
   - [ ] Keine Errors oder Warnings
   - [ ] Richtige Schema-Typen erkannt (FAQPage, WebPage, LocalBusiness)

#### **Mobile-Friendly Test:**
- [ ] Zusätzlich: https://search.google.com/test/mobile-friendly
- [ ] Alle Seiten müssen mobile-friendly sein

### **4. Häufige Probleme & Lösungen**

#### **FAQ nicht erkannt:**
- [ ] Prüfen ob `mainEntity` Array korrekt ist
- [ ] Mindestens 3 FAQ-Einträge pro Seite
- [ ] `acceptedAnswer.text` darf keine HTML-Tags enthalten

#### **Speakable nicht erkannt:**
- [ ] CSS-Selektoren müssen existieren (`.hero-headline`, `.pillar-intro`)
- [ ] Selektoren müssen sichtbaren Text enthalten
- [ ] Nicht mehr als 3 Selektoren pro Seite

#### **LocalBusiness nicht erkannt:**
- [ ] Vollständige Adresse mit postalCode und addressCountry
- [ ] Geo-Koordinaten müssen numerisch sein
- [ ] areaServed mit GeoCircle muss definiert sein

### **5. Test-Ergebnisse dokumentieren**

**Template für Test-Bericht:**
```
URL: https://www.zoe-solar.de/[page]
Datum: 25.09.2025
Status: ✅ PASS / ❌ FAIL

Detected Items:
- FAQ Schema: ✅
- Speakable Schema: ✅
- LocalBusiness Schema: ✅

Issues Found:
- [ ] Keine
- [ ] Warning: [Beschreibung]
- [ ] Error: [Beschreibung]

Screenshot: [Link zu Screenshot]
```

### **6. Follow-up Tests**
- [ ] Nach Schema-Änderungen erneut testen
- [ ] Wöchentlich alle URLs testen
- [ ] Bei neuen Seiten sofort testen
- [ ] Nach Google Core Updates testen

---

**Nächster Schritt:** Führe die Tests durch und dokumentiere die Ergebnisse. Bei Fehlern die entsprechenden Schema-Konfigurationen anpassen.</content>
<parameter name="filePath">/workspaces/ZOE-Solar-Webseite-Solaranbieter/docs/rich-results-test-plan.md