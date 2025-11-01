import React, { useCallback, useEffect, useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ScheduledPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  featuredImage: string;
  scheduledDate: string;
  publishStatus: 'scheduled' | 'published' | 'draft' | 'cancelled';
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  notificationsSent: boolean;
  error: string | null;
}

interface SchedulingStats {
  totalScheduled: number;
  pending: number;
  published: number;
  drafts: number;
  cancelled: number;
  error: number;
  nextPublication: ScheduledPost | null;
  thisWeek: number;
  thisMonth: number;
}

interface BlogSchedulerProps {
  onClose: () => void;
}

const BlogScheduler: React.FC<BlogSchedulerProps> = ({ onClose }) => {
  const [schedules, setSchedules] = useState<ScheduledPost[]>([]);
  const [stats, setStats] = useState<SchedulingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledPost | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Allgemein',
    tags: '',
    author: 'Admin',
    featuredImage: '',
    scheduledDate: '',
    metaTitle: '',
    metaDescription: '',
    seoKeywords: ''
  });

  // API Helper
  const apiCall = useCallback(async (path: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(path, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }, []);

  // Schedules laden
  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/api/admin/scheduling');
      
      if (data.success) {
        setSchedules(data.data.schedules);
      } else {
        throw new Error('Schedules konnten nicht geladen werden');
      }
    } catch (error) {
      console.error('Schedules laden fehlgeschlagen:', error);
      setError(error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Stats laden
  const loadStats = useCallback(async () => {
    try {
      const data = await apiCall('/api/admin/scheduling/stats');
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Stats laden fehlgeschlagen:', error);
    }
  }, [apiCall]);

  // Form zurücksetzen
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: 'Allgemein',
      tags: '',
      author: 'Admin',
      featuredImage: '',
      scheduledDate: '',
      metaTitle: '',
      metaDescription: '',
      seoKeywords: ''
    });
    setEditingSchedule(null);
    setShowForm(false);
  };

  // Form mit Daten füllen für Bearbeitung
  const fillForm = (schedule: ScheduledPost) => {
    setFormData({
      title: schedule.title,
      slug: schedule.slug,
      content: schedule.content,
      excerpt: schedule.excerpt,
      category: schedule.category,
      tags: schedule.tags.join(', '),
      author: schedule.author,
      featuredImage: schedule.featuredImage,
      scheduledDate: new Date(schedule.scheduledDate).toISOString().slice(0, 16),
      metaTitle: schedule.metaTitle,
      metaDescription: schedule.metaDescription,
      seoKeywords: schedule.seoKeywords.join(', ')
    });
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  // Schedule speichern
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.scheduledDate) {
      setError('Titel, Inhalt und Datum sind erforderlich');
      return;
    }

    try {
      setError(null);
      
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || formData.title.trim().toLowerCase().replace(/\s+/g, '-'),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: formData.author,
        featuredImage: formData.featuredImage,
        scheduledDate: formData.scheduledDate,
        metaTitle: formData.metaTitle || formData.title.trim(),
        metaDescription: formData.metaDescription || formData.excerpt.trim(),
        seoKeywords: formData.seoKeywords.split(',').map(kw => kw.trim()).filter(kw => kw)
      };

      if (editingSchedule) {
        await apiCall(`/api/admin/scheduling/${editingSchedule.id}`, {
          method: 'PUT',
          body: JSON.stringify(postData)
        });
      } else {
        await apiCall('/api/admin/scheduling', {
          method: 'POST',
          body: JSON.stringify(postData)
        });
      }

      resetForm();
      await loadSchedules();
      await loadStats();

    } catch (error) {
      console.error('Speichern fehlgeschlagen:', error);
      setError(error instanceof Error ? error.message : 'Speichern fehlgeschlagen');
    }
  }, [formData, editingSchedule, apiCall, loadSchedules, loadStats]);

  // Schedule löschen
  const handleDelete = useCallback(async (scheduleId: string) => {
    if (!confirm('Möchten Sie diesen geplanten Beitrag wirklich löschen?')) {
      return;
    }

    try {
      setError(null);
      await apiCall(`/api/admin/scheduling/${scheduleId}`, {
        method: 'DELETE'
      });
      
      await loadSchedules();
      await loadStats();
    } catch (error) {
      console.error('Löschen fehlgeschlagen:', error);
      setError(error instanceof Error ? error.message : 'Löschen fehlgeschlagen');
    }
  }, [apiCall, loadSchedules, loadStats]);

  // Beitrag sofort veröffentlichen
  const handlePublishNow = useCallback(async (scheduleId: string) => {
    try {
      setPublishing(scheduleId);
      setError(null);
      
      await apiCall(`/api/admin/scheduling/${scheduleId}/publish`, {
        method: 'POST',
        body: JSON.stringify({ force: true })
      });
      
      await loadSchedules();
      await loadStats();
    } catch (error) {
      console.error('Veröffentlichung fehlgeschlagen:', error);
      setError(error instanceof Error ? error.message : 'Veröffentlichung fehlgeschlagen');
    } finally {
      setPublishing(null);
    }
  }, [apiCall, loadSchedules, loadStats]);

  // Status-Badges
  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  // Status-Icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format Datum
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    loadSchedules();
    loadStats();
  }, [loadSchedules, loadStats]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <CalendarDaysIcon className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Blog-Beitragsplanung</h2>
              <p className="text-gray-600">
                {stats ? `${stats.pending} ausstehend • ${stats.published} veröffentlicht` : 'Lade...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Neuer Beitrag
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Ausstehend</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Veröffentlicht</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Entwürfe</p>
                <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Diese Woche</p>
                <p className="text-2xl font-bold text-purple-600">{stats.thisWeek}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Diesen Monat</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.thisMonth}</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Fehler</p>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
              </div>
            </div>
            {stats.nextPublication && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Nächste Veröffentlichung:</p>
                <p className="text-blue-900 font-semibold">{stats.nextPublication.title}</p>
                <p className="text-blue-700 text-sm">{formatDate(stats.nextPublication.scheduledDate)}</p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              {schedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <CalendarDaysIcon className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Keine geplanten Beiträge</p>
                  <p className="text-sm">Erstellen Sie Ihren ersten geplanten Beitrag</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(schedule.publishStatus)}
                            <h3 className="text-lg font-semibold text-gray-900">{schedule.title}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(schedule.publishStatus)}`}>
                              {schedule.publishStatus}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3 line-clamp-2">{schedule.excerpt}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarDaysIcon className="h-4 w-4" />
                              {formatDate(schedule.scheduledDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-4 w-4" />
                              {schedule.category}
                            </div>
                            <div>Autor: {schedule.author}</div>
                          </div>
                          
                          {schedule.error && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-800 text-sm font-medium">Fehler:</p>
                              <p className="text-red-600 text-sm">{schedule.error}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {schedule.publishStatus === 'scheduled' && (
                            <button
                              onClick={() => handlePublishNow(schedule.id)}
                              disabled={publishing === schedule.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Sofort veröffentlichen"
                            >
                              {publishing === schedule.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <PlayIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          
                          <button
                            onClick={() => fillForm(schedule)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Bearbeiten"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Löschen"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingSchedule ? 'Beitrag bearbeiten' : 'Neuen Beitrag planen'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="wird automatisch generiert wenn leer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Allgemein">Allgemein</option>
                      <option value="Technologie">Technologie</option>
                      <option value="Nachhaltigkeit">Nachhaltigkeit</option>
                      <option value="News">News</option>
                      <option value="Tipps">Tipps</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Geplantes Datum *</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inhalt *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (kommagetrennt)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="solar, energie, nachhaltigkeit"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords (kommagetrennt)</label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="photovoltaik, solarenergie, nachhaltig"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    {editingSchedule ? 'Aktualisieren' : 'Planen'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogScheduler;