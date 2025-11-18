import { enterpriseCitationManagementService } from '../services/enterpriseCitationManagementService';

/**
 * Führt die Erstellung einer Citation-Kampagne mit dem echten Service durch.
 */
async function runCampaignCreation() {
  console.log('🚀 Initializing Citation Campaign Creation...');

  try {
    const campaignDetails = {
      name: 'Phase 3 Authority Building - Local Citations (Live)',
      description: 'Systematischer Aufbau von Local Citations für alle Standorte gemäß Phase 3 unter Verwendung des Live-Systems.',
      targetLocations: ['berlin', 'muenchen', 'koeln', 'frankfurt', 'stuttgart', 'hamburg'],
      targetSources: ['google_business_profile', 'bing_places', 'yelp', 'yellowpages_de', 'hotfrog_de'],
      status: 'active' as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      budget: 2500,
      goals: {
        citationsToCreate: 200,
        consistencyTarget: 95,
        timeFrame: '3 Monate'
      },
      progress: {
        citationsCreated: 0,
        citationsVerified: 0,
        consistencyAchieved: 0
      }
    };

    console.log('📋 Creating citation campaign...');
    const newCampaign = enterpriseCitationManagementService.createCitationCampaign(campaignDetails);

    console.log('✅ Campaign successfully created:');
    console.log(JSON.stringify(newCampaign, null, 2));
    console.log('\n✨ Citation campaign creation finished successfully!');

  } catch (error) {
    console.error('❌ An error occurred during campaign creation:', error);
    process.exit(1);
  }
}

// Skript ausführen
runCampaignCreation();