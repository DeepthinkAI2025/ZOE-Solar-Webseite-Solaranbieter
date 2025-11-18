export interface FAQItem {
  question: string;
  answer: string;
  category: string;
  helpfulVotes?: number;
}

// FAQ-Datenbank für SEO-optimierte Photovoltaik-Unterseite
export const enhancedFAQs: FAQItem[] = [
  // KATEGORIE: KOSTEN & FINANZIERUNG
  {
    category: "Kosten & Finanzierung",
    question: "Was kostet eine Photovoltaikanlage für ein Einfamilienhaus?",
    answer: `
      <p>Die Kosten für eine Photovoltaikanlage variieren je nach Größe und Qualität der Komponenten. <strong>Bei ZOE Solar** beginnen die Preise für eine komplette Anlage (Solarpanels, Wechselrichter, Montage) ab <span class="text-green-600 font-bold">ca. 1.200€/kWp</span>.</p>
      
      <h4>Beispiel-Kostenaufschlüsselung für 8 kWp Anlage:</h4>
      <ul>
        <li><strong>Solarpanels (8 kWp):</strong> 8.000€ - 12.000€</li>
        <li><strong>Wechselrichter:</strong> 1.200€ - 2.000€</li>
        <li><strong>Montage & Installation:</strong> 2.500€ - 3.500€</li>
        <li><strong>Elektroinstallation:</strong> 800€ - 1.500€</li>
        <li><strong>Gesamtkosten:</strong> <span class="text-green-600 font-bold">12.500€ - 19.000€</span></li>
      </ul>
      
      <p><strong>Finanzierung & Förderung:</strong></p>
      <ul>
        <li>KfW-Kredit 270: <strong>0% Zinsen, 100% Förderung</strong></li>
        <li>Investitionszuschuss: <strong>bis zu 30%</strong></li>
        <li>Einspeisevergütung: <strong>0,081€ pro kWh (2025)</strong></li>
      </ul>
      
      <p>Mit unserer <strong>kostenlosen Solar-Berechnung** erhalten Sie eine genaue Kostenaufstellung für Ihre individuelle Anlage.</p>
    `,
    helpfulVotes: 45
  },
  
  {
    category: "Kosten & Finanzierung",
    question: "Lohnt sich die Photovoltaik finanziell wirklich?",
    answer: `
      <p><strong>Ja, Photovoltaik ist eine der rentabelsten Investitionen!**</strong> Unsere ROI-Analyse zeigt deutliche Vorteile:</p>
      
      <h4>Typische Rendite-Berechnung (8 kWp Anlage, 15.000€ Gesamtkosten):</h4>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h5>Jährliche Erträge:</h5>
        <ul>
          <li><strong>Einspeisevergütung:</strong> 1.400€ (ca. 4.000 kWh à 0,081€)</li>
          <li><strong>Eigenverbrauch-Ersparnis:</strong> 900€ (ca. 2.800 kWh à 0,35€)</li>
          <li><strong>Förderzuschüsse (einmalig):</strong> 4.500€ (30% der Investitionskosten)</li>
          <li><strong>Gesamteinsparung jährlich:</strong> <span class="text-green-600 font-bold">2.300€</span></li>
        </ul>
      </div>
      
      <h4>Amortisationszeit: <span class="text-green-600 font-bold">6-8 Jahre!</span></h4>
      
      <p><strong>Nach 25 Jahren Laufzeit erwirtschaften Sie:</strong></p>
      <ul>
        <li>Überschuss: <strong>ca. 55.000€</strong></li>
        <li>Rendite: <strong>12-15% jährlich</strong></li>
        <li>CO₂-Einsparung: <strong>ca. 18 Tonnen pro Jahr</strong></li>
      </ul>
      
      <p><strong>Faktoren für optimale Rentabilität:</strong></p>
      <ul>
        <li>Gute Südausrichtung des Daches</li>
        <li>Geringe Verschattung</li>
        <li>Hoher Eigenverbrauch</li>
        <li>Intelligentes Energiemanagement</li>
      </ul>
    `,
    helpfulVotes: 38
  },

  {
    category: "Kosten & Finanzierung",
    question: "Welche Förderung gibt es für Photovoltaik 2025?",
    answer: `
      <p><strong>2025 gibt es die attraktivste Förderung für Photovoltaik seit Jahren!**</strong> Die aktuellen Programme im Überblick:</p>
      
      <h4>🇩🇪 Bundesförderung für Solar & Speicher (SolarDach-Förderung)</h4>
      <ul>
        <li><strong>Photovoltaik-Anlagen:</strong> 30% Zuschuss auf Komponentenkosten</li>
        <li><strong>Speicher-Bonus:</strong> +5.000€ für Batteriespeicher ab 5 kWh</li>
        <li><strong>Gesamtmaximum:</strong> 60.000€ pro Anlage</li>
        <li><strong>Antrag:</strong> Bafa-Förderportal (www.bafa.de)</li>
      </ul>
      
      <h4>🏛️ KfW-Kredit 270 "Erneuerbare Energien"</h4>
      <ul>
        <li><strong>Zinssatz:</strong> 0% (Stand 2025)</li>
        <li><strong>Höhe:</strong> bis zu 100% der Investitionskosten</li>
        <li><strong>Laufzeit:</strong> bis zu 20 Jahre</li>
        <li><strong>Antrag:</strong> Über Ihre Hausbank</li>
      </ul>
      
      <h4>🏢 Bundesländer-spezifische Förderung</h4>
      <ul>
        <li><strong>Bayern:</strong> 500€ pro kWp (max. 5.000€)</li>
        <li><strong>Baden-Württemberg:</strong> 500€ pro kWp + 500€/kWh Speicher</li>
        <li><strong>Berlin:</strong> 1.500€ für Balkonkraftwerke</li>
        <li><strong>Brandenburg:</strong> 300€/kWp bis max. 3.000€</li>
      </ul>
      
      <h4>💡 Förderung für Gewerbe & Landwirtschaft</h4>
      <ul>
        <li><strong>Agrarphotovoltaik:</strong> bis zu 50% Förderung</li>
        <li><strong>Gewerbliche Anlagen:</strong> 30-40% je nach Bundesland</li>
        <li><strong>Industriedächer:</strong> Sonderkonditionen für Großanlagen</li>
      </ul>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <p><strong>💰 Beispiel: 8 kWp Anlage mit 15.000€ Kosten</strong></p>
        <ul>
          <li>SolarDach-Förderung: 4.500€ (30%)</li>
          <li>KfW-Kredit: 10.500€ (0% Zinsen)</li>
          <li>Ihr Eigenanteil: 0€ (bei 100% Finanzierung)</li>
          <li><strong>Sie zahlen nur die Monatsraten!</strong></li>
        </ul>
      </div>
    `,
    helpfulVotes: 52
  },

  // KATEGORIE: INSTALLATION & TECHNISCHES
  {
    category: "Installation & Technik",
    question: "Wie lange dauert die Installation einer Photovoltaikanlage?",
    answer: `
      <p><strong>Die Installation einer Photovoltaikanlage erfolgt schnell und unkompliziert!</strong></p>
      
      <h4>📋 Installationszeit für verschiedene Anlagengrößen:</h4>
      <ul>
        <li><strong>Balkonkraftwerk (600W):</strong> 2-4 Stunden</li>
        <li><strong>Einfamilienhaus (5-8 kWp):</strong> 1-2 Tage</li>
        <li><strong>Mittlere Anlagen (10-20 kWp):</strong> 2-3 Tage</li>
        <li><strong>Große Gewerbeanlagen (50+ kWp):</strong> 1-2 Wochen</li>
      </ul>
      
      <h4>🔧 Was passiert während der Installation?</h4>
      
      <div class="bg-gray-50 p-4 rounded-lg">
        <h5>Tag 1: Montage der Solarpanels</h5>
        <ul>
          <li>Dachaufmaß und Vorbereitung</li>
          <li>Montage der Befestigungssysteme</li>
          <li>Verlegung der Solarkabel</li>
          <li>Installation der Solarpanels</li>
        </ul>
      </div>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h5>Tag 2: Elektroinstallation</h5>
        <ul>
          <li>Wechselrichter-Installation</li>
          <li>DC- und AC-Verkabelung</li>
          <li>Überspannungsschutzeinrichtung</li>
          <li>Anschluss an das Stromnetz</li>
        </ul>
      </div>
      
      <h4>⚡ Vorab-Koordination erforderlich:</h4>
      <ul>
        <li><strong>Netzanschluss:</strong> 2-4 Wochen Vorlaufzeit</li>
        <li><strong>Kundenberatung:</strong> 1 Woche vor Installation</li>
        <li><strong>Materialbeschaffung:</strong> bereits erfolgt</li>
        <li><strong>Genehmigungen:</strong> übernimmt ZOE Solar für Sie</li>
      </ul>
      
      <h4>🎯 Unser Installations-Service:</h4>
      <ul>
        <li><strong>Checkliste mit Durchführung:</strong> Planung bis Abschluss</li>
        <li><strong>Fachkräfte mit Zertifikat:</strong> TÜV und Elektro-Handwerk</li>
        <li><strong>Saubere Arbeitsweise:</strong> Schutz der Dachfläche</li>
        <li><strong>Sofortige Inbetriebnahme:</strong> nach Abschluss funktionsfähig</li>
      </ul>
    `,
    helpfulVotes: 29
  },

  {
    category: "Installation & Technik",
    question: "Wie lange hält eine Photovoltaikanlage wirklich?",
    answer: `
      <p><strong>Photovoltaik-Anlagen sind auf eine Lebensdauer von 25-30 Jahren ausgelegt** und überdauern ihre Garantiezeit oft deutlich!</p>
      
      <h4>🔋 Lebensdauer der einzelnen Komponenten:</h4>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h5>Solarpanels</h5>
        <ul>
          <li><strong>Herstellergarantie:</strong> 25-30 Jahre</li>
          <li><strong>Leistungsebbau:</strong> <span class="text-green-600 font-bold">0,5% pro Jahr</span></li>
          <li><strong>Nach 25 Jahren:</strong> noch 88% der ursprünglichen Leistung</li>
          <li><strong>Messproblem:</strong> praktisch unbegrenzt nutzbar</li>
        </ul>
      </div>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h5>Wechselrichter</h5>
        <ul>
          <li><strong>Herstellergarantie:</strong> 10-15 Jahre</li>
          <li><strong>Lebensdauer:</strong> 15-20 Jahre</li>
          <li><strong>Austausch:</strong> nach 15-20 Jahren einfach möglich</li>
          <li><strong>Kosten:</strong> ca. 1.000-2.000€</li>
        </ul>
      </div>
      
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h5>Speichersysteme</h5>
        <ul>
          <li><strong>Zyklenfestigkeit:</strong> 6.000-10.000 Ladezyklen</li>
          <li><strong>Lebensdauer:</strong> 15-20 Jahre</li>
          <li><strong>Kapazitätsverlust:</strong> ca. 1-2% pro Jahr</li>
          <li><strong>Nach 10 Jahren:</strong> noch 80-90% der ursprünglichen Kapazität</li>
        </ul>
      </div>
      
      <h4>📈 Faktoren für maximale Lebensdauer:</h4>
      
      <ul>
        <li><strong>Qualität der Komponenten:</strong> Premium-Module und Wechselrichter</li>
        <li><strong>Professionelle Installation:</strong> fachgerechte Montage und Verkabelung</li>
        <li><strong>Regelmäßige Wartung:</strong> jährliche Sichtprüfung und Reinigung</li>
        <li><strong>Witterungsschutz:</strong> geeignete Halterung und Überspannungsschutz</li>
        <li><strong>Überwachung:</strong> kontinuierliches Monitoring für Früherkennung</li>
      </ul>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h4>🎯 Unser Wartungs-Service:</h4>
        <ul>
          <li><strong>Jährliche Funktionsprüfung</strong></li>
          <li><strong>Reinigung der Panels</strong></li>
          <li><strong>Sofortige Reparatur bei Defekten</strong></li>
          <li><strong>Kostenlose Leistungsüberwachung</strong></li>
        </ul>
      </div>
      
      <p><strong>Fazit:</strong> Mit ZOE Solar investieren Sie in eine Technologie, die Sie über Jahrzehnte zuverlässig mit sauberer Energie versorgt!</p>
    `,
    helpfulVotes: 34
  },

  {
    category: "Installation & Technik",
    question: "Welche Dachtypen sind für Photovoltaik geeignet?",
    answer: `
      <p><strong>Photovoltaik lässt sich auf nahezu jedem Dach montieren!** Unsere Experten berücksichtigen dabei alle Aspekte:</p>
      
      <h4>🏠 Geeignete Dachtypen:</h4>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h5>Steildächer (optimal)</h5>
        <ul>
          <li><strong>Ziegeldächer:</strong> für alle Ziegelarten geeignet</li>
          <li><strong>Dachsteine:</strong> professionelle Montage</li>
          <li><strong>Dachschindeln:</strong> speziell developed Befestigung</li>
          <li><strong>Neigungswinkel:</strong> 15-60° ideal für Solar</li>
        </ul>
      </div>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h5>Flachdächer</h5>
        <ul>
          <li><strong>Aufständerung:</strong> optimale Neigung (10-35°)</li>
          <li><strong>Auflastverankerung:</strong> kostenlos, ohne Dachdurchdringung</li>
          <li><strong>Wartungsfreundlichkeit:</strong> beste Zugänglichkeit</li>
          <li><strong>Erweiterbarkeit:</strong> einfach erweiterbar</li>
        </ul>
      </div>
      
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h5>Sonderdachformen</h5>
        <ul>
          <li><strong>Fachwerkdächer:</strong> individuelle Lösungen</li>
          <li><strong>Kuppeldächer:</strong> angepasste Montage</li>
          <li><strong>Pultdächer:</strong> hohe Rendite (optimal ausgerichtet)</li>
          <li><strong>Carports:</strong> Überdachung + Solar</li>
        </ul>
      </div>
      
      <h4>🔍 Unser Dach-Analyse-Service:</h4>
      
      <ul>
        <li><strong>Kostenlose Dachbegehung:</strong> vor Ort zur optimalen Planung</li>
        <li><strong>3D-Vermessung:</strong> präzise Datenerfassung für Simulation</li>
        <li><strong>Schattensimulation:</strong> maximale Ertragsberechnung</li>
        <li><strong>Dachzustandsprüfung:</strong> vor Installation erforderlich</li>
      </ul>
      
      <h4>⚠️ Nicht geeignete Bedingungen:</h4>
      
      <ul>
        <li><strong>Asbestdach:</strong> nur nach Entfernung</li>
        <li><strong>Über 50 Jahre altes Dach:</strong> Sanierung erforderlich</li>
        <li><strong>Starke Verschattung:</strong> reduzierte Effizienz</li>
        <li><strong>Nordfassade:</strong> schlechte Wirtschaftlichkeit</li>
      </ul>
      
      <div class="bg-purple-50 p-4 rounded-lg">
        <h4>💡 ZOE Solar Expertise:</h4>
        <ul>
          <li><strong>Über 1.000 Dächer</strong> in 2024 erfolgreich ausgestattet</li>
          <li><strong>Alle Dachformen</strong> kein Problem für unsere Spezialisten</li>
          <li><strong>Versicherungsschutz</strong> für alle Arbeiten</li>
          <li><strong>Garantie</strong> auf Montage und Material</li>
        </ul>
      </div>
    `,
    helpfulVotes: 27
  },

  // KATEGORIE: LEISTUNG & ENERGIE
  {
    category: "Leistung & Energie",
    question: "Wie viel Strom erzeugt eine Photovoltaikanlage?",
    answer: `
      <p><strong>Der Energieertrag einer PV-Anlage hängt von verschiedenen Faktoren ab!** Hier die detaillierte Übersicht:</p>
      
      <h4>📊 Standard-Erträge in Deutschland (Südost-Ausrichtung, 35° Neigung):</h4>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h5>Anlagengröße und erwarteter Jahresertrag:</h5>
        <ul>
          <li><strong>6 kWp:</strong> 5.400-6.600 kWh pro Jahr</li>
          <li><strong>8 kWp:</strong> 7.200-8.800 kWh pro Jahr</li>
          <li><strong>10 kWp:</strong> 9.000-11.000 kWh pro Jahr</li>
          <li><strong>12 kWp:</strong> 10.800-13.200 kWh pro Jahr</li>
          <li><strong>15 kWp:</strong> 13.500-16.500 kWh pro Jahr</li>
        </ul>
      </div>
      
      <h4>🌍 Regionale Unterschiede in Deutschland:</h4>
      
      <ul>
        <li><strong>Süddeutschland:</strong> 1.000-1.200 kWh/kWp</li>
        <li><strong>Mitteldeutschland:</strong> 950-1.100 kWh/kWp</li>
        <li><strong>Norddeutschland:</strong> 850-1.000 kWh/kWp</li>
        <li><strong>Küstenregionen:</strong> 900-1.050 kWh/kWp</li>
      </ul>
      
      <h4>📅 Saisonale Erträge (Beispiel 8 kWp Anlage):</h4>
      
      <ul>
        <li><strong>Januar:</strong> 200-250 kWh (niedrigste Ausbeute)</li>
        <li><strong>März-Mai:</strong> 650-800 kWh (Frühling)</li>
        <li><strong>Juni-August:</strong> 850-1.000 kWh (Höchster Ertrag)</li>
        <li><strong>September-November:</strong> 500-650 kWh (Herbst)</li>
        <li><strong>Dezember:</strong> 180-220 kWh</li>
      </ul>
      
      <h4>⚡ Optimale Ausrichtung und Neigung:</h4>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h5>Ertragssteigerung durch optimale Ausrichtung:</h5>
        <ul>
          <li><strong>Süd (180°):</strong> 100% (Basiswert)</li>
          <li><strong>Südost/Südwest (135°/225°):</strong> 95%</li>
          <li><strong>Ost/West (90°/270°):</strong> 85%</li>
          <li><strong>Nordost/Nordwest (45°/315°):</strong> 70%</li>
        </ul>
      </div>
      
      <h4>🎯 Einflussfaktoren auf den Ertrag:</h4>
      
      <ul>
        <li><strong>Dachausrichtung:</strong> Süd optimal, Südost/Südwest fast gleich gut</li>
        <li><strong>Dachneigung:</strong> 30-40° ideal für ganzjährigen Ertrag</li>
        <li><strong>Verschattung:</strong> auch partielle Schatten reduzieren Ertrag um 10-30%</li>
        <li><strong>Panel-Qualität:</strong> Premium-Module 5-10% effizienter</li>
        <li><strong>Temperatur:</strong> extreme Hitze reduziert Ertrag</li>
      </ul>
      
      <h4>📱 Beispiel: Familie Schmidt (4 Personen, 8 kWp Anlage):</h4>
      
      <ul>
        <li><strong>Stromverbrauch:</strong> 4.500 kWh pro Jahr</li>
        <li><strong>Solarertrag:</strong> 8.000 kWh pro Jahr</li>
        <li><strong>Eigenverbrauch:</strong> 2.800 kWh (62%)</li>
        <li><strong>Einspeisung:</strong> 5.200 kWh (38%)</li>
        <li><strong>Autarkiegrad:</strong> 62% (ohne Speicher)</li>
      </ul>
      
      <p><strong>Mit unserem kostenlosen Ertragsrechner** erhalten Sie eine exakte Vorhersage für Ihr spezifisches Dach!</p>
    `,
    helpfulVotes: 41
  },

  {
    category: "Leistung & Energie",
    question: "Wieviel Eigenverbrauch ist mit Photovoltaik realistisch?",
    answer: `
      <p><strong>Der Eigenverbrauch von Solarstrom ist der Schlüssel zur Rentabilität!** 60-80% Eigennutzung ist realistisch:</p>
      
      <h4>📊 Typische Eigenverbrauchs-Quoten:</h4>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h5>Ohne Speichersystem:</h5>
        <ul>
          <li><strong>Durchschnittlich:</strong> 25-40% des Solarertrags</li>
          <li><strong>Gute Nutzer:</strong> 40-50% durch smarten Verbrauch</li>
          <li><strong>Schlechte Nutzer:</strong> 15-25% (Vieltagsnutzung, wenig daheim)</li>
          <li><strong>Wichtig:</strong> Anpassung der Verbrauchsgewohnheiten!</li>
        </ul>
      </div>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h5>Mit Batteriespeicher:</h5>
        <ul>
          <li><strong>Ungesteuert:</strong> 50-60% des Solarertrags</li>
          <li><strong>Smart gesteuert:</strong> 70-80% des Solarertrags</li>
          <li><strong>Elektroauto + Speicher:</strong> 85-90% Autarkie</li>
          <li><strong>Komplette Unabhängigkeit:</strong> möglich mit Wärmepumpe</li>
        </ul>
      </div>
      
      <h4>⏰ Beste Verbrauchszeiten für Solarstrom:</h4>
      
      <ul>
        <li><strong>11-15 Uhr:</strong> Höchste Solarproduktion (Peak-Zeiten)</li>
        <li><strong>Waschmaschine/Geschirrspüler:</strong> 10-14 Uhr starten</li>
        <li><strong>E-Bike/Werkstatt laden:</strong> Mittags (12-15 Uhr)</li>
        <li><strong>Wäschetrockner:</strong> Nur bei viel Sonne verwenden</li>
      </ul>
      
      <h4>🏠 Haushaltsgeräte für Eigenverbrauch optimieren:</h4>
      
      <div class="bg-purple-50 p-4 rounded-lg">
        <h5>Hoher Verbrauch tagsüber (ideal für PV):</h5>
        <ul>
          <li><strong>Waschmaschine:</strong> 0,5-1,5 kWh pro Waschgang</li>
          <li><strong>Geschirrspüler:</strong> 1-2 kWh pro Spülgang</li>
          <li><strong>Elektroauto:</strong> 15-25 kWh pro 100km</li>
          <li><strong>Wärmepumpe:</strong> 8-12 kWh pro Tag</li>
        </ul>
      </div>
      
      <h4>🔋 Strategien für höheren Eigenverbrauch:</h4>
      
      <ul>
        <li><strong>Smart Home:</strong> automatische Steuerung von Verbrauchern</li>
        <li><strong>Thermal-Management:</strong> Wäsche/Kochen tagsüber</li>
        <li><strong>Batteriespeicher:</strong> Sonnenenergie für Abend/Nacht</li>
        <li><strong>Elektroauto:</strong> als mobiler Speicher nutzen</li>
        <li><strong>Wärmespeicher:</strong> Heizung/Brauchwasser mit Überschuss</li>
      </ul>
      
      <h4>💰 Wirtschaftliche Auswirkung des Eigenverbrauchs:</h4>
      
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h5>Eigenverbrauch vs. Einspeisung (Preise 2025):</h5>
        <ul>
          <li><strong>Eigenverbrauch:</strong> 0,35€ pro kWh (Strompreisersparnis)</li>
          <li><strong>Einspeisung:</strong> 0,081€ pro kWh (EEG-Vergütung)</li>
          <li><strong>Vorteil Eigenverbrauch:</strong> <span class="text-green-600 font-bold">4,3x höherer Wert!</span></li>
        </ul>
      </div>
      
      <h4>🎯 Beispiel: Familie Müller (8 kWp Anlage, 10.000€ Gewinn über 25 Jahre)</h4>
      
      <ul>
        <li><strong>Szenario A (30% Eigenverbrauch):</strong> 10.000€ Gewinn</li>
        <li><strong>Szenario B (70% Eigenverbrauch):</strong> 15.000€ Gewinn (+50%)</li>
        <li><strong>Differenz:</strong> 5.000€ durch bessere Verbrauchsstrategien!</li>
      </ul>
      
      <p><strong>Unser Solarberater zeigt Ihnen:** Wie Sie Ihren Eigenverbrauch maximieren und so noch mehr Geld sparen!</p>
    `,
    helpfulVotes: 35
  },

  // KATEGORIE: RECHTLICHES & GENEHMIGUNGEN
  {
    category: "Rechtliches & Genehmigungen",
    question: "Braucht man eine Genehmigung für Photovoltaik?",
    answer: `
      <p><strong>Die meisten PV-Anlagen sind genehmigungsfrei,** aber Ausnahmen gibt es! ZOE Solar kümmert sich um alles:</p>
      
      <h4>✅ Genehmigungsfreie Anlagen (Regelfall):</h4>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h5>Automatisch genehmigungsfrei:</h5>
        <ul>
          <li><strong>Aufdachanlagen:</strong> auf bestehenden Gebäuden</li>
          <li><strong>Dachintegration:</strong> Solardächer oder -ziegel</li>
          <li><strong>Flachdach-Aufständerung:</strong> bis 3m Höhe</li>
          <li><strong>Kleinstanlagen:</strong> bis 7,84 kWp (Anmeldepflichtig nur beim Netzbetreiber)</li>
          <li><strong>Balkonkraftwerke:</strong> bis 600W (registrierungspflichtig)</li>
        </ul>
      </div>
      
      <h4>📋 Anmeldepflichtig IMMER (nicht genehmigungspflichtig):</h4>
      
      <ul>
        <li><strong>Netzbetreiber:</strong> Vor Inbetriebnahme anmelden</li>
        <li><strong>Finanzamt:</strong> als Einnahmequelle melden</li>
        <li><strong>GEMA:</strong> für Anlagen über 7,84 kWp</li>
        <li><strong>Versicherung:</strong> Anlage dem Versicherer melden</li>
      </ul>
      
      <h4>⚠️ Genehmigungspflichtige Fälle:</h4>
      
      <div class="bg-red-50 p-4 rounded-lg">
        <h5>Genehmigung erforderlich:</h5>
        <ul>
          <li><strong>Freiflächenanlagen:</strong> in bebauten Gebieten</li>
          <li><strong>Denkmalschutz:</strong> bei geschützten Gebäuden</li>
          <li><strong>Stadtbildschutz:</strong> bei Ensemble-Schutz</li>
          <li><strong>Gewässerabstände:</strong> zu Gewässern 1. Ordnung</li>
          <li><strong>Befristete Genehmigung:</strong> bei befristeten Bebauungsplänen</li>
        </ul>
      </div>
      
      <h4>🏛️ Behörden-Koordination durch ZOE Solar:</h4>
      
      <ul>
        <li><strong>Bauamt:</strong> Bei genehmigungspflichtigen Fällen</li>
        <li><strong>Denkmalschutz:</strong> Vermittlung mit Denkmalschutzbehörde</li>
        <li><strong>Untere Naturschutzbehörde:</strong> Bei naturschutzrechtlichen Bedenken</li>
        <li><strong>Stadtplanung:</strong> Bei städtebaulichen Konflikten</li>
      </ul>
      
      <h4>📄 Benötigte Dokumente:</h4>
      
      <ul>
        <li><strong>Grundstückseigentümererklärung:</strong> vom Eigentümer</li>
        <li><strong>Stromlieferungsvertrag:</strong> mit regionalem Netzbetreiber</li>
        <li><strong>Anlagendatenblatt:</strong> technische Spezifikationen</li>
        <li><strong>Statikprüfung:</strong> bei großen Anlagen (>50kWp)</li>
      </ul>
      
      <h4>⏰ Zeitaufwand für Genehmigungen:</h4>
      
      <ul>
        <li><strong>Standard-Aufdachanlage:</strong> Keine Genehmigung (sofort)</li>
        <li><strong>Genehmigungspflichtig:</strong> 4-8 Wochen Bearbeitungszeit</li>
        <li><strong>Denkmalschutz:</strong> 6-12 Wochen inkl. Abstimmungen</li>
        <li><strong>ZOE Solar Übernahme:** vollständige Abwicklung für Sie</li>
      </ul>
      
      <h4>🎯 Unsere Genehmigungs-Expertise:</h4>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <ul>
          <li><strong>99% genehmigungsfreie Projekte:** durch optimale Vorprüfung</li>
          <li><strong>Schnellbearbeitung:** bei erforderlichen Genehmigungen</li>
          <li><strong>Vollständige Abwicklung:** alle Behördenkommunikation</li>
          <li><strong>Rechtsschutz:** bei streitigen Fällen</li>
        </ul>
      </div>
    `,
    helpfulVotes: 23
  },

  {
    category: "Rechtliches & Genehmigungen",
    question: "Was ist beim Steuerlichen zu beachten?",
    answer: `
      <p><strong>Photovoltaik ist steuerlich sehr attraktiv!** Gewerblich genutzte Anlagen bieten erhebliche Steuervorteile:</p>
      
      <h4>💰 Gewerbesteuer-Befreiung (bis 2023):</h4>
      
      <div class="bg-yellow-50 p-4 rounded-lg">
        <h5>Wichtige Rechtslage:</h5>
        <ul>
          <li><strong>Bis 31.12.2022:</strong> 90% der Gewinne steuerfrei (≤ 45.000€ Gewinn)</li>
          <li><strong>Ab 01.01.2023:</strong> <span class="text-red-600 font-bold">Entfällt diese Befreiung!</span></li>
          <li><strong>Neue Regelung:** volle Gewerbesteuerpflicht für PV-Anlagen</li>
          <li><strong>Ausnahme:** Bagatellgrenze 450€ Gewinn pro Jahr</li>
        </ul>
      </div>
      
      <h4>📊 Alternativen zur gewerblichen Nutzung:</h4>
      
      <div class="bg-green-50 p-4 rounded-lg">
        <h5>Optionen für Privathaushalte:</h5>
        <ul>
          <li><strong>Vermietung des Dachgeldes:** 1.000-3.000€ pro Jahr steuerfrei</li>
          <li><strong>Steuersparmodelle:** über Energieberatungsunternehmen</li>
          <li><strong>Gewinnrücklage:** für zukünftige Abschreibungen</li>
          <li><strong>Separation des Geschäftsbereichs:** separate GmbH</li>
        </ul>
      </div>
      
      <h4>🏠 Steuerliche Behandlung Privat:</h4>
      
      <ul>
        <li><strong>Private Nutzung:** keine Einkommensteuer</li>
        <li><strong>Einspeisevergütung:** umsatzsteuerpflichtig (19%)</li>
        <li><strong>Vereinfachungsoption:** Kleinunternehmerregelung bis 22.000€ Umsatz</li>
        <li><strong>Abschreibung:** lineare AfA über 20 Jahre</li>
      </ul>
      
      <h4>💼 Gewerbetreibende / Unternehmen:</h4>
      
      <div class="bg-blue-50 p-4 rounded-lg">
        <h5>Optimale steuerliche Gestaltung:</h5>
        <ul>
          <li><strong>AfA-Positionen:** 20 Jahre lineare Abschreibung</li>
          <li><strong>Betriebsausgaben:** Planung, Montage, Wartung</li>
          <li><strong>Vorsteuerabzug:** bei unternehmerischer Nutzung</li>
          <li><strong>Erweiterte Abschreibungen:** für KMU-Betriebe</li>
        </ul>
      </div>
      
      <h4>📈 Abschreibungs-Tabelle (Beispiel 50.000€ Anlage):</h4>
      
      <ul>
        <li><strong>Jahr 1:</strong> 2.500€ Abschreibung</li>
        <li><strong>Jahr 2:</strong> 2.500€ Abschreibung</li>
        <li><strong>...</strong> (über 20 Jahre)</li>
        <li><strong>Gesamtabschreibung:** 50.000€</li>
      </ul>
      
      <h4>🏛️ Umsatzsteuer und Vorsteuer:</h4>
      
      <ul>
        <li><strong>Vorsteuer-Rückerstattung:** beim Finanzamt beantragen</li>
        <li><strong>Anlage Kosten:** zzgl. 19% MwSt. bei privater Nutzung</li>
        <li><strong>Einspeisevergütung:** umsatzsteuerpflichtig</li>
        <li><strong>Kleinunternehmerregelung:** bis 22.000€ Umsatz möglich</li>
      </ul>
      
      <h4>🎯 Steuerberatung durch ZOE Solar-Partner:</h4>
      
      <div class="bg-purple-50 p-4 rounded-lg">
        <ul>
          <li><strong>Kostenlose Steuerberatung:** bei allen PV-Projekten</li>
          <li><strong>Optimale Gestaltungsberatung:** für individuelle Situation</li>
          <li><strong>Antragsstellung:** Finanzamt, Vorsteuer, AfA</li>
          <li><strong>Langfristige Betreuung:** jährliche Steuererklärung</li>
        </ul>
      </div>
      
      <p><strong>Wichtig:** Steuerliche Aspekte sind komplex! Lassen Sie sich von unseren Steuerberatern beraten, um das Maximum aus Ihrer PV-Anlage zu holen.</p>
    `,
    helpfulVotes: 31
  }
];

// Hilfsfunktionen für FAQ-Daten
export const getFAQsByCategory = (category: string): FAQItem[] => {
  if (category === 'alle') {
    return enhancedFAQs;
  }
  return enhancedFAQs.filter(faq => faq.category === category);
};

export const getFAQCategories = (): string[] => {
  return Array.from(new Set(enhancedFAQs.map(faq => faq.category)));
};

export const getMostHelpfulFAQs = (limit: number = 5): FAQItem[] => {
  return [...enhancedFAQs]
    .sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0))
    .slice(0, limit);
};