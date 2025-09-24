# ZOE Solar - Kundenportal API Endpunkte (Spezifikation)

Dieses Dokument beschreibt die Spezifikation für die Backend-API-Endpunkte, die zur Versorgung des ZOE Solar Kunden-Dashboards erforderlich sind.

## Authentifizierung

### `POST /api/auth/login`
Meldet einen Kunden an.
- **Request Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Success Response (200 OK):**
  - Setzt ein sicheres HTTP-only Session-Cookie.
  - **Body:** `{ "success": true, "user": { "id": "cus_123", "name": "Max Mustermann", "email": "user@example.com" } }`
- **Error Response (401 Unauthorized):** `{ "success": false, "message": "Ungültige Anmeldedaten" }`

### `POST /api/auth/logout`
Meldet den aktuellen Kunden ab.
- **Request Body:** (leer)
- **Success Response (200 OK):**
  - Löscht das Session-Cookie.
  - **Body:** `{ "success": true }`

## Kundendaten

### `GET /api/customer/profile`
Ruft das Profil des aktuell authentifizierten Kunden ab.
- **Success Response (200 OK):** `{ "id": "...", "name": "...", "email": "...", "companyName": "...", "address": "...", "phone": "..." }`
- **Error Response (401 Unauthorized):** Wenn kein Benutzer angemeldet ist.

### `PUT /api/customer/profile`
Aktualisiert das Profil für den aktuell authentifizierten Kunden.
- **Request Body:** `{ "name": "...", "companyName": "...", "address": "...", "phone": "..." }`
- **Success Response (200 OK):** Gibt das aktualisierte Profilobjekt zurück.
- **Error Response (400 Bad Request):** Bei Validierungsfehlern.

## Projekte

### `GET /api/customer/projects`
Ruft eine Liste aller Projekte für den authentifizierten Kunden ab.
- **Success Response (200 OK):** `[{ "id": "proj_abc", "name": "Dachanlage Logistikzentrum", "status": "In Betrieb", "power": "1.2 MWp", "startDate": "2023-05-10" }, ...]`

### `GET /api/customer/projects/{projectId}`
Ruft detaillierte Informationen für ein bestimmtes Projekt ab.
- **Success Response (200 OK):** Ein detailliertes Projektobjekt mit Angeboten, Rechnungen, Verlauf und Nachrichten.
  ```json
  {
    "id": "proj_abc",
    "name": "Dachanlage Logistikzentrum",
    "status": "In Betrieb",
    "offers": [{ "id": "offer_1", "date": "...", "amount": 120000, "status": "angenommen" }],
    "invoices": [{ "id": "inv_1", "date": "...", "amount": 60000, "status": "bezahlt", "pdfUrl": "..." }],
    "history": [{ "date": "...", "event": "Anlage in Betrieb genommen" }],
    "messages": [{ "date": "...", "from": "Zoe Solar", "text": "..." }]
  }
  ```

### `POST /api/customer/projects`
Erstellt eine neue Projektanfrage für den authentifizierten Kunden.
- **Request Body:** `{ "serviceType": "...", "message": "...", "files": [...] }`
- **Success Response (201 Created):** Gibt das neu erstellte Projektobjekt zurück.

## Angebote

### `POST /api/customer/projects/{projectId}/offers/{offerId}/accept`
Akzeptiert ein bestimmtes Angebot.
- **Success Response (200 OK):** `{ "success": true, "message": "Angebot erfolgreich angenommen." }`

## Rechnungen

### `POST /api/customer/invoices/{invoiceId}/pay`
Initiiert den Zahlungsprozess für eine Rechnung (Integration mit einem Zahlungsanbieter wie Stripe).
- **Request Body:** `{ "paymentMethodId": "..." }`
- **Success Response (200 OK):** Gibt den Zahlungsstatus zurück.

## Produkte

### `GET /api/products`
Ruft eine Liste aller verfügbaren Produkte ab. Kann nach Kategorie gefiltert werden.
- **Query Params:** `?category=Module`
- **Success Response (200 OK):** `[{ "id": "prod_1", "name": "Meyer Burger Black", "category": "Module", "description": "...", "imageUrl": "..." }, ...]`

## Benötigte API-Dienste

Damit die Anwendung, insbesondere der KI-Chat und die Dach-Analyse, voll funktionsfähig ist, müssen die folgenden API-Dienste im Google Cloud Projekt sowie bei Drittanbietern aktiviert und konfiguriert werden.

### Google Cloud Platform
**Wichtiger Hinweis:** Ersetzen Sie in den folgenden Links `[IHRE_PROJECT_ID]` durch Ihre tatsächliche Google Cloud Projekt-ID.

*   **Vertex AI API (Gemini)**
    *   **Zweck:** Dies ist das Herzstück der KI-Funktionen. Gemini wird für den dialogorientierten Chat, die intelligente Validierung von Satellitenbildern und die Analyse von Dachflächen zur Potenzialschätzung verwendet.
    *   **Aktivierungslink:** `https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=[IHRE_PROJECT_ID]`

*   **Maps Static API**
    *   **Zweck:** Wird aktuell verwendet, um Satellitenbilder für eine gegebene Adresse abzurufen, die dann von der KI analysiert werden.
    *   **Aktivierungslink:** `https://console.cloud.google.com/apis/library/maps-static-backend.googleapis.com?project=[IHRE_PROJECT_ID]`

*   **Geocoding API**
    *   **Zweck:** Wandelt Adress-Strings in präzise geografische Koordinaten (Breiten- und Längengrad) um. Dies erhöht die Genauigkeit der Karten- und Analyse-APIs erheblich.
    *   **Aktivierungslink:** `https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?project=[IHRE_PROJECT_ID]`

*   **Solar API (Empfehlung für beste Ergebnisse)**
    *   **Zweck:** Stellt hochdetaillierte Solarpotenzial-Daten für Dächer bereit, einschließlich 3D-Geometrie, genauer Sonneneinstrahlung über das Jahr und möglicher Solarmodul-Layouts. Die Integration dieser API würde die Dach-Analyse von einer Schätzung zu einer präzisen, datengestützten Auswertung aufwerten.
    *   **Aktivierungslink:** `https://console.cloud.google.com/apis/library/solar.googleapis.com?project=[IHRE_PROJECT_ID]`

*   **Places API (Optional)**
    *   **Zweck:** Kann für eine Adress-Autovervollständigung im KI-Chat verwendet werden, um die Benutzerfreundlichkeit zu verbessern und Fehleingaben zu reduzieren.
    *   **Aktivierungslink:** `https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=[IHRE_PROJECT_ID]`

### Drittanbieter-APIs

*   **Fapro API**
    *   **Zweck:** Dient der Verwaltung von Kundenanfragen (Leads), die über das Kontaktformular oder den KI-Chat generiert werden. Die Daten werden an dieses CRM-System zur weiteren Bearbeitung gesendet.
    *   **Konfiguration:** Der API-Schlüssel muss als Umgebungsvariable `FAPRO_API_KEY` im System hinterlegt werden. Weitere Informationen finden Sie unter [fapro.de](https://www.fapro.de/).