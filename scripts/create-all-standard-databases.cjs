#!/usr/bin/env node

/**
 * Create all standard ZOE Solar Notion databases
 * Based on the actual database structure needed by the application
 */

const { Client } = require('@notionhq/client');

const token = 'your_notion_api_token_here';
const notion = new Client({ auth: token });

const parentId = '2a3d95db-e7b1-80de-ace7-e8ab322f8f1a'; // ZOE Solar Steuersoftware CMS

async function createStandardDatabases() {
  try {
    console.log('🏢 Creating Standard ZOE Solar Notion Databases...');
    console.log(`Parent Page: ZOE Solar Steuersoftware CMS`);
    console.log(`Workspace: ZOE Solar\n`);

    const databases = {};

    // 1. Blog/Articles Database
    console.log('📝 Creating Blog/Articles Database...');
    const articlesDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '📝 Blog & Artikel' } }],
      properties: {
        'Title': { title: {} },
        'Status': {
          select: {
            options: [
              { name: 'Draft', color: 'gray' },
              { name: 'Published', color: 'green' },
              { name: 'Archived', color: 'red' }
            ]
          }
        },
        'Category': {
          select: {
            options: [
              { name: 'Photovoltaik', color: 'blue' },
              { name: 'Wärmepumpe', color: 'orange' },
              { name: 'E-Mobilität', color: 'purple' },
              { name: 'Unternehmen', color: 'yellow' },
              { name: 'News', color: 'green' }
            ]
          }
        },
        'Author': {
          rich_text: [{ text: { content: '' } }]
        },
        'Publish Date': {
          date: {}
        },
        'Featured': {
          checkbox: {}
        },
        'Tags': {
          multi_select: []
        },
        'Content': {
          rich_text: [{ text: { content: '' } }]
        },
        'SEO Description': {
          rich_text: [{ text: { content: '' } }]
        },
        'SEO Keywords': {
          rich_text: [{ text: { content: '' } }]
        }
      },
      icon: { type: 'emoji', emoji: '📝' }
    });
    databases.articles = articlesDatabase.id;
    console.log(`✅ Articles Database created: ${articlesDatabase.url}`);

    // 2. Products Database
    console.log('🔋 Creating Products Database...');
    const productsDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '🔋 Produkte & Solaranlagen' } }],
      properties: {
        'Name': { title: {} },
        'Category': {
          select: {
            options: [
              { name: 'Photovoltaikanlagen', color: 'blue' },
              { name: 'Speicher', color: 'green' },
              { name: 'Wallboxen', color: 'orange' },
              { name: 'Wärmepumpen', color: 'red' },
              { name: 'Zubehör', color: 'purple' }
            ]
          }
        },
        'Status': {
          select: {
            options: [
              { name: 'Available', color: 'green' },
              { name: 'Out of Stock', color: 'red' },
              { name: 'Coming Soon', color: 'yellow' }
            ]
          }
        },
        'Price': {
          number: { format: 'euro' }
        },
        'Description': {
          rich_text: [{ text: { content: '' } }]
        },
        'Image': {
          files: []
        },
        'Technical Specs': {
          rich_text: [{ text: { content: '' } }]
        },
        'Featured': {
          checkbox: {}
        }
      },
      icon: { type: 'emoji', emoji: '🔋' }
    });
    databases.products = productsDatabase.id;
    console.log(`✅ Products Database created: ${productsDatabase.url}`);

    // 3. FAQ Database
    console.log('❓ Creating FAQ Database...');
    const faqDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '❓ Häufige Fragen (FAQ)' } }],
      properties: {
        'Question': { title: {} },
        'Category': {
          select: {
            options: [
              { name: 'Photovoltaik', color: 'blue' },
              { name: 'Speicher', color: 'green' },
              { name: 'Installation', color: 'orange' },
              { name: 'Finanzierung', color: 'purple' },
              { name: 'Service', color: 'red' }
            ]
          }
        },
        'Answer': {
          rich_text: [{ text: { content: '' } }]
        },
        'Status': {
          select: {
            options: [
              { name: 'Published', color: 'green' },
              { name: 'Draft', color: 'gray' }
            ]
          }
        },
        'Priority': {
          select: {
            options: [
              { name: 'High', color: 'red' },
              { name: 'Medium', color: 'yellow' },
              { name: 'Low', color: 'green' }
            ]
          }
        }
      },
      icon: { type: 'emoji', emoji: '❓' }
    });
    databases.faq = faqDatabase.id;
    console.log(`✅ FAQ Database created: ${faqDatabase.url}`);

    // 4. Team Database
    console.log('👥 Creating Team Database...');
    const teamDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '👥 Team & Mitarbeiter' } }],
      properties: {
        'Name': { title: {} },
        'Role': {
          select: {
            options: [
              { name: 'CEO', color: 'purple' },
              { name: 'Techniker', color: 'blue' },
              { name: 'Vertrieb', color: 'green' },
              { name: 'Marketing', color: 'orange' },
              { name: 'Support', color: 'red' }
            ]
          }
        },
        'Email': {
          email: {}
        },
        'Phone': {
          phone: {}
        },
        'Photo': {
          files: []
        },
        'Bio': {
          rich_text: [{ text: { content: '' } }]
        },
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Inactive', color: 'gray' }
            ]
          }
        }
      },
      icon: { type: 'emoji', emoji: '👥' }
    });
    databases.team = teamDatabase.id;
    console.log(`✅ Team Database created: ${teamDatabase.url}`);

    // 5. Customers/Case Studies Database
    console.log('🏠 Creating Customers/Case Studies Database...');
    const customersDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '🏠 Kunden & Fallstudien' } }],
      properties: {
        'Customer Name': { title: {} },
        'Type': {
          select: {
            options: [
              { name: 'Privat', color: 'green' },
              { name: 'Gewerbe', color: 'blue' },
              { name: 'Landwirtschaft', color: 'orange' }
            ]
          }
        },
        'Location': {
          rich_text: [{ text: { content: '' } }]
        },
        'System Size': {
          number: {}
        },
        'Description': {
          rich_text: [{ text: { content: '' } }]
        },
        'Images': {
          files: []
        },
        'Status': {
          select: {
            options: [
              { name: 'Completed', color: 'green' },
              { name: 'In Progress', color: 'yellow' },
              { name: 'Planned', color: 'gray' }
            ]
          }
        },
        'Featured': {
          checkbox: {}
        }
      },
      icon: { type: 'emoji', emoji: '🏠' }
    });
    databases.customers = customersDatabase.id;
    console.log(`✅ Customers Database created: ${customersDatabase.url}`);

    // 6. Locations Database
    console.log('📍 Creating Locations Database...');
    const locationsDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '📍 Standorte & Regionen' } }],
      properties: {
        'Name': { title: {} },
        'Type': {
          select: {
            options: [
              { name: 'Büro', color: 'blue' },
              { name: 'Showroom', color: 'green' },
              { name: 'Service Region', color: 'orange' }
            ]
          }
        },
        'Address': {
          rich_text: [{ text: { content: '' } }]
        },
        'Phone': {
          phone: {}
        },
        'Email': {
          email: {}
        },
        'Opening Hours': {
          rich_text: [{ text: { content: '' } }]
        },
        'Coordinates': {
          rich_text: [{ text: { content: '' } }]
        },
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Coming Soon', color: 'yellow' },
              { name: 'Inactive', color: 'red' }
            ]
          }
        }
      },
      icon: { type: 'emoji', emoji: '📍' }
    });
    databases.locations = locationsDatabase.id;
    console.log(`✅ Locations Database created: ${locationsDatabase.url}`);

    // 7. Gallery Database
    console.log('🖼️ Creating Gallery Database...');
    const galleryDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '🖼️ Galerien & Medien' } }],
      properties: {
        'Title': { title: {} },
        'Type': {
          select: {
            options: [
              { name: 'Foto', color: 'blue' },
              { name: 'Video', color: 'purple' },
              { name: 'Fallstudie', color: 'green' }
            ]
          }
        },
        'Description': {
          rich_text: [{ text: { content: '' } }]
        },
        'Category': {
          select: {
            options: [
              { name: 'Photovoltaik', color: 'blue' },
              { name: 'Speicher', color: 'green' },
              { name: 'Team', color: 'orange' },
              { name: 'Unternehmen', color: 'purple' }
            ]
          }
        },
        'Files': {
          files: []
        },
        'Status': {
          select: {
            options: [
              { name: 'Published', color: 'green' },
              { name: 'Draft', color: 'gray' }
            ]
          }
        }
      },
      icon: { type: 'emoji', emoji: '🖼️' }
    });
    databases.gallery = galleryDatabase.id;
    console.log(`✅ Gallery Database created: ${galleryDatabase.url}`);

    // 8. Services Database
    console.log('⚙️ Creating Services Database...');
    const servicesDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '⚙️ Dienstleistungen' } }],
      properties: {
        'Name': { title: {} },
        'Description': {
          rich_text: [{ text: { content: '' } }]
        },
        'Category': {
          select: {
            options: [
              { name: 'Beratung', color: 'blue' },
              { name: 'Installation', color: 'green' },
              { name: 'Wartung', color: 'orange' },
              { name: 'Finanzierung', color: 'purple' }
            ]
          }
        },
        'Price': {
          rich_text: [{ text: { content: '' } }]
        },
        'Duration': {
          rich_text: [{ text: { content: '' } }]
        },
        'Status': {
          select: {
            options: [
              { name: 'Available', color: 'green' },
              { name: 'Unavailable', color: 'red' }
            ]
          }
        }
      },
      icon: { type: 'emoji', emoji: '⚙️' }
    });
    databases.services = servicesDatabase.id;
    console.log(`✅ Services Database created: ${servicesDatabase.url}`);

    // 9. Newsletter Database
    console.log('📧 Creating Newsletter Database...');
    const newsletterDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '📧 Newsletter & Abonnenten' } }],
      properties: {
        'Email': { title: {} },
        'Name': {
          rich_text: [{ text: { content: '' } }]
        },
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Unsubscribed', color: 'red' },
              { name: 'Pending', color: 'yellow' }
            ]
          }
        },
        'Source': {
          select: {
            options: [
              { name: 'Website', color: 'blue' },
              { name: 'Manuell', color: 'green' },
              { name: 'Import', color: 'purple' }
            ]
          }
        },
        'Subscribed Date': {
          date: {}
        }
      },
      icon: { type: 'emoji', emoji: '📧' }
    });
    databases.newsletter = newsletterDatabase.id;
    console.log(`✅ Newsletter Database created: ${newsletterDatabase.url}`);

    // 10. Knowledge Base Database
    console.log('📚 Creating Knowledge Base Database...');
    const knowledgeDatabase = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '📚 Wissensdatenbank' } }],
      properties: {
        'Title': { title: {} },
        'Category': {
          select: {
            options: [
              { name: 'Technik', color: 'blue' },
              { name: 'FAQ', color: 'green' },
              { name: 'Anleitungen', color: 'orange' },
              { name: 'Glossar', color: 'purple' }
            ]
          }
        },
        'Content': {
          rich_text: [{ text: { content: '' } }]
        },
        'Tags': {
          multi_select: []
        },
        'Status': {
          select: {
            options: [
              { name: 'Published', color: 'green' },
              { name: 'Draft', color: 'gray' }
            ]
          }
        },
        'Last Updated': {
          date: {}
        }
      },
      icon: { type: 'emoji', emoji: '📚' }
    });
    databases.knowledge = knowledgeDatabase.id;
    console.log(`✅ Knowledge Base Database created: ${knowledgeDatabase.url}`);

    console.log('\n🎉 All standard databases created successfully!');
    console.log('\n📊 DATABASE IDs:');
    for (const [name, id] of Object.entries(databases)) {
      console.log(`   ${name.charAt(0).toUpperCase() + name.slice(1)}: ${id}`);
    }

    // Update .env.local with new database IDs
    console.log('\n📝 Updating .env.local file...');
    const envContent = `
# ZOE SOLAR NOTION DATABASES (Updated: ${new Date().toISOString()})

# Standard Databases
NEXT_PUBLIC_NOTION_ARTICLES_DB_ID=${databases.articles}
NEXT_PUBLIC_NOTION_PRODUCTS_DB_ID=${databases.products}
NEXT_PUBLIC_NOTION_FAQ_DB_ID=${databases.faq}
NEXT_PUBLIC_NOTION_TEAM_DB_ID=${databases.team}
NEXT_PUBLIC_NOTION_CUSTOMERS_DB_ID=${databases.customers}
NEXT_PUBLIC_NOTION_LOCATIONS_DB_ID=${databases.locations}
NEXT_PUBLIC_NOTION_GALLERY_DB_ID=${databases.gallery}
NEXT_PUBLIC_NOTION_SERVICES_DB_ID=${databases.services}
NEXT_PUBLIC_NOTION_NEWSLETTER_DB_ID=${databases.newsletter}
NEXT_PUBLIC_NOTION_KNOWLEDGE_DB_ID=${databases.knowledge}

# Special Databases (from previous creation)
NEXT_PUBLIC_NOTION_USERS_DB_ID=b9620985-29da-45f2-8c9e-9bc0c96346fe
NEXT_PUBLIC_NOTION_ROLES_DB_ID=12a47eb9-4716-4191-903f-6aeaff0da645
NEXT_PUBLIC_NOTION_CREDENTIALS_DB_ID=e7d1b1b1-3351-4164-8bc2-d418c6329875
NEXT_PUBLIC_NOTION_ENV_SYNC_DB_ID=0d988d23-0aae-4c50-b770-ae4aed6cf95c
NEXT_PUBLIC_NOTION_ABTESTING_DB_ID=0fa601e3-22a7-4370-ba96-7d64e5fda81a

# Parent Page
NOTION_PARENT_PAGE_ID=${parentId}
VITE_NOTION_PARENT_PAGE_ID=${parentId}
`;

    require('fs').writeFileSync('.env.local', envContent);
    console.log('✅ .env.local file updated');

    console.log('\n🚀 Ready to use!');
    console.log('📱 Test your application: npm run dev');
    console.log('🔧 Admin Dashboard: https://zoe-solar.de/admin');

  } catch (error) {
    console.error('❌ Error creating databases:', error.message);
    if (error.body) {
      console.error('Error details:', JSON.stringify(error.body, null, 2));
    }
  }
}

createStandardDatabases();