import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthService } from './authService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Datenpfade
const dataDir = path.join(__dirname, '../data');
const articlesPath = path.join(dataDir, 'articles.ts');
const schedulesPath = path.join(dataDir, 'scheduledPosts.ts');

/**
 * Blog-Scheduling-Service
 * 
 * Funktionen:
 * - Zeitgesteuerte Veröffentlichung von Blog-Beiträgen
 * - Scheduling-Verwaltung (erstellen, bearbeiten, löschen)
 * - Automatische Publikation basierend auf Zeitplan
 * - Queue-Management für ausstehende Posts
 */
class BlogSchedulingService {
  
  /**
   * Alle geplanten Beiträge abrufen
   */
  static async getScheduledPosts() {
    try {
      const content = await fs.readFile(schedulesPath, 'utf-8');
      const schedulesMatch = content.match(/export const scheduledPosts: ScheduledPost\[\] = \[([\s\S]*?)\];/);

      if (!schedulesMatch) {
        return [];
      }

      let schedules = JSON.parse('[' + schedulesMatch[1] + ']');
      
      // Sortieren nach Erstellungsdatum (neueste zuerst)
      schedules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return schedules;
    } catch (error) {
      console.error('[BlogScheduler] Fehler beim Laden geplanter Posts:', error);
      return [];
    }
  }

  /**
   * Geplanten Beitrag abrufen
   */
  static async getScheduledPost(scheduleId) {
    try {
      const schedules = await this.getScheduledPosts();
      return schedules.find(schedule => schedule.id === scheduleId) || null;
    } catch (error) {
      console.error('[BlogScheduler] Fehler beim Laden des geplanten Posts:', error);
      throw error;
    }
  }

  /**
   * Ausstehende Beiträge (scheduled) abrufen
   */
  static async getPendingScheduledPosts() {
    try {
      const schedules = await this.getScheduledPosts();
      const now = new Date();
      
      return schedules.filter(schedule => 
        schedule.status === 'scheduled' && new Date(schedule.scheduledDate) > now
      );
    } catch (error) {
      console.error('[BlogScheduler] Fehler beim Laden ausstehender Posts:', error);
      return [];
    }
  }

  /**
   * Neuen Beitrag zur Veröffentlichung planen
   */
  static async schedulePost(postData) {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        category,
        tags,
        author,
        featuredImage,
        scheduledDate,
        publishStatus = 'scheduled',
        metaTitle,
        metaDescription,
        seoKeywords
      } = postData;

      // Validierung
      if (!title || !slug || !content || !scheduledDate) {
        throw new Error('Titel, Slug, Inhalt und geplantes Datum sind erforderlich');
      }

      const scheduledDateTime = new Date(scheduledDate);
      if (isNaN(scheduledDateTime.getTime())) {
        throw new Error('Ungültiges Datumsformat');
      }

      if (scheduledDateTime <= new Date()) {
        throw new Error('Geplantes Datum muss in der Zukunft liegen');
      }

      // Prüfen ob Slug bereits existiert
      const existingPosts = await this.getScheduledPosts();
      if (existingPosts.find(post => post.slug === slug)) {
        throw new Error('Ein Beitrag mit diesem Slug ist bereits geplant');
      }

      const scheduleData = {
        id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        content: content.trim(),
        excerpt: excerpt?.trim() || '',
        category: category || 'Allgemein',
        tags: tags || [],
        author: author || 'Admin',
        featuredImage: featuredImage || '',
        scheduledDate: scheduledDateTime.toISOString(),
        publishStatus: publishStatus, // 'scheduled', 'published', 'draft', 'cancelled'
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || '',
        seoKeywords: seoKeywords || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: null,
        notificationsSent: false,
        error: null
      };

      // In Scheduling-Datei speichern
      await this.saveScheduledPost(scheduleData);

      console.log(`[BlogScheduler] Beitrag geplant: ${title} für ${scheduledDateTime.toLocaleString('de-DE')}`);
      
      return {
        success: true,
        message: 'Beitrag erfolgreich zur Veröffentlichung geplant',
        schedule: scheduleData
      };

    } catch (error) {
      console.error('[BlogScheduler] Planung fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Geplanten Beitrag bearbeiten
   */
  static async updateScheduledPost(scheduleId, updates) {
    try {
      const content = await fs.readFile(schedulesPath, 'utf-8');
      const schedulesMatch = content.match(/export const scheduledPosts: ScheduledPost\[\] = \[([\s\S]*?)\];/);

      if (!schedulesMatch) {
        throw new Error('Keine geplanten Beiträge gefunden');
      }

      let schedules = JSON.parse('[' + schedulesMatch[1] + ']');
      const index = schedules.findIndex(schedule => schedule.id === scheduleId);

      if (index === -1) {
        throw new Error('Geplanter Beitrag nicht gefunden');
      }

      const existingSchedule = schedules[index];

      // Status-basierte Validierung
      if (existingSchedule.publishStatus === 'published') {
        throw new Error('Bereits veröffentlichte Beiträge können nicht bearbeitet werden');
      }

      // Datums-Validierung falls geändert
      if (updates.scheduledDate && updates.scheduledDate !== existingSchedule.scheduledDate) {
        const newDate = new Date(updates.scheduledDate);
        if (isNaN(newDate.getTime())) {
          throw new Error('Ungültiges Datumsformat');
        }
        if (newDate <= new Date()) {
          throw new Error('Geplantes Datum muss in der Zukunft liegen');
        }
        updates.scheduledDate = newDate.toISOString();
      }

      // Slug-Validierung falls geändert
      if (updates.slug && updates.slug !== existingSchedule.slug) {
        const slugExists = schedules.find(schedule => 
          schedule.slug === updates.slug && schedule.id !== scheduleId
        );
        if (slugExists) {
          throw new Error('Ein Beitrag mit diesem Slug ist bereits geplant');
        }
        updates.slug = updates.slug.trim().toLowerCase();
      }

      // Updates anwenden
      const updatedSchedule = {
        ...existingSchedule,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      schedules[index] = updatedSchedule;

      // Datei aktualisieren
      const newContent = content.replace(
        /export const scheduledPosts: ScheduledPost\[\] = \[[\s\S]*?\];/,
        `export const scheduledPosts: ScheduledPost[] = ${JSON.stringify(schedules, null, 2)};`
      );

      await fs.writeFile(schedulesPath, newContent, 'utf-8');

      console.log(`[BlogScheduler] Geplanter Beitrag aktualisiert: ${updatedSchedule.title}`);
      
      return {
        success: true,
        message: 'Geplanter Beitrag erfolgreich aktualisiert',
        schedule: updatedSchedule
      };

    } catch (error) {
      console.error('[BlogScheduler] Update fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Geplanten Beitrag löschen
   */
  static async deleteScheduledPost(scheduleId) {
    try {
      const content = await fs.readFile(schedulesPath, 'utf-8');
      const schedulesMatch = content.match(/export const scheduledPosts: ScheduledPost\[\] = \[([\s\S]*?)\];/);

      if (!schedulesMatch) {
        throw new Error('Keine geplanten Beiträge gefunden');
      }

      let schedules = JSON.parse('[' + schedulesMatch[1] + ']');
      const index = schedules.findIndex(schedule => schedule.id === scheduleId);

      if (index === -1) {
        throw new Error('Geplanter Beitrag nicht gefunden');
      }

      const deletedSchedule = schedules.splice(index, 1)[0];

      // Datei aktualisieren
      const newContent = content.replace(
        /export const scheduledPosts: ScheduledPost\[\] = \[[\s\S]*?\];/,
        `export const scheduledPosts: ScheduledPost[] = ${JSON.stringify(schedules, null, 2)};`
      );

      await fs.writeFile(schedulesPath, newContent, 'utf-8');

      console.log(`[BlogScheduler] Geplanter Beitrag gelöscht: ${deletedSchedule.title}`);
      
      return {
        success: true,
        message: 'Geplanter Beitrag erfolgreich gelöscht',
        schedule: deletedSchedule
      };

    } catch (error) {
      console.error('[BlogScheduler] Löschen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Beitrag sofort veröffentlichen (ohne Planung)
   */
  static async publishImmediately(postData) {
    try {
      const result = await this.schedulePost({
        ...postData,
        scheduledDate: new Date().toISOString(),
        publishStatus: 'scheduled'
      });

      if (result.success) {
        // Sofort veröffentlichen
        const publishResult = await this.publishScheduledPost(result.schedule.id, true);
        return publishResult;
      }

      return result;

    } catch (error) {
      console.error('[BlogScheduler] Sofortige Veröffentlichung fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Geplanten Beitrag veröffentlichen
   */
  static async publishScheduledPost(scheduleId, force = false) {
    try {
      const schedule = await this.getScheduledPost(scheduleId);
      if (!schedule) {
        throw new Error('Geplanter Beitrag nicht gefunden');
      }

      // Zeitprüfung (außer bei force)
      if (!force) {
        const scheduledDate = new Date(schedule.scheduledDate);
        if (scheduledDate > new Date()) {
          throw new Error('Beitrag kann noch nicht veröffentlicht werden');
        }
      }

      // In Blog-Artikel konvertieren
      const articleData = {
        id: `article_${Date.now()}`,
        slug: schedule.slug,
        title: schedule.title,
        content: schedule.content,
        excerpt: schedule.excerpt,
        category: schedule.category,
        tags: schedule.tags,
        author: schedule.author,
        featuredImage: schedule.featuredImage,
        date: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(schedule.content.replace(/<[^>]*>/g, '').split(' ').length / 200),
        metaTitle: schedule.metaTitle,
        metaDescription: schedule.metaDescription,
        seoKeywords: schedule.seoKeywords,
        isScheduled: false,
        publishedAt: new Date().toISOString()
      };

      // Artikel zur articles.ts hinzufügen
      await this.addArticle(articleData);

      // Status aktualisieren
      await this.updateScheduledPost(scheduleId, {
        publishStatus: 'published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`[BlogScheduler] Beitrag veröffentlicht: ${schedule.title}`);
      
      return {
        success: true,
        message: 'Beitrag erfolgreich veröffentlicht',
        article: articleData
      };

    } catch (error) {
      console.error('[BlogScheduler] Veröffentlichung fehlgeschlagen:', error);
      
      // Fehler im Schedule speichern
      try {
        await this.updateScheduledPost(scheduleId, {
          error: error.message,
          updatedAt: new Date().toISOString()
        });
      } catch (updateError) {
        console.error('[BlogScheduler] Fehler beim Speichern des Fehlers:', updateError);
      }
      
      throw error;
    }
  }

  /**
   * Artikel zu articles.ts hinzufügen
   */
  static async addArticle(article) {
    try {
      const content = await fs.readFile(articlesPath, 'utf-8');
      const articlesMatch = content.match(/export const articles: Article\[\] = \[([\s\S]*?)\];/);

      let articles = [];
      if (articlesMatch) {
        articles = JSON.parse('[' + articlesMatch[1] + ']');
      }

      // Prüfen ob Artikel bereits existiert
      if (articles.find(a => a.slug === article.slug)) {
        throw new Error('Artikel mit diesem Slug existiert bereits');
      }

      articles.push(article);

      // Datei aktualisieren
      const newContent = content.replace(
        /export const articles: Article\[\] = \[[\s\S]*?\];/,
        `export const articles: Article[] = ${JSON.stringify(articles, null, 2)};`
      );

      await fs.writeFile(articlesPath, newContent, 'utf-8');

    } catch (error) {
      console.error('[BlogScheduler] Artikel hinzufügen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Geplanten Beitrag in Scheduling-Datei speichern
   */
  static async saveScheduledPost(scheduleData) {
    try {
      let content;
      try {
        content = await fs.readFile(schedulesPath, 'utf-8');
      } catch (error) {
        // Datei existiert nicht - neu erstellen
        content = 'export const scheduledPosts: ScheduledPost[] = [];';
      }

      const schedulesMatch = content.match(/export const scheduledPosts: ScheduledPost\[\] = \[([\s\S]*?)\];/);

      let schedules = [];
      if (schedulesMatch) {
        schedules = JSON.parse('[' + schedulesMatch[1] + ']');
      }

      schedules.push(scheduleData);

      const newContent = content.replace(
        /export const scheduledPosts: ScheduledPost\[\] = \[[\s\S]*?\];/,
        `export const scheduledPosts: ScheduledPost[] = ${JSON.stringify(schedules, null, 2)};`
      );

      await fs.writeFile(schedulesPath, newContent, 'utf-8');

    } catch (error) {
      console.error('[BlogScheduler] Speichern fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Automatische Veröffentlichung prüfen (wird von Cron aufgerufen)
   */
  static async checkAndPublishScheduledPosts() {
    try {
      const schedules = await this.getScheduledPosts();
      const now = new Date();
      const toPublish = schedules.filter(schedule => 
        schedule.publishStatus === 'scheduled' && 
        new Date(schedule.scheduledDate) <= now &&
        !schedule.error
      );

      const results = [];

      for (const schedule of toPublish) {
        try {
          const result = await this.publishScheduledPost(schedule.id, true);
          results.push({
            scheduleId: schedule.id,
            success: true,
            title: schedule.title,
            message: result.message
          });
        } catch (error) {
          results.push({
            scheduleId: schedule.id,
            success: false,
            title: schedule.title,
            error: error.message
          });
        }
      }

      if (results.length > 0) {
        console.log(`[BlogScheduler] Automatische Veröffentlichung: ${results.length} Beiträge verarbeitet`);
      }

      return results;

    } catch (error) {
      console.error('[BlogScheduler] Automatische Veröffentlichung fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Statistiken für Dashboard
   */
  static async getSchedulingStats() {
    try {
      const schedules = await this.getScheduledPosts();
      const now = new Date();
      
      const stats = {
        totalScheduled: schedules.length,
        pending: schedules.filter(s => s.publishStatus === 'scheduled' && new Date(s.scheduledDate) > now).length,
        published: schedules.filter(s => s.publishStatus === 'published').length,
        drafts: schedules.filter(s => s.publishStatus === 'draft').length,
        cancelled: schedules.filter(s => s.publishStatus === 'cancelled').length,
        error: schedules.filter(s => s.error).length,
        nextPublication: null,
        thisWeek: 0,
        thisMonth: 0
      };

      // Nächste Veröffentlichung
      const upcoming = schedules
        .filter(s => s.publishStatus === 'scheduled' && new Date(s.scheduledDate) > now)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      
      if (upcoming.length > 0) {
        stats.nextPublication = upcoming[0];
      }

      // Diese Woche/Monat
      const oneWeek = new Date();
      oneWeek.setDate(oneWeek.getDate() + 7);
      const oneMonth = new Date();
      oneMonth.setMonth(oneMonth.getMonth() + 1);

      stats.thisWeek = schedules.filter(s => 
        s.publishStatus === 'scheduled' && 
        new Date(s.scheduledDate) > now &&
        new Date(s.scheduledDate) <= oneWeek
      ).length;

      stats.thisMonth = schedules.filter(s => 
        s.publishStatus === 'scheduled' && 
        new Date(s.scheduledDate) > now &&
        new Date(s.scheduledDate) <= oneMonth
      ).length;

      return stats;

    } catch (error) {
      console.error('[BlogScheduler] Statistiken fehlgeschlagen:', error);
      throw error;
    }
  }
}

export default BlogSchedulingService;