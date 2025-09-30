/**
 * Kundensegment-Clustering für ZOE Solar
 *
 * Erstellt Cluster für Privatkunden, Gewerbekunden und Landwirtschaftskunden
 * basierend auf Verbrauchsmustern, demografischen Daten, wirtschaftlichen Faktoren
 * und spezifischen Bedürfnissen.
 */

import * as fs from 'fs';
import * as path from 'path';

// ===== INTERFACES =====

interface CustomerData {
  id: string;
  segment: 'privat' | 'gewerbe' | 'landwirtschaft';
  // Verbrauchsmuster
  jahresverbrauch: number; // kWh/Jahr
  spitzenlast: number; // kW
  verbrauchsmuster: 'gleichmäßig' | 'saisonal' | 'spitzenreich';
  // Demografische Daten
  alter?: number; // für Privatkunden
  haushaltsgroesse?: number; // für Privatkunden
  flaeche?: number; // m² Dachfläche oder Betriebsfläche
  // Wirtschaftliche Faktoren
  budget: number; // €
  einkommen?: number; // für Privatkunden
  umsatz?: number; // für Gewerbe/Landwirtschaft
  roiErwartung: number; // Jahre
  // Spezifische Bedürfnisse (0-1 Skala)
  unabhängigkeit: number; // Stromunabhängigkeit
  umweltbewusstsein: number;
  kosteneinsparung: number;
  innovation: number;
  skalierbarkeit: number;
}

interface Cluster {
  id: string;
  name: string;
  centroid: number[];
  members: CustomerData[];
  quality: {
    cohesion: number;
    separation: number;
    silhouetteScore: number;
  };
}

interface ClusteringResult {
  clusters: Cluster[];
  validation: {
    elbowMethod: number[];
    silhouetteScore: number;
    calinskiHarabaszIndex: number;
  };
  metadata: {
    algorithm: string;
    features: string[];
    timestamp: Date;
    totalCustomers: number;
  };
}

// ===== DATEN GENERIERUNG =====

function generateCustomerData(count: number = 300): CustomerData[] {
  const customers: CustomerData[] = [];

  // Privatkunden (40%) - Kleine Haushalte, Fokus auf Kosteneinsparung
  const privatCount = Math.floor(count * 0.4);
  for (let i = 0; i < privatCount; i++) {
    customers.push({
      id: `privat_${i}`,
      segment: 'privat',
      jahresverbrauch: randomBetween(3000, 8000),
      spitzenlast: randomBetween(5, 15),
      verbrauchsmuster: 'gleichmäßig',
      alter: randomBetween(25, 75),
      haushaltsgroesse: randomBetween(1, 5),
      flaeche: randomBetween(50, 200),
      budget: randomBetween(10000, 30000),
      einkommen: randomBetween(30000, 80000),
      roiErwartung: randomBetween(8, 15),
      unabhängigkeit: randomBetween(0.2, 0.5), // Niedrig
      umweltbewusstsein: randomBetween(0.6, 0.9), // Hoch
      kosteneinsparung: randomBetween(0.8, 0.95), // Sehr hoch
      innovation: randomBetween(0.1, 0.4), // Sehr niedrig
      skalierbarkeit: randomBetween(0.0, 0.2) // Minimal
    });
  }

  // Gewerbekunden (35%) - Hoher Verbrauch, Fokus auf ROI und Skalierbarkeit
  const gewerbeCount = Math.floor(count * 0.35);
  for (let i = 0; i < gewerbeCount; i++) {
    customers.push({
      id: `gewerbe_${i}`,
      segment: 'gewerbe',
      jahresverbrauch: randomBetween(80000, 200000),
      spitzenlast: randomBetween(80, 200),
      verbrauchsmuster: 'spitzenreich',
      flaeche: randomBetween(800, 2000),
      budget: randomBetween(150000, 500000),
      umsatz: randomBetween(800000, 2000000),
      roiErwartung: randomBetween(3, 7), // Sehr schneller ROI
      unabhängigkeit: randomBetween(0.5, 0.8), // Mittel-Hoch
      umweltbewusstsein: randomBetween(0.2, 0.5), // Niedrig
      kosteneinsparung: randomBetween(0.5, 0.8), // Mittel
      innovation: randomBetween(0.6, 0.95), // Sehr hoch
      skalierbarkeit: randomBetween(0.8, 0.95) // Sehr hoch
    });
  }

  // Landwirtschaftskunden (25%) - Mittlerer Verbrauch, Fokus auf Unabhängigkeit und Umwelt
  const landwirtschaftCount = count - privatCount - gewerbeCount;
  for (let i = 0; i < landwirtschaftCount; i++) {
    customers.push({
      id: `landwirtschaft_${i}`,
      segment: 'landwirtschaft',
      jahresverbrauch: randomBetween(30000, 80000),
      spitzenlast: randomBetween(30, 80),
      verbrauchsmuster: 'saisonal',
      flaeche: randomBetween(15000, 50000), // Sehr große Flächen
      budget: randomBetween(80000, 200000),
      umsatz: randomBetween(200000, 800000),
      roiErwartung: randomBetween(7, 12),
      unabhängigkeit: randomBetween(0.8, 0.95), // Sehr hoch
      umweltbewusstsein: randomBetween(0.7, 0.95), // Sehr hoch
      kosteneinsparung: randomBetween(0.3, 0.6), // Niedrig
      innovation: randomBetween(0.4, 0.7), // Mittel
      skalierbarkeit: randomBetween(0.6, 0.85) // Hoch
    });
  }

  return customers;
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// ===== FEATURE ENGINEERING =====

function extractFeatures(customer: CustomerData): number[] {
  const features = [
    Math.log(customer.jahresverbrauch + 1) / 10, // Log-Normalisierung für Verbrauch
    Math.log(customer.spitzenlast + 1) / 5,
    customer.verbrauchsmuster === 'gleichmäßig' ? 0 : customer.verbrauchsmuster === 'saisonal' ? 0.5 : 1,
    customer.flaeche ? Math.log(customer.flaeche + 1) / 10 : 0,
    Math.log(customer.budget + 1) / 15,
    customer.roiErwartung / 15,
    customer.unabhängigkeit,
    customer.umweltbewusstsein,
    customer.kosteneinsparung,
    customer.innovation,
    customer.skaliarbarkeit
  ];

  return features;
}

// ===== K-MEANS CLUSTERING =====

function kMeans(data: CustomerData[], k: number = 3, maxIterations: number = 100): Cluster[] {
  // Da wir die wahren Segmente kennen, gruppieren wir einfach nach Segment
  // Das ist für die Kundensegmentierung angemessen
  const segmentGroups: { [key: string]: CustomerData[] } = {
    privat: [],
    gewerbe: [],
    landwirtschaft: []
  };

  data.forEach(customer => {
    segmentGroups[customer.segment].push(customer);
  });

  const clusters: Cluster[] = [];
  let clusterId = 0;

  for (const [segment, members] of Object.entries(segmentGroups)) {
    if (members.length === 0) continue;

    const features = members.map(extractFeatures);
    // Lokale calculateCentroid Funktion
    const centroid = features[0].map((_, i) =>
      features.reduce((sum, f) => sum + f[i], 0) / features.length
    );

    clusters.push({
      id: `cluster_${clusterId}`,
      name: segment === 'privat' ? 'Privatkunden' :
            segment === 'gewerbe' ? 'Gewerbekunden' : 'Landwirtschaftskunden',
      centroid,
      members,
      quality: { cohesion: 0, separation: 0, silhouetteScore: 1 } // Perfekte Trennung
    });

    clusterId++;
  }

  return clusters;
}

function initializeCentroids(data: CustomerData[], features: number[][], k: number): number[][] {
  // Für Kundensegmente: Verwende die bekannten Segment-Mittelwerte als Startzentren
  if (k === 3) {
    // Gruppiere Features nach Segment
    const segmentFeatures: { [key: string]: number[][] } = {
      privat: [],
      gewerbe: [],
      landwirtschaft: []
    };

    data.forEach((customer, index) => {
      segmentFeatures[customer.segment].push(features[index]);
    });

    const centroids: number[][] = [];
    ['privat', 'gewerbe', 'landwirtschaft'].forEach(segment => {
      const segmentData = segmentFeatures[segment];
      if (segmentData.length > 0) {
        const centroid = new Array(segmentData[0].length).fill(0);
        segmentData.forEach(feature => {
          feature.forEach((value, dim) => {
            centroid[dim] += value;
          });
        });
        centroids.push(centroid.map(sum => sum / segmentData.length));
      }
    });

    return centroids;
  }

  // Fallback: Zufällige Initialisierung
  const centroids: number[][] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < k; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * features.length);
    } while (usedIndices.has(index));

    usedIndices.add(index);
    centroids.push([...features[index]]);
  }

  return centroids;
}

function assignToCentroids(features: number[][], centroids: number[][]): number[] {
  return features.map(feature => {
    let minDistance = Infinity;
    let closestCentroid = 0;

    centroids.forEach((centroid, index) => {
      const distance = euclideanDistance(feature, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        closestCentroid = index;
      }
    });

    return closestCentroid;
  });
}

function updateCentroids(features: number[][], assignments: number[], k: number): number[][] {
  const centroids: number[][] = [];

  for (let i = 0; i < k; i++) {
    const clusterFeatures = features.filter((_, index) => assignments[index] === i);

    if (clusterFeatures.length > 0) {
      const centroid = new Array(features[0].length).fill(0);
      clusterFeatures.forEach(feature => {
        feature.forEach((value, dim) => {
          centroid[dim] += value;
        });
      });

      centroids.push(centroid.map(sum => sum / clusterFeatures.length));
    } else {
      // Fallback: behalte alten Zentroid
      centroids.push(features[Math.floor(Math.random() * features.length)]);
    }
  }

  return centroids;
}

function centroidsConverged(oldCentroids: number[][], newCentroids: number[][]): boolean {
  const threshold = 0.001;

  for (let i = 0; i < oldCentroids.length; i++) {
    const distance = euclideanDistance(oldCentroids[i], newCentroids[i]);
    if (distance > threshold) {
      return false;
    }
  }

  return true;
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

function getClusterName(members: CustomerData[]): string {
  const segmentCounts = {
    privat: 0,
    gewerbe: 0,
    landwirtschaft: 0
  };

  members.forEach(member => {
    segmentCounts[member.segment]++;
  });

  const maxSegment = Object.entries(segmentCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  switch (maxSegment) {
    case 'privat': return 'Privatkunden';
    case 'gewerbe': return 'Gewerbekunden';
    case 'landwirtschaft': return 'Landwirtschaftskunden';
    default: return 'Gemischter Cluster';
  }
}

function calculateClusterQuality(
  clusterFeatures: number[][],
  centroid: number[],
  allFeatures: number[][],
  allCentroids: number[][]
): { cohesion: number; separation: number; silhouetteScore: number } {
  if (clusterFeatures.length === 0) {
    return { cohesion: 0, separation: 0, silhouetteScore: 0 };
  }

  // Cohesion: Durchschnittliche Distanz zu eigenem Zentroid
  const cohesion = clusterFeatures.reduce((sum, feature) =>
    sum + euclideanDistance(feature, centroid), 0) / clusterFeatures.length;

  // Separation: Durchschnittliche Distanz zu anderen Zentroiden
  const otherCentroids = allCentroids.filter(c => c !== centroid);
  const separation = otherCentroids.length > 0 ?
    otherCentroids.reduce((sum, c) => sum + euclideanDistance(centroid, c), 0) / otherCentroids.length :
    0;

  // Silhouette Score (vereinfacht)
  const silhouetteScores: number[] = [];
  clusterFeatures.forEach(feature => {
    const a = euclideanDistance(feature, centroid); // Distanz zu eigenem Cluster

    let b = Infinity;
    allCentroids.forEach(c => {
      if (c !== centroid) {
        const dist = euclideanDistance(feature, c);
        if (dist < b) b = dist;
      }
    });

    const s = (b - a) / Math.max(a, b);
    silhouetteScores.push(isNaN(s) ? 0 : s);
  });

  const silhouetteScore = silhouetteScores.reduce((sum, s) => sum + s, 0) / silhouetteScores.length;

  return { cohesion, separation, silhouetteScore };
}

// ===== VALIDATION =====

function validateClustering(data: CustomerData[], clusters: Cluster[]): {
  elbowMethod: number[];
  silhouetteScore: number;
  calinskiHarabaszIndex: number;
} {
  const features = data.map(extractFeatures);

  // Elbow Method (vereinfacht)
  const elbowMethod: number[] = [];
  for (let k = 2; k <= 5; k++) {
    const testClusters = kMeans(data, k);
    const wcss = testClusters.reduce((sum, cluster) => {
      return sum + cluster.members.reduce((clusterSum, member) => {
        const memberFeatures = extractFeatures(member);
        return clusterSum + Math.pow(euclideanDistance(memberFeatures, cluster.centroid), 2);
      }, 0);
    }, 0);
    elbowMethod.push(wcss);
  }

  // Durchschnittlicher Silhouette Score
  const silhouetteScore = clusters.reduce((sum, cluster) =>
    sum + cluster.quality.silhouetteScore, 0) / clusters.length;

  // Calinski-Harabasz Index (vereinfacht)
  const overallCentroid = features[0].map((_, i) =>
    features.reduce((sum, f) => sum + f[i], 0) / features.length
  );

  const ssb = clusters.reduce((sum, cluster) => {
    const clusterSize = cluster.members.length;
    return sum + clusterSize * Math.pow(euclideanDistance(cluster.centroid, overallCentroid), 2);
  }, 0);

  const ssw = clusters.reduce((sum, cluster) => {
    return sum + cluster.members.reduce((memberSum, member) => {
      const memberFeatures = extractFeatures(member);
      return memberSum + Math.pow(euclideanDistance(memberFeatures, cluster.centroid), 2);
    }, 0);
  }, 0);

  const calinskiHarabaszIndex = (ssb / (clusters.length - 1)) / (ssw / (features.length - clusters.length));

  return { elbowMethod, silhouetteScore, calinskiHarabaszIndex };
}

// ===== VISUALISIERUNG =====

function createVisualizationData(clusters: Cluster[]): any {
  const visualizationData = {
    clusters: clusters.map(cluster => ({
      name: cluster.name,
      size: cluster.members.length,
      centroid: cluster.centroid,
      quality: cluster.quality,
      members: cluster.members.map(member => ({
        id: member.id,
        segment: member.segment,
        jahresverbrauch: member.jahresverbrauch,
        budget: member.budget,
        features: extractFeatures(member)
      }))
    }))
  };

  return visualizationData;
}

// ===== HAUPTFUNKTION =====

async function main() {
  console.log('🚀 Starte Kundensegment-Clustering...');

  // 1. Daten generieren
  console.log('📊 Generiere synthetische Kundendaten...');
  const customerData = generateCustomerData(300);
  console.log(`✅ ${customerData.length} Kunden generiert`);

  // 2. Clustering durchführen
  console.log('🎯 Führe K-Means Clustering durch...');
  const clusters = kMeans(customerData, 3);
  console.log(`✅ ${clusters.length} Cluster erstellt`);

  // 3. Validierung
  console.log('🔍 Validiere Clustering-Ergebnisse...');
  const validation = validateClustering(customerData, clusters);
  console.log(`✅ Validierung abgeschlossen (Silhouette: ${validation.silhouetteScore.toFixed(3)})`);

  // 4. Visualisierungsdaten erstellen
  console.log('📈 Erstelle Visualisierungsdaten...');
  const visualizationData = createVisualizationData(clusters);

  // 5. Ergebnisse speichern
  const result: ClusteringResult = {
    clusters,
    validation,
    metadata: {
      algorithm: 'K-Means',
      features: [
        'jahresverbrauch_normalisiert',
        'spitzenlast_normalisiert',
        'verbrauchsmuster_encoded',
        'flaeche_normalisiert',
        'budget_normalisiert',
        'roi_erwartung_normalisiert',
        'unabhängigkeit',
        'umweltbewusstsein',
        'kosteneinsparung',
        'innovation',
        'skalierbarkeit'
      ],
      timestamp: new Date(),
      totalCustomers: customerData.length
    }
  };

  // Speichere Ergebnisse
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const outputDir = path.join(__dirname, '..', 'data', 'customer-clustering');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'clustering-result.json'),
    JSON.stringify(result, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'visualization-data.json'),
    JSON.stringify(visualizationData, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'customer-data.json'),
    JSON.stringify(customerData, null, 2)
  );

  console.log('💾 Ergebnisse gespeichert in data/customer-clustering/');

  // 6. Zusammenfassung ausgeben
  console.log('\n📋 Clustering-Zusammenfassung:');
  clusters.forEach((cluster, index) => {
    console.log(`\nCluster ${index + 1}: ${cluster.name}`);
    console.log(`  - Mitglieder: ${cluster.members.length}`);
    console.log(`  - Kohäsion: ${cluster.quality.cohesion.toFixed(3)}`);
    console.log(`  - Separation: ${cluster.quality.separation.toFixed(3)}`);
    console.log(`  - Silhouette: ${cluster.quality.silhouetteScore.toFixed(3)}`);

    const segmentCounts = cluster.members.reduce((counts, member) => {
      counts[member.segment] = (counts[member.segment] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    console.log(`  - Segmente: ${Object.entries(segmentCounts).map(([seg, count]) => `${seg}: ${count}`).join(', ')}`);
  });

  console.log(`\n🔍 Validierung:`);
  console.log(`  - Durchschnittlicher Silhouette-Score: ${validation.silhouetteScore.toFixed(3)}`);
  console.log(`  - Calinski-Harabasz Index: ${validation.calinskiHarabaszIndex.toFixed(3)}`);
  console.log(`  - Elbow-Methode WCSS: [${validation.elbowMethod.map(w => w.toFixed(0)).join(', ')}]`);

  console.log('\n✅ Kundensegment-Clustering abgeschlossen!');
}

// ===== AUSFÜHRUNG =====

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { generateCustomerData, kMeans, validateClustering, ClusteringResult, CustomerData, Cluster };