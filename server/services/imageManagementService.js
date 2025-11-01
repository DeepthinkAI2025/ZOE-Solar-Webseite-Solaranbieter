import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { promisify } from 'util';
import sharp from 'sharp';
import { AuthService } from './authService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Unterstützte Bildformate
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

// Bildverzeichnis
const IMAGE_DIR = path.join(__dirname, '../storage/images');
const THUMBNAIL_DIR = path.join(__dirname, '../storage/images/thumbnails');

/**
 * Bildverwaltung-Service
 * 
 * Funktionen:
 * - Bildupload mit Verarbeitung
 * - Thumbnails generieren
 * - Bildverwaltung (alle Bilder abrufen, löschen, Details)
 * - Zuweisung zu Seiten
 */
class ImageManagementService {
  
  /**
   * Verzeichnisse initialisieren
   */
  static async initialize() {
    try {
      await fs.mkdir(IMAGE_DIR, { recursive: true });
      await fs.mkdir(THUMBNAIL_DIR, { recursive: true });
      console.log('[ImageService] Verzeichnisse initialisiert');
    } catch (error) {
      console.error('[ImageService] Verzeichnis-Initialisierung fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Datei-Validierung
   */
  static validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push('Keine Datei übergeben');
      return errors;
    }

    if (!SUPPORTED_FORMATS.includes(file.mimetype)) {
      errors.push(`Nicht unterstütztes Format: ${file.mimetype}. Unterstützt: ${SUPPORTED_FORMATS.join(', ')}`);
    }

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Datei zu groß: ${file.size} bytes. Maximum: ${MAX_FILE_SIZE} bytes`);
    }

    return errors;
  }

  /**
   * Eindeutigen Dateinamen generieren
   */
  static generateFileName(originalName) {
    const timestamp = Date.now();
    const hash = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9\-_.]/g, '_')
      .substring(0, 50);
    
    return `${baseName}_${timestamp}_${hash}${ext}`;
  }

  /**
   * Bild verarbeiten und speichern
   */
  static async processAndSaveImage(file) {
    try {
      const fileName = this.generateFileName(file.name);
      const originalPath = path.join(IMAGE_DIR, fileName);
      const thumbnailName = `thumb_${fileName}`;
      const thumbnailPath = path.join(THUMBNAIL_DIR, thumbnailName);

      // Originalbild speichern
      await fs.writeFile(originalPath, file.buffer);

      // Bildmetadaten lesen
      const metadata = await sharp(originalPath).metadata();

      // Thumbnail erstellen (300x300, proportional)
      await sharp(originalPath)
        .resize(300, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toFile(thumbnailPath);

      // Größe optimieren falls zu groß
      let optimizedPath = originalPath;
      if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
        optimizedPath = path.join(IMAGE_DIR, `optimized_${fileName}`);
        await sharp(originalPath)
          .resize(MAX_WIDTH, MAX_HEIGHT, { 
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 90, progressive: true })
          .toFile(optimizedPath);
      }

      return {
        original: {
          name: fileName,
          path: optimizedPath,
          url: `/images/${path.basename(optimizedPath)}`,
          width: metadata.width,
          height: metadata.height,
          size: file.size,
          format: metadata.format,
          mimeType: file.mimetype
        },
        thumbnail: {
          name: thumbnailName,
          path: thumbnailPath,
          url: `/images/thumbnails/${thumbnailName}`,
          width: 300,
          height: 300
        }
      };
    } catch (error) {
      console.error('[ImageService] Bildverarbeitung fehlgeschlagen:', error);
      throw new Error('Bildverarbeitung fehlgeschlagen');
    }
  }

  /**
   * Alle Bilder abrufen
   */
  static async getAllImages() {
    try {
      const files = await fs.readdir(IMAGE_DIR);
      const images = [];

      for (const file of files) {
        if (file.startsWith('thumb_') || file.startsWith('optimized_')) continue;

        const filePath = path.join(IMAGE_DIR, file);
        const stats = await fs.stat(filePath);
        const metadata = await sharp(filePath).metadata();
        
        // Thumbnail prüfen
        const thumbnailName = `thumb_${file}`;
        const thumbnailExists = await fs.access(
          path.join(THUMBNAIL_DIR, thumbnailName)
        ).then(() => true).catch(() => false);

        images.push({
          id: file,
          name: path.basename(file),
          url: `/images/${file}`,
          thumbnailUrl: thumbnailExists ? `/images/thumbnails/${thumbnailName}` : `/images/${file}`,
          width: metadata.width || 0,
          height: metadata.height || 0,
          size: stats.size,
          format: metadata.format || 'unknown',
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime,
          isUsed: false, // TODO: Prüfen ob Bild auf Seiten verwendet wird
          pageUsage: [] // TODO: Liste der Seiten wo es verwendet wird
        });
      }

      return images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('[ImageService] Bilder laden fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Einzelnes Bild abrufen
   */
  static async getImage(imageId) {
    try {
      const fileName = decodeURIComponent(imageId);
      const filePath = path.join(IMAGE_DIR, fileName);

      await fs.access(filePath);
      const stats = await fs.stat(filePath);
      const metadata = await sharp(filePath).metadata();

      return {
        id: fileName,
        name: path.basename(fileName),
        url: `/images/${fileName}`,
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: stats.size,
        format: metadata.format || 'unknown',
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('Bild nicht gefunden');
      }
      console.error('[ImageService] Einzelnes Bild laden fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Bild löschen
   */
  static async deleteImage(imageId) {
    try {
      const fileName = decodeURIComponent(imageId);
      const filePath = path.join(IMAGE_DIR, fileName);
      const thumbnailName = `thumb_${fileName}`;
      const thumbnailPath = path.join(THUMBNAIL_DIR, thumbnailName);
      const optimizedPath = path.join(IMAGE_DIR, `optimized_${fileName}`);

      // Alle Versionen löschen
      const deletions = [
        fs.unlink(filePath).catch(() => {}), // ignorieren falls nicht vorhanden
        fs.unlink(thumbnailPath).catch(() => {}),
        fs.unlink(optimizedPath).catch(() => {})
      ];

      await Promise.all(deletions);
      
      console.log(`[ImageService] Bild gelöscht: ${fileName}`);
      return true;
    } catch (error) {
      console.error('[ImageService] Bild löschen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Bildupload verarbeiten (für multipart/form-data)
   */
  static async uploadImage(fileBuffer, originalName, mimetype) {
    try {
      const file = {
        buffer: fileBuffer,
        name: originalName,
        mimetype: mimetype,
        size: fileBuffer.length
      };

      // Validierung
      const validationErrors = this.validateFile(file);
      if (validationErrors.length > 0) {
        const error = new Error('Validierung fehlgeschlagen');
        error.details = validationErrors;
        throw error;
      }

      // Bild verarbeiten
      const result = await this.processAndSaveImage(file);
      
      console.log(`[ImageService] Bild hochgeladen: ${result.original.name}`);
      return {
        success: true,
        image: {
          id: result.original.name,
          name: result.original.name,
          url: result.original.url,
          thumbnailUrl: result.thumbnail.url,
          width: result.original.width,
          height: result.original.height,
          size: result.original.size,
          format: result.original.format
        }
      };

    } catch (error) {
      console.error('[ImageService] Upload fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Zuweisung zu Seite aktualisieren (mockup - würde in echter Implementierung DB nutzen)
   */
  static async updatePageAssignment(imageId, pagePath, action = 'assign') {
    // TODO: In echter Implementierung würde hier die Datenbank aktualisiert
    console.log(`[ImageService] ${action === 'assign' ? 'Zuweisung' : 'Entfernung'}: ${imageId} ${action === 'assign' ? 'zu' : 'von'} ${pagePath}`);
    return true;
  }

  /**
   * Bilder für spezifische Seite abrufen
   */
  static async getImagesForPage(pagePath) {
    // TODO: In echter Implementierung würde hier aus DB gelesen werden
    return [];
  }

  /**
   * Statistiken für Dashboard
   */
  static async getStats() {
    try {
      const images = await this.getAllImages();
      const totalSize = images.reduce((sum, img) => sum + img.size, 0);
      
      // Format-Verteilung
      const formatStats = {};
      images.forEach(img => {
        formatStats[img.format] = (formatStats[img.format] || 0) + 1;
      });

      return {
        totalImages: images.length,
        totalSize: totalSize,
        avgSize: images.length > 0 ? Math.round(totalSize / images.length) : 0,
        formatDistribution: formatStats,
        recentUploads: images.slice(0, 5)
      };
    } catch (error) {
      console.error('[ImageService] Stats fehlgeschlagen:', error);
      throw error;
    }
  }
}

// Initialisierung beim Import
ImageManagementService.initialize().catch(error => {
  console.error('[ImageService] Service-Initialisierung fehlgeschlagen:', error);
});

export default ImageManagementService;