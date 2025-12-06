import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Package, 
  LogOut,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar
} from 'lucide-react';
import { MetricsOverview } from './MetricsOverview';
import { ChartsSection } from './ChartsSection';
import { CustomersTab } from './CustomersTab';
import { OrdersTab } from './OrdersTab';
import { ProductsTab } from './ProductsTab';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2928691d`;

interface DashboardProps {
  session: any;
  onSignOut: () => void;
}

type Tab = 'overview' | 'customers' | 'orders' | 'products';

export function Dashboard({ session, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [metrics, setMetrics] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const storeName = session?.user?.user_metadata?.store_name || 'Your Store';
  const accessToken = session?.access_token;

  useEffect(() => {
    if (accessToken) {
      fetchAllData();
    }
  }, [accessToken, dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMetrics(),
        fetchCustomers(),
        fetchOrders(),
        fetchProducts()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      let url = `${API_URL}/metrics`;
      const params = new URLSearchParams();
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">{storeName}</h1>
                <p className="text-gray-500">Shopify Analytics Dashboard</p>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !metrics ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && metrics && (
              <>
                {/* Date Range Filter */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div className="flex items-center gap-3">
                    <label className="text-gray-700">From:</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <label className="text-gray-700">To:</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    {(dateRange.start || dateRange.end) && (
                      <button
                        onClick={() => setDateRange({ start: '', end: '' })}
                        className="px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <MetricsOverview metrics={metrics} />
                <ChartsSection metrics={metrics} />
              </>
            )}

            {activeTab === 'customers' && (
              <CustomersTab customers={customers} />
            )}

            {activeTab === 'orders' && (
              <OrdersTab orders={orders} />
            )}

            {activeTab === 'products' && (
              <ProductsTab products={products} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
