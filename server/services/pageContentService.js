import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthService } from './authService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Datenpfade
const dataDir = path.join(__dirname, '../data');
const contactContentPath = path.join(dataDir, 'contactContent.ts');
const imprintContentPath = path.join(dataDir, 'imprintContent.ts');

/**
 * Seiten-Content-Management-Service
 * 
 * Funktionen:
 * - Live-Bearbeitung von Kontakt- und Impressumsseiten
 * - Sofortige Aktualisierung der Inhalte
 * - Validierung der geänderten Daten
 * - Backup alter Versionen
 */
class PageContentService {
  
  /**
   * Standard-Content für Kontaktseite
   */
  static getDefaultContactContent() {
    return {
      companyName: 'ZOE Solar GmbH',
      address: {
        street: 'Musterstraße 123',
        city: '10115 Berlin',
        country: 'Deutschland'
      },
      email: 'kundenervice@zukunftsorientierte-energie.de',
      phone: '+49 (0) 30 123 456 78',
      officeHours: {
        weekday: 'Montag - Freitag',
        hours: '08:00 - 17:00 Uhr'
      },
      heroTitle: 'Kontakt aufnehmen.',
      heroSubtitle: 'Wir sind bereit für Ihr Projekt. Lassen Sie uns sprechen, wie wir Ihre Flächen in eine rentable Einnahmequelle verwandeln können.',
      contactDescription: 'Wir freuen uns darauf, Sie und Ihren Betrieb kennenzulernen. Lassen Sie uns in einem persönlichen Gespräch herausfinden, wie wir gemeinsam die Zukunft Ihres Unternehmens sichern können. Nutzen Sie das Formular oder erreichen Sie uns direkt.',
      formTitle: 'Starten Sie jetzt Ihre kostenlose Analyse',
      formSubtitle: 'Dank Browser-Autofill ist das Formular in Sekunden ausgefüllt. Wir melden uns umgehend bei Ihnen.',
      lastUpdated: new Date().toISOString(),
      updatedBy: 'System'
    };
  }

  /**
   * Standard-Content für Impressumsseite
   */
  static getDefaultImprintContent() {
    return {
      companyName: 'ZOE Solar GmbH',
      address: {
        street: 'Kurfürstenstraße 124',
        city: '10785 Berlin',
        country: 'Deutschland'
      },
      representative: 'Jeremy Schulze',
      position: 'Geschäftsführer',
      phone: '+49 156 78876200',
      email: 'kundenservice@zukunftsorientierte-energie.de',
      registerEntry: {
        type: 'Eintragung im Handelsregister',
        court: 'Amtsgericht Charlottenburg',
        number: 'HRB 123456 B'
      },
      vatId: {
        text: 'Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:',
        id: 'DE325514610'
      },
      responsibleEditor: {
        name: 'Max Mustermann',
        address: {
          street: 'Kurfürstenstraße 124',
          city: '10785 Berlin'
        }
      },
      euDispute: {
        text: 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:',
        url: 'https://ec.europa.eu/consumers/odr/',
        emailNote: 'Unsere E-Mail-Adresse finden Sie oben im Impressum.'
      },
      consumerDispute: {
        text: 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
      },
      contentLiability: {
        text: 'Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.'
      },
      linkLiability: {
        text: 'Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.'
      },
      copyright: {
        text: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.'
      },
      lastUpdated: new Date().toISOString(),
      updatedBy: 'System'
    };
  }

  /**
   * Kontakt-Content laden
   */
  static async getContactContent() {
    try {
      let content;
      try {
        content = await fs.readFile(contactContentPath, 'utf-8');
        const match = content.match(/export const contactContent: ContactContent = ({[\s\S]*?});/);
        if (match) {
          return JSON.parse(match[1]);
        }
      } catch (error) {
        console.log('[PageContent] Kontakt-Content Datei nicht gefunden, verwende Standard');
      }

      return this.getDefaultContactContent();
    } catch (error) {
      console.error('[PageContent] Fehler beim Laden des Kontakt-Contents:', error);
      return this.getDefaultContactContent();
    }
  }

  /**
   * Impressums-Content laden
   */
  static async getImprintContent() {
    try {
      let content;
      try {
        content = await fs.readFile(imprintContentPath, 'utf-8');
        const match = content.match(/export const imprintContent: ImprintContent = ({[\s\S]*?});/);
        if (match) {
          return JSON.parse(match[1]);
        }
      } catch (error) {
        console.log('[PageContent] Impressum-Content Datei nicht gefunden, verwende Standard');
      }

      return this.getDefaultImprintContent();
    } catch (error) {
      console.error('[PageContent] Fehler beim Laden des Impressum-Contents:', error);
      return this.getDefaultImprintContent();
    }
  }

  /**
   * Kontakt-Content aktualisieren
   */
  static async updateContactContent(updates, userId) {
    try {
      const currentContent = await this.getContactContent();
      const updatedContent = {
        ...currentContent,
        ...updates,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId || 'Admin'
      };

      // Validierung
      this.validateContactContent(updatedContent);

      // Backup erstellen
      await this.createBackup(contactContentPath);

      // Content speichern
      const fileContent = `export const contactContent: ContactContent = ${JSON.stringify(updatedContent, null, 2)};`;

      await fs.writeFile(contactContentPath, fileContent, 'utf-8');

      console.log(`[PageContent] Kontakt-Content aktualisiert von ${userId}`);
      
      return {
        success: true,
        message: 'Kontakt-Content erfolgreich aktualisiert',
        content: updatedContent
      };

    } catch (error) {
      console.error('[PageContent] Update Kontakt-Content fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Impressums-Content aktualisieren
   */
  static async updateImprintContent(updates, userId) {
    try {
      const currentContent = await this.getImprintContent();
      const updatedContent = {
        ...currentContent,
        ...updates,
        lastUpdated: new Date().toISOString(),
        updatedBy: userId || 'Admin'
      };

      // Validierung
      this.validateImprintContent(updatedContent);

      // Backup erstellen
      await this.createBackup(imprintContentPath);

      // Content speichern
      const fileContent = `export const imprintContent: ImprintContent = ${JSON.stringify(updatedContent, null, 2)};`;

      await fs.writeFile(imprintContentPath, fileContent, 'utf-8');

      console.log(`[PageContent] Impressum-Content aktualisiert von ${userId}`);
      
      return {
        success: true,
        message: 'Impressum-Content erfolgreich aktualisiert',
        content: updatedContent
      };

    } catch (error) {
      console.error('[PageContent] Update Impressum-Content fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Kontakt-Content validieren
   */
  static validateContactContent(content) {
    const errors = [];

    if (!content.companyName?.trim()) {
      errors.push('Firmenname ist erforderlich');
    }

    if (!content.address?.street?.trim()) {
      errors.push('Straße ist erforderlich');
    }

    if (!content.address?.city?.trim()) {
      errors.push('Stadt ist erforderlich');
    }

    if (!content.email?.trim()) {
      errors.push('E-Mail ist erforderlich');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email)) {
      errors.push('Ungültige E-Mail-Adresse');
    }

    if (!content.phone?.trim()) {
      errors.push('Telefonnummer ist erforderlich');
    }

    if (!content.heroTitle?.trim()) {
      errors.push('Hero-Titel ist erforderlich');
    }

    if (errors.length > 0) {
      const error = new Error('Validierung fehlgeschlagen');
      error.details = errors;
      throw error;
    }
  }

  /**
   * Impressums-Content validieren
   */
  static validateImprintContent(content) {
    const errors = [];

    if (!content.companyName?.trim()) {
      errors.push('Firmenname ist erforderlich');
    }

    if (!content.address?.street?.trim()) {
      errors.push('Straße ist erforderlich');
    }

    if (!content.address?.city?.trim()) {
      errors.push('Stadt ist erforderlich');
    }

    if (!content.representative?.trim()) {
      errors.push('Vertreter ist erforderlich');
    }

    if (!content.email?.trim()) {
      errors.push('E-Mail ist erforderlich');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email)) {
      errors.push('Ungültige E-Mail-Adresse');
    }

    if (!content.phone?.trim()) {
      errors.push('Telefonnummer ist erforderlich');
    }

    if (!content.registerEntry?.court?.trim()) {
      errors.push('Registergericht ist erforderlich');
    }

    if (!content.registerEntry?.number?.trim()) {
      errors.push('Registernummer ist erforderlich');
    }

    if (!content.vatId?.id?.trim()) {
      errors.push('Umsatzsteuer-ID ist erforderlich');
    }

    if (errors.length > 0) {
      const error = new Error('Validierung fehlgeschlagen');
      error.details = errors;
      throw error;
    }
  }

  /**
   * Backup erstellen
   */
  static async createBackup(filePath) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = filePath.replace('.ts', `_backup_${timestamp}.ts`);
      
      const content = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(backupPath, content, 'utf-8');
      
      console.log(`[PageContent] Backup erstellt: ${backupPath}`);
    } catch (error) {
      console.warn('[PageContent] Backup fehlgeschlagen:', error.message);
    }
  }

  /**
   * Änderungshistorie laden (vereinfacht)
   */
  static async getChangeHistory() {
    // In einer echten Implementierung würde hier eine Datenbank oder Logdatei verwendet
    // Für diese Demo simulieren wir eine einfache Historie
    return {
      contactContent: [
        {
          timestamp: new Date().toISOString(),
          action: 'initial',
          userId: 'System',
          description: 'Initiale Erstellung'
        }
      ],
      imprintContent: [
        {
          timestamp: new Date().toISOString(),
          action: 'initial',
          userId: 'System',
          description: 'Initiale Erstellung'
        }
      ]
    };
  }

  /**
   * Statistiken für Dashboard
   */
  static async getContentStats() {
    try {
      const contactContent = await this.getContactContent();
      const imprintContent = await this.getImprintContent();
      const history = await this.getChangeHistory();

      const now = new Date();
      const contactLastUpdate = new Date(contactContent.lastUpdated);
      const imprintLastUpdate = new Date(imprintContent.lastUpdated);

      return {
        pages: {
          contact: {
            hasChanges: true,
            lastUpdate: contactContent.lastUpdated,
            daysSinceUpdate: Math.floor((now - contactLastUpdate) / (1000 * 60 * 60 * 24)),
            updatedBy: contactContent.updatedBy
          },
          imprint: {
            hasChanges: true,
            lastUpdate: imprintContent.lastUpdated,
            daysSinceUpdate: Math.floor((now - imprintLastUpdate) / (1000 * 60 * 60 * 24)),
            updatedBy: imprintContent.updatedBy
          }
        },
        history: history,
        totalChanges: history.contactContent.length + history.imprintContent.length
      };
    } catch (error) {
      console.error('[PageContent] Stats fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Content auf Standard zurücksetzen
   */
  static async resetToDefault(pageType, userId) {
    try {
      const defaultContent = pageType === 'contact' 
        ? this.getDefaultContactContent()
        : this.getDefaultImprintContent();

      defaultContent.lastUpdated = new Date().toISOString();
      defaultContent.updatedBy = userId || 'Admin';

      const filePath = pageType === 'contact' ? contactContentPath : imprintContentPath;

      // Backup erstellen
      await this.createBackup(filePath);

      // Standard-Content speichern
      const fileContent = `export const ${pageType === 'contact' ? 'contactContent' : 'imprintContent'}: ${pageType === 'contact' ? 'ContactContent' : 'ImprintContent'} = ${JSON.stringify(defaultContent, null, 2)};`;
      await fs.writeFile(filePath, fileContent, 'utf-8');

      console.log(`[PageContent] ${pageType === 'contact' ? 'Kontakt' : 'Impressum'}-Content auf Standard zurückgesetzt von ${userId}`);
      
      return {
        success: true,
        message: `${pageType === 'contact' ? 'Kontakt' : 'Impressum'}-Content auf Standard zurückgesetzt`,
        content: defaultContent
      };

    } catch (error) {
      console.error('[PageContent] Reset fehlgeschlagen:', error);
      throw error;
    }
  }
}

export default PageContentService;