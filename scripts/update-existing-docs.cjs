#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Automatisches Dokumentations-Update-System
 * Erweitert bestehende Dokumentationsabschnitte basierend auf Code-Änderungen
 */

class DocsUpdater {
    constructor() {
        this.docsPath = path.join(__dirname, '..', 'data', 'docs-data.json');
        this.commitHash = process.env.GITHUB_SHA || execSync('git rev-parse HEAD').toString().trim();
        this.commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
        this.changedFiles = (process.env.CHANGED_FILES || '').split(',').filter(f => f.trim());
        this.changes = process.env.CHANGES || '';
        this.docsData = this.loadDocsData();
    }

    

    loadDocsData() {
        try {
            if (fs.existsSync(this.docsPath)) {
                return JSON.parse(fs.readFileSync(this.docsPath, 'utf8'));
            }
        } catch (error) {
            console.error('Fehler beim Laden der Dokumentationsdaten:', error);
        }

        // Standard-Dokumentationsstruktur falls Datei nicht existiert
        return {
            lastUpdated: new Date().toISOString(),
            sections: {
                'api-reference': {
                    title: 'API-Referenz',
                    content: '# API-Referenz\n\nHier finden Sie alle verfügbaren APIs und deren Verwendung.',
                    lastModified: new Date().toISOString()
                },
                'getting-started': {
                    title: 'Erste Schritte',
                    content: '# Erste Schritte\n\nWillkommen bei ZOE Solar! Hier erfahren Sie, wie Sie starten.',
                    lastModified: new Date().toISOString()
                },
                'troubleshooting': {
                    title: 'Fehlerbehebung',
                    content: '# Fehlerbehebung\n\nHäufige Probleme und deren Lösungen.',
                    lastModified: new Date().toISOString()
                },
                'changelog': {
                    title: 'Änderungsprotokoll',
                    content: '# Änderungsprotokoll\n\nAlle wichtigen Änderungen und Updates.',
                    lastModified: new Date().toISOString()
                }
            }
        };
    }

    categorizeChanges() {
        const categories = {
            api: [],
            components: [],
            services: [],
            pages: [],
            config: [],
            docs: [],
            other: []
        };

        this.changedFiles.forEach(file => {
            if (file.includes('services/') || file.includes('api/')) {
                categories.api.push(file);
            } else if (file.includes('components/')) {
                categories.components.push(file);
            } else if (file.includes('pages/')) {
                categories.pages.push(file);
            } else if (file.includes('data/') || file.includes('config')) {
                categories.config.push(file);
            } else if (file.includes('docs/') || file.includes('README')) {
                categories.docs.push(file);
            } else {
                categories.other.push(file);
            }
        });

        return categories;
    }

    generateApiUpdates(categories) {
        if (categories.api.length === 0) return null;

        const updates = [];

        categories.api.forEach(file => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                const lines = fs.readFileSync(filePath, 'utf8').split('\n').length;

                updates.push(`• Wesentliche Änderungen an: \`${file}\` (${lines} Zeilen)`);
            }
        });

        if (updates.length === 0) return null;

        return {
            title: `API-Updates (${new Date().toISOString().split('T')[0]})`,
            content: `## API-Updates (${new Date().toISOString().split('T')[0]})

**Commit:** \`${this.commitHash.substring(0, 7)}\`

### Geänderte Dateien
${categories.api.map(file => `- \`${file}\``).join('\n')}

### Änderungen
${updates.join('\n')}

### Wichtige Hinweise
- Überprüfen Sie alle API-Integrationen
- Testen Sie betroffene Endpunkte
- Aktualisieren Sie API-Dokumentation bei Bedarf`
        };
    }

    generateComponentUpdates(categories) {
        if (categories.components.length === 0 && categories.pages.length === 0) return null;

        const allComponents = [...categories.components, ...categories.pages];
        const updates = [];

        allComponents.forEach(file => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const isNew = !content.includes('export default') && content.length > 100;

                if (isNew) {
                    updates.push(`• Neue Komponente/Seite hinzugefügt: \`${file}\``);
                } else {
                    updates.push(`• Aktualisiert: \`${file}\``);
                }
            }
        });

        if (updates.length === 0) return null;

        return {
            title: `Neue Features (${new Date().toISOString().split('T')[0]})`,
            content: `## Neue Features (${new Date().toISOString().split('T')[0]})

**Commit:** \`${this.commitHash.substring(0, 7)}\`

### Hinzugefügte/Aktualisierte Komponenten
${allComponents.map(file => `- \`${file}\``).join('\n')}

### Funktionalität
${updates.join('\n')}

### Verwendung
Die neuen Features sind ab sofort verfügbar und können über das Dashboard erkundet werden.`
        };
    }

    generateTroubleshootingUpdates(categories) {
        // Suche nach Fehlerbehandlungs-Änderungen
        const errorFiles = this.changedFiles.filter(file =>
            file.includes('error') ||
            file.includes('Error') ||
            file.includes('catch') ||
            file.includes('try')
        );

        if (errorFiles.length === 0) return null;

        return {
            title: `Fehlerbehebung (${new Date().toISOString().split('T')[0]})`,
            content: `## Fehlerbehebung (${new Date().toISOString().split('T')[0]})

**Commit:** \`${this.commitHash.substring(0, 7)}\`

### Verbesserte Fehlerbehandlung
${errorFiles.map(file => `- Verbesserungen in: \`${file}\``).join('\n')}

### Änderungen
• Verbesserte Fehlerbehandlung und Logging
• Neue Fehlerfälle abgedeckt
• Bessere Fehlermeldungen für Benutzer`
        };
    }

    updateSection(sectionKey, newContent) {
        if (!this.docsData.sections[sectionKey]) {
            console.log(`Abschnitt ${sectionKey} existiert nicht, überspringe Update`);
            return;
        }

        const currentContent = this.docsData.sections[sectionKey].content;
        const updatedContent = currentContent + '\n\n' + newContent.content;

        this.docsData.sections[sectionKey].content = updatedContent;
        this.docsData.sections[sectionKey].lastModified = new Date().toISOString();

        console.log(`Abschnitt ${sectionKey} wurde aktualisiert: ${newContent.title}`);
    }

    updateChangelog(updates) {
        const changelogEntry = `## ${new Date().toISOString().split('T')[0]}

**Commit:** \`${this.commitHash.substring(0, 7)}\`

${updates.map(update => `- ${update}`).join('\n')}

**Commit-Nachricht:** ${this.commitMessage}`;

        const currentContent = this.docsData.sections.changelog.content;
        const updatedContent = currentContent + '\n\n' + changelogEntry;

        this.docsData.sections.changelog.content = updatedContent;
        this.docsData.sections.changelog.lastModified = new Date().toISOString();
    }

    saveDocsData() {
        this.docsData.lastUpdated = new Date().toISOString();
        fs.writeFileSync(this.docsPath, JSON.stringify(this.docsData, null, 2));
        console.log(`Dokumentationsdaten gespeichert in: ${this.docsPath}`);
    }

    run() {
        console.log('🚀 Starte automatisches Dokumentations-Update...');
        console.log(`📝 Commit: ${this.commitHash.substring(0, 7)}`);
        console.log(`📁 Geänderte Dateien: ${this.changedFiles.length}`);

        if (this.changedFiles.length === 0) {
            console.log('ℹ️ Keine Dateiänderungen gefunden, überspringe Update');
            return;
        }

        const categories = this.categorizeChanges();
        console.log('📊 Kategorisierte Änderungen:', categories);

        const updates = [];

        // API-Updates
        const apiUpdate = this.generateApiUpdates(categories);
        if (apiUpdate) {
            this.updateSection('api-reference', apiUpdate);
            updates.push('API-Änderungen dokumentiert');
        }

        // Komponenten-Updates
        const componentUpdate = this.generateComponentUpdates(categories);
        if (componentUpdate) {
            this.updateSection('getting-started', componentUpdate);
            updates.push('Neue Features dokumentiert');
        }

        // Fehlerbehebung-Updates
        const troubleshootingUpdate = this.generateTroubleshootingUpdates(categories);
        if (troubleshootingUpdate) {
            this.updateSection('troubleshooting', troubleshootingUpdate);
            updates.push('Fehlerbehebung aktualisiert');
        }

        // Changelog immer aktualisieren
        this.updateChangelog(updates);

        this.saveDocsData();

        console.log('✅ Dokumentations-Update abgeschlossen!');
        console.log(`📊 ${updates.length} Abschnitte aktualisiert`);
    }
}

// Script ausführen
if (require.main === module) {
    const updater = new DocsUpdater();
    updater.run();
}

module.exports = DocsUpdater;