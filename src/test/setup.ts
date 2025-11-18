import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'util';

// Configure testing-library
configure({ testIdAttribute: 'data-testid' });

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock Web Speech API
const mockSpeechRecognition = {
  continuous: true,
  interimResults: true,
  lang: 'de-DE',
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
  onresult: null,
  onerror: null,
  onend: null,
};

Object.defineProperty(window, 'SpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true,
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  value: jest.fn(() => mockSpeechRecognition),
  writable: true,
});

// Mock Speech Synthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn(() => []),
  },
  writable: true,
});