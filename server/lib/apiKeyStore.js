import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_PATH = path.join(__dirname, '..', 'storage', 'apiKeys.json');

const defaultState = {
  gemini: {
    apiKey: '',
    model: 'gemini-1.5-pro',
    lastUpdated: null
  },
  googleMaps: {
    staticKey: '',
    geocodingKey: '',
    placesKey: '',
    solarApiKey: '',
    lastUpdated: null
  },
  googleServiceAccount: {
    clientEmail: '',
    privateKey: '',
    propertyUrl: '',
    analyticsPropertyId: '',
    lastUpdated: null
  },
  ahrefs: {
    apiToken: '',
    target: '',
    lastUpdated: null
  },
  businessProfile: {
    apiKey: '',
    accountName: '',
    locationId: '',
    lastUpdated: null
  },
  other: {}
};

function mergeWithDefaults(currentState = {}) {
  return {
    ...defaultState,
    ...currentState,
    gemini: {
      ...defaultState.gemini,
      ...(currentState.gemini ?? {})
    },
    googleMaps: {
      ...defaultState.googleMaps,
      ...(currentState.googleMaps ?? {})
    },
    googleServiceAccount: {
      ...defaultState.googleServiceAccount,
      ...(currentState.googleServiceAccount ?? {})
    },
    ahrefs: {
      ...defaultState.ahrefs,
      ...(currentState.ahrefs ?? {})
    },
    businessProfile: {
      ...defaultState.businessProfile,
      ...(currentState.businessProfile ?? {})
    },
    other: {
      ...defaultState.other,
      ...(currentState.other ?? {})
    }
  };
}

export async function loadApiKeys() {
  try {
    const buffer = await fs.readFile(STORAGE_PATH, 'utf-8');
    const parsed = JSON.parse(buffer);
    return mergeWithDefaults(parsed);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await saveApiKeys(defaultState);
      return mergeWithDefaults(defaultState);
    }
    throw error;
  }
}

export async function saveApiKeys(state) {
  const normalised = mergeWithDefaults(state);
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  await fs.writeFile(STORAGE_PATH, JSON.stringify(normalised, null, 2), 'utf-8');
  return normalised;
}

export function maskValue(value) {
  if (!value) return null;
  if (value.length <= 4) {
    return '••••';
  }
  return `••••${value.slice(-4)}`;
}

export function summariseKeys(state) {
  const summary = mergeWithDefaults(state);
  return {
    gemini: {
      configured: Boolean(summary.gemini.apiKey),
      mask: maskValue(summary.gemini.apiKey),
      model: summary.gemini.model,
      lastUpdated: summary.gemini.lastUpdated
    },
    googleMaps: {
      configured: Boolean(
        summary.googleMaps.staticKey ||
          summary.googleMaps.geocodingKey ||
          summary.googleMaps.placesKey ||
          summary.googleMaps.solarApiKey
      ),
      mask: maskValue(
        summary.googleMaps.staticKey ||
          summary.googleMaps.geocodingKey ||
          summary.googleMaps.placesKey ||
          summary.googleMaps.solarApiKey
      ),
      lastUpdated: summary.googleMaps.lastUpdated
    },
    googleServiceAccount: {
      configured: Boolean(
        summary.googleServiceAccount.clientEmail &&
          summary.googleServiceAccount.privateKey &&
          (summary.googleServiceAccount.propertyUrl || summary.googleServiceAccount.analyticsPropertyId)
      ),
      clientEmail: summary.googleServiceAccount.clientEmail || null,
      propertyUrl: summary.googleServiceAccount.propertyUrl || null,
      analyticsPropertyId: summary.googleServiceAccount.analyticsPropertyId || null,
      lastUpdated: summary.googleServiceAccount.lastUpdated
    },
    ahrefs: {
      configured: Boolean(summary.ahrefs.apiToken),
      mask: maskValue(summary.ahrefs.apiToken),
      target: summary.ahrefs.target || null,
      lastUpdated: summary.ahrefs.lastUpdated
    },
    businessProfile: {
      configured: Boolean(summary.businessProfile.apiKey && summary.businessProfile.locationId),
      mask: maskValue(summary.businessProfile.apiKey),
      accountName: summary.businessProfile.accountName || null,
      locationId: summary.businessProfile.locationId || null,
      lastUpdated: summary.businessProfile.lastUpdated
    }
  };
}

export function updateService(state, service, payload) {
  const updated = mergeWithDefaults(state);
  const timestamp = new Date().toISOString();

  switch (service) {
    case 'gemini': {
      updated.gemini.apiKey = payload.apiKey ?? '';
      updated.gemini.model = payload.model ?? updated.gemini.model;
      updated.gemini.lastUpdated = timestamp;
      break;
    }
    case 'googleMaps': {
      updated.googleMaps.staticKey = payload.staticKey ?? '';
      updated.googleMaps.geocodingKey = payload.geocodingKey ?? '';
      updated.googleMaps.placesKey = payload.placesKey ?? '';
      updated.googleMaps.solarApiKey = payload.solarApiKey ?? '';
      updated.googleMaps.lastUpdated = timestamp;
      break;
    }
    case 'googleServiceAccount': {
      updated.googleServiceAccount.clientEmail = payload.clientEmail ?? '';
      updated.googleServiceAccount.privateKey = payload.privateKey ?? '';
      updated.googleServiceAccount.propertyUrl = payload.propertyUrl ?? '';
      updated.googleServiceAccount.analyticsPropertyId = payload.analyticsPropertyId ?? '';
      updated.googleServiceAccount.lastUpdated = timestamp;
      break;
    }
    case 'ahrefs': {
      updated.ahrefs.apiToken = payload.apiToken ?? '';
      updated.ahrefs.target = payload.target ?? '';
      updated.ahrefs.lastUpdated = timestamp;
      break;
    }
    case 'businessProfile': {
      updated.businessProfile.apiKey = payload.apiKey ?? '';
      updated.businessProfile.accountName = payload.accountName ?? '';
      updated.businessProfile.locationId = payload.locationId ?? '';
      updated.businessProfile.lastUpdated = timestamp;
      break;
    }
    default: {
      updated.other = {
        ...updated.other,
        [service]: {
          ...(payload ?? {}),
          lastUpdated: timestamp
        }
      };
    }
  }

  return updated;
}
