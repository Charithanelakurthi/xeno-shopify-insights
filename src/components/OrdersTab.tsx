import { ShoppingCart, User, Package, Calendar, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  products: Array<{ title: string; quantity: number; price: number }>;
  total: number;
  status: string;
  createdAt: string;
}

interface OrdersTabProps {
  orders: Order[];
}

export function OrdersTab({ orders }: OrdersTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-gray-900">Orders</h2>
            <p className="text-gray-600">
              Total: {orders.length} orders
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Order #</th>
              <th className="px-6 py-3 text-left text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-gray-700">Products</th>
              <th className="px-6 py-3 text-left text-gray-700">Total</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-indigo-600">{order.orderNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <User className="w-4 h-4 text-gray-500" />
                    {order.customerName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-gray-500 mt-1">
                    {order.products.map(p => `${p.title} (${p.quantity})`).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
