/**
 * URL Utilities - macht URLs domain-unabhängig
 * Funktioniert sowohl mit zoe-solar.de als auch mit Vercel Subdomains
 */

// Dynamische Basis-URL basierend auf aktueller Umgebung
export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: Environment Variable oder Fallback
    return process.env.NEXT_PUBLIC_APP_URL || 'https://zoe-solar.de';
  }

  // Client-side: Aktuelle Origin verwenden
  return window.location.origin;
};

// API URL basierend auf Environment
export const getApiUrl = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || `${getBaseUrl()}/api`;
  }

  return `${window.location.origin}/api`;
};

// Test URL für Testing-Zwecke
export const getTestUrl = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_TEST_URL || 'http://localhost:5173';
  }

  return window.location.origin;
};

// Prüft ob URL eine ZOE Solar URL ist (verschiedene Domains)
export const isZoeSolarUrl = (url: string): boolean => {
  const allowedDomains = [
    'zoe-solar.de',
    'zoe-solar.vercel.app',
    'localhost:5173',
    'localhost:3000'
  ];

  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain =>
      urlObj.hostname === domain ||
      urlObj.hostname.endsWith(`.${domain}`) ||
      urlObj.hostname.endsWith('vercel.app') && urlObj.hostname.includes('zoe-solar')
    );
  } catch {
    return false;
  }
};

// Canonical URL generieren (domain-unabhängig)
export const getCanonicalUrl = (path?: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
  return `${baseUrl}${cleanPath}`;
};

// Environment-spezifische Konfiguration
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }

  const hostname = window.location.hostname;
  if (hostname === 'zoe-solar.de' || hostname === 'www.zoe-solar.de') {
    return 'production';
  } else if (hostname.includes('vercel.app')) {
    return 'staging';
  }
  return 'development';
};

export default {
  getBaseUrl,
  getApiUrl,
  getTestUrl,
  isZoeSolarUrl,
  getCanonicalUrl,
  getEnvironment
};