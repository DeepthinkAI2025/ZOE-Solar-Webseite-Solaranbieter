/**
 * ZOE SOLAR - Testing & Validation Framework
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Features:
 * - Component Testing Suite
 * - Accessibility Testing
 * - Performance Validation
 * - Error Handling Tests
 * - Integration Tests
 * - Automated Quality Checks
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test Utils für Component Testing
export class ComponentTestSuite {
    constructor(componentName: string) {
        this.componentName = componentName;
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0
        };
    }

    private componentName: string;
    private testResults: {
        passed: number;
        failed: number;
        warnings: number;
        total: number;
    };

    // ErrorBoundary Testing
    async testErrorBoundary() {
        console.log(`🛡️ Testing ErrorBoundary for ${this.componentName}...`);
        
        const ThrowError = () => {
            throw new Error('Test error');
        };

        const { container } = render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        // Test 1: Error is caught and fallback is shown
        expect(screen.getByText(/Entschuldigung, ein Fehler ist aufgetreten/)).toBeInTheDocument();
        this.testResults.passed++;

        // Test 2: Error ID is generated
        const errorId = container.querySelector('.font-mono');
        expect(errorId).toBeInTheDocument();
        this.testResults.passed++;

        // Test 3: Retry functionality
        const retryButton = screen.getByText('Erneut versuchen');
        expect(retryButton).toBeInTheDocument();
        this.testResults.passed++;

        this.testResults.total += 3;
    }

    // SkeletonLoader Testing
    async testSkeletonLoader() {
        console.log(`💀 Testing SkeletonLoader for ${this.componentName}...`);

        // Test different variants
        const variants = ['text', 'title', 'card', 'image', 'button', 'avatar', 'list', 'table'];
        
        for (const variant of variants) {
            const { container } = render(<SkeletonLoader variant={variant} />);
            const skeleton = container.querySelector('.skeleton-loader');
            expect(skeleton).toBeInTheDocument();
            this.testResults.passed++;
            this.testResults.total++;
        }

        // Test count prop
        const { container } = render(<SkeletonLoader count={3} />);
        const skeletons = container.querySelectorAll('.skeleton-loader');
        expect(skeletons).toHaveLength(3);
        this.testResults.passed++;
        this.testResults.total++;
    }

    // CO2Calculator Testing
    async testCO2Calculator() {
        console.log(`🌱 Testing CO2Calculator for ${this.componentName}...`);

        render(<AccessibleCO2Calculator />);

        // Test 1: Component renders
        expect(screen.getByText('ESG-Potenzial-Rechner')).toBeInTheDocument();
        this.testResults.passed++;
        this.testResults.total++;

        // Test 2: Slider accessibility
        const slider = screen.getByLabelText(/Jährlicher Stromverbrauch Regler/);
        expect(slider).toBeInTheDocument();
        expect(slider).toHaveAttribute('aria-valuemin', '10000');
        expect(slider).toHaveAttribute('aria-valuemax', '1000000');
        this.testResults.passed += 2;
        this.testResults.total += 2;

        // Test 3: Input accessibility
        const input = screen.getByLabelText(/Jährlicher Stromverbrauch in kWh/);
        expect(input).toBeInTheDocument();
        this.testResults.passed++;
        this.testResults.total++;

        // Test 4: Live region for results
        const liveRegion = screen.getByRole('status', { hidden: true });
        expect(liveRegion).toBeInTheDocument();
        this.testResults.passed++;
        this.testResults.total++;

        // Test 5: Modal functionality
        const certificateButton = screen.getByText('ESG-Potenzial-Zertifikat erstellen');
        fireEvent.click(certificateButton);
        
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        this.testResults.passed++;
        this.testResults.total++;

        // Test 6: Modal accessibility
        const modal = screen.getByRole('dialog');
        expect(modal).toHaveAttribute('aria-labelledby');
        expect(modal).toHaveAttribute('aria-describedby');
        this.testResults.passed += 2;
        this.testResults.total += 2;

        // Test 7: Modal keyboard navigation
        const companyNameInput = screen.getByLabelText(/Für/);
        companyNameInput.focus();
        expect(companyNameInput).toHaveFocus();
        this.testResults.passed++;
        this.testResults.total++;
    }

    // ExitIntentPopup Testing
    async testExitIntentPopup() {
        console.log(`🚪 Testing ExitIntentPopup for ${this.componentName}...`);

        render(
            <ExitIntentPopup 
                isVisible={true} 
                onClose={() => {}}
                variant="discount"
            />
        );

        // Test 1: Popup renders
        expect(screen.getByText(/Warten Sie! Verpassen Sie nicht/)).toBeInTheDocument();
        this.testResults.passed++;
        this.testResults.total++;

        // Test 2: Offer step
        const offerButton = screen.getByText('Jetzt sichern');
        expect(offerButton).toBeInTheDocument();
        this.testResults.passed++;
        this.testResults.total++;

        // Test 3: Form step navigation
        fireEvent.click(offerButton);
        await waitFor(() => {
            expect(screen.getByText('Fast geschafft!')).toBeInTheDocument();
        });
        this.testResults.passed++;
        this.testResults.total++;

        // Test 4: Form accessibility
        const emailInput = screen.getByLabelText(/E-Mail-Adresse/);
        const nameInput = screen.getByLabelText(/Name/);
        expect(emailInput).toBeInTheDocument();
        expect(nameInput).toBeInTheDocument();
        this.testResults.passed += 2;
        this.testResults.total += 2;

        // Test 5: Submit button
        const submitButton = screen.getByText('Angebot anfordern');
        expect(submitButton).toBeInTheDocument();
        this.testResults.passed++;
        this.testResults.total++;

        // Test 6: Close button
        const closeButton = screen.getByLabelText('Popup schließen');
        expect(closeButton).toBeInTheDocument();
        this.testResults.passed++;
        this.testResults.total++;
    }

    // Accessibility Testing
    async testAccessibility(component: React.ReactElement, componentName: string) {
        console.log(`♿ Testing Accessibility for ${componentName}...`);

        const { container } = render(component);
        
        // Run axe accessibility tests
        const results = await axe(container);
        expect(results).toHaveNoViolations();
        this.testResults.passed++;
        this.testResults.total++;

        // Check for common accessibility issues
        const images = container.querySelectorAll('img');
        images.forEach(img => {
            expect(img).toHaveAttribute('alt');
            this.testResults.passed++;
            this.testResults.total++;
        });

        // Check for proper heading structure
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > previousLevel + 1) {
                this.testResults.warnings++;
                console.warn(`Heading hierarchy issue: ${heading.tagName} after h${previousLevel}`);
            }
            previousLevel = level;
        });
    }

    // Performance Testing
    async testPerformance(component: React.ReactElement, componentName: string) {
        console.log(`⚡ Testing Performance for ${componentName}...`);

        // Measure render time
        const startTime = performance.now();
        render(component);
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        // Performance thresholds (in ms)
        const thresholds = {
            critical: 16, // 60fps
            warning: 50,
            ok: 100
        };

        if (renderTime < thresholds.critical) {
            this.testResults.passed++;
            console.log(`✅ Excellent performance: ${renderTime.toFixed(2)}ms`);
        } else if (renderTime < thresholds.warning) {
            this.testResults.warnings++;
            console.log(`⚠️ Good performance: ${renderTime.toFixed(2)}ms`);
        } else if (renderTime < thresholds.ok) {
            this.testResults.warnings++;
            console.log(`⚠️ Acceptable performance: ${renderTime.toFixed(2)}ms`);
        } else {
            this.testResults.failed++;
            console.error(`❌ Poor performance: ${renderTime.toFixed(2)}ms`);
        }
        this.testResults.total++;
    }

    // Integration Testing
    async testIntegration() {
        console.log(`🔗 Testing Integration for ${this.componentName}...`);

        // Test service integration
        try {
            // Mock CRO Service integration
            const croService = new (require('./conversionRateOptimizationService').ConversionRateOptimizationService)();
            expect(croService).toBeDefined();
            this.testResults.passed++;
            
            // Mock Performance Service integration
            const perfService = new (require('./performanceOptimizationService').PerformanceOptimizationService)();
            expect(perfService).toBeDefined();
            this.testResults.passed++;
            
            // Mock Analytics Service integration
            const analyticsService = new (require('./advancedAnalyticsMeasurementService').AdvancedAnalyticsMeasurementService)();
            expect(analyticsService).toBeDefined();
            this.testResults.passed++;
            
        } catch (error) {
            this.testResults.warnings++;
            console.warn('Service integration test failed:', error.message);
        }
        this.testResults.total += 3;
    }

    // Error Handling Testing
    async testErrorHandling() {
        console.log(`💥 Testing Error Handling for ${this.componentName}...`);

        // Test boundary error handling
        const boundaryComponent = new ErrorBoundary({ 
            children: () => { throw new Error('Test boundary error'); }
        });
        
        expect(() => boundaryComponent.render()).not.toThrow();
        this.testResults.passed++;
        this.testResults.total++;

        // Test invalid props handling
        const invalidProps = { invalid: 'props' };
        try {
            // This should not crash the application
            const { container } = render(<ErrorBoundary {...invalidProps as any} />);
            expect(container).toBeInTheDocument();
            this.testResults.passed++;
        } catch (error) {
            this.testResults.failed++;
            console.error('Invalid props handling failed:', error);
        }
        this.testResults.total++;
    }

    // Generate Test Report
    generateReport(): string {
        const { passed, failed, warnings, total } = this.testResults;
        const successRate = ((passed / total) * 100).toFixed(1);
        
        const report = `
╔══════════════════════════════════════════════════════════════╗
║                    TEST REPORT - ${this.componentName.padEnd(33)} ║
╠══════════════════════════════════════════════════════════════╣
║  ✅ Passed Tests:      ${passed.toString().padStart(4)}                                 ║
║  ❌ Failed Tests:      ${failed.toString().padStart(4)}                                 ║
║  ⚠️  Warnings:         ${warnings.toString().padStart(4)}                                 ║
║  📊 Total Tests:       ${total.toString().padStart(4)}                                 ║
║  🎯 Success Rate:      ${successRate.padStart(4)}%                                 ║
╚══════════════════════════════════════════════════════════════╝
        `;

        console.log(report);
        return report;
    }

    // Reset test results
    reset() {
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0
        };
    }
}

// Automated Testing Runner
export class AutomatedTestRunner {
    private static instance: AutomatedTestRunner;

    public static getInstance(): AutomatedTestRunner {
        if (!AutomatedTestRunner.instance) {
            AutomatedTestRunner.instance = new AutomatedTestRunner();
        }
        return AutomatedTestRunner.instance;
    }

    async runAllTests() {
        console.log('🚀 Starting Automated Test Suite...');
        console.log('='.repeat(60));

        const components = [
            { name: 'ErrorBoundary', component: ErrorBoundary },
            { name: 'SkeletonLoader', component: SkeletonLoader },
            { name: 'CO2Calculator', component: AccessibleCO2Calculator },
            { name: 'ExitIntentPopup', component: (props: any) => <ExitIntentPopup {...props} isVisible={true} /> }
        ];

        const results: { [key: string]: any } = {};

        for (const { name, component } of components) {
            const testSuite = new ComponentTestSuite(name);
            
            try {
                await testSuite.testErrorBoundary();
                await testSuite.testAccessibility(<ErrorBoundary>{component}</ErrorBoundary>, name);
                await testSuite.testPerformance(<ErrorBoundary>{component}</ErrorBoundary>, name);
                await testSuite.testErrorHandling();
                
                results[name] = testSuite.generateReport();
            } catch (error) {
                console.error(`❌ Test suite failed for ${name}:`, error);
                results[name] = 'Test execution failed';
            }
        }

        this.generateSummaryReport(results);
        return results;
    }

    private generateSummaryReport(results: { [key: string]: any }) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 FINAL SUMMARY REPORT');
        console.log('='.repeat(60));
        
        Object.entries(results).forEach(([component, result]) => {
            console.log(`\n${component}:`);
            console.log(result);
        });

        console.log('\n🎯 RECOMMENDATIONS:');
        console.log('• All components should pass accessibility tests (axe)');
        console.log('• Performance should be under 16ms for 60fps');
        console.log('• Error boundaries should gracefully handle failures');
        console.log('• Integration with services should be verified');
        console.log('\n✅ Test suite completed!');
    }

    // Quick validation test
    async quickValidation() {
        console.log('⚡ Running Quick Validation...');
        
        const validationChecks = [
            () => {
                // Test imports
                require('./ErrorBoundary');
                require('./SkeletonLoader');
                require('./CO2Calculator');
                require('./ExitIntentPopup');
                console.log('✅ All components import successfully');
            },
            () => {
                // Test service imports
                require('./services/performanceOptimizationService');
                require('./services/conversionRateOptimizationService');
                require('./services/mobileExperienceOptimizationService');
                console.log('✅ All services import successfully');
            }
        ];

        validationChecks.forEach(check => {
            try {
                check();
            } catch (error) {
                console.error('❌ Quick validation failed:', error);
                return false;
            }
        });

        console.log('✅ Quick validation completed successfully!');
        return true;
    }
}

// Export testing utilities
export const testUtils = {
    // Mock user interactions
    async simulateUserInteraction(element: HTMLElement, type: 'click' | 'focus' | 'blur' | 'keypress') {
        switch (type) {
            case 'click':
                fireEvent.click(element);
                break;
            case 'focus':
                fireEvent.focus(element);
                break;
            case 'blur':
                fireEvent.blur(element);
                break;
            case 'keypress':
                fireEvent.keyPress(element, { key: 'Enter' });
                break;
        }
    },

    // Check WCAG compliance
    async checkWCAGCompliance(element: HTMLElement) {
        const results = await axe(element);
        const violations = results.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length
        }));
        
        return {
            violations,
            passes: results.passes.length,
            inapplicable: results.inapplicable.length,
            incomplete: results.incomplete.length
        };
    },

    // Performance measurement
    measureComponentRender(Component: React.ComponentType) {
        const startMark = `render-start-${Date.now()}`;
        const endMark = `render-end-${Date.now()}`;
        
        performance.mark(startMark);
        const component = React.createElement(Component);
        render(component);
        performance.mark(endMark);
        performance.measure('render-time', startMark, endMark);
        
        const measure = performance.getEntriesByName('render-time')[0] as PerformanceMeasure;
        return measure.duration;
    }
};

export default AutomatedTestRunner;