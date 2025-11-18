#!/usr/bin/env node

// Setup Script für Users & Roles Datenbank in Notion
// Erstellt automatisch die Users und Roles Datenbanken für das Admin-System

const { Client } = require('@notionhq/client');

// Konfiguration
const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN;
const USERS_DB_ID = process.env.VITE_NOTION_USERS_DB;
const ROLES_DB_ID = process.env.VITE_NOTION_ROLES_DB;

if (!NOTION_TOKEN) {
  console.error('❌ VITE_NOTION_TOKEN nicht gefunden. Bitte setzen Sie die Umgebungsvariable.');
  process.exit(1);
}

const notion = new Client({
  auth: NOTION_TOKEN,
});

// Users Datenbank Schema
const usersDatabaseSchema = {
  parent: {
    type: 'page_id',
    page_id: process.env.VITE_NOTION_PARENT_PAGE_ID || null
  },
  title: {
    title: [
      {
        text: {
          content: '👥 Admin Users Management'
        }
      }
    ]
  },
  properties: {
    // Hauptfelder
    'Email': {
      title: {},
      description: {
        rich_text: [
          {
            text: {
              content: 'E-Mail-Adresse des Benutzers (Primärfeld)'
            }
          }
        ]
      }
    },

    'Name': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Vollständiger Name des Benutzers'
              }
            }
          ]
        }
      }
    },

    'Rolle': {
      select: {
        options: [
          { name: 'Super Admin', color: 'red' },
          { name: 'Administrator', color: 'orange' },
          { name: 'Marketing Manager', color: 'green' },
          { name: 'Sales Manager', color: 'blue' },
          { name: 'Content Editor', color: 'purple' },
          { name: 'Viewer', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Rolle des Benutzers im System'
              }
            }
          ]
        }
      }
    },

    'Abteilung': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Abteilung oder Team des Benutzers'
              }
            }
          ]
        }
      }
    },

    // Status & Aktivität
    'Status': {
      select: {
        options: [
          { name: 'Aktiv', color: 'green' },
          { name: 'Inaktiv', color: 'red' },
          { name: 'Gesperrt', color: 'orange' },
          { name: 'Ausstehend', color: 'yellow' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Aktueller Status des Benutzers'
              }
            }
          ]
        }
      }
    },

    'Letzter Login': {
      date: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Datum des letzten Logins'
              }
            }
          ]
        }
      }
    },

    'Passwort geändert am': {
      date: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Datum der letzten Passwortänderung'
              }
            }
          ]
        }
      }
    },

    // Berechtigungen
    'Zweistufen-Faktor': {
      checkbox: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Ist 2FA für den Benutzer aktiviert?'
              }
            }
          ]
        }
      }
    },

    'API Zugriff': {
      checkbox: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Hat der Benutzer API-Zugriff?'
              }
            }
        ]
      }
    },

    // Profile
    'Avatar': {
      files: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Profilbild des Benutzers'
              }
            }
          ]
        }
      }
    },

    'Telefon': {
      phone: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Telefonnummer des Benutzers'
              }
            }
          ]
        }
      }
    },

    // Zusätzliche Informationen
    'Beschreibung': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Beschreibung der Rolle und Verantwortlichkeiten'
              }
            }
          ]
        }
      }
    },

    'Notizen': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Interne Notizen zum Benutzer'
              }
            }
          ]
        }
      }
    },

    // Zeitsteuerung
    'Erstellt am': {
      created_time: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Automatisch generiertes Erstellungsdatum'
              }
            }
          ]
        }
      }
    },

    'Letzte Aktualisierung': {
      last_edited_time: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Automatisch generiertes Aktualisierungsdatum'
              }
            }
          ]
        }
      }
    }
  },
  icon: {
    type: 'emoji',
    emoji: '👥'
  },
  cover: {
    type: 'external',
    external: {
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=400&fit=crop'
    }
  }
};

// Roles Datenbank Schema
const rolesDatabaseSchema = {
  parent: {
    type: 'page_id',
    page_id: process.env.VITE_NOTION_PARENT_PAGE_ID || null
  },
  title: {
    title: [
      {
        text: {
          content: '🔐 Roles & Permissions'
        }
      }
    ]
  },
  properties: {
    // Hauptfelder
    'Role Name': {
      title: {},
      description: {
        rich_text: [
          {
            text: {
              content: 'Name der Rolle'
            }
          }
        ]
      }
    },

    'Role ID': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'System-ID der Rolle (für Programmierung)'
              }
            }
        ]
      }
    },

    'Beschreibung': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Detaillierte Beschreibung der Rolle'
              }
            }
          ]
        }
      }
    },

    // Berechtigungen
    'Permissions': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'JSON-Array der Berechtigungen'
              }
            }
          ]
        }
      }
    },

    // Hierarchie
    'Level': {
      number: {
        format: 'number',
        min: 1,
        max: 5
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Hierarchie-Level (1=niedrigste, 5=höchste Berechtigung)'
            }
          }
        ]
      }
    },

    'Status': {
      select: {
        options: [
          { name: 'Aktiv', color: 'green' },
          { name: 'Inaktiv', color: 'red' },
          { name: 'Archiviert', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Status der Rolle'
              }
            }
          ]
        }
      }
    },

    // Kategorisierung
    'Kategorie': {
      select: {
        options: [
          { name: 'System', color: 'red' },
          { name: 'Administration', color: 'orange' },
          { name: 'Management', color: 'yellow' },
          { name: 'Content', color: 'green' },
          { name: 'Read-Only', color: 'blue' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Kategorie der Rolle'
              }
            }
        ]
      }
    },

    // Benutzer-Zuordnung
    'Anzahl Benutzer': {
      number: {
        format: 'number'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Anzahl der Benutzer mit dieser Rolle'
            }
          }
        ]
      }
    },

    // Sicherheit
    'API Zugriff erlaubt': {
      checkbox: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Darf diese Rolle API-Aktionen durchführen?'
              }
            }
        ]
      }
    },

    'Datenlöschung erlaubt': {
      checkbox: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Darf diese Rolle Daten löschen?'
              }
            }
        ]
      }
    },

    // Metadaten
    'Erstellt am': {
      created_time: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Automatisch generiertes Erstellungsdatum'
              }
            }
          ]
        }
      },

    'Letzte Aktualisierung': {
      last_edited_time: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Automatisch generiertes Aktualisierungsdatum'
              }
            }
        ]
      }
    }
  },
  icon: {
    type: 'emoji',
    emoji: '🔐'
  },
  cover: {
    type: 'external',
    external: {
      url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1600&h=400&fit=crop'
    }
  }
};

async function createUsersDatabase() {
  try {
    console.log('🚀 Erstelle Users Datenbank in Notion...');

    let database;

    if (USERS_DB_ID) {
      console.log(`✅ Verwende existierende Users Datenbank-ID: ${USERS_DB_ID}`);
      try {
        database = await notion.databases.retrieve({ database_id: USERS_DB_ID });
        console.log('✅ Existierende Users Datenbank gefunden und validiert');
      } catch (error) {
        console.log('⚠️  Users Datenbank nicht gefunden, erstelle neue...');
        database = await notion.databases.create(usersDatabaseSchema);
      }
    } else {
      console.log('📝 Erstelle neue Users Datenbank...');
      database = await notion.databases.create(usersDatabaseSchema);
    }

    console.log('✅ Users Datenbank erfolgreich erstellt/validiert!');
    console.log(`📊 Users Datenbank-ID: ${database.id}`);
    console.log(`🔗 Link: ${database.url}`);

    // Erstelle Beispiel-Benutzer
    await createSampleUsers(database.id);

    return database;

  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Users Datenbank:', error);
    throw error;
  }
}

async function createRolesDatabase() {
  try {
    console.log('🚀 Erstelle Roles Datenbank in Notion...');

    let database;

    if (ROLES_DB_ID) {
      console.log(`✅ Verwende existierende Roles Datenbank-ID: ${ROLES_DB_ID}`);
      try {
        database = await notion.databases.retrieve({ database_id: ROLES_DB_ID });
        console.log('✅ Existierende Roles Datenbank gefunden und validiert');
      } catch (error) {
        console.log('⚠️  Roles Datenbank nicht gefunden, erstelle neue...');
        database = await notion.databases.create(rolesDatabaseSchema);
      }
    } else {
      console.log('📝 Erstelle neue Roles Datenbank...');
      database = await notion.databases.create(rolesDatabaseSchema);
    }

    console.log('✅ Roles Datenbank erfolgreich erstellt/validiert!');
    console.log(`📊 Roles Datenbank-ID: ${database.id}`);
    console.log(`🔗 Link: ${database.url}`);

    // Erstelle Standard-Rollen
    await createSampleRoles(database.id);

    return database;

  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Roles Datenbank:', error);
    throw error;
  }
}

async function createSampleUsers(databaseId) {
  console.log('📝 Erstelle Beispiel-Benutzer...');

  const sampleUsers = [
    {
      parent: { database_id: databaseId },
      properties: {
        'Email': {
          title: [
            { text: { content: 'admin@zoe-solar.de' } }
          ]
        },
        'Name': {
          rich_text: [
            { text: { content: 'Max Mustermann' } }
          ]
        },
        'Rolle': {
          select: { name: 'Super Admin' }
        },
        'Abteilung': {
          rich_text: [
            { text: { content: 'Management' } }
          ]
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Zweistufen-Faktor': {
          checkbox: true
        },
        'API Zugriff': {
          checkbox: true
        },
        'Telefon': {
          phone: '+49 123 456789'
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'System Administrator mit vollzugriff auf alle Funktionen' } }
          ]
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Email': {
          title: [
            { text: { content: 'marketing@zoe-solar.de' } }
          ]
        },
        'Name': {
          rich_text: [
            { text: { content: 'Sarah Marketing' } }
          ]
        },
        'Rolle': {
          select: { name: 'Marketing Manager' }
        },
        'Abteilung': {
          rich_text: [
            { text: { content: 'Marketing' } }
          ]
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Zweistufen-Faktor': {
          checkbox: true
        },
        'API Zugriff': {
          checkbox: true
        },
        'Telefon': {
          phone: '+49 123 456790'
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Verantwortlich für Marketing Kampagnen und Content Management' } }
          ]
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Email': {
          title: [
            { text: { content: 'sales@zoe-solar.de' } }
          ]
        },
        'Name': {
          rich_text: [
            { text: { content: 'Tom Sales' } }
          ]
        },
        'Rolle': {
          select: { name: 'Sales Manager' }
        },
        'Abteilung': {
          rich_text: [
            { text: { content: 'Sales' } }
          ]
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Zweistufen-Faktor': {
          checkbox: true
        },
        'API Zugriff': {
          checkbox: false
        },
        'Telefon': {
          phone: '+49 123 456788'
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Verantwortlich für Lead Management und Kundenbetreuung' } }
          ]
        }
      }
    }
  ];

  for (const user of sampleUsers) {
    try {
      await notion.pages.create(user);
      console.log('✅ Beispiel-Benutzer erstellt');
    } catch (error) {
      console.warn('⚠️  Beispiel-Benutzer konnte nicht erstellt werden:', error.message);
    }
  }

  console.log('✅ Beispiel-Benutzer erfolgreich erstellt!');
}

async function createSampleRoles(databaseId) {
  console.log('📝 Erstelle Standard-Rollen...');

  const standardRoles = [
    {
      parent: { database_id: databaseId },
      properties: {
        'Role Name': {
          title: [
            { text: { content: 'Super Admin' } }
          ]
        },
        'Role ID': {
          rich_text: [
            { text: { content: 'super_admin' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Vollzugriff auf alle Systemfunktionen, inklusive System-Administration' } }
          ]
        },
        'Permissions': {
          rich_text: [
            { text: { content: JSON.stringify(['users_create', 'users_read', 'users_update', 'users_delete', 'roles_manage', 'system_config', 'system_backup', 'system_logs', 'content_create', 'content_read', 'content_update', 'content_delete', 'content_publish', 'marketing_create', 'marketing_read', 'marketing_update', 'marketing_delete', 'marketing_publish', 'ab_testing', 'leads_read', 'leads_update', 'leads_assign', 'analytics_read']) } }
          ]
        },
        'Level': {
          number: 5
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Kategorie': {
          select: { name: 'System' }
        },
        'Anzahl Benutzer': {
          number: 1
        },
        'API Zugriff erlaubt': {
          checkbox: true
        },
        'Datenlöschung erlaubt': {
          checkbox: true
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Role Name': {
          title: [
            { text: { content: 'Administrator' } }
          ]
        },
        'Role ID': {
          rich_text: [
            { text: { content: 'admin' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Administrative Berechtigungen ohne System-Zugriff' } }
          ]
        },
        'Permissions': {
          rich_text: [
            { text: { content: JSON.stringify(['users_create', 'users_read', 'users_update', 'roles_manage', 'content_create', 'content_read', 'content_update', 'content_delete', 'content_publish', 'marketing_create', 'marketing_read', 'marketing_update', 'marketing_delete', 'marketing_publish', 'ab_testing', 'leads_read', 'leads_update', 'leads_assign', 'analytics_read']) } }
          ]
        },
        'Level': {
          number: 4
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Kategorie': {
          select: { name: 'Administration' }
        },
        'Anzahl Benutzer': {
          number: 0
        },
        'API Zugriff erlaubt': {
          checkbox: true
        },
        'Datenlöschung erlaubt': {
          checkbox: true
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Role Name': {
          title: [
            { text: { content: 'Marketing Manager' } }
          ]
        },
        'Role ID': {
          rich_text: [
            { text: { content: 'marketing_manager' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Vollzugriff auf Marketing-Funktionen und Content Management' } }
          ]
        },
        'Permissions': {
          rich_text: [
            { text: { content: JSON.stringify(['content_create', 'content_read', 'content_update', 'content_publish', 'marketing_create', 'marketing_read', 'marketing_update', 'marketing_delete', 'marketing_publish', 'ab_testing', 'analytics_read']) } }
          ]
        },
        'Level': {
          number: 3
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Kategorie': {
          select: { name: 'Management' }
        },
        'Anzahl Benutzer': {
          number: 1
        },
        'API Zugriff erlaubt': {
          checkbox: true
        },
        'Datenlöschung erlaubt': {
          checkbox: false
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Role Name': {
          title: [
            { text: { content: 'Sales Manager' } }
          ]
        },
        'Role ID': {
          rich_text: [
            { text: { content: 'sales_manager' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Zugriff auf Leads, Analytics und grundlegende Marketing-Infos' } }
          ]
        },
        'Permissions': {
          rich_text: [
            { text: { content: JSON.stringify(['leads_read', 'leads_update', 'leads_assign', 'analytics_read', 'content_read', 'marketing_read']) } }
          ]
        },
        'Level': {
          number: 3
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Kategorie': {
          select: { name: 'Management' }
        },
        'Anzahl Benutzer': {
          number: 1
        },
        'API Zugriff erlaubt': {
          checkbox: false
        },
        'Datenlöschung erlaubt': {
          checkbox: false
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Role Name': {
          title: [
            { text: { content: 'Content Editor' } }
          ]
        },
        'Role ID': {
          rich_text: [
            { text: { content: 'content_editor' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Inhalte erstellen und bearbeiten, aber nicht löschen' } }
          ]
        },
        'Permissions': {
          rich_text: [
            { text: { content: JSON.stringify(['content_create', 'content_read', 'content_update', 'content_publish', 'marketing_read', 'analytics_read']) } }
          ]
        },
        'Level': {
          number: 2
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Kategorie': {
          select: { name: 'Content' }
        },
        'Anzahl Benutzer': {
          number: 0
        },
        'API Zugriff erlaubt': {
          checkbox: false
        },
        'Datenlöschung erlaubt': {
          checkbox: false
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Role Name': {
          title: [
            { text: { content: 'Viewer' } }
          ]
        },
        'Role ID': {
          rich_text: [
            { text: { content: 'viewer' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Nur Leseberechtigungen für alle Bereiche' } }
          ]
        },
        'Permissions': {
          rich_text: [
            { text: { content: JSON.stringify(['content_read', 'marketing_read', 'leads_read', 'analytics_read']) } }
          ]
        },
        'Level': {
          number: 1
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Kategorie': {
          select: { name: 'Read-Only' }
        },
        'Anzahl Benutzer': {
          number: 0
        },
        'API Zugriff erlaubt': {
          checkbox: false
        },
        'Datenlöschung erlaubt': {
          checkbox: false
        }
      }
    }
  ];

  for (const role of standardRoles) {
    try {
      await notion.pages.create(role);
      console.log('✅ Standard-Rolle erstellt');
    } catch (error) {
      console.warn('⚠️  Standard-Rolle konnte nicht erstellt werden:', error.message);
    }
  }

  console.log('✅ Standard-Rollen erfolgreich erstellt!');
}

// Hauptfunktion
async function main() {
  try {
    console.log('🔧 ZOE Solar Users & Roles Setup');
    console.log('===================================');

    const usersDatabase = await createUsersDatabase();
    const rolesDatabase = await createRolesDatabase();

    console.log('');
    console.log('🎉 Users & Roles Setup abgeschlossen!');
    console.log('');
    console.log('📋 Datenbank-IDs für .env.local:');
    console.log(`VITE_NOTION_USERS_DB=${usersDatabase.id}`);
    console.log(`VITE_NOTION_ROLES_DB=${rolesDatabase.id}`);
    console.log('');
    console.log('📋 Nächste Schritte:');
    console.log('1. Fügen Sie die IDs zu Ihrer .env.local hinzu');
    console.log('2. Testen Sie die Admin-Anmeldung mit:');
    console.log('   - admin@zoe-solar.de (Super Admin)');
    console.log('   - marketing@zoe-solar.de (Marketing Manager)');
    console.log('   - sales@zoe-solar.de (Sales Manager)');
    console.log('');
    console.log('✨ Ihr Admin-System ist jetzt bereit für die Verwendung!');

  } catch (error) {
    console.error('❌ Setup fehlgeschlagen:', error);
    process.exit(1);
  }
}

// Script ausführen
if (require.main === module) {
  main();
}

module.exports = { createUsersDatabase, createRolesDatabase };