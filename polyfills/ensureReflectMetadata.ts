import 'reflect-metadata';

declare global {
  // Flag to prevent redundant polyfill bootstrapping across entry points
  // eslint-disable-next-line no-var
  var __REFLECT_METADATA_POLYFILL_LOADED__: boolean | undefined;
}

if (typeof globalThis !== 'undefined') {
  if (globalThis.__REFLECT_METADATA_POLYFILL_LOADED__) {
    if (import.meta?.env?.DEV) {
      console.info('[reflect-metadata] Polyfill already initialized, skipping duplicate load.');
    }
  } else {
    globalThis.__REFLECT_METADATA_POLYFILL_LOADED__ = true;
  }
}

export {};
