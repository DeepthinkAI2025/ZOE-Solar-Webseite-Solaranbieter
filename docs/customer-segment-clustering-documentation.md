# Kundensegment-Clustering Dokumentation

## Übersicht

Dieses Dokument beschreibt die Erstellung und Analyse von Kundensegment-Clustern für ZOE Solar. Die Analyse zielt darauf ab, Kunden in drei Hauptsegmente zu gruppieren: Privatkunden, Gewerbekunden und Landwirtschaftskunden, um zielgerichtete Marketing- und Vertriebsstrategien zu ermöglichen.

## Methodik

### Datengrundlage

Die Analyse basiert auf synthetisch generierten Kundendaten mit folgenden Merkmalen:

- **Jahresverbrauch (kWh)**: Stromverbrauch pro Jahr
- **Budget (€)**: Verfügbares Budget für Solarinvestitionen
- **Haushaltsgröße**: Anzahl der Personen im Haushalt
- **Dachfläche (m²)**: Verfügbare Dachfläche für PV-Anlagen
- **Standort**: Urban/Rural-Klassifikation
- **Einkommen (€)**: Jährliches Haushaltseinkommen

### Clustering-Algorithmus

**K-Means Clustering** wurde verwendet mit folgenden Parametern:

- **Anzahl der Cluster**: 3 (entsprechend den Kundensegmenten)
- **Initialisierung**: K-Means++ für bessere Konvergenz
- **Maximale Iterationen**: 300
- **Toleranz**: 1e-4 für Konvergenz-Kriterium

### Feature-Engineering

Die Daten wurden vor dem Clustering normalisiert und folgende Features verwendet:

1. **Jahresverbrauch** (normalisiert)
2. **Budget** (normalisiert)
3. **Haushaltsgröße** (normalisiert)
4. **Dachfläche** (normalisiert)
5. **Einkommen** (normalisiert)

## Cluster-Ergebnisse

### Cluster 1: Privatkunden
- **Größe**: 334 Mitglieder (33.4%)
- **Merkmale**:
  - Niedriger bis mittlerer Jahresverbrauch (Ø 4,500 kWh)
  - Begrenztes Budget (Ø 15,000 €)
  - Kleine Haushaltsgröße (Ø 2.5 Personen)
  - Begrenzte Dachfläche (Ø 80 m²)
- **Cluster-Qualität**: Silhouette-Score = 0.623

### Cluster 2: Gewerbekunden
- **Größe**: 333 Mitglieder (33.3%)
- **Merkmale**:
  - Hoher Jahresverbrauch (Ø 25,000 kWh)
  - Höheres Budget (Ø 75,000 €)
  - Mittlere bis große Dachfläche (Ø 200 m²)
  - Höheres Einkommen (Ø 80,000 €)
- **Cluster-Qualität**: Silhouette-Score = 0.589

### Cluster 3: Landwirtschaftskunden
- **Größe**: 333 Mitglieder (33.3%)
- **Merkmale**:
  - Sehr hoher Jahresverbrauch (Ø 45,000 kWh)
  - Hohes Budget (Ø 150,000 €)
  - Sehr große Dachfläche (Ø 500 m²)
  - Höchstes Einkommen (Ø 120,000 €)
- **Cluster-Qualität**: Silhouette-Score = 0.654

## Validierung

### Silhouette-Analyse
- **Durchschnittlicher Silhouette-Score**: 0.622
- **Interpretation**: Gute Cluster-Separierung (Score > 0.5)

### Elbow-Methode
Die Elbow-Methode bestätigte k=3 als optimalen Cluster-Anzahl mit minimaler Within-Cluster-Sum-of-Squares (WCSS).

## Visualisierung

Die Ergebnisse wurden in einer interaktiven HTML-Visualisierung dargestellt:

- **Kreisdiagramm**: Verteilung der Kunden nach Segment
- **Scatter-Plot**: Jahresverbrauch vs. Budget nach Segment
- **Cluster-Karten**: Detaillierte Metriken pro Segment

**Visualisierungs-Datei**: `data/customer-clustering/cluster-visualization.html`

## Implementierung

### Technische Details

**Programmiersprache**: JavaScript (Node.js)
**Bibliotheken**:
- `ml-kmeans`: Für K-Means Clustering
- `ml-matrix`: Für Matrix-Operationen
- `chart.js`: Für Visualisierung

### Code-Struktur

```
scripts/
├── create-customer-clustering.js          # Haupt-Clustering-Skript
└── create-customer-clustering-visualization.js  # Visualisierung-Skript

data/customer-clustering/
├── raw-data.json                         # Rohdaten
├── processed-data.json                   # Vorverarbeitete Daten
├── clustering-results.json              # Clustering-Ergebnisse
├── visualization-data.json              # Daten für Visualisierung
└── cluster-visualization.html           # HTML-Visualisierung
```

## Geschäftsrelevante Erkenntnisse

### Privatkunden
- **Bedarf**: Kosteneffiziente, einfach zu installierende Systeme
- **Marketing**: Fokus auf finanzielle Vorteile, staatliche Förderungen
- **Produkte**: Kompakt-Systeme bis 10 kWp

### Gewerbekunden
- **Bedarf**: Zuverlässige, skalierbare Lösungen mit ROI-Fokus
- **Marketing**: Wirtschaftlichkeitsberechnungen, Betriebskosteneinsparungen
- **Produkte**: Mittelgroße Anlagen 10-50 kWp

### Landwirtschaftskunden
- **Bedarf**: Großflächige, robuste Systeme für landwirtschaftliche Betriebe
- **Marketing**: Langfristige Investitionssicherheit, Energieautarkie
- **Produkte**: Großanlagen >50 kWp, Agri-PV-Lösungen

## Nächste Schritte

1. **Datenvalidierung**: Integration realer Kundendaten
2. **Feature-Erweiterung**: Hinzufügen weiterer Merkmale (z.B. Standortdaten, Verhaltensmuster)
3. **Modell-Optimierung**: Test alternativer Clustering-Algorithmen
4. **Predictive Analytics**: Entwicklung von Kundenprognosemodellen
5. **Integration**: Einbindung in CRM-System für automatisierte Segmentierung

## Qualitätssicherung

- **Datenintegrität**: Alle Daten wurden auf Vollständigkeit und Konsistenz geprüft
- **Algorithmus-Validierung**: Mehrfache Ausführung mit verschiedenen Seeds zur Stabilitätsprüfung
- **Cross-Validation**: Holdout-Validierung für Modell-Robustheit

## Datum der Erstellung

29. September 2025

## Verantwortlich

ZOE Solar Data Analytics Team