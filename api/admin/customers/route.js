/**
 * Admin Customer Management API
 * Manages customer data, projects, and communications
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '../../utils/auth.js';
import { customerData, mockDemoCustomer } from '../../../data/customerData.js';

// Mock customer database
let customerDatabase = [
  customerData,
  mockDemoCustomer,
  {
    id: 'cus_003',
    name: 'Anna Schmidt',
    email: 'a.schmidt@biohof-muenchen.de',
    companyName: 'Biohof Schmidt',
    address: 'Bauernstraße 5, 82362 Weilheim',
    phone: '+49 881 345678',
    projects: [
      {
        id: 'proj_agri_001',
        name: 'Agri-PV Anlage Biohof Weilheim',
        status: 'In Planung',
        power: '120 kWp',
        startDate: '2025-02-15',
        offers: [
          { id: 'offer_agri_001', date: '2024-11-01', amount: 95000, status: 'angenommen', pdfUrl: '#' }
        ],
        invoices: [],
        history: [
          { date: '2024-11-01', event: 'Angebot angenommen' },
          { date: '2024-10-15', event: 'Anfrage für Agri-PV erhalten' }
        ],
        messages: [
          { id: 'msg_agri_001', date: '2024-10-20', from: 'ZOE Solar', text: 'Guten Tag Frau Schmidt, wir freuen uns auf die Agri-PV Zusammenarbeit. Die Planung beginnt im November.' }
        ]
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const company = searchParams.get('company');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    let filteredCustomers = [...customerDatabase];

    // Filter by project status
    if (status) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.projects.some(project => 
          project.status.toLowerCase().includes(status.toLowerCase())
        )
      );
    }

    // Filter by company name
    if (company) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.companyName.toLowerCase().includes(company.toLowerCase()) ||
        customer.name.toLowerCase().includes(company.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    // Generate statistics
    const stats = {
      total: filteredCustomers.length,
      byStatus: filteredCustomers.reduce((acc, customer) => {
        customer.projects.forEach(project => {
          acc[project.status] = (acc[project.status] || 0) + 1;
        });
        return acc;
      }, {}),
      totalProjects: filteredCustomers.reduce((acc, customer) => 
        acc + customer.projects.length, 0),
      totalRevenue: filteredCustomers.reduce((acc, customer) => {
        return acc + customer.projects.reduce((projAcc, project) => {
          return projAcc + project.invoices
            .filter(inv => inv.status === 'bezahlt')
            .reduce((invAcc, inv) => invAcc + inv.amount, 0);
        }, 0);
      }, 0)
    };

    return NextResponse.json({
      data: paginatedCustomers,
      pagination: {
        page,
        limit,
        total: filteredCustomers.length,
        pages: Math.ceil(filteredCustomers.length / limit)
      },
      stats,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=180'
      }
    });

  } catch (error) {
    console.error('Customer retrieval error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to retrieve customers'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const customerData = await request.json();

    // Validate required fields
    if (!customerData.name || !customerData.email || !customerData.companyName) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'Name, email, and company name are required'
      }, { status: 400 });
    }

    // Check for duplicate email
    const existingCustomer = customerDatabase.find(c => c.email === customerData.email);
    if (existingCustomer) {
      return NextResponse.json({
        error: 'Customer already exists',
        message: 'A customer with this email already exists'
      }, { status: 409 });
    }

    // Create new customer
    const newCustomer = {
      id: `cus_${Date.now()}`,
      name: customerData.name,
      email: customerData.email,
      companyName: customerData.companyName,
      address: customerData.address || '',
      phone: customerData.phone || '',
      projects: []
    };

    customerDatabase.push(newCustomer);

    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Customer creation error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to create customer'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) {
      return NextResponse.json({
        error: 'Missing customer ID',
        message: 'Customer ID is required for updates'
      }, { status: 400 });
    }

    const updateData = await request.json();
    
    // Find and update customer
    const customerIndex = customerDatabase.findIndex(c => c.id === customerId);
    
    if (customerIndex === -1) {
      return NextResponse.json({
        error: 'Customer not found',
        message: 'Customer does not exist'
      }, { status: 404 });
    }

    // Update customer data
    customerDatabase[customerIndex] = {
      ...customerDatabase[customerIndex],
      ...updateData,
      // Prevent updating ID
      id: customerDatabase[customerIndex].id
    };

    return NextResponse.json({
      success: true,
      data: customerDatabase[customerIndex],
      message: 'Customer updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to update customer'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('id');

    if (!customerId) {
      return NextResponse.json({
        error: 'Missing customer ID',
        message: 'Customer ID is required for deletion'
      }, { status: 400 });
    }

    // Find and remove customer
    const customerIndex = customerDatabase.findIndex(c => c.id === customerId);
    
    if (customerIndex === -1) {
      return NextResponse.json({
        error: 'Customer not found',
        message: 'Customer does not exist'
      }, { status: 404 });
    }

    customerDatabase.splice(customerIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Customer deletion error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to delete customer'
    }, { status: 500 });
  }
}

// Export customer data in different formats
export async function export(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.valid) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Valid authentication token required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    if (format === 'csv') {
      // Generate CSV data
      const csvHeaders = 'Name,Email,Company,Phone,Projects,Revenue\n';
      const csvRows = customerDatabase.map(customer => {
        const projects = customer.projects.length;
        const revenue = customer.projects.reduce((sum, project) => {
          return sum + project.invoices
            .filter(inv => inv.status === 'bezahlt')
            .reduce((invSum, inv) => invSum + inv.amount, 0);
        }, 0);
        
        return `"${customer.name}","${customer.email}","${customer.companyName}","${customer.phone}",${projects},${revenue}`;
      }).join('\n');

      const csvContent = csvHeaders + csvRows;

      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Default JSON export
    return NextResponse.json({
      data: customerDatabase,
      exportDate: new Date().toISOString(),
      totalCustomers: customerDatabase.length
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="customers-${new Date().toISOString().split('T')[0]}.json"`
      }
    });

  } catch (error) {
    console.error('Customer export error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to export customer data'
    }, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}