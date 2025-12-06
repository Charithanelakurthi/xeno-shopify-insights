import { Users, Mail, Calendar, DollarSign, ShoppingBag } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

interface CustomersTabProps {
  customers: Customer[];
}

export function CustomersTab({ customers }: CustomersTabProps) {
  // Sort by total spent descending
  const sortedCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-gray-900">Customers</h2>
            <p className="text-gray-600">
              Total: {customers.length} customers
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-gray-700">Total Spent</th>
              <th className="px-6 py-3 text-left text-gray-700">Orders</th>
              <th className="px-6 py-3 text-left text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-700">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-gray-900">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {customer.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    ${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ShoppingBag className="w-4 h-4" />
                    {customer.ordersCount}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
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
