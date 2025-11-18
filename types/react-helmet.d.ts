declare module 'react-helmet' {
  import * as React from 'react';

  export interface HelmetData {
    base: () => string;
    bodyAttributes: () => string;
    htmlAttributes: () => string;
    link: () => string;
    meta: () => string;
    noscript: () => string;
    script: () => string;
    style: () => string;
    title: () => string;
    titleTemplate: () => string;
    priority?: 'normal' | 'high';
    toString(): string;
  }

  export interface HelmetContextType {
    helmet: HelmetData;
  }

  export interface HelmetProps {
    async?: boolean;
    base?: any;
    bodyAttributes?: any;
    children?: React.ReactNode;
    defer?: boolean;
    encodeSpecialCharacters?: boolean;
    htmlAttributes?: any;
    onChangeClientState?: (newState: Record<string, unknown>) => void;
    title?: string;
    titleAttributes?: any;
    titleTemplate?: string;
    priority?: 'normal' | 'high';
  }

  export interface HelmetProviderProps {
    context?: HelmetContextType;
    children?: React.ReactNode;
  }

  export class Helmet extends React.Component<HelmetProps> {}
  export default Helmet;
  
  export class HelmetProvider extends React.Component<HelmetProviderProps> {
    static childContextTypes: any;
    static contextTypes: any;
    getChildContext(): HelmetContextType;
    render(): React.ReactNode;
  }
}
