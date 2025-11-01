import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthService } from './authService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Datenpfade
const dataDir = path.join(__dirname, '../data');
const customersPath = path.join(dataDir, 'customers.ts');
const customerSessionsPath = path.join(dataDir, 'customerSessions.ts');

/**
 * Kundenverwaltungs-Service
 * 
 * Funktionen:
 * - Verwaltung von Kundenkonten
 * - Tracking von Login-Aktivitäten
 * - Kundenstatistiken und -metriken
 * - Such- und Filterfunktionen
 * - Kundenaktivitäten protokollieren
 */
class CustomerManagementService {
  
  /**
   * Alle Kunden abrufen
   */
  static async getAllCustomers(filters = {}) {
    try {
      let content;
      try {
        content = await fs.readFile(customersPath, 'utf-8');
      } catch (error) {
        return [];
      }

      const customersMatch = content.match(/export const customers: Customer\[\] = \[([\s\S]*?)\];/);

      if (!customersMatch) {
        return [];
      }

      let customers = JSON.parse('[' + customersMatch[1] + ']');

      // Filter anwenden
      if (filters.status) {
        customers = customers.filter(customer => customer.status === filters.status);
      }

      if (filters.planType) {
        customers = customers.filter(customer => customer.planType === filters.planType);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        customers = customers.filter(customer => 
          customer.name.toLowerCase().includes(searchTerm) ||
          customer.email.toLowerCase().includes(searchTerm) ||
          customer.companyName?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        customers = customers.filter(customer => 
          new Date(customer.registrationDate) >= dateFrom
        );
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        customers = customers.filter(customer => 
          new Date(customer.registrationDate) <= dateTo
        );
      }

      // Sortieren (neueste zuerst)
      customers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

      return customers;
    } catch (error) {
      console.error('[CustomerService] Kunden laden fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Einzelnes Kundenkonto abrufen
   */
  static async getCustomer(customerId) {
    try {
      const customers = await this.getAllCustomers();
      return customers.find(customer => customer.id === customerId) || null;
    } catch (error) {
      console.error('[CustomerService] Kunde laden fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Kundenkonto aktualisieren
   */
  static async updateCustomer(customerId, updates) {
    try {
      const content = await fs.readFile(customersPath, 'utf-8');
      const customersMatch = content.match(/export const customers: Customer\[\] = \[([\s\S]*?)\];/);

      if (!customersMatch) {
        throw new Error('Kunden-Datenbank nicht gefunden');
      }

      let customers = JSON.parse('[' + customersMatch[1] + ']');
      const index = customers.findIndex(customer => customer.id === customerId);

      if (index === -1) {
        throw new Error('Kunde nicht gefunden');
      }

      const updatedCustomer = {
        ...customers[index],
        ...updates,
        lastModified: new Date().toISOString()
      };

      customers[index] = updatedCustomer;

      const newContent = content.replace(
        /export const customers: Customer\[\] = \[([\s\S]*?)\];/,
        `export const customers: Customer[] = ${JSON.stringify(customers, null, 2)};`
      );

      await fs.writeFile(customersPath, newContent, 'utf-8');

      console.log(`[CustomerService] Kunde aktualisiert: ${customerId}`);
      
      return {
        success: true,
        message: 'Kunde erfolgreich aktualisiert',
        customer: updatedCustomer
      };

    } catch (error) {
      console.error('[CustomerService] Update fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Neues Kundenkonto erstellen
   */
  static async createCustomer(customerData) {
    try {
      const {
        name,
        email,
        password, // In echter Implementierung gehasht
        companyName,
        phone,
        address,
        planType = 'basic',
        notes = ''
      } = customerData;

      // Validierung
      if (!name?.trim() || !email?.trim()) {
        throw new Error('Name und E-Mail sind erforderlich');
      }

      // E-Mail eindeutig prüfen
      const existingCustomers = await this.getAllCustomers();
      if (existingCustomers.find(customer => customer.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Ein Kunde mit dieser E-Mail existiert bereits');
      }

      const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newCustomer = {
        id: customerId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password || 'temp123', // In echter Implementierung gehasht
        companyName: companyName?.trim() || '',
        phone: phone?.trim() || '',
        address: address || {},
        planType: planType,
        status: 'active',
        registrationDate: new Date().toISOString(),
        lastLogin: null,
        totalLogins: 0,
        lastActivity: null,
        notes: notes.trim(),
        tags: [],
        subscriptionExpiry: null,
        createdBy: 'admin',
        lastModified: new Date().toISOString(),
        preferences: {
          language: 'de',
          notifications: true,
          newsletter: false
        },
        statistics: {
          totalSessions: 0,
          lastSessionDuration: 0,
          averageSessionDuration: 0,
          pagesVisited: 0
        }
      };

      await this.addCustomer(newCustomer);

      console.log(`[CustomerService] Neuer Kunde erstellt: ${email}`);
      
      return {
        success: true,
        message: 'Kunde erfolgreich erstellt',
        customer: newCustomer
      };

    } catch (error) {
      console.error('[CustomerService] Erstellen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Kunden zur Datenbank hinzufügen
   */
  static async addCustomer(customerData) {
    try {
      let content;
      try {
        content = await fs.readFile(customersPath, 'utf-8');
      } catch (error) {
        // Datei existiert nicht - neu erstellen
        content = 'export const customers: Customer[] = [];';
      }

      const customersMatch = content.match(/export const customers: Customer\[\] = \[([\s\S]*?)\];/);

      let customers = [];
      if (customersMatch) {
        customers = JSON.parse('[' + customersMatch[1] + ']');
      }

      customers.push(customerData);

      const newContent = content.replace(
        /export const customers: Customer\[\] = \[([\s\S]*?)\];/,
        `export const customers: Customer[] = ${JSON.stringify(customers, null, 2)};`
      );

      await fs.writeFile(customersPath, newContent, 'utf-8');

    } catch (error) {
      console.error('[CustomerService] Kunde hinzufügen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Kundenkonto löschen (soft delete)
   */
  static async deleteCustomer(customerId) {
    try {
      const result = await this.updateCustomer(customerId, {
        status: 'deleted',
        deletedAt: new Date().toISOString()
      });

      console.log(`[CustomerService] Kunde gelöscht: ${customerId}`);
      
      return result;

    } catch (error) {
      console.error('[CustomerService] Löschen fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Aktive Kunden-Sessions abrufen
   */
  static async getActiveCustomerSessions() {
    try {
      let content;
      try {
        content = await fs.readFile(customerSessionsPath, 'utf-8');
      } catch (error) {
        return [];
      }

      const sessionsMatch = content.match(/export const customerSessions: CustomerSession\[\] = \[([\s\S]*?)\];/);

      if (!sessionsMatch) {
        return [];
      }

      let sessions = JSON.parse('[' + sessionsMatch[1] + ']');

      // Nur aktive Sessions (nicht abgelaufen)
      const now = new Date();
      const activeSessions = sessions.filter(session => 
        new Date(session.expiresAt) > now
      );

      return activeSessions;
    } catch (error) {
      console.error('[CustomerService] Sessions laden fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Login-Aktivität protokollieren
   */
  static async logCustomerActivity(customerId, activity) {
    try {
      // Kunden-Aktivität aktualisieren
      await this.updateCustomer(customerId, {
        lastActivity: new Date().toISOString(),
        lastLogin: activity.type === 'login' ? new Date().toISOString() : undefined,
        totalLogins: activity.type === 'login' ? undefined : undefined // Wird separat erhöht
      });

      console.log(`[CustomerService] Aktivität protokolliert: ${customerId} - ${activity.type}`);
      
      return {
        success: true,
        message: 'Aktivität protokolliert'
      };

    } catch (error) {
      console.error('[CustomerService] Aktivitäts-Log fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Kunden suchen
   */
  static async searchCustomers(query, filters = {}) {
    try {
      let customers = await this.getAllCustomers(filters);
      
      if (query) {
        const searchTerm = query.toLowerCase();
        customers = customers.filter(customer => 
          customer.name.toLowerCase().includes(searchTerm) ||
          customer.email.toLowerCase().includes(searchTerm) ||
          customer.companyName?.toLowerCase().includes(searchTerm) ||
          customer.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      return customers;
    } catch (error) {
      console.error('[CustomerService] Suche fehlgeschlagen:', error);
      return [];
    }
  }

  /**
   * Kunden-Tags verwalten
   */
  static async updateCustomerTags(customerId, tags, action = 'set') {
    try {
      const customer = await this.getCustomer(customerId);
      if (!customer) {
        throw new Error('Kunde nicht gefunden');
      }

      let newTags = [...customer.tags];
      
      if (action === 'add') {
        tags.forEach(tag => {
          if (!newTags.includes(tag)) {
            newTags.push(tag);
          }
        });
      } else if (action === 'remove') {
        newTags = newTags.filter(tag => !tags.includes(tag));
      } else if (action === 'set') {
        newTags = tags;
      }

      const result = await this.updateCustomer(customerId, {
        tags: newTags
      });

      console.log(`[CustomerService] Tags aktualisiert: ${customerId} - ${action} ${tags.join(', ')}`);
      
      return result;

    } catch (error) {
      console.error('[CustomerService] Tag-Update fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Kunden-Statistiken für Dashboard
   */
  static async getCustomerStats() {
    try {
      const customers = await this.getAllCustomers();
      const activeSessions = await this.getActiveCustomerSessions();

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.status === 'active').length,
        deletedCustomers: customers.filter(c => c.status === 'deleted').length,
        newCustomersThisWeek: customers.filter(c => 
          new Date(c.registrationDate) > oneWeekAgo
        ).length,
        newCustomersThisMonth: customers.filter(c => 
          new Date(c.registrationDate) > oneMonthAgo
        ).length,
        currentlyLoggedIn: activeSessions.length,
        planDistribution: this.getPlanDistribution(customers),
        activityStats: this.getActivityStats(customers),
        recentRegistrations: customers
          .filter(c => c.status === 'active')
          .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
          .slice(0, 10),
        topActiveUsers: customers
          .filter(c => c.status === 'active' && c.totalLogins > 0)
          .sort((a, b) => b.totalLogins - a.totalLogins)
          .slice(0, 10)
      };

      return stats;
    } catch (error) {
      console.error('[CustomerService] Stats fehlgeschlagen:', error);
      throw error;
    }
  }

  /**
   * Plan-Verteilung berechnen
   */
  static getPlanDistribution(customers) {
    const distribution = {};
    
    customers.forEach(customer => {
      const plan = customer.planType || 'basic';
      distribution[plan] = (distribution[plan] || 0) + 1;
    });

    return Object.entries(distribution).map(([plan, count]) => ({
      plan,
      count,
      percentage: Math.round((count / customers.length) * 100)
    }));
  }

  /**
   * Aktivitäts-Statistiken berechnen
   */
  static getActivityStats(customers) {
    const activeCustomers = customers.filter(c => c.status === 'active');
    const customersWithLogins = activeCustomers.filter(c => c.totalLogins > 0);
    
    const totalLogins = activeCustomers.reduce((sum, c) => sum + c.totalLogins, 0);
    const averageLogins = customersWithLogins.length > 0 
      ? totalLogins / customersWithLogins.length 
      : 0;

    return {
      totalLogins,
      averageLoginsPerCustomer: Math.round(averageLogins * 10) / 10,
      activeUsersWithLogins: customersWithLogins.length,
      inactiveUsers: activeCustomers.length - customersWithLogins.length,
      mostActiveUser: customersWithLogins.length > 0 
        ? customersWithLogins.reduce((prev, current) => 
            (prev.totalLogins > current.totalLogins) ? prev : current
          )
        : null
    };
  }

  /**
   * Kunden-Daten exportieren
   */
  static async exportCustomers(format = 'json', filters = {}) {
    try {
      const customers = await this.getAllCustomers(filters);
      
      if (format === 'csv') {
        // Einfache CSV-Export-Logik
        const headers = ['ID', 'Name', 'Email', 'Firma', 'Status', 'Plan', 'Registriert', 'Letzter Login', 'Logins'];
        const csvContent = [
          headers.join(','),
          ...customers.map(customer => [
            customer.id,
            `"${customer.name}"`,
            customer.email,
            `"${customer.companyName || ''}"`,
            customer.status,
            customer.planType,
            customer.registrationDate.split('T')[0],
            customer.lastLogin ? customer.lastLogin.split('T')[0] : '',
            customer.totalLogins
          ].join(','))
        ].join('\n');

        return csvContent;
      }
      
      return JSON.stringify(customers, null, 2);
    } catch (error) {
      console.error('[CustomerService] Export fehlgeschlagen:', error);
      throw error;
    }
  }
}

export default CustomerManagementService;