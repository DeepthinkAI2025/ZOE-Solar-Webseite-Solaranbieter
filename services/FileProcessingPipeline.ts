/**
 * File Processing Pipeline - Sichere Verarbeitung von Datei-Uploads
 * Validiert, komprimiert und bereitet Dateien für die KI-Analyse vor
 */

export interface FileProcessingOptions {
  maxFileSize: number; // in bytes
  maxTotalSize: number; // in bytes
  allowedTypes: string[];
  compressionQuality: number; // 0.1 - 1.0
  maxFiles: number;
}

export interface ProcessedFile {
  id: string;
  originalName: string;
  type: string;
  size: number;
  compressedSize?: number;
  base64: string;
  metadata: {
    uploadTime: Date;
    dimensions?: { width: number; height: number };
    pageCount?: number;
    originalFormat: string;
  };
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export interface ProcessingResult {
  success: boolean;
  processedFiles: ProcessedFile[];
  totalOriginalSize: number;
  totalCompressedSize: number;
  errors: string[];
  warnings: string[];
  processingTime: number;
}

class FileProcessingPipeline {
  private defaultOptions: FileProcessingOptions = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxTotalSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ],
    compressionQuality: 0.8,
    maxFiles: 5
  };

  private compressionCache = new Map<string, string>();

  /**
   * Verarbeitet eine Liste von Dateien mit Validierung und Kompression
   */
  async processFiles(
    files: File[],
    options?: Partial<FileProcessingOptions>
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const config = { ...this.defaultOptions, ...options };

    const result: ProcessingResult = {
      success: false,
      processedFiles: [],
      totalOriginalSize: 0,
      totalCompressedSize: 0,
      errors: [],
      warnings: [],
      processingTime: 0
    };

    try {
      // Vorab-Validierungen
      this.validateFileList(files, config, result);

      if (result.errors.length > 0) {
        result.processingTime = Date.now() - startTime;
        return result;
      }

      // Dateien einzeln verarbeiten
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const processedFile = await this.processSingleFile(file, config, i);
          result.processedFiles.push(processedFile);
          result.totalOriginalSize += file.size;
          result.totalCompressedSize += processedFile.compressedSize || file.size;
        } catch (error) {
          const errorMsg = `Fehler bei der Verarbeitung von "${file.name}": ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`;
          result.errors.push(errorMsg);
          console.error(errorMsg, error);
        }
      }

      // Gesamterfolg bestimmen
      result.success = result.processedFiles.length > 0 && result.errors.length === 0;
      result.processingTime = Date.now() - startTime;

      return result;

    } catch (error) {
      result.errors.push(`Allgemeiner Verarbeitungsfehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Validiert eine Liste von Dateien vor der Verarbeitung
   */
  private validateFileList(files: File[], config: FileProcessingOptions, result: ProcessingResult): void {
    // Anzahl der Dateien prüfen
    if (files.length > config.maxFiles) {
      result.errors.push(`Maximal ${config.maxFiles} Dateien erlaubt. Es wurden ${files.length} hochgeladen.`);
    }

    // Gesamtkapazität prüfen
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > config.maxTotalSize) {
      result.errors.push(`Die Gesamtgröße der Dateien (${this.formatFileSize(totalSize)}) überschreitet das Limit von ${this.formatFileSize(config.maxTotalSize)}.`);
    }

    // Einzelne Dateien prüfen
    files.forEach((file, index) => {
      if (file.size > config.maxFileSize) {
        result.errors.push(`Datei "${file.name}" ist zu groß (${this.formatFileSize(file.size)}). Maximal ${this.formatFileSize(config.maxFileSize)} erlaubt.`);
      }

      if (!config.allowedTypes.includes(file.type)) {
        result.errors.push(`Dateityp "${file.type}" der Datei "${file.name}" wird nicht unterstützt.`);
      }

      // Zusätzliche Warnungen
      if (file.size > 5 * 1024 * 1024) { // 5MB
        result.warnings.push(`Datei "${file.name}" ist groß. Die Verarbeitung kann einige Zeit dauern.`);
      }
    });
  }

  /**
   * Verarbeitet eine einzelne Datei
   */
  private async processSingleFile(
    file: File,
    config: FileProcessingOptions,
    index: number
  ): Promise<ProcessedFile> {
    const fileId = `file_${Date.now()}_${index}`;
    const processedFile: ProcessedFile = {
      id: fileId,
      originalName: file.name,
      type: file.type,
      size: file.size,
      base64: '',
      metadata: {
        uploadTime: new Date(),
        originalFormat: file.type
      },
      validation: {
        isValid: true,
        errors: [],
        warnings: []
      }
    };

    try {
      // Datei in Base64 umwandeln
      const base64 = await this.fileToBase64(file);
      processedFile.base64 = base64;

      // Metadaten extrahieren
      await this.extractMetadata(processedFile, base64);

      // Kompression durchführen (falls erforderlich)
      if (this.shouldCompress(file)) {
        const compressedBase64 = await this.compressFile(base64, file.type, config.compressionQuality);
        processedFile.base64 = compressedBase64;
        processedFile.compressedSize = this.base64ToSize(compressedBase64);
      }

      return processedFile;

    } catch (error) {
      processedFile.validation.isValid = false;
      processedFile.validation.errors.push(
        `Verarbeitung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
      );
      throw error;
    }
  }

  /**
   * Wandelt eine Datei in Base64 um
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extrahiert Metadaten aus der Datei
   */
  private async extractMetadata(processedFile: ProcessedFile, base64: string): Promise<void> {
    if (processedFile.type.startsWith('image/')) {
      try {
        const dimensions = await this.getImageDimensions(base64);
        processedFile.metadata.dimensions = dimensions;

        if (dimensions.width < 100 || dimensions.height < 100) {
          processedFile.validation.warnings.push('Das Bild ist sehr klein und möglicherweise nicht für die Analyse geeignet.');
        }
      } catch (error) {
        processedFile.validation.warnings.push('Konnte Bild-Dimensionen nicht extrahieren.');
      }
    }

    if (processedFile.type === 'application/pdf') {
      try {
        const pageCount = await this.getPDFPageCount(base64);
        processedFile.metadata.pageCount = pageCount;

        if (pageCount > 10) {
          processedFile.validation.warnings.push(`Das PDF hat ${pageCount} Seiten. Nur die ersten Seiten werden analysiert.`);
        }
      } catch (error) {
        processedFile.validation.warnings.push('Konnte PDF-Seitenanzahl nicht ermitteln.');
      }
    }
  }

  /**
   * Ermittelt die Dimensionen eines Bildes
   */
  private getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => reject(new Error('Konnte Bild nicht laden'));
      img.src = base64;
    });
  }

  /**
   * Ermittelt die Anzahl der Seiten in einem PDF (vereinfachte Implementierung)
   */
  private async getPDFPageCount(base64: string): Promise<number> {
    // Dies ist eine vereinfachte Implementierung
    // In einer echten Anwendung würde man hier eine PDF-Bibliothek wie pdf.js verwenden
    const pdfData = atob(base64.split(',')[1]);
    const pageCount = (pdfData.match(/\/Type\s*\/Page[^s]/g) || []).length;
    return Math.max(1, pageCount);
  }

  /**
   * Prüft, ob eine Datei komprimiert werden sollte
   */
  private shouldCompress(file: File): boolean {
    return file.type.startsWith('image/') && file.size > 1024 * 1024; // Bilder > 1MB
  }

  /**
   * Komprimiert eine Bilddatei
   */
  private async compressFile(base64: string, mimeType: string, quality: number): Promise<string> {
    // Cache-Prüfung
    const cacheKey = `${base64.substring(0, 100)}_${quality}`;
    if (this.compressionCache.has(cacheKey)) {
      return this.compressionCache.get(cacheKey)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Konnte Canvas-Kontext nicht erstellen'));
          return;
        }

        // Neue Berechnung der Größe (max 1920x1920)
        const maxSize = 1920;
        let { width, height } = img;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Bild mit neuer Qualität zeichnen
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL(mimeType, quality);

        // Cache aktualisieren
        this.compressionCache.set(cacheKey, compressedBase64);

        // Cache-Limit
        if (this.compressionCache.size > 50) {
          const firstKey = this.compressionCache.keys().next().value;
          this.compressionCache.delete(firstKey);
        }

        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error('Konnte Bild für Kompression nicht laden'));
      img.src = base64;
    });
  }

  /**
   * Konvertiert Base64 zu ungefährer Dateigröße
   */
  private base64ToSize(base64: string): number {
    const base64Data = base64.split(',')[1] || base64;
    return Math.round(base64Data.length * 0.75); // Base64 ist ca. 33% größer als Original
  }

  /**
   * Formatiert Dateigröße für die Anzeige
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validiert eine einzelne Datei
   */
  async validateFile(file: File, options?: Partial<FileProcessingOptions>): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const config = { ...this.defaultOptions, ...options };
    const result = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[]
    };

    // Dateigröße prüfen
    if (file.size > config.maxFileSize) {
      result.errors.push(`Datei ist zu groß (${this.formatFileSize(file.size)}). Maximal ${this.formatFileSize(config.maxFileSize)} erlaubt.`);
      result.isValid = false;
    }

    // Dateityp prüfen
    if (!config.allowedTypes.includes(file.type)) {
      result.errors.push(`Dateityp "${file.type}" wird nicht unterstützt.`);
      result.isValid = false;
    }

    // Zusätzliche Prüfungen
    if (file.size === 0) {
      result.errors.push('Datei ist leer.');
      result.isValid = false;
    }

    if (file.name.length > 255) {
      result.warnings.push('Dateiname ist sehr lang.');
    }

    return result;
  }

  /**
   * Bereinigt den Kompressions-Cache
   */
  clearCache(): void {
    this.compressionCache.clear();
  }

  /**
   * Gibt Cache-Statistiken zurück
   */
  getCacheStats(): {
    size: number;
    estimatedMemoryUsage: number;
  } {
    let totalSize = 0;
    for (const base64 of this.compressionCache.values()) {
      totalSize += this.base64ToSize(base64);
    }

    return {
      size: this.compressionCache.size,
      estimatedMemoryUsage: totalSize
    };
  }
}

// Singleton Instanz
let fileProcessingPipeline: FileProcessingPipeline | null = null;

export function getFileProcessingPipeline(): FileProcessingPipeline {
  if (!fileProcessingPipeline) {
    fileProcessingPipeline = new FileProcessingPipeline();
  }
  return fileProcessingPipeline;
}

export default FileProcessingPipeline;