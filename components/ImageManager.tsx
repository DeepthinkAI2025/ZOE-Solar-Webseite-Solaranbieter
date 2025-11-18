import React, { useCallback, useEffect, useState } from 'react';
import {
  PhotoIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ImageData {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  format: string;
  createdAt: string;
  modifiedAt: string;
  isUsed: boolean;
  pageUsage: string[];
}

interface ImageStats {
  totalImages: number;
  totalSize: number;
  avgSize: number;
  formatDistribution: Record<string, number>;
  recentUploads: ImageData[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ImageManagerProps {
  onClose: () => void;
  onImageSelect?: (imageUrl: string) => void;
  allowSelection?: boolean;
}

const ImageManager: React.FC<ImageManagerProps> = ({ 
  onClose, 
  onImageSelect, 
  allowSelection = false 
}) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 20;

  // API Helper
  const apiCall = useCallback(async (path: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(path, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, []);

  // Bilder laden
  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedFormat && { format: selectedFormat })
      });

      const data = await apiCall(`/api/admin/images?${params}`);
      
      if (data.success) {
        setImages(data.data.images);
        setPagination(data.data.pagination);
      } else {
        throw new Error('Bilder konnten nicht geladen werden');
      }
    } catch (error) {
      console.error('Bilder laden fehlgeschlagen:', error);
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [apiCall, currentPage, searchTerm, selectedFormat]);

  // Statistiken laden
  const loadStats = useCallback(async () => {
    try {
      const data = await apiCall('/api/admin/images/stats');
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Stats laden fehlgeschlagen:', error);
    }
  }, [apiCall]);

  // Bildupload
  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setError(null);

      const response = await fetch('/api/admin/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload fehlgeschlagen (${response.status})`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Aktualisiere Bilder und Statistiken
        await loadImages();
        await loadStats();
      }
      
      // Reset File Input
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload fehlgeschlagen:', error);
      setError(error instanceof Error ? error.message : 'Upload fehlgeschlagen');
    } finally {
      setUploading(false);
    }
  }, [loadImages, loadStats]);

  // Bild löschen
  const handleDelete = useCallback(async (imageId: string) => {
    try {
      setError(null);
      await apiCall(`/api/admin/images/${imageId}`, { method: 'DELETE' });
      
      // Aktualisiere die Liste
      await loadImages();
      await loadStats();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Löschen fehlgeschlagen:', error);
      setError(error instanceof Error ? error.message : 'Löschen fehlgeschlagen');
    }
  }, [apiCall, loadImages, loadStats]);

  // Format Bytes
  const formatBytes = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Suche debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadImages();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedFormat, loadImages]);

  // Initial laden
  useEffect(() => {
    loadImages();
    loadStats();
  }, [loadImages, loadStats]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <PhotoIcon className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bildverwaltung</h2>
              <p className="text-gray-600">
                {stats ? `${stats.totalImages} Bilder, ${formatBytes(stats.totalSize)}` : 'Lade...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Upload Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors cursor-pointer">
                <ArrowUpTrayIcon className="h-5 w-5" />
                <span>{uploading ? 'Lädt hoch...' : 'Bild hochladen'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              
              {error && (
                <div className="text-red-600 text-sm font-medium">
                  Fehler: {error}
                </div>
              )}
            </div>

            {/* Stats */}
            {stats && (
              <div className="text-sm text-gray-600">
                Durchschnitt: {formatBytes(stats.avgSize)}
              </div>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Bilder durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Alle Formate</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="gif">GIF</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <PhotoIcon className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Keine Bilder gefunden</p>
              <p className="text-sm">
                {searchTerm || selectedFormat 
                  ? 'Versuchen Sie andere Suchkriterien'
                  : 'Laden Sie Ihr erstes Bild hoch'
                }
              </p>
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className={`group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                      allowSelection ? 'cursor-pointer' : ''
                    } ${selectedImage?.id === image.id ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => {
                      if (allowSelection) {
                        setSelectedImage(image);
                        if (onImageSelect) {
                          onImageSelect(image.url);
                        }
                      }
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square rounded-t-xl overflow-hidden bg-gray-100">
                      <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {image.width}×{image.height} • {formatBytes(image.size)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(image.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image);
                          }}
                          className="p-1.5 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
                          title="Details anzeigen"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(image.id);
                          }}
                          className="p-1.5 bg-red-500 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-colors"
                          title="Bild löschen"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Usage indicator */}
                    {image.isUsed && (
                      <div className="absolute bottom-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktiv
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Seite {pagination.page} von {pagination.pages} • {pagination.total} Bilder
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Zurück
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Weiter
              </button>
            </div>
          </div>
        )}

        {/* Image Detail Modal */}
        {selectedImage && !allowSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedImage.name}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="w-full max-h-96 object-contain rounded-xl mb-6"
                />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Größe</p>
                    <p className="text-gray-600">{selectedImage.width} × {selectedImage.height}px</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Dateigröße</p>
                    <p className="text-gray-600">{formatBytes(selectedImage.size)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Format</p>
                    <p className="text-gray-600">{selectedImage.format.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Hochgeladen</p>
                    <p className="text-gray-600">
                      {new Date(selectedImage.createdAt).toLocaleString('de-DE')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (onImageSelect && allowSelection) {
                        onImageSelect(selectedImage.url);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    {onImageSelect && allowSelection ? 'Auswählen' : 'URL kopieren'}
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.origin + selectedImage.url);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Link kopieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Bild löschen?</h3>
              <p className="text-gray-600 mb-6">
                Diese Aktion kann nicht rückgängig gemacht werden. Das Bild wird dauerhaft von der Webseite entfernt.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;