import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { AuthService } from './authService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Datenpfade
const dataDir = path.join(__dirname, '../data');
const advertisementsPath = path.join(dataDir, 'advertisements.ts');
const adSpacesPath = path.join(dataDir, 'adSpaces.ts');

// Speicher für Banner-Dateien
const BANNERS_DIR = path.join(__dirname, '../storage/banners');

/**
 * Werbeverwaltungs-Service
 * 
 * Funktionen:
 * - Werbebanner-Management (erstellen, bearbeiten, löschen)
 * - Banner-Upload mit Bildverarbeitung
 * - Aktionsangebote-Management
 * - Werbeflächen-Verwaltung
 * - Banner-Rotation und A/B-Testing
 * - Performance-Tracking
 * - Zeitplanung von Bannern
 */
class AdvertisementService {
  
  /**
   * Verzeichnis initialisieren
   */
  static async initialize() {
    try {
      await fs.mkdir(BANNERS_DIR, { recursive: true });
      console.log('[AdService] Banner-Verzeichnis initialisiert');
    } catch (error) {
      console.error('[AdService] Verzeichnis-Initialisierung fehlgeschlagen:', error);
    }
  }

  /**
   * Banner-Dateien validieren
   */
  static validateBannerFile(file) {
    const errors = [];

    if (!file) {
      errors.push('Keine Datei übergeben');
      return errors;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Nicht unterstütztes Format: ${file.mimetype}`);
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      errors.push(`Datei zu groß: ${file.size} bytes. Maximum: 2MB`);
    }

    return errors;
  }

  /**
   * Eindeutigen Dateinamen generieren
   */
  static generateBannerFileName(originalName) {
    const timestamp = Date.now();
    const hash = crypto.randomBytes(6).toString('hex');
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9\-_.]/g, '_')
      .substring(0, 30);
    
    return `banner_${baseName}_${timestamp}_${hash}${ext}`;
  }

  /**
   * Neues Werbebanner erstellen
   */
  static async createBanner(bannerData, bannerFile = null) {
    try {
      const {
        name,
        title,
        subtitle,
        description,
        callToAction,
        targetUrl,
        category = 'general',
        priority = 1,
        isActive = true,
        startDate,
        endDate,
        adSpace,
        rotationWeights,
        performance = {},
        settings = {},
        tags = []
      } = bannerData;

      // Validierung
      if (!name?.trim() || !title?.trim()) {
        throw new Error('Name und Titel sind erforderlich');
      }

      let bannerImage = null;
      if (bannerFile) {
        const validationErrors = this.validateBannerFile(bannerFile);
        if (validationErrors.length > 0) {
          const error = new Error('Banner-Validierung fehlgeschlagen');
          error.details = validationErrors;
          throw error;
        }

        const fileName = this.generateBannerFileName(bannerFile.name);
        const filePath = path.join(BANNERS_DIR, fileName);
        
        await fs.writeFile(filePath, bannerFile.buffer);
        
        bannerImage = {
          fileName: fileName,
          originalName: bannerFile.name,
          url: `/banners/${fileName}`,
          size: bannerFile.size,
          mimeType: bannerFile.mimetype,
          uploadedAt: new Date().toISOString()
        };
      }

      const bannerId = `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newBanner = {
        id: bannerId,
        name: name.trim(),
        title: title.trim(),
        subtitle: subtitle?.trim() || '',
        description: description?.trim() || '',
        callToAction: callToAction?.trim() || 'Mehr erfahren',
        targetUrl: targetUrl?.trim() || '#',
        category: category,
        priority: parseInt(priority) || 1,
        isActive: Boolean(isActive),
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        adSpace: adSpace || 'default',
        rotationWeights: rotationWeights || { default: 1 },
        image: bannerImage,
        performance: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
          conversions: 0,
          ...performance
        },
        settings: {
          openInNewTab: false,
          showCloseButton: true,
          autoClose: false,
          duration: 0,
          ...settings
        },
        tags: Array.isArray(tags) ? tags : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastShown: null,
        version: '1.0',
        status: 'active'
      };

      await this.addBanner(newBanner);

      console.log(`[AdService] Banner erstellt: ${name}`);
      
      return {
        success: true,
        message: 'Banner erfolgreich erstellt',
        banner: newBanner
      };

    } catch (error) {
      console.error('[AdService] Banner-Erstellung fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Banner zur Datenbank hinzufügen
   */
  static async addBanner(bannerData) {
    try {
      let content;
      try {
        content = await fs.readFile(advertisementsPath, 'utf-8');
      } catch (error) {
        // Datei existiert nicht - neu erstellen
        content = 'export const advertisements: Advertisement[] = [];';
      }

      const adsMatch = content.match(/export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/);

      let advertisements = [];
      if (adsMatch) {
        advertisements = JSON.parse('[' + adsMatch[1] + ']');
      }

      advertisements.push(bannerData);

      const newContent = content.replace(
        /export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/,
        `export const advertisements: Advertisement[] = ${JSON.stringify(advertisements, null, 2)};`
      );

      await fs.writeFile(advertisementsPath, newContent, 'utf-8');

    } catch (error) {
      console.error('[AdService] Banner hinzufügen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Alle Banner abrufen
   */
  static async getAllBanners(filters = {}) {
    try {
      let content;
      try {
        content = await fs.readFile(advertisementsPath, 'utf-8');
      } catch (error) {
        return [];
      }

      const adsMatch = content.match(/export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/);

      if (!adsMatch) {
        return [];
      }

      let advertisements = JSON.parse('[' + adsMatch[1] + ']');

      // Filter anwenden
      if (filters.category) {
        advertisements = advertisements.filter(ad => ad.category === filters.category);
      }

      if (filters.adSpace) {
        advertisements = advertisements.filter(ad => ad.adSpace === filters.adSpace);
      }

      if (filters.isActive !== undefined) {
        advertisements = advertisements.filter(ad => ad.isActive === filters.isActive);
      }

      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        advertisements = advertisements.filter(ad => 
          new Date(ad.createdAt) >= dateFrom
        );
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        advertisements = advertisements.filter(ad => 
          new Date(ad.createdAt) <= dateTo
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        advertisements = advertisements.filter(ad => 
          ad.name.toLowerCase().includes(searchTerm) ||
          ad.title.toLowerCase().includes(searchTerm) ||
          ad.category.toLowerCase().includes(searchTerm) ||
          ad.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Zeitbasierte Filter
      const now = new Date();
      advertisements = advertisements.filter(ad => {
        if (ad.startDate && new Date(ad.startDate) > now) return false;
        if (ad.endDate && new Date(ad.endDate) < now) return false;
        return true;
      });

      // Sortieren (Priorität, dann neueste zuerst)
      advertisements.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return advertisements;
    } catch (error) {
      console.error('[AdService] Banner laden fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Banner für Werbefläche abrufen
   */
  static async getBannersForAdSpace(adSpace, rotation = true) {
    try {
      const allBanners = await this.getAllBanners({ adSpace, isActive: true });
      
      if (!rotation || allBanners.length <= 1) {
        return allBanners[0] || null;
      }

      // Gewichtete Rotation
      const totalWeight = allBanners.reduce((sum, banner) => {
        const weight = banner.rotationWeights?.[adSpace] || banner.rotationWeights?.default || 1;
        return sum + weight;
      }, 0);

      let random = Math.random() * totalWeight;
      for (const banner of allBanners) {
        const weight = banner.rotationWeights?.[adSpace] || banner.rotationWeights?.default || 1;
        random -= weight;
        if (random <= 0) {
          return banner;
        }
      }

      return allBanners[0]; // Fallback
    } catch (error) {
      console.error('[AdService] AdSpace Banner laden fehlgeschlagen:', error);
      return null;
    }
  }

  /**
   * Einzelnes Banner abrufen
   */
  static async getBanner(bannerId) {
    try {
      const banners = await this.getAllBanners();
      return banners.find(banner => banner.id === bannerId) || null;
    } catch (error) {
      console.error('[AdService] Banner laden fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Banner aktualisieren
   */
  static async updateBanner(bannerId, updates, bannerFile = null) {
    try {
      const content = await fs.readFile(advertisementsPath, 'utf-8');
      const adsMatch = content.match(/export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/);

      if (!adsMatch) {
        throw new Error('Banner-Datenbank nicht gefunden');
      }

      let advertisements = JSON.parse('[' + adsMatch[1] + ']');
      const index = advertisements.findIndex(ad => ad.id === bannerId);

      if (index === -1) {
        throw new Error('Banner nicht gefunden');
      }

      let newImage = null;
      if (bannerFile) {
        const validationErrors = this.validateBannerFile(bannerFile);
        if (validationErrors.length > 0) {
          const error = new Error('Banner-Validierung fehlgeschlagen');
          error.details = validationErrors;
          throw error;
        }

        const fileName = this.generateBannerFileName(bannerFile.name);
        const filePath = path.join(BANNERS_DIR, fileName);
        
        await fs.writeFile(filePath, bannerFile.buffer);
        
        newImage = {
          fileName: fileName,
          originalName: bannerFile.name,
          url: `/banners/${fileName}`,
          size: bannerFile.size,
          mimeType: bannerFile.mimetype,
          uploadedAt: new Date().toISOString()
        };
      }

      const updatedBanner = {
        ...advertisements[index],
        ...updates,
        ...(newImage && { image: newImage }),
        updatedAt: new Date().toISOString()
      };

      advertisements[index] = updatedBanner;

      const newContent = content.replace(
        /export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/,
        `export const advertisements: Advertisement[] = ${JSON.stringify(advertisements, null, 2)};`
      );

      await fs.writeFile(advertisementsPath, newContent, 'utf-8');

      console.log(`[AdService] Banner aktualisiert: ${bannerId}`);
      
      return {
        success: true,
        message: 'Banner erfolgreich aktualisiert',
        banner: updatedBanner
      };

    } catch (error) {
      console.error('[AdService] Banner-Update fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Banner löschen
   */
  static async deleteBanner(bannerId) {
    try {
      const content = await fs.readFile(advertisementsPath, 'utf-8');
      const adsMatch = content.match(/export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/);

      if (!adsMatch) {
        throw new Error('Banner-Datenbank nicht gefunden');
      }

      let advertisements = JSON.parse('[' + adsMatch[1] + ']');
      const index = advertisements.findIndex(ad => ad.id === bannerId);

      if (index === -1) {
        throw new Error('Banner nicht gefunden');
      }

      const deletedBanner = advertisements.splice(index, 1)[0];

      // Banner-Datei löschen
      if (deletedBanner.image?.fileName) {
        try {
          await fs.unlink(path.join(BANNERS_DIR, deletedBanner.image.fileName));
        } catch (error) {
          console.warn('[AdService] Banner-Datei konnte nicht gelöscht werden:', error.message);
        }
      }

      const newContent = content.replace(
        /export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/,
        `export const advertisements: Advertisement[] = ${JSON.stringify(advertisements, null, 2)};`
      );

      await fs.writeFile(advertisementsPath, newContent, 'utf-8');

      console.log(`[AdService] Banner gelöscht: ${bannerId}`);
      
      return {
        success: true,
        message: 'Banner erfolgreich gelöscht',
        banner: deletedBanner
      };

    } catch (error) {
      console.error('[AdService] Banner-Löschung fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Banner-Performance aktualisieren
   */
  static async updateBannerPerformance(bannerId, event) {
    try {
      const content = await fs.readFile(advertisementsPath, 'utf-8');
      const adsMatch = content.match(/export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/);

      if (!adsMatch) {
        throw new Error('Banner-Datenbank nicht gefunden');
      }

      let advertisements = JSON.parse('[' + adsMatch[1] + ']');
      const index = advertisements.findIndex(ad => ad.id === bannerId);

      if (index === -1) {
        throw new Error('Banner nicht gefunden');
      }

      const banner = advertisements[index];
      const performance = { ...banner.performance };

      // Event verarbeiten
      switch (event) {
        case 'impression':
          performance.impressions++;
          break;
        case 'click':
          performance.clicks++;
          break;
        case 'conversion':
          performance.conversions++;
          break;
        default:
          throw new Error('Unbekanntes Event');
      }

      // CTR berechnen
      performance.ctr = performance.impressions > 0 
        ? (performance.clicks / performance.impressions) * 100 
        : 0;

      const updatedBanner = {
        ...banner,
        performance,
        lastShown: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      advertisements[index] = updatedBanner;

      const newContent = content.replace(
        /export const advertisements: Advertisement\[\] = \[([\s\S]*?)\];/,
        `export const advertisements: Advertisement[] = ${JSON.stringify(advertisements, null, 2)};`
      );

      await fs.writeFile(advertisementsPath, newContent, 'utf-8');

      console.log(`[AdService] Banner-Performance aktualisiert: ${bannerId} - ${event}`);
      
      return {
        success: true,
        message: 'Performance aktualisiert',
        performance
      };

    } catch (error) {
      console.error('[AdService] Performance-Update fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Werbeflächen verwalten
   */
  static async getAdSpaces() {
    try {
      let content;
      try {
        content = await fs.readFile(adSpacesPath, 'utf-8');
      } catch (error) {
        return this.getDefaultAdSpaces();
      }

      const spacesMatch = content.match(/export const adSpaces: AdSpace\[\] = \[([\s\S]*?)\];/);

      if (!spacesMatch) {
        return this.getDefaultAdSpaces();
      }

      return JSON.parse('[' + spacesMatch[1] + ']');
    } catch (error) {
      console.error('[AdService] AdSpaces laden fehlgeschlagen:', error);
      return this.getDefaultAdSpaces();
    }
  }

  /**
   * Standard-Werbeflächen
   */
  static getDefaultAdSpaces() {
    return [
      {
        id: 'header-banner',
        name: 'Header Banner',
        description: 'Banner im Header-Bereich der Webseite',
        position: 'header',
        dimensions: { width: 728, height: 90 },
        maxBanners: 1,
        isActive: true,
        rotation: false,
        priority: 1
      },
      {
        id: 'sidebar-banner',
        name: 'Sidebar Banner',
        description: 'Banner in der Seitenleiste',
        position: 'sidebar',
        dimensions: { width: 300, height: 250 },
        maxBanners: 2,
        isActive: true,
        rotation: true,
        priority: 2
      },
      {
        id: 'footer-banner',
        name: 'Footer Banner',
        description: 'Banner im Footer-Bereich',
        position: 'footer',
        dimensions: { width: 970, height: 250 },
        maxBanners: 1,
        isActive: true,
        rotation: false,
        priority: 3
      },
      {
        id: 'popup-banner',
        name: 'Pop-up Banner',
        description: 'Modal-Fenster mit Banner',
        position: 'modal',
        dimensions: { width: 600, height: 400 },
        maxBanners: 1,
        isActive: false,
        rotation: false,
        priority: 1
      },
      {
        id: 'inline-banner',
        name: 'Inline Banner',
        description: 'Banner innerhalb des Contents',
        position: 'content',
        dimensions: { width: 336, height: 280 },
        maxBanners: 1,
        isActive: true,
        rotation: false,
        priority: 2
      }
    ];
  }

  /**
   * Banner-Kategorien abrufen
   */
  static async getBannerCategories() {
    try {
      const banners = await this.getAllBanners();
      const categories = [...new Set(banners.map(banner => banner.category))];
      return categories.sort();
    } catch (error) {
      console.error('[AdService] Kategorien laden fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Werbe-Statistiken für Dashboard
   */
  static async getAdvertisementStats() {
    try {
      const banners = await this.getAllBanners();
      const adSpaces = await this.getAdSpaces();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalImpressions = banners.reduce((sum, banner) => sum + banner.performance.impressions, 0);
      const totalClicks = banners.reduce((sum, banner) => sum + banner.performance.clicks, 0);
      const overallCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      const activeBanners = banners.filter(banner => banner.isActive);
      const inactiveBanners = banners.filter(banner => !banner.isActive);
      const recentBanners = banners.filter(banner => new Date(banner.createdAt) > oneWeekAgo);

      const topPerformingBanners = banners
        .filter(banner => banner.performance.impressions > 0)
        .sort((a, b) => b.performance.ctr - a.performance.ctr)
        .slice(0, 10);

      const categoryStats = {};
      banners.forEach(banner => {
        if (!categoryStats[banner.category]) {
          categoryStats[banner.category] = {
            total: 0,
            impressions: 0,
            clicks: 0
          };
        }
        categoryStats[banner.category].total++;
        categoryStats[banner.category].impressions += banner.performance.impressions;
        categoryStats[banner.category].clicks += banner.performance.clicks;
      });

      return {
        totalBanners: banners.length,
        activeBanners: activeBanners.length,
        inactiveBanners: inactiveBanners.length,
        recentBanners: recentBanners.length,
        totalImpressions,
        totalClicks,
        overallCTR: Math.round(overallCTR * 100) / 100,
        adSpaces: adSpaces.length,
        activeAdSpaces: adSpaces.filter(space => space.isActive).length,
        topPerformingBanners,
        categoryStats,
        mostUsedCategories: Object.entries(categoryStats)
          .sort(([,a], [,b]) => b.impressions - a.impressions)
          .slice(0, 5)
          .map(([category, stats]) => ({
            category,
            ...stats,
            ctr: stats.impressions > 0 ? Math.round((stats.clicks / stats.impressions) * 100 * 100) / 100 : 0
          }))
      };
    } catch (error) {
      console.error('[AdService] Stats fehlgeschlagen:', error);
      throw error;
    }
  }
}

// Initialisierung beim Import
AdvertisementService.initialize().catch(error => {
  console.error('[AdService] Service-Initialisierung fehlgeschlagen:', error);
});

export default AdvertisementService;