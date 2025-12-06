import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper to verify auth
async function verifyAuth(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No token provided', userId: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Unauthorized', userId: null };
  }
  
  return { error: null, userId: user.id };
}

// Sign up endpoint
app.post('/make-server-2928691d/signup', async (c) => {
  try {
    const { email, password, storeName } = await c.req.json();
    
    if (!email || !password || !storeName) {
      return c.json({ error: 'Email, password, and store name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { store_name: storeName },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create tenant record
    const tenantId = data.user.id;
    await kv.set(`tenant:${tenantId}`, {
      id: tenantId,
      email,
      storeName,
      createdAt: new Date().toISOString()
    });

    // Initialize sample data for demo
    await initializeSampleData(tenantId);

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Error during signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Initialize sample Shopify data
async function initializeSampleData(tenantId: string) {
  // Sample customers
  const customers = [
    { id: 'cust_1', name: 'John Smith', email: 'john@example.com', totalSpent: 5420.00, ordersCount: 12, createdAt: '2024-08-15' },
    { id: 'cust_2', name: 'Sarah Johnson', email: 'sarah@example.com', totalSpent: 3890.50, ordersCount: 8, createdAt: '2024-09-02' },
    { id: 'cust_3', name: 'Mike Williams', email: 'mike@example.com', totalSpent: 7250.75, ordersCount: 15, createdAt: '2024-07-20' },
    { id: 'cust_4', name: 'Emily Davis', email: 'emily@example.com', totalSpent: 2340.00, ordersCount: 5, createdAt: '2024-10-10' },
    { id: 'cust_5', name: 'Robert Brown', email: 'robert@example.com', totalSpent: 4180.25, ordersCount: 9, createdAt: '2024-08-28' },
    { id: 'cust_6', name: 'Lisa Anderson', email: 'lisa@example.com', totalSpent: 1890.00, ordersCount: 4, createdAt: '2024-11-05' },
    { id: 'cust_7', name: 'David Martinez', email: 'david@example.com', totalSpent: 6320.50, ordersCount: 13, createdAt: '2024-07-30' },
  ];

  for (const customer of customers) {
    await kv.set(`tenant:${tenantId}:customer:${customer.id}`, customer);
  }

  // Sample products
  const products = [
    { id: 'prod_1', title: 'Wireless Headphones', price: 129.99, sku: 'WH-001', inventory: 45 },
    { id: 'prod_2', title: 'Smart Watch', price: 299.99, sku: 'SW-002', inventory: 23 },
    { id: 'prod_3', title: 'Laptop Stand', price: 49.99, sku: 'LS-003', inventory: 67 },
    { id: 'prod_4', title: 'USB-C Cable', price: 19.99, sku: 'UC-004', inventory: 150 },
    { id: 'prod_5', title: 'Mechanical Keyboard', price: 159.99, sku: 'MK-005', inventory: 34 },
  ];

  for (const product of products) {
    await kv.set(`tenant:${tenantId}:product:${product.id}`, product);
  }

  // Sample orders (last 90 days)
  const orders = [];
  const orderStatuses = ['fulfilled', 'pending', 'cancelled'];
  let orderId = 1;

  for (let i = 0; i < 53; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const total = product.price * quantity;

    orders.push({
      id: `order_${orderId++}`,
      orderNumber: `#${1000 + orderId}`,
      customerId: customer.id,
      customerName: customer.name,
      products: [{ ...product, quantity }],
      total,
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      createdAt: date.toISOString()
    });
  }

  for (const order of orders) {
    await kv.set(`tenant:${tenantId}:order:${order.id}`, order);
  }

  console.log(`Initialized sample data for tenant ${tenantId}`);
}

// Get dashboard metrics
app.get('/make-server-2928691d/metrics', async (c) => {
  try {
    const { error, userId } = await verifyAuth(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    // Get all customers
    const customers = await kv.getByPrefix(`tenant:${userId}:customer:`);
    
    // Get all orders
    const allOrders = await kv.getByPrefix(`tenant:${userId}:order:`);
    
    // Filter orders by date range if provided
    let orders = allOrders;
    if (startDate || endDate) {
      orders = allOrders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        if (startDate && orderDate < new Date(startDate)) return false;
        if (endDate && orderDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Calculate metrics
    const totalRevenue = orders.reduce((sum: number, order: any) => 
      order.status !== 'cancelled' ? sum + order.total : sum, 0
    );

    const totalOrders = orders.filter((o: any) => o.status !== 'cancelled').length;

    // Orders by date
    const ordersByDate: Record<string, number> = {};
    const revenueByDate: Record<string, number> = {};
    
    orders.forEach((order: any) => {
      if (order.status === 'cancelled') return;
      const date = order.createdAt.split('T')[0];
      ordersByDate[date] = (ordersByDate[date] || 0) + 1;
      revenueByDate[date] = (revenueByDate[date] || 0) + order.total;
    });

    // Top customers by spend
    const customerSpendMap: Record<string, { name: string; spent: number; orders: number }> = {};
    
    allOrders.forEach((order: any) => {
      if (order.status === 'cancelled') return;
      if (!customerSpendMap[order.customerId]) {
        customerSpendMap[order.customerId] = {
          name: order.customerName,
          spent: 0,
          orders: 0
        };
      }
      customerSpendMap[order.customerId].spent += order.total;
      customerSpendMap[order.customerId].orders += 1;
    });

    const topCustomers = Object.entries(customerSpendMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    // Order status distribution
    const statusDistribution: Record<string, number> = {};
    orders.forEach((order: any) => {
      statusDistribution[order.status] = (statusDistribution[order.status] || 0) + 1;
    });

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return c.json({
      totalCustomers: customers.length,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      ordersByDate: Object.entries(ordersByDate).map(([date, count]) => ({ 
        date, 
        orders: count,
        revenue: parseFloat((revenueByDate[date] || 0).toFixed(2))
      })).sort((a, b) => a.date.localeCompare(b.date)),
      topCustomers: topCustomers.map(c => ({
        ...c,
        spent: parseFloat(c.spent.toFixed(2))
      })),
      statusDistribution
    });
  } catch (error) {
    console.log('Error fetching metrics:', error);
    return c.json({ error: 'Internal server error while fetching metrics' }, 500);
  }
});

// Get customers list
app.get('/make-server-2928691d/customers', async (c) => {
  try {
    const { error, userId } = await verifyAuth(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const customers = await kv.getByPrefix(`tenant:${userId}:customer:`);
    return c.json({ customers });
  } catch (error) {
    console.log('Error fetching customers:', error);
    return c.json({ error: 'Internal server error while fetching customers' }, 500);
  }
});

// Get orders list
app.get('/make-server-2928691d/orders', async (c) => {
  try {
    const { error, userId } = await verifyAuth(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const orders = await kv.getByPrefix(`tenant:${userId}:order:`);
    // Sort by date descending
    orders.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ orders });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: 'Internal server error while fetching orders' }, 500);
  }
});

// Get products list
app.get('/make-server-2928691d/products', async (c) => {
  try {
    const { error, userId } = await verifyAuth(c.req.raw);
    if (error) {
      return c.json({ error }, 401);
    }

    const products = await kv.getByPrefix(`tenant:${userId}:product:`);
    return c.json({ products });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Internal server error while fetching products' }, 500);
  }
});

// Webhook endpoint for Shopify data sync (simulated)
app.post('/make-server-2928691d/webhook/orders', async (c) => {
  try {
    // In production, verify Shopify HMAC signature here
    const orderData = await c.req.json();
    const tenantId = c.req.header('X-Tenant-ID');

    if (!tenantId) {
      return c.json({ error: 'Tenant ID required' }, 400);
    }

    // Store the order
    await kv.set(`tenant:${tenantId}:order:${orderData.id}`, orderData);

    console.log(`Webhook received: Order ${orderData.id} for tenant ${tenantId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error processing webhook:', error);
    return c.json({ error: 'Internal server error during webhook processing' }, 500);
  }
});

Deno.serve(app.fetch);
