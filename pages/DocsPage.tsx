import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocSection {
  id: string;
  title: string;
  content: string;
  category: string;
}

const DocsPage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false); // In real app, check user role
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  // Mock documentation data - in real app, this would come from API/database
  const [docsData, setDocsData] = useState<DocSection[]>([
    {
      id: 'getting-started',
      title: 'Erste Schritte',
      category: 'setup',
      content: `# Erste Schritte mit ZOE Solar

## Willkommen bei ZOE Solar

ZOE Solar ist Ihr vertrauensvoller Partner für erneuerbare Energien in Deutschland. Wir bieten umfassende Lösungen für Photovoltaik, Elektromobilität und Energiespeicher.

### Schnellstart

1. **Registrieren Sie sich** in unserem Kundenportal
2. **Konfigurieren Sie Ihr System** mit unserem Planungstool
3. **Fordern Sie ein Angebot an** von unseren zertifizierten Partnern

### Systemvoraussetzungen

- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Internetverbindung
- JavaScript aktiviert

## Nächste Schritte

Nach der Registrierung können Sie:
- Ihr persönliches Dashboard erkunden
- Projektanfragen erstellen
- Mit unserem Support-Team chatten`
    },
    {
      id: 'api-reference',
      title: 'API-Referenz',
      category: 'developer',
      content: `# API-Referenz

## Authentifizierung

Alle API-Anfragen müssen mit einem Bearer-Token authentifiziert werden.

\`\`\`javascript
const headers = {
  'Authorization': 'Bearer YOUR_API_TOKEN',
  'Content-Type': 'application/json'
};
\`\`\`

## Endpunkte

### GET /api/projects

Ruft alle Projekte des authentifizierten Benutzers ab.

**Parameter:**
- \`limit\` (optional): Maximale Anzahl der Ergebnisse (Standard: 10)
- \`offset\` (optional): Offset für Pagination (Standard: 0)

**Beispiel:**

\`\`\`javascript
fetch('/api/projects?limit=5', { headers })
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

### POST /api/projects

Erstellt ein neues Projekt.

**Body:**
\`\`\`json
{
  "title": "Mein Solarprojekt",
  "description": "Installation einer 10kW Anlage",
  "location": "Berlin, Deutschland"
}
\`\`\``
    },
    {
      id: 'troubleshooting',
      title: 'Fehlerbehebung',
      category: 'support',
      content: `# Fehlerbehebung

## Häufige Probleme

### Problem: Dashboard lädt nicht

**Lösung:**
1. Überprüfen Sie Ihre Internetverbindung
2. Leeren Sie den Browser-Cache
3. Versuchen Sie einen anderen Browser

### Problem: API-Anfragen schlagen fehl

**Lösung:**
1. Überprüfen Sie Ihren API-Token
2. Stellen Sie sicher, dass der Token nicht abgelaufen ist
3. Kontrollieren Sie die API-Endpunkt-URLs

### Problem: Projekt kann nicht erstellt werden

**Lösung:**
1. Überprüfen Sie alle Pflichtfelder
2. Stellen Sie sicher, dass Sie angemeldet sind
3. Kontaktieren Sie den Support bei wiederholten Fehlern

## Support kontaktieren

Bei weiteren Problemen:
- **E-Mail:** support@zoe-solar.de
- **Telefon:** +49 30 12345678
- **Live-Chat:** Verfügbar im Dashboard`
    }
  ]);

  const categories = [
    { id: 'all', label: 'Alle' },
    { id: 'setup', label: 'Einrichtung' },
    { id: 'developer', label: 'Entwickler' },
    { id: 'support', label: 'Support' }
  ];

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('docs-theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    // Check admin status - in real app, check user role from auth context
    setIsAdmin(true); // Mock admin status
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('docs-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const startEditing = (sectionId: string, content: string) => {
    setEditingSection(sectionId);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingSection) {
      setDocsData(prev => prev.map(doc =>
        doc.id === editingSection ? { ...doc, content: editContent } : doc
      ));
      setEditingSection(null);
      setEditContent('');
      // In real app, save to backend
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditContent('');
  };

  const filteredDocs = docsData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={theme === 'dark' ? oneDark : oneLight}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dokumentation</h1>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Umfassende Anleitungen und Referenzen für ZOE Solar
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              aria-label="Theme umschalten"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Dokumentation durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documentation Content */}
        <div className="space-y-4">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className={`rounded-lg border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } overflow-hidden`}
            >
              <button
                onClick={() => toggleSection(doc.id)}
                className={`w-full px-6 py-4 text-left flex items-center justify-between hover:${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                } transition-colors`}
              >
                <div>
                  <h2 className="text-xl font-semibold">{doc.title}</h2>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Kategorie: {categories.find(c => c.id === doc.category)?.label}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedSections.has(doc.id) ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedSections.has(doc.id) && (
                <div className="px-6 pb-6">
                  {editingSection === doc.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className={`w-full h-96 p-4 rounded-lg border font-mono text-sm ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Markdown-Content hier eingeben..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`prose max-w-none ${
                      theme === 'dark' ? 'prose-invert' : ''
                    }`}>
                      <ReactMarkdown components={MarkdownComponents}>
                        {doc.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {isAdmin && editingSection !== doc.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => startEditing(doc.id, doc.content)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Bearbeiten
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-lg">Keine Dokumentation gefunden.</p>
            <p className="text-sm mt-2">Versuchen Sie andere Suchbegriffe oder Kategorien.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsPage;