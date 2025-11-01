import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { AuthService } from './authService.js';
import { geminiClient } from './geminiClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Datenpfade
const dataDir = path.join(__dirname, '../data');
const knowledgeBasePath = path.join(dataDir, 'knowledgeBase.ts');
const documentsPath = path.join(__dirname, '../storage/documents');

// Unterstützte Dokumentformate
const SUPPORTED_FORMATS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Knowledge-Base-Service
 * 
 * Funktionen:
 * - Dokument-Upload und -Verarbeitung
 * - KI-gestützte Inhaltsanalyse
 * - Volltextsuche
 * - Kategorisierung und Tagging
 * - Versionierung
 */
class KnowledgeBaseService {
  
  /**
   * Verzeichnis initialisieren
   */
  static async initialize() {
    try {
      await fs.mkdir(documentsPath, { recursive: true });
      console.log('[KBService] Dokumente-Verzeichnis initialisiert');
    } catch (error) {
      console.error('[KBService] Verzeichnis-Initialisierung fehlgeschlagen:', error);
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
      errors.push(`Nicht unterstütztes Format: ${file.mimetype}`);
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
   * Dokument hochladen und verarbeiten
   */
  static async uploadDocument(file, metadata = {}) {
    try {
      const validationErrors = this.validateFile(file);
      if (validationErrors.length > 0) {
        const error = new Error('Validierung fehlgeschlagen');
        error.details = validationErrors;
        throw error;
      }

      const fileName = this.generateFileName(file.name);
      const filePath = path.join(documentsPath, fileName);

      // Datei speichern
      await fs.writeFile(filePath, file.buffer);

      // Metadaten erstellen
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const documentData = {
        id: documentId,
        name: file.name,
        fileName: fileName,
        originalName: file.name,
        path: filePath,
        size: file.size,
        mimeType: file.mimetype,
        uploadDate: new Date().toISOString(),
        status: 'processing', // 'processing', 'completed', 'failed'
        metadata: {
          title: metadata.title || file.name,
          description: metadata.description || '',
          category: metadata.category || 'Allgemein',
          tags: Array.isArray(metadata.tags) ? metadata.tags : [],
          author: metadata.author || 'Unbekannt',
          language: metadata.language || 'de'
        },
        aiAnalysis: null,
        extractedText: null,
        summary: null,
        keywords: [],
        language: metadata.language || 'de',
        version: '1.0',
        lastModified: new Date().toISOString(),
        downloads: 0,
        isActive: true
      };

      // In Knowledge-Base hinzufügen
      await this.addDocument(documentData);

      // Asynchrone KI-Analyse starten
      this.analyzeDocument(documentData).catch(error => {
        console.error('[KBService] KI-Analyse fehlgeschlagen:', error);
        this.updateDocumentStatus(documentId, 'failed', error.message);
      });

      console.log(`[KBService] Dokument hochgeladen: ${file.name}`);
      
      return {
        success: true,
        message: 'Dokument erfolgreich hochgeladen und wird verarbeitet',
        document: documentData
      };

    } catch (error) {
      console.error('[KBService] Upload fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Dokument zur Knowledge-Base hinzufügen
   */
  static async addDocument(documentData) {
    try {
      let content;
      try {
        content = await fs.readFile(knowledgeBasePath, 'utf-8');
      } catch (error) {
        // Datei existiert nicht - neu erstellen
        content = 'export const knowledgeBase: KnowledgeBaseDocument[] = [];';
      }

      const kbMatch = content.match(/export const knowledgeBase: KnowledgeBaseDocument\[\] = \[([\s\S]*?)\];/);

      let documents = [];
      if (kbMatch) {
        documents = JSON.parse('[' + kbMatch[1] + ']');
      }

      documents.push(documentData);

      const newContent = content.replace(
        /export const knowledgeBase: KnowledgeBaseDocument\[\] = \[([\s\S]*?)\];/,
        `export const knowledgeBase: KnowledgeBaseDocument[] = ${JSON.stringify(documents, null, 2)};`
      );

      await fs.writeFile(knowledgeBasePath, newContent, 'utf-8');

    } catch (error) {
      console.error('[KBService] Dokument hinzufügen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Alle Dokumente abrufen
   */
  static async getAllDocuments(filters = {}) {
    try {
      let content;
      try {
        content = await fs.readFile(knowledgeBasePath, 'utf-8');
      } catch (error) {
        return [];
      }

      const kbMatch = content.match(/export const knowledgeBase: KnowledgeBaseDocument\[\] = \[([\s\S]*?)\];/);

      if (!kbMatch) {
        return [];
      }

      let documents = JSON.parse('[' + kbMatch[1] + ']');

      // Filter anwenden
      if (filters.category) {
        documents = documents.filter(doc => doc.metadata.category === filters.category);
      }

      if (filters.tags && filters.tags.length > 0) {
        documents = documents.filter(doc => 
          filters.tags.some(tag => doc.metadata.tags.includes(tag))
        );
      }

      if (filters.status) {
        documents = documents.filter(doc => doc.status === filters.status);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        documents = documents.filter(doc => 
          doc.metadata.title.toLowerCase().includes(searchTerm) ||
          doc.metadata.description.toLowerCase().includes(searchTerm) ||
          doc.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Sortieren (neueste zuerst)
      documents.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

      return documents;
    } catch (error) {
      console.error('[KBService] Dokumente laden fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Einzelnes Dokument abrufen
   */
  static async getDocument(documentId) {
    try {
      const documents = await this.getAllDocuments();
      return documents.find(doc => doc.id === documentId) || null;
    } catch (error) {
      console.error('[KBService] Einzelnes Dokument laden fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Dokument aktualisieren
   */
  static async updateDocument(documentId, updates) {
    try {
      const content = await fs.readFile(knowledgeBasePath, 'utf-8');
      const kbMatch = content.match(/export const knowledgeBase: KnowledgeBaseDocument\[\] = \[([\s\S]*?)\];/);

      if (!kbMatch) {
        throw new Error('Knowledge Base nicht gefunden');
      }

      let documents = JSON.parse('[' + kbMatch[1] + ']');
      const index = documents.findIndex(doc => doc.id === documentId);

      if (index === -1) {
        throw new Error('Dokument nicht gefunden');
      }

      const updatedDocument = {
        ...documents[index],
        ...updates,
        lastModified: new Date().toISOString()
      };

      documents[index] = updatedDocument;

      const newContent = content.replace(
        /export const knowledgeBase: KnowledgeBaseDocument\[\] = \[([\s\S]*?)\];/,
        `export const knowledgeBase: KnowledgeBaseDocument[] = ${JSON.stringify(documents, null, 2)};`
      );

      await fs.writeFile(knowledgeBasePath, newContent, 'utf-8');

      console.log(`[KBService] Dokument aktualisiert: ${documentId}`);
      
      return {
        success: true,
        message: 'Dokument erfolgreich aktualisiert',
        document: updatedDocument
      };

    } catch (error) {
      console.error('[KBService] Update fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Dokument löschen
   */
  static async deleteDocument(documentId) {
    try {
      const content = await fs.readFile(knowledgeBasePath, 'utf-8');
      const kbMatch = content.match(/export const knowledgeBase: KnowledgeBaseDocument\[\] = \[([\s\S]*?)\];/);

      if (!kbMatch) {
        throw new Error('Knowledge Base nicht gefunden');
      }

      let documents = JSON.parse('[' + kbMatch[1] + ']');
      const index = documents.findIndex(doc => doc.id === documentId);

      if (index === -1) {
        throw new Error('Dokument nicht gefunden');
      }

      const deletedDocument = documents.splice(index, 1)[0];

      // Physische Datei löschen
      try {
        await fs.unlink(deletedDocument.path);
      } catch (error) {
        console.warn('[KBService] Physische Datei konnte nicht gelöscht werden:', error.message);
      }

      const newContent = content.replace(
        /export const knowledgeBase: KnowledgeBaseDocument\[\] = \[([\s\S]*?)\];/,
        `export const knowledgeBase: KnowledgeBaseDocument[] = ${JSON.stringify(documents, null, 2)};`
      );

      await fs.writeFile(knowledgeBasePath, newContent, 'utf-8');

      console.log(`[KBService] Dokument gelöscht: ${documentId}`);
      
      return {
        success: true,
        message: 'Dokument erfolgreich gelöscht',
        document: deletedDocument
      };

    } catch (error) {
      console.error('[KBService] Löschen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Dokument mit KI analysieren
   */
  static async analyzeDocument(document) {
    try {
      console.log(`[KBService] Starte KI-Analyse für: ${document.name}`);
      
      // Status auf 'processing' setzen
      await this.updateDocumentStatus(document.id, 'processing');

      // Hier würde normalerweise die echte Dokumentverarbeitung stattfinden
      // Für diese Demo simulieren wir die KI-Analyse
      
      const aiAnalysis = {
        summary: `KI-Analyse für "${document.metadata.title}" - Dieses Dokument enthält relevante Informationen zu ${document.metadata.category}.`,
        keyPoints: [
          'Wichtiger Punkt 1 aus dem Dokument',
          'Wichtiger Punkt 2 aus dem Dokument', 
          'Wichtiger Punkt 3 aus dem Dokument'
        ],
        keywords: [...document.metadata.tags, document.metadata.category, 'Solarenergie', 'Nachhaltigkeit'],
        sentiment: 'neutral',
        readability: 'gut',
        topics: [document.metadata.category, 'Technologie', 'Energie'],
        language: document.language,
        extractedText: 'Simulierter extrahierter Text aus dem Dokument...',
        entities: ['ZOE Solar', 'Photovoltaik', 'Solarenergie', 'Deutschland'],
        aiRecommendations: [
          'Das Dokument ist gut strukturiert und informativ',
          'Empfehlung: Weitere Verlinkung zu verwandten Themen',
          'Perfekt für Kunden-FAQ geeignet'
        ]
      };

      // Dokument mit AI-Analyse aktualisieren
      await this.updateDocument(document.id, {
        status: 'completed',
        aiAnalysis: aiAnalysis,
        summary: aiAnalysis.summary,
        keywords: aiAnalysis.keywords,
        extractedText: aiAnalysis.extractedText
      });

      console.log(`[KBService] KI-Analyse abgeschlossen für: ${document.name}`);
      
      return aiAnalysis;

    } catch (error) {
      console.error('[KBService] KI-Analyse fehlgeschlagen:', error);
      await this.updateDocumentStatus(document.id, 'failed', error.message);
      throw error;
    }
  }

  /**
   * Dokument-Status aktualisieren
   */
  static async updateDocumentStatus(documentId, status, errorMessage = null) {
    try {
      await this.updateDocument(documentId, { 
        status,
        ...(errorMessage && { aiAnalysis: { ...{}, error: errorMessage } })
      });
    } catch (error) {
      console.error('[KBService] Status-Update fehlgeschlagen:', error);
    }
  }

  /**
   * Kategorien abrufen
   */
  static async getCategories() {
    try {
      const documents = await this.getAllDocuments();
      const categories = [...new Set(documents.map(doc => doc.metadata.category))];
      return categories.sort();
    } catch (error) {
      console.error('[KBService] Kategorien laden fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Alle Tags abrufen
   */
  static async getTags() {
    try {
      const documents = await this.getAllDocuments();
      const allTags = documents.flatMap(doc => doc.metadata.tags);
      return [...new Set(allTags)].sort();
    } catch (error) {
      console.error('[KBService] Tags laden fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Suche in der Knowledge Base
   */
  static async searchDocuments(query, filters = {}) {
    try {
      const documents = await this.getAllDocuments({ ...filters, search: query });
      
      const results = documents.map(doc => {
        let relevanceScore = 0;
        
        // Titel-Match
        if (doc.metadata.title.toLowerCase().includes(query.toLowerCase())) {
          relevanceScore += 10;
        }
        
        // Tag-Matches
        doc.metadata.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 5;
          }
        });
        
        // AI-Analyse Matches
        if (doc.aiAnalysis) {
          if (doc.aiAnalysis.summary?.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 3;
          }
          if (doc.aiAnalysis.keywords?.some(kw => kw.toLowerCase().includes(query.toLowerCase()))) {
            relevanceScore += 2;
          }
        }
        
        return { ...doc, relevanceScore };
      });
      
      // Nach Relevanz sortieren
      return results
        .filter(doc => doc.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
        
    } catch (error) {
      console.error('[KBService] Suche fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Statistiken für Dashboard
   */
  static async getStats() {
    try {
      const documents = await this.getAllDocuments();
      const categories = await this.getCategories();
      const tags = await this.getTags();
      
      const stats = {
        totalDocuments: documents.length,
        activeDocuments: documents.filter(doc => doc.isActive).length,
        processingDocuments: documents.filter(doc => doc.status === 'processing').length,
        completedDocuments: documents.filter(doc => doc.status === 'completed').length,
        failedDocuments: documents.filter(doc => doc.status === 'failed').length,
        totalSize: documents.reduce((sum, doc) => sum + doc.size, 0),
        categories: categories.length,
        tags: tags.length,
        recentUploads: documents
          .filter(doc => {
            const uploadDate = new Date(doc.uploadDate);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return uploadDate > weekAgo;
          })
          .length,
        mostUsedCategories: this.getMostUsedCategories(documents),
        popularTags: tags.slice(0, 10)
      };
      
      return stats;
    } catch (error) {
      console.error('[KBService] Stats fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Meist verwendete Kategorien
   */
  static getMostUsedCategories(documents) {
    const categoryCounts = {};
    
    documents.forEach(doc => {
      categoryCounts[doc.metadata.category] = (categoryCounts[doc.metadata.category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  }
}

// Initialisierung beim Import
KnowledgeBaseService.initialize().catch(error => {
  console.error('[KBService] Service-Initialisierung fehlgeschlagen:', error);
});

export default KnowledgeBaseService;