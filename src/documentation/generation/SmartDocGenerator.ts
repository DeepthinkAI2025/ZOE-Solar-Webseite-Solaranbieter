/**
 * Advanced Documentation Generator
 * AI-powered intelligent documentation generation with automated analysis and updates
 */

export interface DocumentationConfig {
 targetLanguage: 'de' | 'en' | 'both';
 outputFormat: 'markdown' | 'html' | 'pdf' | 'docx';
 includeExamples: boolean;
 includeTypeDefinitions: boolean;
 includeTestingDocs: boolean;
 includeAPIDocs: boolean;
 includeArchitectureDocs: boolean;
 customTemplates: Record<string, string>;
 excludePatterns: string[];
 optimization: {
 enableSmartGrouping: boolean;
 enableCrossReferences: boolean;
 enableAutomaticIndexing: boolean;
 enableInteractiveExamples: boolean;
 };
}

export interface DocumentationSection {
 id: string;
 title: string;
 type: 'overview' | 'api' | 'guide' | 'tutorial' | 'reference' | 'architecture' | 'deployment' | 'troubleshooting';
 priority: number;
 content: string;
 metadata: {
 lastModified: Date;
 author: string;
 tags: string[];
 difficulty: 'beginner' | 'intermediate' | 'advanced';
 estimatedReadTime: number;
 };
 dependencies: string[];
 relatedSections: string[];
 codeExamples: CodeExample[];
 interactiveElements: InteractiveElement[];
}

export interface CodeExample {
 id: string;
 title: string;
 description: string;
 language: '"typescript"' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'html' | 'json';
 code: string;
 livePreview?: boolean;
 runnable?: boolean;
 dependencies?: string[];
 output?: string;
 explanation: string;
 bestPractices: string[];
 commonMistakes: string[];
}

export interface InteractiveElement {
 id: string;
 type: 'playground' | 'demo' | 'quiz' | 'exercise' | 'api-explorer';
 title: string;
 description: string;
 content: string;
 config: {
  theme?: string;
  language?: string;
  dependencies?: string[];
  timeout?: number;
  maxRetries?: number;
  enableSharing?: boolean;
  showOutput?: boolean;
  autoRun?: boolean;
 };
 dependencies?: string[];
}

export interface DocumentationAnalysis {
 completeness: number;
 quality: {
 codeExamples: boolean;
 explanations: boolean;
 typeDefinitions: boolean;
 crossReferences: boolean;
 interactiveElements: boolean;
 };
 coverage: {
 totalFiles: number;
 documentedFiles: number;
 documentationRatio: number;
 undocumentedComponents: string[];
 };
 recommendations: string[];
 qualityScore: number;
}

export interface GeneratedDocumentation {
 id: string;
 timestamp: Date;
 version: string;
 config: DocumentationConfig;
 sections: DocumentationSection[];
 analysis: DocumentationAnalysis;
 assets: {
 images: string[];
 diagrams: string[];
 interactiveDemos: string[];
 };
 navigation: {
 tableOfContents: TOCItem[];
 index: IndexItem[];
 crossReferences: CrossReference[];
 };
 metadata: {
 totalSections: number;
 totalWords: number;
 estimatedReadTime: number;
 lastUpdate: Date;
 authors: string[];
 };
}

export interface TOCItem {
 id: string;
 title: string;
 level: number;
 page?: string;
 children: TOCItem[];
 estimatedReadTime: number;
}

export interface IndexItem {
 term: string;
 definition: string;
 section: string;
 context: string;
 relevance: number;
}

export interface CrossReference {
 source: string;
 target: string;
 type: 'see-also' | 'related' | 'dependency' | 'example' | 'implementation';
 description: string;
}

// Internal interfaces for SmartDocGenerator
interface CodeAnalyzer {
 analyzeComponent(component: ComponentAnalysis): AnalysisResult;
 extractTypeDefinitions(code: string): TypeDefinitionResult;
 findExamples(code: string): CodeExample[];
 analyzeDependencies(file: string): DependencyAnalysis;
}

interface TemplateEngine {
 renderTemplate(template: string, data: TemplateData): RenderedContent;
 loadTemplate(name: string): TemplateContent;
 registerHelper(name: string, helper: HelperFunction): void;
}

interface AIContentGenerator {
 generateExplanation(code: string, context: string): GeneratedExplanation;
 generateExamples(component: string): GeneratedExamples;
 generateDocumentation(file: string): GeneratedDocumentation;
 optimizeContent(content: string): OptimizedContent;
}

interface ComponentAnalysis {
 name: string;
 path: string;
 props: string[];
 exports: string[];
 hooks: string[];
}

interface AnalysisResult {
 props: string[];
 hooks: string[];
 dependencies: string[];
}

interface TypeDefinitionResult {
 interfaces: string[];
 types: string[];
 enums: string[];
}

interface DependencyAnalysis {
 imports: string[];
 exports: string[];
 dependencies: string[];
}

interface TemplateData {
 [key: string]: unknown;
}

interface RenderedContent {
 content: string;
 metadata: {
  template: string;
  renderTime: number;
 };
}

interface TemplateContent {
 name: string;
 content: string;
 variables: string[];
}

interface HelperFunction {
 (...args: unknown[]): unknown;
}

interface GeneratedExplanation {
 explanation: string;
 confidence: number;
 sources: string[];
}

interface GeneratedExamples {
 examples: CodeExample[];
 coverage: number;
}

interface OptimizedContent {
 content: string;
 improvements: string[];
 score: number;
}

interface SourceAnalysis {
 components: ComponentAnalysis[];
 utilities: UtilityAnalysis[];
 services: ServiceAnalysis[];
 types: TypeAnalysis[];
 hooks: string[];
 apiEndpoints: string[];
 tests: string[];
 configFiles: string[];
 dependencies: Map<string, string[]>;
 fileStructure: string[];
}

interface UtilityAnalysis {
 name: string;
 path: string;
 functions: string[];
}

interface ServiceAnalysis {
 name: string;
 path: string;
 methods: string[];
 endpoints?: string[];
}

interface TypeAnalysis {
 name: string;
 path: string;
 properties: string[];
}

class SmartDocGenerator {
 private config: DocumentationConfig;
 private codeAnalyzer!: CodeAnalyzer;
 private templateEngine!: TemplateEngine;
 private aiContentGenerator!: AIContentGenerator;
 private documentationCache: Map<string, GeneratedDocumentation> = new Map();

 constructor(config?: Partial<DocumentationConfig>) {
 this.config = {
 targetLanguage: 'de',
 outputFormat: 'markdown',
 includeExamples: true,
 includeTypeDefinitions: true,
 includeTestingDocs: true,
 includeAPIDocs: true,
 includeArchitectureDocs: true,
 customTemplates: {},
 excludePatterns: ['node_modules', '.git', 'dist', 'build'],
 optimization: {
 enableSmartGrouping: true,
 enableCrossReferences: true,
 enableAutomaticIndexing: true,
 enableInteractiveExamples: true,
 },
 ...config,
 };

 this.initialize();
 }

 private async initialize(): Promise<void> {
 console.log('Initializing Smart Documentation Generator...');

 // Initialize code analyzer
 this.codeAnalyzer = await this.initializeCodeAnalyzer();

 // Initialize template engine
 this.templateEngine = await this.initializeTemplateEngine();

 // Initialize AI content generator
 this.aiContentGenerator = await this.initializeAIContentGenerator();
 }

 private async initializeCodeAnalyzer(): Promise<CodeAnalyzer> {
  // Mock implementation - in real scenario would initialize actual code analysis tools
  return {
   analyzeComponent: (component: ComponentAnalysis): AnalysisResult => {
    return {
     props: component.props,
     hooks: component.hooks,
     dependencies: []
    };
   },
   extractTypeDefinitions: (_code: string): TypeDefinitionResult => {
    return {
     interfaces: [],
     types: [],
     enums: []
    };
   },
   findExamples: (_code: string): CodeExample[] => {
    return [];
   },
   analyzeDependencies: (_file: string): DependencyAnalysis => {
    return {
     imports: [],
     exports: [],
     dependencies: []
    };
   }
  };
 } private async initializeTemplateEngine(): Promise<TemplateEngine> {
  // Mock implementation - in real scenario would initialize actual template engine
  return {
   renderTemplate: (_template: string, _data: TemplateData): RenderedContent => {
    return {
     content: '',
     metadata: {
      template: '',
      renderTime: 0
     }
    };
   },
   loadTemplate: (_name: string): TemplateContent => {
    return {
     name: '',
     content: '',
     variables: []
    };
   },
   registerHelper: (_name: string, _helper: HelperFunction): void => {
    // Mock implementation
   }
  };
 }

 private async initializeAIContentGenerator(): Promise<AIContentGenerator> {
  // Mock implementation - in real scenario would initialize AI service
  return {
   generateExplanation: (_code: string, _context: string): GeneratedExplanation => {
    return {
     explanation: '',
     confidence: 0,
     sources: []
    };
   },
   generateExamples: (_component: string): GeneratedExamples => {
    return {
     examples: [],
     coverage: 0
    };
   },
   generateDocumentation: (_file: string): GeneratedDocumentation => {
    return {
     content: '',
     sections: [],
     metadata: {
      generatedAt: new Date(),
      version: '1.0.0'
     }
    };
   },
   optimizeContent: (_content: string): OptimizedContent => {
    return {
     content: '',
     improvements: [],
     score: 0
    };
   }
  };
 }

 public async generateDocumentation(sourcePath: string = './src'): Promise<GeneratedDocumentation> {
 console.log(`Starting documentation generation for: ${sourcePath}`);
 const startTime = performance.now();

 // Analyze source code
 const sourceAnalysis = await this.analyzeSourceCode(sourcePath);

 // Generate documentation sections
 const sections = await this.generateSections(sourceAnalysis);

 // Generate navigation and cross-references
 const navigation = await this.generateNavigation(sections);

 // Generate assets
 const assets = await this.generateAssets(sections);

 // Analyze documentation quality
 const analysis = await this.analyzeDocumentation(sections, sourceAnalysis);

 // Compile final documentation
 const documentation: GeneratedDocumentation = {
 id: `doc-${Date.now()}`,
 timestamp: new Date(),
 version: this.getProjectVersion(),
 config: this.config,
 sections,
 analysis,
 assets,
 navigation,
 metadata: {
 totalSections: sections.length,
 totalWords: this.calculateTotalWords(sections),
 estimatedReadTime: this.calculateTotalReadTime(sections),
 lastUpdate: new Date(),
 authors: ['Serena MCP Documentation Generator'],
 },
 };

 // Cache the generated documentation
 this.documentationCache.set(sourcePath, documentation);

 console.log(`Documentation generation completed in ${(performance.now() - startTime).toFixed(2)}ms`);
 console.log(`Generated ${sections.length} sections covering ${analysis.coverage.documentedFiles} files`);

 return documentation;
 }

 private async analyzeSourceCode(_sourcePath: string): Promise<SourceAnalysis> {
  const analysis: SourceAnalysis = {
   components: [],
   utilities: [],
   services: [],
   types: [],
   hooks: [],
   apiEndpoints: [],
   tests: [],
   configFiles: [],
   dependencies: new Map<string, string[]>(),
   fileStructure: [],
  };

  // Mock source code analysis
  // In real implementation, would recursively scan and analyze all source files
  analysis.components = [
   {
    name: 'AIChatFunnel',
    path: 'src/components/AIChatFunnel.tsx',
    props: ['messages', 'onMessageSend', 'config'],
    exports: ['AIChatFunnel'],
    hooks: ['useState', 'useEffect'],
   },
   {
    name: 'SolarCalculator',
    path: 'src/components/SolarCalculator.tsx',
    props: ['systemSize', 'consumption', 'location'],
    exports: ['SolarCalculator'],
    hooks: ['useState', 'useCallback'],
   },
  ];

  analysis.utilities = [
   {
    name: 'formatters',
    path: 'src/utils/formatters.ts',
    functions: ['formatCurrency', 'formatDate', 'formatNumber'],
   },
   {
    name: 'validators',
    path: 'src/utils/validators.ts',
    functions: ['validateEmail', 'validatePhone', 'validateZipCode'],
   },
  ];

  analysis.services = [
   {
    name: 'APIClient',
    path: 'src/services/APIClient.ts',
    methods: ['get', 'post', 'put', 'delete'],
    endpoints: ['/api/user', '/api/calculator', '/api/contact'],
   },
   {
    name: 'AnalyticsService',
    path: 'src/services/AnalyticsService.ts',
    methods: ['trackEvent', 'trackPageView', 'trackConversion'],
   },
  ];

  analysis.types = [
   {
    name: 'User',
    path: 'src/types/User.ts',
    properties: ['id', 'name', 'email', 'createdAt'],
   },
   {
    name: 'SolarProject',
    path: 'src/types/SolarProject.ts',
    properties: ['id', 'size', 'location', 'status', 'createdAt'],
   },
  ];

  return analysis;
 }

 private async generateSections(sourceAnalysis: SourceAnalysis): Promise<DocumentationSection[]> {
 const sections: DocumentationSection[] = [];

 // Generate Overview section
 sections.push(await this.generateOverviewSection(sourceAnalysis));

 // Generate API documentation if enabled
 if (this.config.includeAPIDocs) {
 sections.push(...await this.generateAPISections(sourceAnalysis));
 }

 // Generate component documentation
 sections.push(...await this.generateComponentSections(sourceAnalysis));

 // Generate utility documentation
 sections.push(...await this.generateUtilitySections(sourceAnalysis));

 // Generate service documentation
 sections.push(...await this.generateServiceSections(sourceAnalysis));

 // Generate type documentation if enabled
 if (this.config.includeTypeDefinitions) {
 sections.push(...await this.generateTypeSections(sourceAnalysis));
 }

 // Generate architecture documentation if enabled
 if (this.config.includeArchitectureDocs) {
 sections.push(await this.generateArchitectureSection(sourceAnalysis));
 }

 // Generate deployment section
 sections.push(await this.generateDeploymentSection(sourceAnalysis));

 // Generate troubleshooting section
 sections.push(await this.generateTroubleshootingSection(sourceAnalysis));

 // Generate testing documentation if enabled
 if (this.config.includeTestingDocs) {
 sections.push(await this.generateTestingSection(sourceAnalysis));
 }

 // Sort sections by priority
 return sections.sort((a, b) => a.priority - b.priority);
 }

 private async generateOverviewSection(_sourceAnalysis: SourceAnalysis): Promise<DocumentationSection> {
 const content = this.config.targetLanguage === 'de' ? `
# ZOE Solar Projektübersicht

Willkommen zur Dokumentation des ZOE Solar Projekts. Diese umfassende Dokumentation behandelt alle Aspekte der Anwendung, von der Architektur bis zur Bereitstellung.

## Projektbeschreibung

ZOE Solar ist eine moderne React-Anwendung, die Kunden bei der Planung und Berechnung von Solaranlagen unterstützt. Die Anwendung bietet:

- **Solarrechner**: Detaillierte Berechnung von Solaranlagen basierend auf Standort und Verbrauch
- **KI-gestützte Beratung**: Intelligenter Chat für persönliche Beratung
- **Finanzierungspläne**: Verschiedene Finanzierungsoptionen und Fördermittel
- **Projektverwaltung**: Verwaltung von Solarprojekten von der Anfrage bis zur Umsetzung

## Technologiestack

- **Frontend**: React 19.1.1 mit TypeScript
- **Styling**: Tailwind CSS mit benutzerdefinierten Komponenten
- **State Management**: Redux Toolkit mit RTK Query
- **API Integration**: Axios mit optimiertem Caching
- **Build Tools**: Vite mit TypeScript-Unterstützung
- **Testing**: Jest mit React Testing Library
- **Performance**: Serena MCP Integration für Optimierung

## Architektur

Die Anwendung folgt einer modularen Architektur mit klaren Trennungen:

### Komponentenarchitektur
- **Komponenten**: Wiederverwendbare UI-Komponenten
- **Pages**: Seitenweite Layouts und Routing
- **Hooks**: Custom Hooks für Business Logic
- **Services**: API-Services und externe Integrationen
- **Utils**: Hilfsfunktionen und Utility-Module

### Datenfluss
- **State Management**: Zentralisiert mit Redux Toolkit
- **API Layer**: Abstrahiert mit optimiertem Client
- **Caching**: Intelligentes Caching für Performance
- **Error Handling**: Zentralisierte Fehlerbehandlung

## Getting Started

### Voraussetzungen
- Node.js 18.0 oder höher
- npm oder yarn
- Moderner Webbrowser

### Installation
\`\`\`bash
git clone <repository-url>
cd zoe-solar-webseite
npm install
\`\`\`

### Entwicklung
\`\`\`bash
npm run dev
\`\`\`

### Build
\`\`\`bash
npm run build
\`\`\`

### Testing
\`\`\`bash
npm test
\`\`\`

## Team

- **Frontend Development**: React/TypeScript Team
- **Backend Integration**: API Team
- **DevOps**: Infrastructure Team
- **QA**: Quality Assurance Team

## Lizenz

Dieses Projekt unterliegt der MIT Lizenz.
 ` : `
# ZOE Solar Project Overview

Welcome to the ZOE Solar project documentation. This comprehensive documentation covers all aspects of the application, from architecture to deployment.

## Project Description

ZOE Solar is a modern React application that helps customers plan and calculate solar installations. The application provides:

- **Solar Calculator**: Detailed calculations based on location and consumption
- **AI-powered Consultation**: Intelligent chat for personalized advice
- **Financing Plans**: Various financing options and subsidies
- **Project Management**: Management of solar projects from inquiry to implementation

## Technology Stack

- **Frontend**: React 19.1.1 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: Redux Toolkit with RTK Query
- **API Integration**: Axios with optimized caching
- **Build Tools**: Vite with TypeScript support
- **Testing**: Jest with React Testing Library
- **Performance**: Serena MCP integration for optimization

## Architecture

The application follows a modular architecture with clear separations:

### Component Architecture
- **Components**: Reusable UI components
- **Pages**: Page-wide layouts and routing
- **Hooks**: Custom hooks for business logic
- **Services**: API services and external integrations
- **Utils**: Helper functions and utility modules

### Data Flow
- **State Management**: Centralized with Redux Toolkit
- **API Layer**: Abstracted with optimized client
- **Caching**: Intelligent caching for performance
- **Error Handling**: Centralized error handling

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- Modern web browser

### Installation
\`\`\`bash
git clone <repository-url>
cd zoe-solar-webseite
npm install
\`\`\`

### Development
\`\`\`bash
npm run dev
\`\`\`

### Build
\`\`\`bash
npm run build
\`\`\`

### Testing
\`\`\`bash
npm test
\`\`\`

## Team

- **Frontend Development**: React/TypeScript Team
- **Backend Integration**: API Team
- **DevOps**: Infrastructure Team
- **QA**: Quality Assurance Team

## License

This project is licensed under the MIT License.
 `;

 const codeExamples: CodeExample[] = [
 {
 id: 'installation-example',
 title: this.config.targetLanguage === 'de' ? 'Projektinstallation' : 'Project Installation',
 description: this.config.targetLanguage === 'de' ? 'Installation des ZOE Solar Projekts' : 'Installing the ZOE Solar project',
 language: 'javascript',
 code: `# Klonen des Repositories
git clone https://github.com/zukunftsorientierte-energie/zoe-solar-webseite.git

# In das Projektverzeichnis wechseln
cd zoe-solar-webseite

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev`,
 livePreview: false,
 runnable: true,
 explanation: this.config.targetLanguage === 'de'
 ? 'Diese Befehle installieren das Projekt und starten den Entwicklungsserver.'
 : 'These commands install the project and start the development server.',
 bestPractices: [
 'Node.js 18+ wird empfohlen',
 'Verwende npm statt yarn für beste Kompatibilität',
 'Stelle sicher, dass alle Ports verfügbar sind'
 ],
 commonMistakes: [
 'Falsche Node.js Version',
 'Fehlende Berechtigungen',
 'Firewall blockiert Port'
 ],
 },
 ];

 return {
 id: 'overview',
 title: this.config.targetLanguage === 'de' ? 'Projektübersicht' : 'Project Overview',
 type: 'overview',
 priority: 1,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['overview', 'introduction', 'getting-started'],
 difficulty: 'beginner',
 estimatedReadTime: 5,
 },
 dependencies: [],
 relatedSections: ['architecture', 'installation', 'deployment'],
 codeExamples,
 interactiveElements: [],
 };
 }

 private async generateAPISections(sourceAnalysis: SourceAnalysis): Promise<DocumentationSection[]> {
 const sections: DocumentationSection[] = [];

 for (const service of sourceAnalysis.services) {
 const section = await this.generateAPISection(service);
 sections.push(section);
 }

 return sections;
 }

 private async generateAPISection(service: ServiceAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? `API: ${service.name}`
 : `API: ${service.name}`;

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

Der \`${service.name}\` Service bietet folgende API-Methoden:

## Methoden

${service.methods.map((method: string) => `
### ${method.charAt(0).toUpperCase() + method.slice(1)}

\`\`\`"typescript"
await ${service.name}.${method}(endpoint, data);
\`\`\`

**Beispiel:**
\`\`\`"typescript"
const result = await ${service.name}.${method}('/api/data', { id: 123 });
\`\`\`
`).join('')}

## Endpunkte

${(service.endpoints || []).map((endpoint: string) => `
### ${endpoint}

- **Methode**: GET/POST/PUT/DELETE
- **Beschreibung**: API Endpunkt für Datenzugriff
- **Authentifizierung**: Erforderlich
`).join('')}

## Fehlerbehandlung

Alle API-Aufrufe verwenden zentrale Fehlerbehandlung:

\`\`\`"typescript"
try {
 const result = await ${service.name}.get(endpoint);
 return result;
} catch (error) {
 console.error('API Fehler:', error);
 throw error;
}
\`\`\`
 ` : `
# ${title}

The \`${service.name}\` service provides the following API methods:

## Methods

${service.methods.map((method: string) => `
### ${method.charAt(0).toUpperCase() + method.slice(1)}

\`\`\`"typescript"
await ${service.name}.${method}(endpoint, data);
\`\`\`

**Example:**
\`\`\`"typescript"
const result = await ${service.name}.${method}('/api/data', { id: 123 });
\`\`\`
`).join('')}

## Endpoints

${(service.endpoints || []).map((endpoint: string) => `
### ${endpoint}

- **Method**: GET/POST/PUT/DELETE
- **Description**: API endpoint for data access
- **Authentication**: Required
`).join('')}

## Error Handling

All API calls use centralized error handling:

\`\`\`"typescript"
try {
 const result = await ${service.name}.get(endpoint);
 return result;
} catch (error) {
 console.error('API Error:', error);
 throw error;
}
\`\`\`
 `;

 const codeExamples: CodeExample[] = [
 {
 id: `${service.name.toLowerCase()}-usage`,
 title: this.config.targetLanguage === 'de' ? `${service.name} Nutzung` : `${service.name} Usage`,
 description: this.config.targetLanguage === 'de'
 ? `Beispiel für die Verwendung des ${service.name} Services`
 : `Example of using the ${service.name} service`,
 language: '"typescript"',
 code: `import { ${service.name} } from '../services/${service.name}';

class DataController {
 private api = new ${service.name}();

 async fetchData() {
 try {
 const result = await this.api.get('${(service.endpoints || ['/api/data'])[0]}');
 return result;
 } catch (error) {
 console.error('Error fetching data:', error);
 throw error;
 }
 }

 async createData(data: any) {
 try {
 const result = await this.api.post('${(service.endpoints || ['/api/data'])[0]}', data);
 return result;
 } catch (error) {
 console.error('Error creating data:', error);
 throw error;
 }
 }
}`,
 runnable: false,
 explanation: this.config.targetLanguage === 'de'
 ? 'Dieser Code zeigt die grundlegende Verwendung des API Services.'
 : 'This code demonstrates basic usage of the API service.',
 bestPractices: [
 'Always use try-catch for error handling',
 'Validate input data before sending',
 'Use TypeScript interfaces for type safety',
 ],
 commonMistakes: [
 'Forgetting to handle errors',
 'Not validating input data',
 'Using wrong HTTP methods',
 ],
 },
 ];

 return {
 id: `api-${service.name.toLowerCase()}`,
 title,
 type: 'api',
 priority: 20,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['api', 'service', service.name.toLowerCase()],
 difficulty: 'intermediate',
 estimatedReadTime: 3,
 },
 dependencies: ['overview'],
 relatedSections: ['troubleshooting', 'testing'],
 codeExamples,
 interactiveElements: [],
 };
 }

 private async generateComponentSections(sourceAnalysis: SourceAnalysis): Promise<DocumentationSection[]> {
 const sections: DocumentationSection[] = [];

 for (const component of sourceAnalysis.components) {
 const section = await this.generateComponentSection(component);
 sections.push(section);
 }

 return sections;
 }

 private async generateComponentSection(component: ComponentAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? `Komponente: ${component.name}`
 : `Component: ${component.name}`;

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

Die \`${component.name}\` Komponente ist ein React-Element mit folgenden Eigenschaften:

## Props

${component.props.map((prop: string) => `
### \`${prop}\`
- **Typ**: string | number | boolean | object
- **Beschreibung**: ${prop} Eigenschaft
- **Optional**: Nein
`).join('')}

## Nutzung

\`\`\`tsx
import { ${component.name} } from '../components/${component.name}';

function App() {
 return (
 <${component.name}
 ${component.props.map((prop: string) => `${prop}={value}`).join('\n ')}
 />
 );
}
\`\`\`

## Beispiele

### Grundlegende Verwendung
\`\`\`tsx
<${component.name} />
\`\`\`

### Mit allen Props
\`\`\`tsx
<${component.name}
 ${component.props.map((prop: string) => `${prop}={example}`).join('\n ')}
/>
\`\`\`

## Hooks

Die Komponente verwendet folgende React Hooks:
${component.hooks.map((hook: string) => `- \`${hook}\``).join('\n')}

## Best Practices

- Verwende TypeScript für Typensicherheit
- Validiere Props vor der Verwendung
- Behandle Fehlerzustände korrekt
 ` : `
# ${title}

The \`${component.name}\` component is a React element with the following properties:

## Props

${component.props.map((prop: string) => `
### \`${prop}\`
- **Type**: string | number | boolean | object
- **Description**: ${prop} property
- **Optional**: No
`).join('')}

## Usage

\`\`\`tsx
import { ${component.name} } from '../components/${component.name}';

function App() {
 return (
 <${component.name}
 ${component.props.map((prop: string) => `${prop}={value}`).join('\n ')}
 />
 );
}
\`\`\`

## Examples

### Basic Usage
\`\`\`tsx
<${component.name} />
\`\`\`

### With All Props
\`\`\`tsx
<${component.name}
 ${component.props.map((prop: string) => `${prop}={example}`).join('\n ')}
/>
\`\`\`

## Hooks

The component uses the following React hooks:
${component.hooks.map((hook: string) => `- \`${hook}\``).join('\n')}

## Best Practices

- Use TypeScript for type safety
- Validate props before usage
- Handle error states properly
 `;

 const codeExamples: CodeExample[] = [
 {
 id: `${component.name.toLowerCase()}-example`,
 title: this.config.targetLanguage === 'de'
 ? `${component.name} Beispiel`
 : `${component.name} Example`,
 description: this.config.targetLanguage === 'de'
 ? `Beispiel für die Verwendung der ${component.name} Komponente`
 : `Example of using the ${component.name} component`,
 language: 'tsx',
 code: `import React, { useState } from 'react';
import { ${component.name} } from '../components/${component.name}';

function ExampleComponent() {
 const [value, setValue] = useState('');

 return (
 <div className="example">
 <h2>${component.name} Beispiel</h2>
 <${component.name}
 ${component.props.slice(0, 3).map((prop: string, index: number) =>
 `${prop}={${index === 0 ? 'value' : index === 1 ? '"test"' : 'true'}}`
 ).join('\n ')}
 onChange={setValue}
 />
 </div>
 );
}

export default ExampleComponent;`,
 runnable: true,
 explanation: this.config.targetLanguage === 'de'
 ? 'Dieses Beispiel zeigt die typische Verwendung der Komponente.'
 : 'This example shows typical usage of the component.',
 bestPractices: [
 'TypeScript interfaces for props',
 'Default values for optional props',
 'Error boundary implementation',
 ],
 commonMistakes: [
 'Missing prop validation',
 'Not handling loading states',
 'Forgetting key props in lists',
 ],
 },
 ];

 return {
 id: `component-${component.name.toLowerCase()}`,
 title,
 type: 'guide',
 priority: 30,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['component', 'react', component.name.toLowerCase()],
 difficulty: 'intermediate',
 estimatedReadTime: 4,
 },
 dependencies: ['overview'],
 relatedSections: ['hooks', 'testing', 'styling'],
 codeExamples,
 interactiveElements: [],
 };
 }

 private async generateUtilitySections(sourceAnalysis: SourceAnalysis): Promise<DocumentationSection[]> {
 const sections: DocumentationSection[] = [];

 for (const utility of sourceAnalysis.utilities) {
 const section = await this.generateUtilitySection(utility);
 sections.push(section);
 }

 return sections;
 }

 private async generateUtilitySection(utility: UtilityAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? `Utility: ${utility.name}`
 : `Utility: ${utility.name}`;

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

Das \`${utility.name}\` Utility bietet folgende Hilfsfunktionen:

## Funktionen

${utility.functions.map((func: string) => `
### \`${func}\`

\`\`\`"typescript"
import { ${func} } from '../utils/${utility.name}';

const result = ${func}(input);
\`\`\`

**Beispiel:**
\`\`\`"typescript"
const formatted = ${func}('example');
console.log(formatted);
\`\`\`
`).join('')}

## Import

\`\`\`"typescript"
// Gesamtes Utility importieren
import * as ${utility.name} from '../utils/${utility.name}';

// Spezifische Funktion importieren
import { ${utility.functions.slice(0, 2).join(', ')} } from '../utils/${utility.name}';
\`\`\`
 ` : `
# ${title}

The \`${utility.name}\` utility provides the following helper functions:

## Functions

${utility.functions.map((func: string) => `
### \`${func}\`

\`\`\`"typescript"
import { ${func} } from '../utils/${utility.name}';

const result = ${func}(input);
\`\`\`

**Example:**
\`\`\`"typescript"
const formatted = ${func}('example');
console.log(formatted);
\`\`\`
`).join('')}

## Import

\`\`\`"typescript"
// Import entire utility
import * as ${utility.name} from '../utils/${utility.name}';

// Import specific function
import { ${utility.functions.slice(0, 2).join(', ')} } from '../utils/${utility.name}';
\`\`\`
 `;

 const codeExamples: CodeExample[] = [
 {
 id: `${utility.name.toLowerCase()}-usage`,
 title: this.config.targetLanguage === 'de'
 ? `${utility.name} Funktionen`
 : `${utility.name} Functions`,
 description: this.config.targetLanguage === 'de'
 ? `Beispiele für die Verwendung der ${utility.name} Funktionen`
 : `Examples of using ${utility.name} functions`,
 language: '"typescript"',
 code: `import { ${utility.functions.slice(0, 3).join(', ')} } from '../utils/${utility.name}';

class FormController {
 formatData(data: any) {
 ${utility.functions.slice(0, 2).map((func: string, _index: number) => `
 const ${func.toLowerCase()}Result = ${func}(data.${func.toLowerCase()});
 console.log('${func} result:', ${func.toLowerCase()}Result);
 `).join('')}

 return formattedData;
 }

 validateInput(input: string) {
 return ${utility.functions[utility.functions.length - 1]}(input);
 }
}

export default FormController;`,
 runnable: false,
 explanation: this.config.targetLanguage === 'de'
 ? 'Dieser Code zeigt die typische Verwendung der Utility-Funktionen.'
 : 'This code demonstrates typical usage of utility functions.',
 bestPractices: [
 'Type checking before function calls',
 'Error handling for invalid inputs',
 'Unit testing all utility functions',
 ],
 commonMistakes: [
 'Not handling edge cases',
 'Missing type validation',
 'Performance issues with large data',
 ],
 },
 ];

 return {
 id: `utility-${utility.name.toLowerCase()}`,
 title,
 type: 'reference',
 priority: 40,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['utility', 'helper', utility.name.toLowerCase()],
 difficulty: 'beginner',
 estimatedReadTime: 2,
 },
 dependencies: ['overview'],
 relatedSections: ['testing'],
 codeExamples,
 interactiveElements: [],
 };
 }

 private async generateServiceSections(_sourceAnalysis: SourceAnalysis): Promise<DocumentationSection[]> {
 // Similar implementation to API sections but focused on services
 return [];
 }

 private async generateTypeSections(sourceAnalysis: SourceAnalysis): Promise<DocumentationSection[]> {
 const sections: DocumentationSection[] = [];

 for (const type of sourceAnalysis.types) {
 const section = await this.generateTypeSection(type);
 sections.push(section);
 }

 return sections;
 }

 private async generateTypeSection(type: TypeAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? `Typ: ${type.name}`
 : `Type: ${type.name}`;

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

Der \`${type.name}\` Typ definiert die Struktur für:

## Eigenschaften

${type.properties.map((prop: string) => `
### \`${prop}\`
- **Typ**: string | number | boolean | Date
- **Beschreibung**: ${prop} Eigenschaft
- **Optional**: ${prop !== 'id'}
`).join('')}

## Verwendung

\`\`\`"typescript"
import { ${type.name} } from '../types/${type.name}';

const ${type.name.toLowerCase()}: ${type.name} = {
 id: 1,
${type.properties.slice(1).map((prop: string) => ` ${prop}: ${prop === 'createdAt' ? 'new Date()' : `'example'`}`).join(',\n')}
};
\`\`\`

## Interfaces

\`\`\`"typescript"
interface ${type.name} {
${type.properties.map((prop: string) => ` ${prop}${prop !== 'id' ? '?' : ''}: ${prop === 'createdAt' ? 'Date' : 'string | number'};`).join('\n')}
}
\`\`\`
 ` : `
# ${title}

The \`${type.name}\` type defines the structure for:

## Properties

${type.properties.map((prop: string) => `
### \`${prop}\`
- **Type**: string | number | boolean | Date
- **Description**: ${prop} property
- **Optional**: ${prop !== 'id'}
`).join('')}

## Usage

\`\`\`"typescript"
import { ${type.name} } from '../types/${type.name}';

const ${type.name.toLowerCase()}: ${type.name} = {
 id: 1,
${type.properties.slice(1).map((prop: string) => ` ${prop}: ${prop === 'createdAt' ? 'new Date()' : `'example'`}`).join(',\n')}
};
\`\`\`

## Interfaces

\`\`\`"typescript"
interface ${type.name} {
${type.properties.map((prop: string) => ` ${prop}${prop !== 'id' ? '?' : ''}: ${prop === 'createdAt' ? 'Date' : 'string | number'};`).join('\n')}
}
\`\`\`
 `;

 return {
 id: `type-${type.name.toLowerCase()}`,
 title,
 type: 'reference',
 priority: 35,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
    tags: ['type', 'interface', 'typescript'],
 difficulty: 'beginner',
 estimatedReadTime: 2,
 },
 dependencies: ['overview'],
 relatedSections: ['api'],
 codeExamples: [],
 interactiveElements: [],
 };
 }

 private async generateArchitectureSection(_sourceAnalysis: SourceAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? 'Architektur'
 : 'Architecture';

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

## Übersicht

Die ZOE Solar Anwendung folgt einer modernen, skalierbaren Architektur mit klaren Verantwortlichkeiten.

## Verzeichnisstruktur

\`\`\`
src/
├── components/ # React Komponenten
│ ├── ui/ # Basis UI Komponenten
│ ├── forms/ # Formular-Komponenten
│ └── layout/ # Layout-Komponenten
├── pages/ # Seiten-Komponenten
├── hooks/ # Custom Hooks
├── services/ # API Services
├── utils/ # Hilfsfunktionen
├── types/ # TypeScript Typen
├── store/ # Redux Store
└── styles/ # CSS/Styles
\`\`\`

## Data Flow

### State Management
- **Redux Toolkit**: Zentraler State Management
- **RTK Query**: API State Management und Caching
- **Local State**: Komponenten-spezifischer State

### API Layer
- **Axios Client**: HTTP Client mit Interceptors
- **Error Handling**: Zentrale Fehlerbehandlung
- **Caching**: Intelligentes API Response Caching

### Component Architecture
- **Composition**: Komponenten-Komposition über Props
- **Hooks**: Business Logic in Custom Hooks
- **Context**: Globale Konfiguration und Theme

## Performance Optimierungen

- **Code Splitting**: Lazy Loading mit React.lazy()
- **Memoization**: React.memo() und useMemo()
- **Virtualization**: Virtuelle Listen für große Datenmengen
- **Caching**: API Response Caching und Service Worker

## Sicherheitsmaßnahmen

- **Input Validation**: Client- und Server-seitige Validierung
- **XSS Protection**: DOMPurify für sichere HTML-Erstellung
- **CSRF Protection**: Token-basierter Schutz
- **Content Security Policy**: CSP Header
 ` : `
# ${title}

## Overview

The ZOE Solar application follows a modern, scalable architecture with clear responsibilities.

## Directory Structure

\`\`\`
src/
├── components/ # React components
│ ├── ui/ # Base UI components
│ ├── forms/ # Form components
│ └── layout/ # Layout components
├── pages/ # Page components
├── hooks/ # Custom hooks
├── services/ # API services
├── utils/ # Helper functions
├── types/ # TypeScript types
├── store/ # Redux store
└── styles/ # CSS/Styles
\`\`\`

## Data Flow

### State Management
- **Redux Toolkit**: Centralized state management
- **RTK Query**: API state management and caching
- **Local State**: Component-specific state

### API Layer
- **Axios Client**: HTTP client with interceptors
- **Error Handling**: Centralized error handling
- **Caching**: Intelligent API response caching

### Component Architecture
- **Composition**: Component composition through props
- **Hooks**: Business logic in custom hooks
- **Context**: Global configuration and theme

## Performance Optimizations

- **Code Splitting**: Lazy loading with React.lazy()
- **Memoization**: React.memo() and useMemo()
- **Virtualization**: Virtual lists for large datasets
- **Caching**: API response caching and service worker

## Security Measures

- **Input Validation**: Client and server-side validation
- **XSS Protection**: DOMPurify for safe HTML creation
- **CSRF Protection**: Token-based protection
- **Content Security Policy**: CSP headers
 `;

 return {
 id: 'architecture',
 title,
 type: 'architecture',
 priority: 10,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['architecture', 'overview', 'design'],
 difficulty: 'intermediate',
 estimatedReadTime: 6,
 },
 dependencies: ['overview'],
 relatedSections: ['deployment', 'testing'],
 codeExamples: [],
 interactiveElements: [],
 };
 }

 private async generateDeploymentSection(_sourceAnalysis: SourceAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? 'Deployment'
 : 'Deployment';

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

## Produktions-Deployment

### Build Prozess

\`\`\`bash
# Dependencies installieren
npm ci --production=false

# Build erstellen
npm run build

# Build testen
npm run preview
\`\`\`

### Umgebungsvariablen

\`\`\`bash
# Production
VITE_API_URL=https://api.zoe-solar.de
VITE_APP_ENV=production
VITE_SENTRY_DSN=your-sentry-dsn

# Staging
VITE_API_URL=https://staging-api.zoe-solar.de
VITE_APP_ENV=staging
\`\`\`

### Docker Deployment

\`\`\`dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## Monitoring

- **Performance**: Lighthouse CI
- **Errors**: Sentry Integration
- **Analytics**: Google Analytics 4
- **Uptime**: Uptime Robot

## Backup & Recovery

- **Datenbank**: Tägliche Backups
- **Medien**: S3 mit Versionierung
- **Konfiguration**: Git-basiert
 ` : `
# ${title}

## Production Deployment

### Build Process

\`\`\`bash
# Install dependencies
npm ci --production=false

# Create build
npm run build

# Test build
npm run preview
\`\`\`

### Environment Variables

\`\`\`bash
# Production
VITE_API_URL=https://api.zoe-solar.de
VITE_APP_ENV=production
VITE_SENTRY_DSN=your-sentry-dsn

# Staging
VITE_API_URL=https://staging-api.zoe-solar.de
VITE_APP_ENV=staging
\`\`\`

### Docker Deployment

\`\`\`dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## Monitoring

- **Performance**: Lighthouse CI
- **Errors**: Sentry Integration
- **Analytics**: Google Analytics 4
- **Uptime**: Uptime Robot

## Backup & Recovery

- **Database**: Daily backups
- **Media**: S3 with versioning
- **Configuration**: Git-based
 `;

 return {
 id: 'deployment',
 title,
 type: 'deployment',
 priority: 50,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['deployment', 'production', 'docker'],
 difficulty: 'advanced',
 estimatedReadTime: 5,
 },
 dependencies: ['architecture'],
 relatedSections: ['testing', 'troubleshooting'],
 codeExamples: [],
 interactiveElements: [],
 };
 }

 private async generateTroubleshootingSection(_sourceAnalysis: SourceAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? 'Fehlerbehebung'
 : 'Troubleshooting';

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

## Häufige Probleme

### Build Fehler

#### "Cannot find module"
\`\`\`bash
# Lösung
npm install
npm run build
\`\`\`

#### TypeScript Fehler
\`\`\`bash
# Lösung
npm run type-check
npm run build
\`\`\`

### Laufzeitfehler

#### API Verbindungsfehler
- **Prüfen**: API_URL Umgebungsvariable
- **Lösung**: Korrekten API Endpoint setzen

#### CORS Fehler
- **Prüfen**: Server CORS Konfiguration
- **Lösung**: Frontend URL whitelisten

### Performance Probleme

#### Lange Ladezeiten
- **Analyse**: Lighthouse Audit durchführen
- **Lösung**: Bilder optimieren, Code Splitting

#### Hohe Memory Usage
- **Analyse**: React Profiler verwenden
- **Lösung**: Memory Leaks fixen, Cleanup implementieren

## Debug Tools

### Browser DevTools
- **Performance Tab**: Performance Analyse
- **Network Tab**: API Aufrufe prüfen
- **Console**: Fehler loggen

### React DevTools
- **Component Inspector**: State prüfen
- **Profiler**: Performance messen

## Unterstützung

Bei Problemen:
1. Logs prüfen
2. Issues auf GitHub erstellen
3. Development Team kontaktieren
 ` : `
# ${title}

## Common Issues

### Build Errors

#### "Cannot find module"
\`\`\`bash
# Solution
npm install
npm run build
\`\`\`

#### TypeScript Errors
\`\`\`bash
# Solution
npm run type-check
npm run build
\`\`\`

### Runtime Errors

#### API Connection Errors
- **Check**: API_URL environment variable
- **Solution**: Set correct API endpoint

#### CORS Errors
- **Check**: Server CORS configuration
- **Solution**: Whitelist frontend URL

### Performance Issues

#### Slow Loading
- **Analyze**: Run Lighthouse audit
- **Solution**: Optimize images, implement code splitting

#### High Memory Usage
- **Analyze**: Use React Profiler
- **Solution**: Fix memory leaks, implement cleanup

## Debug Tools

### Browser DevTools
- **Performance Tab**: Performance analysis
- **Network Tab**: Check API calls
- **Console**: Error logging

### React DevTools
- **Component Inspector**: Check state
- **Profiler**: Measure performance

## Support

For issues:
1. Check logs
2. Create GitHub issue
3. Contact development team
 `;

 return {
 id: 'troubleshooting',
 title,
 type: 'troubleshooting',
 priority: 60,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['troubleshooting', 'debugging', 'support'],
 difficulty: 'intermediate',
 estimatedReadTime: 4,
 },
 dependencies: ['deployment'],
 relatedSections: ['testing', 'api'],
 codeExamples: [],
 interactiveElements: [],
 };
 }

 private async generateTestingSection(_sourceAnalysis: SourceAnalysis): Promise<DocumentationSection> {
 const title = this.config.targetLanguage === 'de'
 ? 'Testing'
 : 'Testing';

 const content = this.config.targetLanguage === 'de' ? `
# ${title}

## Test-Setup

### Dependencies
\`\`\`json
{
 "jest": "^29.0.0",
 "@testing-library/react": "^13.0.0",
 "@testing-library/jest-dom": "^5.0.0",
 "@testing-library/user-event": "^14.0.0"
}
\`\`\`

### Konfiguration
\`\`\`javascript
// jest.config.js
module.exports = {
 testEnvironment: 'jsdom',
 setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
 moduleNameMapping: {
 '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
 },
};
\`\`\`

## Test-Arten

### Unit Tests
\`\`\`tsx
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component correctly', () => {
 render(<Component />);
 expect(screen.getByText('Hello')).toBeInTheDocument();
});
\`\`\`

### Integration Tests
\`\`\`tsx
// Integration.test.tsx
import { render, fireEvent } from '@testing-library/react';
import Form from './Form';

test('submits form correctly', async () => {
 const onSubmit = jest.fn();
 render(<Form onSubmit={onSubmit} />);

 fireEvent.change(screen.getByLabelText('Name'), {
 target: { value: 'Test' }
 });

 fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

 expect(onSubmit).toHaveBeenCalledWith({ name: 'Test' });
});
\`\`\`

### E2E Tests
\`\`\`"typescript"
// e2e.test.ts
import { test, expect } from '@playwright/test';

test('user can complete form', async ({ page }) => {
 await page.goto('/');

 await page.fill('[data-testid="name"]', 'Test User');
 await page.click('[data-testid="submit"]');

 await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
\`\`\`

## Test-Befehle

\`\`\`bash
# Alle Tests ausführen
npm test

# Watch Mode
npm test -- --watch

# Coverage Report
npm run test:coverage

# E2E Tests
npm run test:e2e
\`\`\`

## Best Practices

- Tests beschreiben, nicht wie
- User-centric Testing
- Wiederverwendbare Test-Utilities
- Mocking externer Dependencies
 ` : `
# ${title}

## Test Setup

### Dependencies
\`\`\`json
{
 "jest": "^29.0.0",
 "@testing-library/react": "^13.0.0",
 "@testing-library/jest-dom": "^5.0.0",
 "@testing-library/user-event": "^14.0.0"
}
\`\`\`

### Configuration
\`\`\`javascript
// jest.config.js
module.exports = {
 testEnvironment: 'jsdom',
 setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
 moduleNameMapping: {
 '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
 },
};
\`\`\`

## Test Types

### Unit Tests
\`\`\`tsx
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component correctly', () => {
 render(<Component />);
 expect(screen.getByText('Hello')).toBeInTheDocument();
});
\`\`\`

### Integration Tests
\`\`\`tsx
// Integration.test.tsx
import { render, fireEvent } from '@testing-library/react';
import Form from './Form';

test('submits form correctly', async () => {
 const onSubmit = jest.fn();
 render(<Form onSubmit={onSubmit} />);

 fireEvent.change(screen.getByLabelText('Name'), {
 target: { value: 'Test' }
 });

 fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

 expect(onSubmit).toHaveBeenCalledWith({ name: 'Test' });
});
\`\`\`

### E2E Tests
\`\`\`"typescript"
// e2e.test.ts
import { test, expect } from '@playwright/test';

test('user can complete form', async ({ page }) => {
 await page.goto('/');

 await page.fill('[data-testid="name"]', 'Test User');
 await page.click('[data-testid="submit"]');

 await expect(page.locator('[data-testid="success"]')).toBeVisible();
});
\`\`\`

## Test Commands

\`\`\`bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
\`\`\`

## Best Practices

- Test what, not how
- User-centric testing
- Reusable test utilities
- Mock external dependencies
 `;

 return {
 id: 'testing',
 title,
 type: 'tutorial',
 priority: 45,
 content,
 metadata: {
 lastModified: new Date(),
 author: 'Serena MCP Documentation Generator',
 tags: ['testing', 'jest', 'testing-library'],
 difficulty: 'intermediate',
 estimatedReadTime: 5,
 },
 dependencies: ['overview'],
 relatedSections: ['troubleshooting', 'components'],
 codeExamples: [],
 interactiveElements: [],
 };
 }

 private async generateNavigation(sections: DocumentationSection[]): Promise<GeneratedDocumentation['navigation']> {
 // Generate table of contents
 const tableOfContents = this.generateTableOfContents(sections);

 // Generate index
 const index = await this.generateIndex(sections);

 // Generate cross-references
 const crossReferences = this.generateCrossReferences(sections);

 return {
 tableOfContents,
 index,
 crossReferences,
 };
 }

 private generateTableOfContents(sections: DocumentationSection[]): TOCItem[] {
 const toc: TOCItem[] = [];

 for (const section of sections) {
 const tocItem: TOCItem = {
 id: section.id,
 title: section.title,
 level: 1,
 estimatedReadTime: section.metadata.estimatedReadTime,
 children: [],
 };

 // Parse content to extract subheadings
 const subheadings = this.extractSubheadings(section.content);
 for (const subheading of subheadings) {
 tocItem.children.push({
 id: `${section.id}-${subheading.id}`,
 title: subheading.title,
 level: subheading.level,
 estimatedReadTime: Math.ceil(subheading.estimatedReadTime),
 children: [],
 });
 }

 toc.push(tocItem);
 }

 return toc;
 }

 private extractSubheadings(content: string): Array<{ id: string; title: string; level: number; estimatedReadTime: number }> {
 const subheadings: Array<{ id: string; title: string; level: number; estimatedReadTime: number }> = [];
 const lines = content.split('\n');

 for (const line of lines) {
 const match = line.match(/^(#{1,6})\s+(.+)$/);
 if (match) {
 const level = match[1]!.length;
 const title = match[2]!;
 const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
 const estimatedReadTime = level * 0.5; // Rough estimate

 subheadings.push({ id, title, level, estimatedReadTime });
 }
 }

 return subheadings;
 }

 private async generateIndex(sections: DocumentationSection[]): Promise<IndexItem[]> {
 const index: IndexItem[] = [];
 const terms = new Set<string>();

 // Extract terms from all sections
 for (const section of sections) {
 // Extract terms from titles
 const titleWords = section.title.toLowerCase().split(/\s+/);
 titleWords.forEach(word => terms.add(word));

 // Extract terms from content (simplified)
 const contentWords = section.content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
 contentWords.forEach((word: string) => terms.add(word));

 // Extract terms from metadata
 section.metadata.tags.forEach(tag => terms.add(tag));
 }

 // Generate index items
 for (const term of Array.from(terms).sort()) {
 if (term.length > 3) { // Only include meaningful terms
 const relatedSections = sections.filter(section =>
 section.title.toLowerCase().includes(term) ||
 section.content.toLowerCase().includes(term) ||
 section.metadata.tags.includes(term)
 );

 if (relatedSections.length > 0) {
 index.push({
 term,
 definition: `${term} - ${this.config.targetLanguage === 'de' ? 'Bezeichnung im ZOE Solar Projekt' : 'Term in ZOE Solar project'}`,
 section: relatedSections[0]!.id,
 context: relatedSections[0]!.title,
 relevance: relatedSections.length,
 });
 }
 }
 }

 return index.slice(0, 500); // Limit index size
 }

 private generateCrossReferences(sections: DocumentationSection[]): CrossReference[] {
 const crossReferences: CrossReference[] = [];

 for (const section of sections) {
 // Generate related section references
 for (const relatedId of section.relatedSections) {
 const relatedSection = sections.find(s => s.id === relatedId);
 if (relatedSection) {
 crossReferences.push({
 source: section.id,
 target: relatedSection.id,
 type: 'related',
 description: this.config.targetLanguage === 'de'
 ? `Siehe auch: ${relatedSection.title}`
 : `See also: ${relatedSection.title}`,
 });
 }
 }

 // Generate dependency references
 for (const depId of section.dependencies) {
 const depSection = sections.find(s => s.id === depId);
 if (depSection) {
 crossReferences.push({
 source: section.id,
 target: depSection.id,
 type: 'dependency',
 description: this.config.targetLanguage === 'de'
 ? `Erfordert Kenntnis von: ${depSection.title}`
 : `Requires knowledge of: ${depSection.title}`,
 });
 }
 }
 }

 return crossReferences;
 }

 private async generateAssets(_sections: DocumentationSection[]): Promise<GeneratedDocumentation['assets']> {
 // In a real implementation, would generate actual assets
 return {
 images: [],
 diagrams: [],
 interactiveDemos: [],
 };
 }

 private async analyzeDocumentation(sections: DocumentationSection[], sourceAnalysis: SourceAnalysis): Promise<DocumentationAnalysis> {
 const totalFiles = sourceAnalysis.components.length +
 sourceAnalysis.utilities.length +
 sourceAnalysis.services.length +
 sourceAnalysis.types.length;

 const documentedFiles = sections.length;
 const documentationRatio = totalFiles > 0 ? (documentedFiles / totalFiles) * 100 : 0;

 const undocumentedComponents = sourceAnalysis.components
 .filter((comp: ComponentAnalysis) => !sections.some(s => s.id.includes(comp.name.toLowerCase())))
 .map((comp: ComponentAnalysis) => comp.path);

 const quality = {
 codeExamples: sections.some(s => s.codeExamples.length > 0),
 explanations: sections.some(s => s.content.length > 500),
 typeDefinitions: sections.some(s => s.type === 'reference'),
 crossReferences: sections.some(s => s.relatedSections.length > 0),
 interactiveElements: sections.some(s => s.interactiveElements.length > 0),
 };

 const qualityScore = Object.values(quality).filter(Boolean).length / Object.keys(quality).length * 100;

 const recommendations: string[] = [];
 if (!quality.codeExamples) recommendations.push('Add more code examples to improve understanding');
 if (!quality.crossReferences) recommendations.push('Add cross-references between related sections');
 if (documentationRatio < 80) recommendations.push('Increase documentation coverage');
 if (!quality.interactiveElements) recommendations.push('Consider adding interactive elements');

 return {
 completeness: documentationRatio,
 quality,
 coverage: {
 totalFiles,
 documentedFiles,
 documentationRatio,
 undocumentedComponents,
 },
 recommendations,
 qualityScore,
 };
 }

 private calculateTotalWords(sections: DocumentationSection[]): number {
 return sections.reduce((total, section) => {
 const wordCount = section.content.split(/\s+/).length;
 const exampleWordCount = section.codeExamples.reduce((sum, example) =>
 sum + example.code.split(/\s+/).length + example.explanation.split(/\s+/).length, 0);
 return total + wordCount + exampleWordCount;
 }, 0);
 }

 private calculateTotalReadTime(sections: DocumentationSection[]): number {
 return sections.reduce((total, section) => total + section.metadata.estimatedReadTime, 0);
 }

 private getProjectVersion(): string {
 // In real implementation, would read from package.json
 return '1.0.0';
 }

 public async exportDocumentation(documentation: GeneratedDocumentation, format: 'markdown' | 'html' | 'pdf' | 'docx' = this.config.outputFormat): Promise<string> {
 switch (format) {
 case 'markdown':
 return this.exportToMarkdown(documentation);
 case 'html':
 return this.exportToHTML(documentation);
 case 'pdf':
 return this.exportToPDF(documentation);
 case 'docx':
 return this.exportToDOCX(documentation);
 default:
 return this.exportToMarkdown(documentation);
 }
 }

 private async exportToMarkdown(documentation: GeneratedDocumentation): Promise<string> {
 let markdown = `# ${this.config.targetLanguage === 'de' ? 'ZOE Solar Dokumentation' : 'ZOE Solar Documentation'}\n\n`;

 // Add table of contents
 markdown += '## Inhaltsverzeichnis\n\n';
 for (const item of documentation.navigation.tableOfContents) {
 markdown += `- [${item.title}](#${item.id})\n`;
 for (const child of item.children) {
 markdown += ` - [${child.title}](#${child.id})\n`;
 }
 }

 // Add sections
 for (const section of documentation.sections) {
 markdown += `\n${section.content}\n`;
 }

 return markdown;
 }

 private async exportToHTML(documentation: GeneratedDocumentation): Promise<string> {
 // In real implementation, would use a proper HTML template
 const markdown = await this.exportToMarkdown(documentation);
 return `<html><body>${markdown.replace(/\n/g, '<br>')}</body></html>`;
 }

 private async exportToPDF(_documentation: GeneratedDocumentation): Promise<string> {
 // In real implementation, would use a PDF generation library
 return 'PDF export would be generated here';
 }

 private async exportToDOCX(_documentation: GeneratedDocumentation): Promise<string> {
 // In real implementation, would use a DOCX generation library
 return 'DOCX export would be generated here';
 }

 public getDocumentation(sourcePath?: string): GeneratedDocumentation | undefined {
 if (sourcePath) {
 return this.documentationCache.get(sourcePath);
 }
 return this.documentationCache.values().next().value;
 }

 public clearCache(): void {
 this.documentationCache.clear();
 }

 public updateConfig(newConfig: Partial<DocumentationConfig>): void {
 this.config = { ...this.config, ...newConfig };
 }
}

export default SmartDocGenerator;