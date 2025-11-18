import '../polyfills/ensureReflectMetadata';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet';
import App from '../App';
import { AppProviders } from '../components/providers/AppProviders';
import type { HelmetContextType } from 'react-helmet';

export function render(url: string) {
  const helmetContext: HelmetContextType = {} as HelmetContextType;

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppProviders>
          <App />
        </AppProviders>
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  return {
    html,
    helmet: {
      title: helmet.title(),
      meta: helmet.meta(),
      link: helmet.link(),
      script: helmet.script(),
    },
  };
}