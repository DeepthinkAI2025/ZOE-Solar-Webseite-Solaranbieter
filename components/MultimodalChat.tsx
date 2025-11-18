/**
 * Multimodal Chat Component - Erweiterter KI-Chat mit Datei-Upload
 * Unterstützt Text, Bilder und PDFs mit intelligenter Analyse
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getMultimodalAIService, MultimodalMessage, UploadedFile, FileAnalysis } from '../services/core/MultimodalAIService';
import { getFileProcessingPipeline, ProcessedFile } from '../services/FileProcessingPipeline';
import { ContactFormData } from '../types';

interface MultimodalChatProps {
  onSendMessage: (message: string, files?: UploadedFile[], analyses?: FileAnalysis[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  sessionId?: string;
}

interface FileUploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  disabled?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
}

interface FilePreviewProps {
  files: ProcessedFile[];
  analyses?: FileAnalysis[];
  onRemove: (fileId: string) => void;
  disabled?: boolean;
}

interface TypingIndicatorProps {
  isLoading: boolean;
  message?: string;
}

// File Upload Area Component
const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFilesSelected,
  isUploading,
  disabled = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt', '.csv']
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  }, [disabled, isUploading, onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled || isUploading) return;

    const files = Array.from(e.target.files);
    onFilesSelected(files);

    // Input zurücksetzen
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [disabled, isUploading, onFilesSelected]);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isUploading]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
        ${isDragOver
          ? 'border-green-500 bg-green-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center space-y-3">
        {isUploading ? (
          <>
            <div className="w-12 h-12 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-600">Dateien werden verarbeitet...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Dateien hier ablegen oder klicken zum Auswählen
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Unterstützt: Bilder, PDFs, Dokumente (max. {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// File Preview Component
const FilePreview: React.FC<FilePreviewProps> = ({
  files,
  analyses = [],
  onRemove,
  disabled = false
}) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    if (type === 'application/pdf') {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getAnalysisStatus = (fileId: string) => {
    const analysis = analyses.find(a => a.fileId === fileId);
    if (!analysis) return { status: 'pending', text: 'Wartet auf Analyse' };
    if (analysis.error) return { status: 'error', text: 'Analyse fehlgeschlagen' };
    return { status: 'completed', text: 'Analysiert' };
  };

  if (files.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Hochgeladene Dateien ({files.length})</h4>
      <div className="space-y-2">
        {files.map((file) => {
          const analysisStatus = getAnalysisStatus(file.id);
          return (
            <div
              key={file.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-colors
                ${analysisStatus.status === 'completed' ? 'bg-green-50 border-green-200' :
                  analysisStatus.status === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-white border-gray-200'
                }
              `}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {analysisStatus.text}
                  </p>
                </div>
              </div>

              {!disabled && (
                <button
                  onClick={() => onRemove(file.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Datei entfernen"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div className="flex items-center space-x-3 p-4">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-sm text-gray-600">{message || 'KI denkt nach...'}</span>
    </div>
  );
};

// Main Multimodal Chat Component
const MultimodalChat: React.FC<MultimodalChatProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = 'Ihre Nachricht...',
  className = '',
  sessionId
}) => {
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<ProcessedFile[]>([]);
  const [fileAnalyses, setFileAnalyses] = useState<FileAnalysis[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileProcessing = getFileProcessingPipeline();
  const multimodalService = getMultimodalAIService();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 128;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  // Handle send message
  const handleSend = useCallback(async () => {
    if ((!message.trim() && uploadedFiles.length === 0) || disabled) return;

    try {
      // Konvertiere ProcessedFile zu UploadedFile
      const filesToSend: UploadedFile[] = uploadedFiles.map(file => ({
        id: file.id,
        name: file.originalName,
        type: file.type,
        size: file.size,
        base64: file.base64,
        analysis: fileAnalyses.find(a => a.fileId === file.id)
      }));

      // Nachricht senden
      onSendMessage(message.trim(), filesToSend, fileAnalyses);

      // Formular zurücksetzen
      setMessage('');
      setUploadedFiles([]);
      setFileAnalyses([]);
      setShowFileUpload(false);
      setUploadError(null);

    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      setUploadError('Nachricht konnte nicht gesendet werden.');
    }
  }, [message, uploadedFiles, fileAnalyses, disabled, onSendMessage]);

  // Handle file selection
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (disabled || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await fileProcessing.processFiles(files);

      if (result.success) {
        setUploadedFiles(prev => [...prev, ...result.processedFiles]);

        // Analysiere Dateien direkt
        if (result.processedFiles.length > 0) {
          setIsAnalyzing(true);
          try {
            // Hier könnten wir die Analyse direkt anstoßen
            // Für jetzt fügen wir die Dateien hinzu
            console.log('Dateien erfolgreich verarbeitet:', result.processedFiles);
          } catch (analysisError) {
            console.error('Fehler bei der Dateianalyse:', analysisError);
          } finally {
            setIsAnalyzing(false);
          }
        }
      } else {
        setUploadError(result.errors.join(' '));
      }
    } catch (error) {
      console.error('Fehler bei der Dateiverarbeitung:', error);
      setUploadError('Dateien konnten nicht verarbeitet werden.');
    } finally {
      setIsUploading(false);
    }
  }, [disabled, fileProcessing]);

  // Remove file
  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setFileAnalyses(prev => prev.filter(a => a.fileId !== fileId));
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowFileUpload(false);
    }
  }, [handleSend]);

  const totalFilesSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
  const isSendDisabled = disabled || isLoading || (!message.trim() && uploadedFiles.length === 0);

  return (
    <div className={`border border-gray-200 rounded-xl bg-white ${className}`}>
      {/* File Preview */}
      {uploadedFiles.length > 0 && (
        <div className="p-3 border-b border-gray-200">
          <FilePreview
            files={uploadedFiles}
            analyses={fileAnalyses}
            onRemove={handleRemoveFile}
            disabled={isLoading}
          />
          <div className="text-xs text-gray-500 mt-2">
            Gesamtgröße: {(totalFilesSize / 1024 / 1024).toFixed(1)} MB
          </div>
        </div>
      )}

      {/* File Upload Area */}
      {showFileUpload && (
        <div className="p-3 border-b border-gray-200">
          <FileUploadArea
            onFilesSelected={handleFilesSelected}
            isUploading={isUploading}
            disabled={disabled || isLoading}
          />
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{uploadError}</p>
          <button
            onClick={() => setUploadError(null)}
            className="mt-1 text-xs text-red-500 hover:text-red-700 underline"
          >
            Schließen
          </button>
        </div>
      )}

      {/* Typing Indicator */}
      <TypingIndicator isLoading={isAnalyzing} message="Dateien werden analysiert..." />

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-end space-x-3">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => setShowFileUpload(!showFileUpload)}
            disabled={disabled || isLoading}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Dateien hochladen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Text Input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ maxHeight: '128px' }}
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={isSendDisabled}
            className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* Hints */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div>
            {uploadedFiles.length > 0 && (
              <span className="text-green-600 font-medium">
                {uploadedFiles.length} Datei{uploadedFiles.length > 1 ? 'en' : ''} ausgewählt
              </span>
            )}
          </div>
          <div>
            <span className="hidden sm:inline">Enter zum Senden, Shift+Enter für neue Zeile</span>
            <span className="sm:hidden">Enter zum Senden</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultimodalChat;