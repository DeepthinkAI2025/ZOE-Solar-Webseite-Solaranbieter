// Use Google Fonts for better reliability and performance
export const ensureFontPreloads = (): void => {
  if (typeof document === 'undefined') {
    return;
  }

  // Add Google Fonts link if not already present
  if (!document.querySelector('link[data-google-fonts]')) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    link.dataset.googleFonts = 'preconnect';
    document.head.appendChild(link);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    link2.dataset.googleFonts = 'preconnect-gstatic';
    document.head.appendChild(link2);

    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap';
    link3.dataset.googleFonts = 'stylesheet';
    document.head.appendChild(link3);
  }

  // Add font-display CSS for better performance
  const fontCSS = document.createElement('style');
  fontCSS.textContent = `
    /* Ensure Poppins font is available */
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
  `;

  // Only add if not already present
  if (!document.querySelector('style[data-font-fallback]')) {
    fontCSS.setAttribute('data-font-fallback', 'true');
    document.head.appendChild(fontCSS);
  }
};
