import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  department: string;
  permissions: string[];
  lastLogin?: string;
  lastSync?: string;
}

interface SyncStatus {
  isRunning: boolean;
  lastSync: string;
  nextSyncIn: number;
  databases: string[];
}

interface VercelStatus {
  notionCredentials: number;
  vercelEnvVars: number;
  lastSync: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'error';
}

const UserManagementDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [vercelStatus, setVercelStatus] = useState<VercelStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingVercel, setSyncingVercel] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'sync' | 'vercel'>('overview');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Mock user data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@zoe-solar.de',
      name: 'System Administrator',
      role: 'Super Admin',
      status: 'Aktiv',
      department: 'Management',
      permissions: ['Alle Berechtigungen'],
      lastLogin: new Date().toISOString(),
      lastSync: new Date().toISOString()
    },
    {
      id: '2',
      email: 'marketing@zoe-solar.de',
      name: 'Marketing Manager',
      role: 'Marketing Manager',
      status: 'Aktiv',
      department: 'Marketing',
      permissions: ['Marketing verwalten', 'Newsletter verwalten', 'Analysen einsehen'],
      lastSync: new Date().toISOString()
    },
    {
      id: '3',
      email: 'dev@zoe-solar.de',
      name: 'Developer',
      role: 'Content Editor',
      status: 'Aktiv',
      department: 'IT',
      permissions: ['Inhalte bearbeiten', 'Nur Lesen'],
      lastSync: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Simulate loading users
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    // Simulate sync status
    setSyncStatus({
      isRunning: true,
      lastSync: new Date().toISOString(),
      nextSyncIn: 180000, // 3 minutes
      databases: ['Users Management', 'Credentials Management', 'Environment Sync']
    });

    // Initialize Vercel status
    fetchVercelStatus();

    // Simulate periodic sync updates
    const interval = setInterval(() => {
      setSyncStatus(prev => ({
        ...prev!,
        lastSync: new Date().toISOString(),
        nextSyncIn: 180000
      }));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email || '',
        name: userData.name || '',
        role: userData.role || 'Viewer',
        status: userData.status || 'Aktiv',
        department: userData.department || 'Management',
        permissions: userData.permissions || ['Nur Lesen'],
        lastSync: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      setShowCreateUser(false);
      showNotification('success', `Benutzer ${newUser.email} wurde erfolgreich erstellt`);
    } catch (error) {
      showNotification('error', 'Fehler beim Erstellen des Benutzers');
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.map(user =>
        user.id === editingUser?.id
          ? { ...user, ...userData, lastSync: new Date().toISOString() }
          : user
      ));

      setEditingUser(null);
      showNotification('success', `Benutzer ${userData.email} wurde erfolgreich aktualisiert`);
    } catch (error) {
      showNotification('error', 'Fehler beim Aktualisieren des Benutzers');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Möchten Sie den Benutzer ${userEmail} wirklich deaktivieren?`)) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.map(user =>
        user.id === userId
          ? { ...user, status: 'Inaktiv' }
          : user
      ));

      showNotification('success', `Benutzer ${userEmail} wurde deaktiviert`);
    } catch (error) {
      showNotification('error', 'Fehler beim Deaktivieren des Benutzers');
    }
  };

  const handleSyncNow = async () => {
    try {
      setLoading(true);
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSyncStatus(prev => prev ? ({
        ...prev,
        lastSync: new Date().toISOString()
      }) : null);

      showNotification('success', 'Synchronisation wurde durchgeführt');
    } catch (error) {
      showNotification('error', 'Fehler bei der Synchronisation');
    } finally {
      setLoading(false);
    }
  };

  const formatNextSync = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVercelSync = async () => {
    try {
      setSyncingVercel(true);
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/notion-webhook-enhanced`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceSync: true }),
      });

      const result = await response.json();

      if (result.success) {
        showNotification('success', `Credentials erfolgreich zu Vercel synchronisiert (${result.syncedCount || 0} Einträge)`);
        fetchVercelStatus();
      } else {
        showNotification('error', result.error || 'Fehler bei der Vercel-Synchronisation');
      }
    } catch (error) {
      showNotification('error', 'Fehler bei der Vercel-Synchronisation');
    } finally {
      setSyncingVercel(false);
    }
  };

  const fetchVercelStatus = async () => {
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/notion-webhook-enhanced`);
      const data = await response.json();

      if (data.syncStatus?.vercel) {
        setVercelStatus(data.syncStatus.vercel);
      }
    } catch (error) {
      console.error('Failed to fetch Vercel status:', error);
    }
  };

  const renderVercel = () => (
    <div className="space-y-6">
      {/* Vercel Connection Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vercel Verbindung</h3>
          <button
            onClick={fetchVercelStatus}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Status aktualisieren
          </button>
        </div>

        {vercelStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                vercelStatus.connectionStatus === 'connected' ? 'bg-green-500' :
                vercelStatus.connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <div className="text-sm text-gray-500">Verbindung</div>
              <div className="text-sm font-medium">
                {vercelStatus.connectionStatus === 'connected' ? 'Verbunden' :
                 vercelStatus.connectionStatus === 'error' ? 'Fehler' : 'Getrennt'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {vercelStatus.notionCredentials}
              </div>
              <div className="text-sm text-gray-500">Notion Credentials</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {vercelStatus.vercelEnvVars}
              </div>
              <div className="text-sm text-gray-500">Vercel Env Vars</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500">Letzter Sync</div>
              <div className="text-sm font-medium">
                {vercelStatus.lastSync ?
                  new Date(vercelStatus.lastSync).toLocaleString('de-DE') :
                  'Nie'
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Sync Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manuelle Synchronisation</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Synchronisieren Sie alle Credentials aus der Notion-Datenbank mit den Vercel Environment Variables.
            Änderungen in Notion werden automatisch über Webhooks synchronisiert, aber Sie können hier manuell auslösen.
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleVercelSync}
              disabled={syncingVercel}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {syncingVercel ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Wird synchronisiert...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Jetzt synchronisieren</span>
                </>
              )}
            </button>

            <button
              onClick={fetchVercelStatus}
              className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Status prüfen
            </button>
          </div>
        </div>
      </div>

      {/* Service Mapping Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service-Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Notion Service → Environment Variable</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><span className="font-mono">Notion API</span> → <span className="font-mono">NOTION_SECRET</span></li>
              <li><span className="font-mono">Google Analytics</span> → <span className="font-mono">GOOGLE_ANALYTICS_ID</span></li>
              <li><span className="font-mono">Vercel API</span> → <span className="font-mono">VERCEL_ACCESS_TOKEN</span></li>
              <li><span className="font-mono">SendGrid</span> → <span className="font-mono">SENDGRID_API_KEY</span></li>
              <li><span className="font-mono">Stripe</span> → <span className="font-mono">STRIPE_SECRET_KEY</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Weitere Services</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><span className="font-mono">Cloudinary</span> → <span className="font-mono">CLOUDINARY_URL</span></li>
              <li><span className="font-mono">MongoDB Atlas</span> → <span className="font-mono">MONGODB_URI</span></li>
              <li><span className="font-mono">OpenAI</span> → <span className="font-mono">OPENAI_API_KEY</span></li>
              <li><span className="font-mono">Firebase</span> → <span className="font-mono">FIREBASE_PRIVATE_KEY</span></li>
              <li><span className="font-mono">PostgreSQL</span> → <span className="font-mono">DATABASE_URL</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Sync Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Synchronisations-Status</h3>
          <button
            onClick={handleSyncNow}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird synchronisiert...' : 'Jetzt synchronisieren'}
          </button>
        </div>

        {syncStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                syncStatus.isRunning ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="text-sm font-medium">
                {syncStatus.isRunning ? 'Aktiv' : 'Inaktiv'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {syncStatus.databases.length}
              </div>
              <div className="text-sm text-gray-500">Datenbanken</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500">Letzte Synchronisation</div>
              <div className="text-sm font-medium">
                {new Date(syncStatus.lastSync).toLocaleString('de-DE')}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500">Nächste Sync</div>
              <div className="text-sm font-medium">
                {formatNextSync(syncStatus.nextSyncIn)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v-1zm0 0h6a2 2 0 012 2v1a2 2 0 01-2 2h-1" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Gesamtbenutzer</dt>
                <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Aktive Benutzer</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {users.filter(u => u.status === 'Aktiv').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4v2m0 2a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110 4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110 4m0-4v2m0 6V4" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Rollen verteilt</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {new Set(users.map(u => u.role)).size}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Letzte Änderung</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {users.length > 0 ? 'vor 2 Min' : '-'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Letzte Aktivitäten</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Benutzer marketing@zoe-solar.de wurde aktualisiert</span>
              <span className="text-gray-400">vor 2 Minuten</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Synchronisation mit Notion durchgeführt</span>
              <span className="text-gray-400">vor 5 Minuten</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Neuer Benutzer erstellt</span>
              <span className="text-gray-400">vor 10 Minuten</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Benutzerverwaltung</h3>
          <button
            onClick={() => setShowCreateUser(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Benutzer erstellen</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benutzer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rolle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letzter Sync</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Aktiv'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastSync ? new Date(user.lastSync).toLocaleString('de-DE') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-900"
                        disabled={user.role === 'Super Admin'}
                      >
                        Deaktivieren
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSync = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Synchronisations-Einstellungen</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Sync Status */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Synchronisations-Status</h4>
              <button
                onClick={handleSyncNow}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Manuelles Sync durchführen
              </button>
            </div>

            {syncStatus && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Status</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        syncStatus.isRunning
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          syncStatus.isRunning ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        {syncStatus.isRunning ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Letzte Synchronisation</div>
                    <div className="mt-1 text-sm text-gray-900">
                      {new Date(syncStatus.lastSync).toLocaleString('de-DE')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Nächste automatische Sync</div>
                    <div className="mt-1 text-sm text-gray-900">
                      In {formatNextSync(syncStatus.nextSyncIn)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">Verbundene Datenbanken</div>
                    <div className="mt-1">
                      {syncStatus.databases.map((db, index) => (
                        <span key={index} className="inline-block px-2 py-1 mr-2 text-xs bg-blue-100 text-blue-800 rounded">
                          {db}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sync Frequency */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Sync-Frequenz</h4>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="1">Jede Minute</option>
              <option value="5">Alle 5 Minuten</option>
              <option value="15" selected>Alle 15 Minuten</option>
              <option value="30">Alle 30 Minuten</option>
              <option value="60">Stündlich</option>
            </select>
          </div>

          {/* Sync Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Sync-Einstellungen</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Automatische Synchronisation aktivieren</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm text-gray-700">Änderungen in Echtzeit synchronisieren</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Benachrichtigungen bei Sync-Fehlern</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Services */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Verbundene Dienste</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 8.293a1 1 0 00-1.414 1.414l-4 4a1 1 0 001.414 1.414l4-4a1 1 0 00-1.414-1.414l-4 4a1 1 0 00-1.414 1.414l4-4z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Notion API</div>
                  <div className="text-sm text-gray-500">Verbunden</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Letzte Aktivität: {new Date().toLocaleString('de-DE')}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 2a1 1 0 011 1v8a1 1 0 011-1h8a1 1 0 01-1-1V4a1 1 0 011-1H8zm6 0V4h2v12H8V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Vercel</div>
                  <div className="text-sm text-gray-500">Nicht verbunden</div>
                </div>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-800 mt-2">
                Verbinden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Benutzerverwaltung</h1>
              <p className="text-sm text-gray-600">Bidirektionale Synchronisation mit Notion</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Sync Status:
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  syncStatus?.isRunning
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {syncStatus?.isRunning ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Benutzer
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sync'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Synchronisation
            </button>
            <button
              onClick={() => setActiveTab('vercel')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vercel'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vercel Sync
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600">Lade Benutzerdaten...</div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'sync' && renderSync()}
            {activeTab === 'vercel' && renderVercel()}
          </>
        )}
      </main>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Neuen Benutzer erstellen</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateUser({
                  email: formData.get('email') as string,
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  department: formData.get('department') as string,
                  permissions: ['Nur Lesen']
                });
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rolle</label>
                <select
                  name="role"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Content Editor">Content Editor</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Abteilung</label>
                <select
                  name="department"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Management">Management</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Vertrieb">Vertrieb</option>
                  <option value="IT">IT</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Benutzer bearbeiten</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateUser({
                  id: editingUser.id,
                  email: formData.get('email') as string,
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  department: formData.get('department') as string,
                  permissions: editingUser.permissions
                });
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser.name}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rolle</label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Content Editor">Content Editor</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Abteilung</label>
                <select
                  name="department"
                  defaultValue={editingUser.department}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Management">Management</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Vertrieb">Vertrieb</option>
                  <option value="IT">IT</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  defaultValue={editingUser.status}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Aktiv">Aktiv</option>
                  <option value="Inaktiv">Inaktiv</option>
                  <option value="Ausstehend">Ausstehend</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Aktualisieren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-sm w-full bg-white rounded-lg shadow-lg p-4 ${
              notification.type === 'error' ? 'border-l-4 border-red-500' :
              notification.type === 'success' ? 'border-l-4 border-green-500' :
              'border-l-4 border-blue-500'
            }`}
          >
            <div className="flex items-center">
              <div className={`ml-3 ${
                notification.type === 'error' ? 'text-red-400' :
                notification.type === 'success' ? 'text-green-400' :
                'text-blue-400'
              }`}>
                {notification.type === 'error' && (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414 1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414l4-4a1 1 0 001.414-1.414l-4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'success' && (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010-1.414l-8-8a1 1 0 00-1.414 0l-8 8a1 1 0 001.414 1.414l8-8a1 1 0 000 1.414zm-9.414-1.414l4-4a1 1 0 011.414-1.414l-4-4a1 1 0 00-1.414 1.414l4 4a1 1 0 011.414-1.414l-4-4z" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0v4.582l1.429 1.428A6.002 6.002 0 0010 15.414v-4.582zm-2-2v4.582l-1.429-1.428A4.002 4.002 0 014 15.414V10a4 4 0 00-2 2z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 1.414L10 18.586l4.293-4.293a1 1 0 111.414-1.414L10 7.414l-4.293-4.293a1 1 0 00-1.414 0l-4.293 4.293a1 1 0 001.414 1.414L10 14.586l-4.293 4.293a1 1 0 001.414-1.414L10 11.586l4.293-4.293a1 1 0 00-1.414 1.414l-4.293 4.293a1 1 0 001.414 1.414L10 10.586l-4.293 4.293a1 1 0 001.414-1.414L10 9.586l4.293-4.293a1 1 0 00-1.414 1.414L10 8.586l-4.293 4.293a1 1 0 001.414 1.414L10 6.586l-4.293 4.293a1 1 0 001.414 1.414L10 4.586l-4.293 4.293a1 1 0 001.414 1.414L10 2.586l4.293-4.293a1 1 0 011.414-1.414L10 4.586l-4.293-4.293a1 1 0 00-1.414-1.414l4.293-4.293a1 1 0 011.414-1.414L10 6.586l-4.293 4.293a1 1 0 001.414-1.414l4.293-4.293a1 1 0 011.414-1.414L10 8.586l-4.293 4.293a1 1 0 001.414-1.414l4.293-4.293a1 1 0 011.414-1.414L10 10.586l-4.293 4.293a1 1 0 001.414-1.414L10 12.586l-4.293-4.293a1 1 0 001.414-1.414L10 14.586l4.293-4.293a1 1 0 001.414-1.414L10 16.586l-4.293 4.293a1 1 0 001.414-1.414L10 18.586l4.293-4.293a1 1 0 001.414-1.414L10 20.586l-4.293-4.293a1 1 0 001.414-1.414l4.293-4.293z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagementDashboard;