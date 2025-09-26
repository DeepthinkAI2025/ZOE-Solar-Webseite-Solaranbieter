import { ContactFormData } from '../types';

const RAW_FAPRO_BASE_URL = import.meta.env.VITE_FAPRO_BASE_URL?.trim();
const RAW_FAPRO_API_KEY = import.meta.env.VITE_FAPRO_API_KEY?.trim();

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getFaproBaseUrl = (): string => {
  const configured = RAW_FAPRO_BASE_URL && RAW_FAPRO_BASE_URL.length > 0
    ? stripTrailingSlash(RAW_FAPRO_BASE_URL)
    : null;

  if (configured) {
    return configured;
  }

  const origin = typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : '';

  return `${stripTrailingSlash(origin || '')}/api/fapro`;
};

export const getFaproApiEndpoint = () => `${getFaproBaseUrl()}/v1/leads`;

// The API key should be stored in environment variables, not here.
// The user will provide this later.
const FAPRO_API_KEY = RAW_FAPRO_API_KEY || 'YOUR_FAPRO_API_KEY_PLACEHOLDER';

export const sendInquiryToFapro = async (data: Omit<ContactFormData, 'dataPrivacy'>): Promise<{ success: boolean; message: string }> => {
  console.log('Sending data to Fapro API:', data);
  if (data.files && data.files.length > 0) {
    console.log(`Includes ${data.files.length} files:`);
    data.files.forEach(file => console.log(`- ${file.name} (${file.size} bytes)`));
  }
  
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real scenario, you would use fetch() here.
      // We simulate a successful call for demonstration purposes.
      if (data.email.includes('error')) {
         reject({ success: false, message: 'Simulierter API-Fehler. Bitte versuchen Sie es erneut.' });
      } else {
         resolve({ success: true, message: 'Ihre Anfrage wurde erfolgreich übermittelt.' });
      }
    }, 1500);
  });

  /* 
  // REAL IMPLEMENTATION EXAMPLE WITH FILES:
  try {
    const formDataPayload = new FormData();
    
    // Append all text/data fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'files' && value !== undefined) {
        formDataPayload.append(key, String(value));
      }
    });

    // Append files
    if (data.files) {
      data.files.forEach((file, index) => {
        formDataPayload.append(`file_${index}`, file, file.name);
      });
    }

  const response = await fetch(getFaproApiEndpoint(), {
      method: 'POST',
      headers: {
        // 'Content-Type' is set automatically by the browser when using FormData
        'Authorization': `Bearer ${FAPRO_API_KEY}`,
      },
      body: formDataPayload,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, message: 'Ihre Anfrage wurde erfolgreich übermittmittelt.', data: result };

  } catch (error) {
    console.error('Failed to send inquiry to Fapro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
    throw new Error(`Fehler bei der Übertragung: ${errorMessage}`);
  }
  */
};
