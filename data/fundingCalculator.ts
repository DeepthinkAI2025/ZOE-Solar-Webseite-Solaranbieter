export interface FundingCalculatorInput {
  projectType: 'pv' | 'pv-speicher' | 'agri-pv' | 'floating-pv' | 'prozesswaerme';
  customerType: 'privatperson' | 'gewerbe' | 'industrie' | 'landwirtschaft' | 'kommune';
  location: {
    bundesland: string;
    kommune?: string;
    plz: string;
  };
  projectSize: {
    pvKwp: number;
    speicherKwh?: number;
    investmentTotal: number;
  };
  innovationLevel: 'standard' | 'innovative' | 'pilotprojekt';
  eigenverbrauchsanteil: number; // 0-100%
  companySize?: 'kleinstunternehmen' | 'kleinunternehmen' | 'mittleres' | 'grossunternehmen';
}

export interface FundingCalculatorResult {
  totalFunding: number;
  fundingQuote: number; // Prozent
  eigenanteil: number;
  roi: number; // Prozent p.a.
  amortisationTime: number; // Jahre
  applicablePrograms: {
    program: string;
    provider: string;
    amount: number;
    type: 'zuschuss' | 'darlehen' | 'zinsersparnis';
    requirements: string[];
    applicationDeadline?: string;
  }[];
  regionalBonus: number;
  innovationBonus: number;
  co2Savings: number; // Tonnen/Jahr
  nextSteps: string[];
}

export const fundingCalculatorRules = {
  // Bundesweite Programme
  federal: {
    kfw270: {
      eligibleCustomers: ['gewerbe', 'industrie', 'landwirtschaft', 'kommune'],
      maxFunding: 50000000,
      interestRate: 0.021, // 2,1%
      savings: 0.025, // 2,5% Zinsersparnis vs. Hausbank
      requirements: ['hausbankprinzip', 'vor-projektbeginn']
    },
    bafaBew: {
      eligibleCustomers: ['gewerbe', 'industrie'],
      fundingRates: {
        kleinstunternehmen: 0.55,
        kleinunternehmen: 0.45,
        mittleres: 0.35,
        grossunternehmen: 0.25
      },
      maxFunding: 15000000,
      requirements: ['energieaudit', 'mindestinvestition-2000']
    },
    communalGuideline: {
      eligibleCustomers: ['kommune'],
      fundingRate: 0.5,
      maxFunding: 5000000,
      requirements: ['klimaschutzkonzept', 'oeffentliche-gebaeude']
    }
  },

  // Bundesländer-spezifische Programme
  states: {
    'nordrhein-westfalen': {
      progresNrw: {
        pvBonus: 300, // €/kWp
        speicherBonus: 300, // €/kWh
        maxFunding: 75000,
        innovationBonus: 1.5 // Multiplikator
      }
    },
    'baden-wuerttemberg': {
      lBankNetworking: {
        networkingBonus: 0.4, // 40% für Netzwerke
        standardRate: 0.25,
        requirements: ['mindestens-5-gebaeude']
      }
    },
    'bayern': {
      energieBonusBetriebe: {
        pvRate: 0.3,
        speicherBonus: 500, // €/kWh
        innovationBonus: 0.1 // +10%
      }
    },
    'brandenburg': {
      ilbRenplus: {
        speicherRate: 0.4, // 40%
        maxFunding: 45000,
        requirements: ['5-100-kwh']
      }
    },
    'sachsen': {
      sabRlEk: {
        rate: 0.35,
        minInvestment: 1000,
        maxFunding: 500000
      }
    }
  },

  // Kommunale Programme (Beispiele)
  municipalities: {
    'muenchen': {
      maxFunding: 30000,
      rate: 0.3,
      bonusInnovative: 0.4
    },
    'hamburg': {
      mieterstroemBonus: 0.4,
      standardRate: 0.25
    },
    'berlin': {
      solarPlus: 0.3,
      mieterstroemBonus: 300 // €/kWh Speicher
    },
    'koeln': {
      innovationBonus: 0.4,
      standardRate: 0.25
    }
  },

  // Technologie-spezifische Boni
  technology: {
    'agri-pv': {
      euElerBonus: 0.4, // 40% EU-Agrarförderung
      innovationMultiplier: 1.8,
      requirements: ['landwirtschaftliche-nutzung', 'wissenschaftliche-begleitung']
    },
    'floating-pv': {
      innovationBonus: 0.2, // +20%
      forschungsBonus: 0.3, // BMBF etc.
      requirements: ['gewaessernutzung', 'umweltpruefung']
    },
    'prozesswaerme': {
      bafahighRate: 0.65, // BAFA BEW bis 65% für KMU
      industrieBonus: 0.1,
      requirements: ['prozesstemperaturen', 'energieaudit']
    }
  },

  // ROI und Wirtschaftlichkeits-Parameter
  economics: {
    strompreis: 0.28, // €/kWh Gewerbetarif 2025
    einspeiseverguetung: 0.082, // €/kWh (2025)
    eigenverbrauchswert: 0.25, // €/kWh Ersparnis
    co2Faktor: 0.000485, // t CO₂/kWh Netzstrom
    inflationRate: 0.03, // 3% jährliche Strompreissteigerung
    anlagenLebensdauer: 25, // Jahre
    speicherLebensdauer: 15 // Jahre
  }
};

export function calculateFunding(input: FundingCalculatorInput): FundingCalculatorResult {
  const { projectType, customerType, location, projectSize, innovationLevel, eigenverbrauchsanteil, companySize } = input;
  const rules = fundingCalculatorRules;
  
  let totalFunding = 0;
  let applicablePrograms: FundingCalculatorResult['applicablePrograms'] = [];
  let regionalBonus = 0;
  let innovationBonus = 0;

  // Bundesförderung berechnen
  if (['gewerbe', 'industrie', 'landwirtschaft', 'kommune'].includes(customerType)) {
    // KfW 270 Zinsersparnis
    const kfwSavings = projectSize.investmentTotal * rules.federal.kfw270.savings;
    totalFunding += kfwSavings;
    applicablePrograms.push({
      program: 'KfW-Programm 270',
      provider: 'KfW Bankengruppe',
      amount: kfwSavings,
      type: 'zinsersparnis',
      requirements: ['Hausbankprinzip', 'Antrag vor Projektbeginn'],
      applicationDeadline: 'Laufend'
    });

    // BAFA BEW für Gewerbe/Industrie mit Speicher oder Prozesswärme
    if (['gewerbe', 'industrie'].includes(customerType) && 
        (projectSize.speicherKwh || projectType === 'prozesswaerme')) {
      let bafaRate = rules.federal.bafaBew.fundingRates[companySize || 'mittleres'];
      if (projectType === 'prozesswaerme') {
        bafaRate = Math.max(bafaRate, rules.technology['prozesswaerme'].bafahighRate);
      }
      
      const bafaAmount = Math.min(
        projectSize.investmentTotal * bafaRate,
        rules.federal.bafaBew.maxFunding
      );
      totalFunding += bafaAmount;
      applicablePrograms.push({
        program: 'BAFA Bundesförderung Energieeffizienz Wirtschaft',
        provider: 'BAFA',
        amount: bafaAmount,
        type: 'zuschuss',
        requirements: ['Energieaudit DIN EN 16247', 'Mindestinvestition 2.000 €']
      });
    }
  }

  // Kommunalrichtlinie für öffentliche Gebäude
  if (customerType === 'kommune') {
    const communalAmount = Math.min(
      projectSize.investmentTotal * rules.federal.communalGuideline.fundingRate,
      rules.federal.communalGuideline.maxFunding
    );
    totalFunding += communalAmount;
    applicablePrograms.push({
      program: 'BMWK Kommunalrichtlinie',
      provider: 'BMWK',
      amount: communalAmount,
      type: 'zuschuss',
      requirements: ['Klimaschutzkonzept', 'Öffentliche Gebäude']
    });
  }

  // Landesförderung berechnen
  const state = location.bundesland.toLowerCase().replace(/\s+/g, '-');
  const statePrograms = rules.states[state as keyof typeof rules.states];
  
  if (statePrograms) {
    switch (state) {
      case 'nordrhein-westfalen':
        const nrwProgram = statePrograms.progresNrw;
        let nrwAmount = projectSize.pvKwp * nrwProgram.pvBonus;
        if (projectSize.speicherKwh) {
          nrwAmount += projectSize.speicherKwh * nrwProgram.speicherBonus;
        }
        if (innovationLevel === 'innovative' || innovationLevel === 'pilotprojekt') {
          nrwAmount *= nrwProgram.innovationBonus;
          innovationBonus += nrwAmount * 0.5;
        }
        nrwAmount = Math.min(nrwAmount, nrwProgram.maxFunding);
        
        totalFunding += nrwAmount;
        regionalBonus += nrwAmount;
        applicablePrograms.push({
          program: 'progres.nrw',
          provider: 'NRW.Bank',
          amount: nrwAmount,
          type: 'zuschuss',
          requirements: ['Standort NRW', 'Antrag vor Maßnahmenbeginn']
        });
        break;

      case 'brandenburg':
        if (projectSize.speicherKwh) {
          const brandenburgAmount = Math.min(
            projectSize.speicherKwh * 1000 * statePrograms.ilbRenplus.speicherRate,
            statePrograms.ilbRenplus.maxFunding
          );
          totalFunding += brandenburgAmount;
          regionalBonus += brandenburgAmount;
          applicablePrograms.push({
            program: 'ILB RENplus',
            provider: 'ILB Brandenburg',
            amount: brandenburgAmount,
            type: 'zuschuss',
            requirements: ['Speicher 5-100 kWh', 'Standort Brandenburg']
          });
        }
        break;

      case 'bayern':
        const bayernProgram = statePrograms.energieBonusBetriebe;
        let bayernAmount = projectSize.investmentTotal * bayernProgram.pvRate;
        if (projectSize.speicherKwh) {
          bayernAmount += projectSize.speicherKwh * bayernProgram.speicherBonus;
        }
        if (innovationLevel !== 'standard') {
          bayernAmount *= (1 + bayernProgram.innovationBonus);
          innovationBonus += bayernAmount * bayernProgram.innovationBonus;
        }
        
        totalFunding += bayernAmount;
        regionalBonus += bayernAmount;
        applicablePrograms.push({
          program: 'EnergieBonusBetriebe',
          provider: 'Bayern Wirtschaftsministerium',
          amount: bayernAmount,
          type: 'zuschuss',
          requirements: ['Unternehmenssitz Bayern', 'Gewerbliche Nutzung']
        });
        break;
    }
  }

  // Kommunale Förderung (vereinfacht)
  const municipality = location.kommune?.toLowerCase();
  if (municipality && rules.municipalities[municipality as keyof typeof rules.municipalities]) {
    const communalProgram = rules.municipalities[municipality as keyof typeof rules.municipalities];
    let communalRate = 'rate' in communalProgram ? communalProgram.rate : 0.25;
    
    if (innovationLevel !== 'standard' && 'bonusInnovative' in communalProgram) {
      communalRate = communalProgram.bonusInnovative;
      innovationBonus += projectSize.investmentTotal * 0.1;
    }
    
    const communalAmount = Math.min(
      projectSize.investmentTotal * communalRate,
      'maxFunding' in communalProgram ? communalProgram.maxFunding : 50000
    );
    
    totalFunding += communalAmount;
    regionalBonus += communalAmount;
    applicablePrograms.push({
      program: `${location.kommune} Solarförderung`,
      provider: `Stadt ${location.kommune}`,
      amount: communalAmount,
      type: 'zuschuss',
      requirements: ['Standort in der Kommune', 'Rechtzeitige Antragstellung']
    });
  }

  // Technologie-spezifische Boni
  if (projectType === 'agri-pv' && customerType === 'landwirtschaft') {
    const agriBonus = projectSize.investmentTotal * rules.technology['agri-pv'].euElerBonus;
    totalFunding += agriBonus;
    innovationBonus += agriBonus;
    applicablePrograms.push({
      program: 'EU ELER Agri-PV Förderung',
      provider: 'EU / Landwirtschaftsministerium',
      amount: agriBonus,
      type: 'zuschuss',
      requirements: ['Landwirtschaftliche Fläche', 'Wissenschaftliche Begleitung', '80% landw. Nutzung']
    });
  }

  // Maximal 95% Förderung (EU-Beihilferecht)
  const maxAllowedFunding = projectSize.investmentTotal * 0.95;
  totalFunding = Math.min(totalFunding, maxAllowedFunding);

  // Wirtschaftlichkeitsberechnung
  const eigenanteil = projectSize.investmentTotal - totalFunding;
  const fundingQuote = (totalFunding / projectSize.investmentTotal) * 100;
  
  // Vereinfachte ROI-Berechnung
  const annualProduction = projectSize.pvKwp * 950; // kWh/Jahr (Deutschland-Durchschnitt)
  const eigenverbrauch = annualProduction * (eigenverbrauchsanteil / 100);
  const einspeisung = annualProduction - eigenverbrauch;
  
  const annualSavings = eigenverbrauch * rules.economics.eigenverbrauchswert + 
                       einspeisung * rules.economics.einspeiseverguetung;
  
  const roi = eigenanteil > 0 ? (annualSavings / eigenanteil) * 100 : 0;
  const amortisationTime = eigenanteil > 0 ? eigenanteil / annualSavings : 0;
  
  // CO₂-Einsparung
  const co2Savings = annualProduction * rules.economics.co2Faktor;

  // Nächste Schritte generieren
  const nextSteps = [
    'Professionelle Förderberatung zur Optimierung der Förder-Kombination',
    'Anträge parallel bei allen Förderstellen vor Projektbeginn stellen',
    'Detailplanung mit qualifizierten Fachplanern durchführen',
    'Hausbankgespräch für KfW-Finanzierung vorbereiten',
    'Fachunternehmen mit Förder-Erfahrung beauftragen'
  ];

  return {
    totalFunding: Math.round(totalFunding),
    fundingQuote: Math.round(fundingQuote * 10) / 10,
    eigenanteil: Math.round(eigenanteil),
    roi: Math.round(roi * 10) / 10,
    amortisationTime: Math.round(amortisationTime * 10) / 10,
    applicablePrograms,
    regionalBonus: Math.round(regionalBonus),
    innovationBonus: Math.round(innovationBonus),
    co2Savings: Math.round(co2Savings * 10) / 10,
    nextSteps
  };
}

// Hilfsfunktionen für häufige Berechnungen
export function getFundingPotentialByState(bundesland: string): { maxRate: number; programs: string[] } {
  const state = bundesland.toLowerCase().replace(/\s+/g, '-');
  const statePrograms = fundingCalculatorRules.states[state as keyof typeof fundingCalculatorRules.states];
  
  const potentials = {
    'nordrhein-westfalen': { maxRate: 70, programs: ['progres.nrw', 'BAFA BEW', 'KfW 270'] },
    'baden-wuerttemberg': { maxRate: 65, programs: ['L-Bank PV-Netzwerke', 'BAFA BEW', 'KfW 270'] },
    'bayern': { maxRate: 60, programs: ['EnergieBonusBetriebe', 'BAFA BEW', 'KfW 270'] },
    'brandenburg': { maxRate: 75, programs: ['ILB RENplus', 'BAFA BEW', 'KfW 270'] },
    'sachsen': { maxRate: 55, programs: ['SAB RL EK', 'BAFA BEW', 'KfW 270'] },
    'schleswig-holstein': { maxRate: 70, programs: ['IB.SH Klimaschutz', 'BAFA BEW', 'KfW 270'] },
    'default': { maxRate: 45, programs: ['BAFA BEW', 'KfW 270', 'Kommunale Programme'] }
  };
  
  return potentials[state as keyof typeof potentials] || potentials.default;
}

export function getOptimalProjectSizing(
  budget: number, 
  eigenverbrauch: number,
  location: string
): { pvKwp: number; speicherKwh: number; totalInvestment: number } {
  // Vereinfachte Optimierung basierend auf Budget und Eigenverbrauch
  const costPerKwp = 1500; // €/kWp (2025 Marktpreis)
  const costPerKwhStorage = 1200; // €/kWh Speicher
  
  // 70% Budget für PV, 30% für Speicher bei hohem Eigenverbrauch > 60%
  let pvBudget = eigenverbrauch > 60 ? budget * 0.7 : budget * 0.85;
  let speicherBudget = budget - pvBudget;
  
  const pvKwp = Math.floor(pvBudget / costPerKwp);
  const speicherKwh = Math.floor(speicherBudget / costPerKwhStorage);
  
  return {
    pvKwp,
    speicherKwh,
    totalInvestment: pvKwp * costPerKwp + speicherKwh * costPerKwhStorage
  };
}