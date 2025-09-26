const loadedScripts = new Map<string, Promise<void>>();

export const loadExternalScript = (src: string): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (loadedScripts.has(src)) {
    return loadedScripts.get(src)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
      } else {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', (event) => reject(event), { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.async = true;
    script.dataset.loaded = 'false';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', (event) => reject(event), { once: true });
    document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
};
