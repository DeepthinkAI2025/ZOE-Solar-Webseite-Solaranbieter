import axios from 'axios';

const BUSINESS_PROFILE_ENDPOINT = 'https://mybusinessbusinessinformation.googleapis.com/v1';

export async function fetchBusinessProfile(apiKeys) {
  const config = apiKeys?.businessProfile ?? {};
  if (!config.apiKey || !config.locationId) {
    return {
      status: 'missing-config',
      message: 'Business Profile benötigt apiKey und locationId.'
    };
  }

  try {
    const { data } = await axios.get(
      `${BUSINESS_PROFILE_ENDPOINT}/${encodeURIComponent(config.locationId)}`,
      {
        params: {
          key: config.apiKey,
          readMask: 'name,storefrontAddress,labels,profileState,metadata'
        }
      }
    );

    return {
      status: 'ok',
      profile: data
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      details: error.response?.data ?? null
    };
  }
}
