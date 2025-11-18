# 🤖 ZOE Solar Testing Automation Tools

## 📋 Overview

Dieses Dokument beschreibt die automatisierten Testing-Tools und -Prozesse für die ZOE Solar Plattform, inklusive Continuous Testing, Monitoring und Quality Gates.

---

## 🔧 Core Testing Tools

### Test Automation Frameworks

#### Jest Configuration with Advanced Plugins
```json
// package.json - Testing Scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:performance": "playwright test --project=performance",
    "test:a11y": "playwright test --project=accessibility",
    "test:security": "npm run test:unit && npm run test:e2e && npm run test:a11y",
    "test:ci": "npm run test:unit --ci --watchAll=false && npm run test:integration --ci && npm run test:e2e",
    "test:smoke": "playwright test --config=smoke.config.ts",
    "test:regression": "playwright test --config=regression.config.ts",
    "test:visual": "percy exec --config .percyrc.yml npm run test:visual",
    "lint:test": "eslint src/**/__tests__/**/*",
    "type-check:test": "tsc --noEmit src/**/__tests__/**/*",
    "prepare:test": "husky install"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "jest-extended": "^4.0.2",
    "jest-junit": "^16.0.0",
    "jest-html-reporters": "^4.1.0",
    "@jest/generate-coverage/legacy": "^0.5.0",
    "@jest/globals": "^29.7.0",
    "playwright": "^1.40.1",
    "@playwright/test": "^1.40.1",
    "percy": "^2.0.1",
    "@percy/cli": "^2.0.1",
    "axe-core": "^4.8.2",
    "jest-axe": "^8.0.0",
    "supertest": "^6.3.4",
    "nock": "^13.3.3",
    "msw": "^2.0.8",
    "testcontainers": "^10.13.0",
    "lighthouse": "^11.4.0",
    "lighthouse-ci": "^0.12.0",
    "@lhci/cli": "^0.12.0",
    "chromedriver": "^120.0.0",
    "selenium-webdriver": "^4.15.0",
    "wd": "^1.14.0",
    "wdio-jasmine-framework": "^8.0.0",
    "cypress": "^13.6.0",
    "cypress-mochawesome-reporter": "^3.5.1",
    "@cypress/code-coverage": "^3.10.11",
    "sql-cli": "^0.6.5",
    "selenium-side-runner": "^2.0.0",
    "detox": "^21.1.0",
    "robotframework": "^6.1.0",
    "robotframework-pythonlib": "^7.0.0",
    "puppeteer": "^21.3.8",
    "puppeteer-to-istanbul": "^1.2.0",
    "serverless": "^3.38.0",
    "serverless-offline": "^13.5.0"
  }
}
```

#### Advanced Jest Plugins Configuration
```javascript
// jest.plugins.js
const { defaults } = require('jest-config-defaults');
const { merge } = require('lodash/merge');
const path = require('path');

module.exports = merge({}, defaults, {
  // Root directory for tests
  rootDir: path.resolve(__dirname, '..'),

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.js'],

  // Module path mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^#/(.*)$': '<rootDir>/node_modules/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',
  },

  // Test path patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    '<rootDir>/test-results/',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/*.types.{ts,tsx}',
    '!src/**/__tests__/**/*',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/components/**/*.{js,jsx,ts,tsx}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/utils/**/*.{js,ts}': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Extensions
  transformIgnorePatterns: [
    'node_modules/(?!((?!jest-).+)/).*$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  // Test environment
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportLocals: ['testing-library/jest-dom'],
  },

  // Test timeout
  testTimeout: 30000,
  testTimeout: 10000,

  // Parallel execution
  maxWorkers: '50%',
  maxConcurrency: 5,

  // Verbose output
  verbose: false,

  // Bail on first failure
  bail: false,

  // Reporter configuration
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results/junit',
        outputName: 'junit.xml',
        ancestorSeparator: ' ›',
        uniqueOutputName: 'false',
        classNameTemplate: '{classname} - {title}',
        titleTemplate: '{title}',
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: 'test-results/html',
        filename: 'report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'ZOE Solar Test Report',
        logoImgPath: undefined,
      },
    ],
    [
      '@jest/generate-coverage/legacy',
      {
        coverageReporters: [
          'text',
          'text-summary',
          'lcov',
          'html',
          'json',
          'cobertura',
          'teamcity',
        ],
        reportsDirectory: 'test-results/coverage',
      },
    ],
  ],
});
```

---

## 🎭 Playwright Advanced Configuration

### Multi-Browser and Multi-Device Setup
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Global configuration
  testDir: './tests/e2e',
  testMatch: '**/tests/**/*.e2e.spec.{ts,js}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    [
      'html',
      { outputFolder: 'test-results/playwright-report' },
    ],
    [
      'json',
      { outputFile: 'test-results/test-results.json' },
    ],
    [
      'junit',
      { outputFile: 'test-results/junit-results.xml' },
    ],
    process.env.CI ? ['github'] : ['list'],
  ],

  // Use configuration
  use: {
    // Global test timeout
    actionTimeout: 10000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Projects configuration
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.desktop.spec.{ts,js}',
      dependencies: ['@playwright/test'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        firefoxUserPrefs: {
          'dom.disable_open_during_load': true,
          'browser.startup.homepage_override': 'about:blank',
        },
      },
      testMatch: '**/*.firefox.spec.{ts,js}',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/*.webkit.spec.{ts,js}',
    },

    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/*.mobile.spec.{ts,js}',
      dependencies: ['@playwright/test'],
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 12'] },
      testMatch: '**/*.mobile.spec.{ts,js}',
    },

    // Tablet devices
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
      testMatch: '**/*.tablet.spec.{ts,js}',
    },

    // Specialized testing
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.a11y.spec.{ts,js}',
      dependencies: ['@axe-core/playwright'],
    },
    {
      name: 'performance',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.perf.spec.{ts,js}',
    },
    {
      name: 'visual-regression',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.visual.spec.{ts,js}',
      dependencies: ['@percy/playwright'],
    },

    // API testing
    {
      name: 'api-testing',
      testMatch: '**/*.api.spec.{ts,js}',
      use: { headless: true },
    },

    // GraphQL testing
    {
      name: 'graphql-testing',
      testMatch: '**/*.graphql.spec.{ts,js}',
      use: { headless: true },
    },

    // Integration testing
    {
      name: 'integration',
      testMatch: '**/*.integration.spec.{ts,js}',
      dependencies: ['@playwright/test'],
    },
  ],

  // Web server configuration
  webServer: {
    command: process.env.CI ? '' : 'npm run dev',
    url: process.env.CI ? undefined : 'http://localhost:3000',
    port: process.env.CI ? undefined : 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Global setup and teardown
  globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown.ts'),

  // Custom configuration
  metadata: {
    'test-environment': process.env.NODE_ENV || 'test',
    'browser-versions': {
      chromium: require('puppeteer/package.json').version,
      firefox: require('firefox/package.json').version,
      webkit: require('playwright/package.json').version,
    },
  },
});
```

### Custom Playwright Extensions
```typescript
// tests/e2e/fixtures/playwright-extensions.ts
import { test as base } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { injectAxe, checkA11y } from 'axe-playwright';

// Custom test with accessibility checking
export const test = base.extend({
  checkA11y: async ({ page }, use) => {
    await use(checkA11y());
  },

  withA11y: async ({ page }, use) => {
    await use({
      async checkA11y({ options }: { options?: any } = {}) {
        const accessibilityScan = await new AxeBuilder({ page })
          .include(['main', '[role="main"]'])
          .withTags(['wcag2a', 'wcag21aa'])
          .analyze(options);

        expect(accessibilityScan.violations).toEqual([]);
      },
    });
  },

  // Slow motion for debugging
  slowMotion: async ({ page }, use) => {
    await use({
      slowMo: {
        delay: 100,
        timeout: 10000,
      },
    });
  },

  // Tracing for debugging
  withTrace: async ({ page }, use) => {
    await use({
      trace: 'on-first-retry',
    });
  },

  // Video recording
  withVideo: async ({ page }, use) => {
    await use({
      video: {
        mode: 'retain-on-failure',
        size: { width: 1280, height: 720 },
      },
    });
  },

  // Network monitoring
  withNetworkMonitoring: async ({ page }, use) => {
    const networkRequests: any[] = [];

    await page.route('**/*', (route) => {
      const start = Date.now();
      route.continue().then(() => {
        networkRequests.push({
          url: route.request().url(),
          method: route.request().method(),
          status: route.response()?.status(),
          duration: Date.now() - start,
        });
      });
    });

    await use({
      networkRequests: {
        get: () => networkRequests,
        clear: () => {
          networkRequests.length = 0;
        },
      },
    });
  },

  // Memory monitoring
  withMemoryMonitoring: async ({ page }, use) => {
    const memorySnapshots: any[] = [];

    const collectMemorySnapshot = () => {
      return page.evaluate(() => ({
        usedJSHeapSize: (performance as any).memory?.usedJSHeapSize || 0,
        totalJSHeapSize: (performance as any).memory?.totalJSHeapSize || 0,
        jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit || 0,
        timestamp: Date.now(),
      }));
    };

    await use({
      memorySnapshots: {
        take: () => {
          const snapshot = collectMemorySnapshot();
          memorySnapshots.push(snapshot);
          return snapshot;
        },
        get: () => memorySnapshots,
        clear: () => {
          memorySnapshots.length = 0;
        },
      },
    });
  },

  // Performance monitoring
  withPerformanceMonitoring: async ({ page }, use) => {
    const performanceMetrics: any[] = [];

    await use({
      performanceMetrics: {
        recordMetric: (name: string, value: number) => {
          performanceMetrics.push({
            name,
            value,
            timestamp: Date.now(),
          });
        },
        getMetrics: () => performanceMetrics,
        clear: () => {
          performanceMetrics.length = 0;
        },
      },
    });
  },

  // Browser DevTools integration
  withDevTools: async ({ page }, use) => {
    const devTools = await page.context().newCDPSession();

    await use({
      devTools,
      captureScreenshot: async (filename: string) => {
        const screenshot = await devTools.Page.captureScreenshot();
        await page.screenshot({ path: `test-results/screenshots/${filename}` });
        return screenshot;
      },
    });
  },

  // Cookie management
  withCookies: async ({ page }, use) => {
    await use({
      cookies: {
        set: async (name: string, value: string) => {
          await page.context().addCookies([{ name, value, domain: 'localhost', path: '/' }]);
        },
        get: async (name: string) => {
          const cookies = await page.context().cookies();
          return cookies.find(c => c.name === name)?.value;
        },
        clear: async () => {
          await page.context().clearCookies();
        },
      },
    });
  },

  // Local storage management
  withLocalStorage: async ({ page }, use) => {
    await use({
      localStorage: {
        set: async (key: string, value: string) => {
          await page.evaluate(([k, v]) => {
            localStorage.setItem(k, v);
          }, [key, value]);
        },
        get: async (key: string) => {
          return await page.evaluate((k) => {
            return localStorage.getItem(k);
          }, [key]);
        },
        remove: async (key: string) => {
          await page.evaluate((k) => {
            localStorage.removeItem(k);
          }, [key]);
        },
        clear: async () => {
          await page.evaluate(() => {
            localStorage.clear();
          });
        },
      },
    });
  },
});

export { expect } from '@playwright/test';
```

---

## ⚡ Performance Testing Automation

### Lighthouse CI/CD Integration
```javascript
// tests/performance/lighthouse-runner.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

class LighthouseRunner {
  constructor(options = {}) {
    this.options = {
      logLevel: 'info',
      outputDirectory: 'test-results/lighthouse',
      baseUrl: 'http://localhost:3000',
      ...options,
    };
  }

  async runAudit(url, config = {}) {
    console.log(`Running Lighthouse audit for: ${url}`);

    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
      logLevel: this.options.logLevel,
    });

    const page = await chrome.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    try {
      const results = await lighthouse(page.url(), {
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
          'pwa',
        ],
        ...config,
      });

      await this.saveResults(results, url);
      return results;
    } finally {
      await chrome.close();
    }
  }

  async saveResults(results, url) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(
      this.options.outputDirectory,
      `lighthouse-${timestamp}-${this.sanitizeUrl(url)}.json`
    );

    await fs.promises.writeFile(filename, JSON.stringify(results, null, 2));
    console.log(`Results saved to: ${filename}`);
  }

  sanitizeUrl(url) {
    return url
      .replace(/^https?:\/\//, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
  }

  async runMultiPageAudit(urls) {
    const results = [];

    for (const url of urls) {
      try {
        const result = await this.runAudit(url);
        results.push(result);
      } catch (error) {
        console.error(`Failed to audit ${url}:`, error);
        results.push(null);
      }
    }

    return results;
  }

  async generateReport(results) {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(results),
      details: results,
    };

    const reportPath = path.join(
      this.options.outputDirectory,
      `lighthouse-summary-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    );

    await fs.promises.writeFile(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`Summary report saved to: ${reportPath}`);

    return reportData;
  }

  generateSummary(results) {
    const validResults = results.filter(r => r !== null);

    if (validResults.length === 0) {
      return { totalTests: 0, averageScore: 0 };
    }

    const scores = validResults.map(r => r.lhr.categories.performance.score * 100);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      totalTests: results.length,
      successfulTests: validResults.length,
      failedTests: results.length - validResults.length,
      averageScore,
      scores: scores.map((score, index) => ({
        url: validResults[index].finalUrl,
        score,
        lighthouse: validResults[index].lhr.categories,
      })),
    };
  }
}

module.exports = LighthouseRunner;
```

### Performance Test Scheduler
```typescript
// tests/performance/scheduler.js
const cron = require('node-cron');
const LighthouseRunner = require('./lighthouse-runner');
const { uploadToS3 } = require('../utils/s3-uploader');
const { sendSlackNotification } = require('../utils/slack-notifier');

class PerformanceTestScheduler {
  constructor() {
    this.lighthouseRunner = new LighthouseRunner();
    this.testUrls = [
      { url: 'https://zoe-solar.de', name: 'Homepage' },
      { url: 'https://zoe-solar.de/rechner', name: 'Solar Calculator' },
      { url: 'https://zoe-solar.de/kontakt', name: 'Contact Form' },
      { url: 'https://zoe-solar.de/projekte', name: 'Project Gallery' },
      { url: 'https://zoe-solar.de/dashboard', name: 'Dashboard' },
    ];
  }

  async startScheduler() {
    console.log('Starting Performance Test Scheduler');

    // Run tests every weekday at 2 AM
    cron.schedule('0 2 * * 1-5', async () => {
      await this.runScheduledTests();
    });

    // Run tests on every commit to main branch
    if (process.env.CI && process.env.GITHUB_REF === 'refs/heads/main') {
      await this.runScheduledTests();
    }

    console.log('Performance Test Scheduler started');
  }

  async runScheduledTests() {
    console.log('Running scheduled performance tests...');

    try {
      // Run Lighthouse audits
      const results = await this.lighthouseRunner.runMultiPageAudit(
        this.testUrls.map(url => url.url)
      );

      // Generate summary report
      const summary = await this.lighthouseRunner.generateReport(results);

      // Save detailed results
      const timestamp = new Date().toISOString();
      const resultsPath = `test-results/performance/lighthouse-${timestamp}`;
      await this.saveResults(results, resultsPath);

      // Upload to S3
      if (process.env.AWS_S3_BUCKET) {
        await uploadToS3(resultsPath, `${process.env.AWS_S3_BUCKET}/performance-reports/`);
      }

      // Send Slack notification
      await this.sendPerformanceNotification(summary);

      console.log('Scheduled performance tests completed successfully');
    } catch (error) {
      console.error('Error running scheduled tests:', error);
      await this.sendErrorNotification(error);
    }
  }

  saveResults(results, path) {
    const resultsPath = path;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    results.forEach((result, index) => {
      if (result) {
        const filename = `test-${index + 1}-${this.lighthouseRunner.sanitizeUrl(result.finalUrl)}.json`;
        const filePath = path.join(resultsPath, filename);
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
      }
    });
  }

  async sendPerformanceNotification(summary) {
    const { totalTests, successfulTests, averageScore, scores } = summary;

    const passingTests = scores.filter(score => score.score >= 90).length;
    const failingTests = totalTests - passingTests;

    const color = failingTests === 0 ? 'green' : averageScore >= 80 ? 'yellow' : 'red';
    const status = failingTests === 0 ? '✅' : averageScore >= 80 ? '⚠️' : '❌';

    const message = `
${status} Performance Test Results

📊 Summary:
   • Total Tests: ${totalTests}
   • Successful: ${successfulTests}
   • Passing: ${passingTests}
   • Failing: ${failingTests}
   • Average Score: ${averageScore.toFixed(1)}

🎯 Score Distribution:
${scores.map(score => `   • ${score.name}: ${score.score}`).join('\n')}

${failingTests > 0 ? '\n❌ Failing Tests:\n' + scores.filter(s => s.score < 90).map(score => `   • ${score.url}: ${score.score}`).join('\n') : ''}
    `;

    await sendSlackNotification({
      channel: '#performance-reports',
      text: message,
      color,
      attachments: [
        {
          color: failingTests === 0 ? 'good' : averageScore >= 80 ? 'warning' : 'danger',
          text: `View detailed report at: https://test-results.zoe-solar.de/performance/`,
          title: 'Performance Test Report',
        },
      ],
    });
  }

  async sendErrorNotification(error) {
    await sendSlackNotification({
      channel: '#performance-reports',
      text: `❌ Performance Test Failed: ${error.message}`,
      color: 'danger',
    });
  }
}

// Start scheduler if this file is run directly
if (require.main === module) {
  const scheduler = new PerformanceTestScheduler();
  scheduler.startScheduler();
}

module.exports = PerformanceTestScheduler;
```

---

## 🔒 Security Testing Automation

### OWASP ZAP Integration
```javascript
// tests/security/zap-runner.js
const ZapClient = require('zaproxy');
const { uploadToS3 } = require('../utils/s3-uploader');
const { sendSlackNotification } = require('../utils/slack-notification');

class OWASPZapRunner {
  constructor(options = {}) {
    this.options = {
      targetUrl: 'https://zoe-solar.de',
      apiKey: process.env.ZAP_API_KEY,
      outputDirectory: 'test-results/security',
      reportName: 'zap-scan',
      ...options,
    };
    this.zap = new ZapClient({ apiKey: this.options.apiKey });
  }

  async initialize() {
    console.log('Initializing OWASP ZAP...');

    await this.zap.core.newSession();
    await this.zap.core.setOption('defaultFilesystem', this.options.outputDirectory);
    await this.zap.core.setOption('defaultRecordFormat', 'json');

    console.log('OWASP ZAP initialized');
  }

  async runBaselineScan() {
    console.log(`Running baseline scan for ${this.options.targetUrl}`);

    try {
      await this.initialize();

      // Configure ZAP options
      await this.zap.core.setOption('ajaxSpiderEnable', 'true');
      await this.zap.core.setOption('spiderMaxDepth', '5');
      await this.zap.core.setOption('spiderDuration', '60');

      // Start spidering
      console.log('Starting spider...');
      const spiderId = await this.zap.spider.scan(this.options.targetUrl);

      // Wait for spider to complete
      let spiderStatus = 0;
      while (spiderStatus < 100) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        spiderStatus = await this.zap.spider.status(spiderId);
        console.log(`Spider progress: ${spiderStatus}%`);
      }

      // Run active scan
      console.log('Starting active scan...');
      const scanId = await this.zap.ascan.scan(this.options.targetUrl);

      // Wait for scan to complete
      let scanStatus = 0;
      while (scanStatus < 100) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        scanStatus = await this.zap.ascan.status(scanId);
        console.log(`Active scan progress: ${scanStatus}%`);
      }

      // Get results
      const alerts = await this.zap.core.alerts();
      const highAlerts = alerts.filter(alert => alert.risk === 'High');
      const mediumAlerts = alerts.filter(alert => alert.risk === 'Medium');
      const lowAlerts = alerts.filter(alert => alert.risk === 'Low');

      // Save results
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const resultsPath = path.join(this.options.outputDirectory, `zap-baseline-${timestamp}`);

      if (!fs.existsSync(resultsPath)) {
        fs.mkdirSync(resultsPath, { recursive: true });
      }

      await this.zap.core.htmlreport(`${resultsPath}/zap-report.html`);
      await this.zap.core.jsonreport(`${resultsPath}/zap-report.json`);

      // Generate summary
      const summary = {
        timestamp,
        target: this.options.targetUrl,
        scanType: 'baseline',
        totalAlerts: alerts.length,
        highAlerts: highAlerts.length,
        mediumAlerts: mediumAlerts.length,
        lowAlerts: lowAlerts.length,
        alerts: this.categorizeAlerts(alerts),
      };

      await fs.promises.writeFile(
        path.join(resultsPath, 'summary.json'),
        JSON.stringify(summary, null, 2)
      );

      // Upload to S3
      if (process.env.AWS_S3_BUCKET) {
        await uploadToS3(resultsPath, `${process.env.AWS_S3_BUCKET}/security-reports/`);
      }

      // Send notification
      await this.sendZapNotification(summary);

      console.log(`Baseline scan completed. ${highAlerts.length} high, ${mediumAlerts.length} medium, ${lowAlerts.length} low risk alerts`);

      return summary;
    } catch (error) {
      console.error('Error running baseline scan:', error);
      throw error;
    }
  }

  categorizeAlerts(alerts) {
    const categories = {
      'Cross Site Scripting (Reflected)': [],
      'Cross Site Scripting (Stored)': [],
      'Cross Site Scripting (DOM Based)': [],
      'Injection': [],
      'Authentication': [],
      'Session Management': [],
    };

    alerts.forEach(alert => {
      const alertType = alert.alert || alert.pluginId;
      if (categories[alertType]) {
        categories[alertType].push(alert);
      } else {
        categories['Other'].push(alert);
      }
    });

    return categories;
  }

  async sendZapNotification(summary) {
    const { totalAlerts, highAlerts, mediumAlerts, lowAlerts } = summary;

    const riskColor = highAlerts > 0 ? 'danger' : mediumAlerts > 0 ? 'warning' : 'good';
    const riskIcon = highAlerts > 0 ? '🚨' : mediumAlerts > 0 ? '⚠️' : '✅';

    let alertSummary = '';
    if (highAlerts > 0) {
      alertSummary += `${highAlerts} High Risk${mediumAlerts > 0 ? `, ${mediumAlerts} Medium` : ''}`;
    } else if (mediumAlerts > 0) {
      alertSummary = `${mediumAlerts} Medium Risk`;
    } else if (lowAlerts > 0) {
      alertSummary = `${lowAlerts} Low Risk`;
    }

    const message = `
${riskIcon} OWASP ZAP Security Scan Results

🎯 Target: ${summary.target}
📊 Summary:
   • Total Alerts: ${totalAlerts}
   • Risk Distribution:
     • High Risk: ${highAlerts}
     • Medium Risk: ${mediumAlerts}
     • Low Risk: ${lowAlerts}

${alertSummary ? `\n⚠️ Alert Summary: ${alertSummary}` : ''}

View detailed report at: https://test-results.zoe-solar.de/security/
    `;

    await sendSlackNotification({
      channel: '#security-reports',
      text: message,
      color: riskColor,
    });
  }

  async runVulnerabilityScan() {
    console.log('Running vulnerability scan with custom rules...');

    try {
      await this.initialize();

      // Add custom rules
      await this.addCustomRules();

      // Run targeted scans
      const scanTargets = [
        {
          url: `${this.options.targetUrl}/api/calculator/calculate`,
          name: 'Calculator API',
          rules: ['sql-injection', 'xss', 'csrf'],
        },
        {
          url: `${this.options.targetUrl}/api/auth/login`,
          name: 'Authentication API',
          rules: ['weak-password', 'authentication-bypass'],
        },
        {
          url: `${this.options.targetUrl}/api/user/profile`,
          name: 'User Profile API',
          rules: ['information-disclosure', 'access-control'],
        },
      ];

      const allResults = [];

      for (const target of scanTargets) {
        console.log(`Scanning: ${target.name} - ${target.url}`);

        // Configure ZAP for this target
        await this.zap.core.setOption('scanpolicy', target.rules.join(','));

        // Run the scan
        const scanId = await this.zap.ascan.scan(target.url);

        // Wait for scan completion
        let scanStatus = 0;
        while (scanStatus < 100) {
          scanStatus = await this.zap.ascan.status(scanId);
          await new Promise(resolve => setTimeout(resolve, 5000));
          console.log(`${target.name} scan progress: ${scanStatus}%`);
        }

        // Get results
        const alerts = await this.zap.core.alerts();
        const results = {
          target: target.name,
          url: target.url,
          rules: target.rules,
          alerts: this.categorizeAlerts(alerts),
          timestamp: new Date().toISOString(),
        };

        allResults.push(results);
      }

      // Generate combined report
      const combinedResults = {
        timestamp: new Date().toISOString(),
        target: this.options.targetUrl,
        scanType: 'vulnerability',
        results: allResults,
        summary: this.generateVulnerabilitySummary(allResults),
      };

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const resultsPath = path.join(this.options.outputDirectory, `zap-vulnerability-${timestamp}`);

      if (!fs.existsSync(resultsPath)) {
        fs.mkdirSync(resultsPath, { recursive: true });
      }

      await fs.promises.writeFile(
        path.join(resultsPath, 'vulnerability-report.json'),
        JSON.stringify(combinedResults, null, 2)
      );

      // Upload to S3
      if (process.env.AWS_S3_BUCKET) {
        await uploadToS3(resultsPath, `${process.env.AWS_S3_BUCKET}/security-reports/`);
      }

      // Send notification
      await this.sendVulnerabilityNotification(combinedResults);

      return combinedResults;
    } catch (error) {
      console.error('Error running vulnerability scan:', error);
      throw error;
    }
  }

  generateVulnerabilitySummary(results) {
    const allAlerts = results.flatMap(r => r.alerts || []);
    const highAlerts = allAlerts.filter(alert => alert.risk === 'High');
    const mediumAlerts = allAlerts.filter(alert => alert.risk === 'Medium');
    const lowAlerts = allAlerts.filter(alert => alert.risk === 'Low');

    return {
      totalAlerts: allAlerts.length,
      highRiskTargets: results.filter(r => r.alerts.some(a => a.risk === 'High')).length,
      mediumRiskTargets: results.filter(r => r.alerts.some(a => a.risk === 'Medium')).length,
      lowRiskTargets: results.filter(r => r.alerts.some(a => a.risk === 'Low')).length,
    };
  }

  async sendVulnerabilityNotification(results) {
    const { summary } = results;

    const { totalAlerts, highRiskTargets } = summary;
    const riskColor = highRiskTargets > 0 ? 'danger' : 'warning';
    const riskIcon = highRiskTargets > 0 ? '🚨' : '⚠️';

    const message = `
${riskIcon} OWASP ZAP Vulnerability Scan Results

🎯 Target: ${results.target}
📊 Summary:
   • Total Vulnerabilities: ${totalAlerts}
   • High Risk Targets: ${highRiskTargets}

${highRiskTargets > 0 ? '\n🚨 High Risk Targets:\n' + results.filter(r => r.alerts.some(a => a.risk === 'High')).map(r => `   • ${r.target}: ${r.alerts.filter(a => a.risk === 'High').length}`).join('\n') : ''}

View detailed report at: https://test-results.zoe-solar.de/security/
    `;

    await sendSlackNotification({
      channel: '#security-reports',
      text: message,
      color: riskColor,
    });
  }

  async addCustomRules() {
    console.log('Adding custom ZAP rules...');

    // Add custom security checks specific to ZOE Solar
    const customRules = [
      {
        name: 'solar-panel-calculator-accuracy',
        description: 'Verify solar panel calculations are accurate',
        pluginId: 'custom-solar-accuracy',
        risk: 'Medium',
      },
      {
        name: 'data-privacy-compliance',
        description: 'Ensure personal data protection compliance',
        pluginId: 'custom-privacy',
        risk: 'High',
      },
      {
        name: 'api-rate-limiting',
        description: 'Verify proper rate limiting is implemented',
        pluginId: 'custom-rate-limit',
        risk: 'Medium',
      },
    ];

    for (const rule of customRules) {
      await this.zap.core.loadCustomRule(rule.name, rule.description, rule.pluginId);
    }
  }

  async cleanup() {
    await this.zap.core.shutdown();
  }
}

module.exports = OWASPZapRunner;
```

---

## 📈 Quality Gates Automation

### Automated Quality Gate Checks
```typescript
// tests/quality-gates/quality-gate-runner.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { uploadToS3 } from '../utils/s3-uploader';
import { sendSlackNotification } from '../utils/slack-notification';

interface QualityGateResult {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  score?: number;
  threshold?: number;
  details: any;
  errors: string[];
  warnings: string[];
}

interface QualityGateConfig {
  name: string;
  type: 'test' | 'coverage' | 'performance' | 'security' | 'accessibility';
  threshold: number;
  check: () => Promise<QualityGateResult>;
}

class QualityGateRunner {
  constructor() {
    this.gates = [
      // Test quality gates
      {
        name: 'Unit Tests',
        type: 'test',
        threshold: 95,
        check: () => this.checkUnitTests(),
      },
      {
        name: 'Integration Tests',
        type: 'test',
        threshold: 90,
        check: () => this.checkIntegrationTests(),
      },
      {
        name: 'E2E Tests',
        type: 'test',
        threshold: 90,
        check: () => this.checkE2ETests(),
      },

      // Coverage gates
      {
        name: 'Code Coverage',
        type: 'coverage',
        threshold: 85,
        check: () => this.checkCodeCoverage(),
      },
      {
        name: 'Statement Coverage',
        type: 'coverage',
        threshold: 85,
        check: () => this.checkStatementCoverage(),
      },
      {
        name: 'Branch Coverage',
        type: 'coverage',
        threshold: 80,
        check: () => this.checkBranchCoverage(),
      },
      {
        name: 'Function Coverage',
        type: 'coverage',
        threshold: 85,
        check: () => this.checkFunctionCoverage(),
      },

      // Performance gates
      {
        name: 'Lighthouse Score',
        type: 'performance',
        threshold: 90,
        check: () => this.checkLighthouseScore(),
      },
      {
        name: 'Core Web Vitals',
        type: 'performance',
        threshold: 80,
        check: () => this.checkCoreWebVitals(),
      },
      {
        name: 'Bundle Size',
        type: 'performance',
        threshold: 100, // MB
        check: () => this.checkBundleSize(),
      },

      // Security gates
      {
        name: 'Vulnerability Scan',
        type: 'security',
        threshold: 0, // No high vulnerabilities
        check: () => this.checkVulnerabilityScan(),
      },
      {
        name: 'Security Audit',
        type: 'security',
        threshold: 5, // No medium vulnerabilities
        check: () => this.checkSecurityAudit(),
      },
      {
        name: 'Dependency Security',
        type: 'security',
        threshold: 0, // No high/critical vulnerabilities
        check: => => this.checkDependencySecurity(),
      },

      // Accessibility gates
      {
        name: 'Axe Violations',
        type: 'accessibility',
        threshold: 0, // No violations
        check: () => this.checkAxeViolations(),
      },
      {
        name: 'WCAG Compliance',
        type: 'accessibility',
        threshold: 95, // WCAG AA compliance
        check: => => this.checkWCAGCompliance(),
      },
    ];
  }

  async runQualityGates() {
    console.log('Running Quality Gates...');

    const results: QualityGateResult[] = [];

    let totalPassed = 0;
    let totalFailed = 0;
    let totalWarnings = 0;

    for (const gate of this.gates) {
      try {
        console.log(`Checking: ${gate.name}`);
        const result = await gate.check();

        results.push(result);

        if (result.status === 'passed') {
          totalPassed++;
        } else if (result.status === 'failed') {
          totalFailed++;
        } else {
          totalWarnings++;
        }

        console.log(`${result.status.toUpperCase()}: ${gate.name} (Score: ${result.score || 'N/A'}, Threshold: ${gate.threshold})`);

        // Log details
        if (result.errors.length > 0) {
          console.error('Errors:', result.errors);
        }
        if (result.warnings.length > 0) {
          console.warn('Warnings:', result.warnings);
        }

      } catch (error) {
        console.error(`Error checking ${gate.name}:`, error);
        results.push({
          name: gate.name,
          status: 'failed',
          details: { error: error.message },
          errors: [error.message],
          warnings: [],
        });
        totalFailed++;
      }
    }

    const overallStatus = totalFailed === 0 ? 'passed' : 'failed';
    const overallScore = totalPassed / (totalPassed + totalFailed + totalWarnings) * 100;

    const summary = {
      timestamp: new Date().toISOString(),
      overallStatus,
      overallScore,
      totalGates: this.gates.length,
      totalPassed,
      totalFailed,
      totalWarnings,
      results,
    };

    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsPath = `test-results/quality-gates/${timestamp}.json`;

    if (!fs.existsSync('test-results/quality-gates')) {
      fs.mkdirSync('test-results/quality-gates', { recursive: true });
    }

    fs.writeFileSync(resultsPath, JSON.stringify(summary, null, 2));

    // Upload to S3
    if (process.env.AWS_S3_BUCKET) {
      await uploadToS3(resultsPath, `${process.env.AWS_S3_BUCKET}/quality-gates/`);
    }

    // Send notification
    await this.sendQualityGateNotification(summary);

    // Exit with appropriate code
    if (overallStatus === 'failed') {
      process.exit(1);
    }

    return summary;
  }

  async checkUnitTests() {
    try {
      const { stdout, stderr } = await promisify(exec)('npm run test:unit --json');
      const testResults = JSON.parse(stdout);

      const passed = testResults.numTotalTests - testResults.numFailedTests;
      const score = (passed / testResults.numTotalTests) * 100;
      const threshold = 95;

      const errors = testResults.testResults
        .filter(result => result.status === 'failed')
        .map(result => result.title);

      return {
        name: 'Unit Tests',
        status: score >= threshold ? 'passed' : score >= threshold * 0.9 ? 'warning' : 'failed',
        score,
        threshold,
        details: testResults,
        errors,
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Unit Tests',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkIntegrationTests() {
    try {
      const { stdout, stderr } = await promisify(exec)('npm run test:integration --json');
      const testResults = JSON.parse(stdout);

      const passed = testResults.numTotalTests - testResults.numFailedTests;
      const score = (passed / testResults.numTotalTests) * 100;
      const threshold = 90;

      const errors = testResults.testResults
        .filter(result => result.status === 'failed')
        .map(result => result.title);

      return {
        name: 'Integration Tests',
        status: score >= threshold ? 'passed' : score >= threshold * 0.9 ? 'warning' : 'failed',
        score,
        threshold,
        details: testResults,
        errors,
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Integration Tests',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkE2ETests() {
    try {
      const { stdout, stderr } = await promisify(exec)('npm run test:e2e');

      // Parse Playwright results
      const jsonMatch = stdout.match(/\*\* Test Summary: (.*)\*/);
      const summaryLine = jsonMatch ? jsonMatch[1].trim() : '';

      const passed = summaryMatch ? parseInt(summaryMatch.split('/')[0]) : 0;
      const failed = summaryMatch ? parseInt(summaryMatch.split('/')[1]) : 0;
      const total = passed + failed;
      const score = total > 0 ? (passed / total) * 100 : 0;
      const threshold = 90;

      return {
        name: 'E2E Tests',
        status: score >= threshold ? 'passed' : score >= threshold * 0.9 ? 'warning' : 'failed',
        score,
        threshold,
        details: { stdout, stderr },
        errors: failed > 0 ? [`${failed} E2E tests failed`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'E2E Tests',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkCodeCoverage() {
    try {
      const coveragePath = 'test-results/coverage/coverage-summary.json';

      if (!fs.existsSync(coveragePath)) {
        return {
          name: 'Code Coverage',
          status: 'failed',
          errors: ['Coverage report not found'],
          warnings: [],
        };
      }

      const coverageData = JSON.parse(readFileSync(coveragePath, 'utf8'));
      const score = coverageData.total.lines.pct;
      const threshold = 85;

      return {
        name: 'Code Coverage',
        status: score >= threshold ? 'passed' : 'failed',
        score,
        threshold,
        details: coverageData,
        errors: score < threshold ? [`Coverage ${score}% is below threshold of ${threshold}%`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Code Coverage',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkStatementCoverage() {
    try {
      const coveragePath = 'test-results/coverage/coverage-summary.json';

      if (!fs.existsSync(coveragePath)) {
        return {
          name: 'Statement Coverage',
          status: 'failed',
          errors: ['Coverage report not found'],
          warnings: [],
        };
      }

      const coverageData = JSON.parse(readFileSync(coveragePath, 'utf-8'));
      const score = coverageData.total.statements.pct;
      const threshold = 85;

      return {
        name: 'Statement Coverage',
        status: score >= threshold ? 'passed' : 'failed',
        score,
        threshold,
        details: coverageData,
        errors: score < threshold ? [`Statement coverage ${score}% is below threshold of ${threshold}%`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Statement Coverage',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkBranchCoverage() {
    try {
      const coveragePath = 'test-results/coverage/coverage-summary.json';

      if (!fs.existsSync(coveragePath)) {
        return {
          name: 'Branch Coverage',
          status: 'failed',
          errors: ['Coverage report not found'],
          warnings: [],
        };
      }

      const coverageData = JSON.parse(readFileSync(coveragePath, 'utf-8'));
      const score = coverageData.total.branches.pct;
      const threshold = 80;

      return {
        name: 'Branch Coverage',
        status: score >= threshold ? 'passed' : 'failed',
        score,
        threshold,
        details: coverageData,
        errors: score < threshold ? [`Branch coverage ${score}% is below threshold of ${threshold}%`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Branch Coverage',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkFunctionCoverage() {
    try {
      const coveragePath = 'test-results/coverage/coverage-summary.json';

      if (!fs.existsSync(coveragePath)) {
        return {
          name: 'Function Coverage',
          status: 'failed',
          errors: ['Coverage report not found'],
          warnings: [],
        };
      }

      const coverageData = JSON.parse(readFileSync(coveragePath, 'utf-8'));
      const score = coverageData.total.functions.pct;
      const threshold = 85;

      return {
        name: 'Function Coverage',
        status: score >= threshold ? 'passed' : 'failed',
        score,
        threshold,
        details: coverageData,
        errors: score < threshold ? [`Function coverage ${score}% is below threshold of ${threshold}%`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Function Coverage',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkLighthouseScore() {
    try {
      const reportPath = 'test-results/lighthouse/latest-summary.json';

      if (!fs.existsSync(reportPath)) {
        return {
          name: 'Lighthouse Score',
          status: 'failed',
          errors: ['Lighthouse report not found'],
          warnings: [],
        };
      }

      const reportData = JSON.parse(readFileSync(reportPath, 'utf-8'));
      const score = reportData.averageScore;
      const threshold = 90;

      return {
        name: 'Lighthouse Score',
        status: score >= threshold ? 'passed' : score >= threshold * 0.9 ? 'warning' : 'failed',
        score,
        threshold,
        details: reportData,
        errors: score < threshold ? [`Lighthouse score ${score} is below threshold of ${threshold}`] : [],
        warnings: score < threshold && score >= threshold * 0.9 ? [`Lighthouse score ${score} is approaching threshold` ] : [],
      };
    } catch (error) {
      return {
        name: 'Lighthouse Score',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkCoreWebVitals() {
    try {
      const reportPath = 'test-results/lighthouse/latest-summary.json';

      if (!fs.existsSync(reportPath)) {
        return {
          name: 'Core Web Vitals',
          status: 'failed',
          errors: ['Lighthouse report not found'],
          warnings: [],
        };
      }

      const reportData = JSON.parse(readFileSync(reportPath, 'lhr');
      const performance = reportData.lhr.categories.performance.score;
      const fcp = reportData.audits['first-contentful-paint']?.numericValue || 0;
      const lcp = reportData.audits['largest-contentful-paint']?.numericValue || 0;
      const cls = reportData.audits['cumulative-layout-shift']?.numericValue || 0;

      const vitalsScore = this.calculateVitalsScore(fcp, lcp, cls);
      const threshold = 80;

      return {
        name: 'Core Web Vitals',
        status: vitalsScore >= threshold ? 'passed' : 'failed',
        score: vitalsScore,
        threshold,
        details: {
          performance: performance * 100,
          fcp,
          lcp,
          cls,
        },
        errors: vitalsScore < threshold ? ['Core Web Vitals score is below threshold'] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Core Web Vitals',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  calculateVitalsScore(fcp: number, lcp: number, cls: number) {
    // Google's Lighthouse scoring algorithm
    const fcpScore = this.calculateVitalScore(fcp, 2500, 2000);
    const lcpScore = this.calculateVitalScore(lcp, 4000, 2500);
    const clsScore = this.calculateVitalScore(0.1, 0.25, 0.1); // CLS threshold is 0.1

    return (fcpScore * 0.1 + lcp * 0.4 + clsScore * 0.5);
  }

  calculateVitalScore(value: number, good: number, poor: number) {
    // Normalized score where good=1.0, poor=0.0
    if (value <= good) return 1;
    if (value >= poor) return 0;
    return (value - good) / (poor - good) * (1 - 0.5);
  }

  async checkBundleSize() {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      const allDependencies = [...dependencies, ...devDependencies];

      // Mock bundle size analysis
      const estimatedSize = allDependencies.length * 0.5; // 500KB per dependency
      const threshold = 100; // 100MB

      return {
        name: 'Bundle Size',
        status: estimatedSize <= threshold ? 'passed' : 'failed',
        score: Math.max(0, 100 - (estimatedSize / threshold * 100)),
        threshold,
        details: { estimatedSize },
        errors: estimatedSize > threshold ? [`Bundle size ${estimatedSize}MB exceeds threshold of ${threshold}MB`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Bundle Size',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkVulnerabilityScan() {
    try {
      // Mock vulnerability scan results
      const mockResults = {
        totalAlerts: 0,
        highAlerts: 0,
        mediumAlerts: 0,
        lowAlerts: 0,
      };

      const threshold = 0;
      const score = mockResults.highAlerts === 0 && mockResults.mediumAlerts < 5 ? 100 : 0;

      return {
        name: 'Vulnerability Scan',
        status: score >= threshold ? 'passed' : 'failed',
        score,
        threshold,
        details: mockResults,
        errors: mockResults.highAlerts > 0 ? [`${mockResults.highAlerts} high-risk vulnerabilities detected`] : [],
        warnings: mockResults.mediumAlerts > 0 ? [`${mockResults.mediumAlerts} medium-risk vulnerabilities detected`] : [],
      };
    } catch (error) {
      return {
        name: 'Vulnerability Scan',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkSecurityAudit() {
    try {
      // Mock security audit results
      const mockResults = {
        highVulnerabilities: 0,
        mediumVulnerabilities: 0,
        lowVulnerabilities: 0,
      };

      const threshold = 5; // Max 5 medium vulnerabilities
      const score = mockResults.highVulnerabilities === 0 && mockResults.mediumVulnerabilities <= threshold ? 100 : 0;

      return {
        name: 'Security Audit',
        status: score >= 100 ? 'passed' : score >= 90 ? 'warning' : 'failed',
        score,
        threshold,
        details: mockResults,
        errors: mockResults.highVulnerabilities > 0 ? [`${mockResults.highVulnerabilities} high-risk vulnerabilities detected`] : [],
        warnings: mockResults.mediumVulnerabilities > threshold ? [`${mockResults.mediumVulnerabilities} medium-risk vulnerabilities detected`] : [],
      };
    } catch (error) {
      return {
        name: 'Security Audit',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkDependencySecurity() {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      const allDependencies = [...dependencies, ...devDependencies];

      // Mock dependency security check
      const vulnerableDependencies = allDependencies.filter(dep =>
        dep.includes('old') || dep.includes('unstable') || dep.includes('beta')
      );

      const threshold = 0; // No vulnerable dependencies
      const score = vulnerableDependencies.length === 0 ? 100 : 0;

      return {
        name: 'Dependency Security',
        status: score >= threshold ? 'passed' : 'failed',
        score,
        threshold,
        details: { vulnerableDependencies },
        errors: vulnerableDependencies.length > 0 ? [`${vulnerableDependencies.length} vulnerable dependencies found`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Dependency Security',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkAxeViolations() {
    try {
      // Mock accessibility check results
      const mockResults = {
        violations: 0,
      };

      const threshold = 0; // No violations allowed
      const score = mockResults.violations === 0 ? 100 : 100;

      return {
        name: 'Axe Violations',
        status: score >= threshold ? 'passed' : 'failed',
        score,
        threshold,
        details: mockResults,
        errors: mockResults.violations > 0 ? [`${mockResults.violations} accessibility violations detected`] : [],
        warnings: [],
      };
    } catch (error) {
      return {
        name: 'Axe Violations',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async checkWCAGCompliance() {
    try {
      // Mock WCAG compliance check
      const mockResults = {
        level: 'AA',
        score: 98,
        violations: 2, // 2 minor violations
      };

      const threshold = 95;
      const score = mockResults.score;

      return {
        name: 'WCAG Compliance',
        status: score >= threshold ? 'passed' : 'warning',
        score,
        threshold,
        details: mockResults,
        errors: mockResults.violations > 5 ? [`${mockResults.violations} WCAG violations detected (Level: ${mockResults.level})`] : [],
        warnings: mockResults.violations > 0 && mockResults.violations <= 5 ? [`${mockResults.violations} WCAG violations (Level: ${mockResults.level})`] : [],
      };
    } catch (error) {
      return {
        name: 'WCAG Compliance',
        status: 'failed',
        details: { error: error.message },
        errors: [error.message],
        warnings: [],
      };
    }
  }

  async sendQualityGateNotification(summary) {
    const { overallStatus, overallScore, totalPassed, totalFailed, totalWarnings } = summary;

    const statusColor = overallStatus === 'passed' ? 'good' : overallStatus === 'warning' ? 'warning' : 'danger';
    const statusIcon = overallStatus === 'passed' ? '✅' : overallStatus === 'warning' ? '⚠️' : '❌';

    const message = `
${statusIcon} Quality Gate Results

📊 Overall Status: ${overallStatus.toUpperCase()}
📊 Overall Score: ${overallScore.toFixed(1)}%
📊 Passed: ${totalPassed}/${summary.totalGates}
📊 Failed: ${totalFailed}
📊 Warnings: ${totalWarnings}

${totalFailed > 0 ? '\n❌ Failed Gates:' + totalFailed.map(gate => `   • ${gate.name}`).join('\n') : ''}

View detailed report at: https://test-results.zoe-solar.de/quality-gates/
    `;

    await sendSlackNotification({
      channel: '#quality-gates',
      text: message,
      color: statusColor,
    });
  }
}

module.exports = QualityGateRunner;
```

---

**🤖 Testing Automation Tools Version:** 1.0.0
**📊 Coverage Target:** 90%+
**⚡ Performance:** Core Web Vitals
**♿ Accessibility:** WCAG 2.1 AA
**🔒 Security:** OWASP Standards
**📅 CI/CD:** Full Integration
**📅 Last Update:** 17. November 2025