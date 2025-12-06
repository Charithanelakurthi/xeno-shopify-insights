import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: number;
  };
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Customers',
      value: metrics.totalCustomers.toLocaleString(),
      icon: Users,
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Avg Order Value',
      value: `$${metrics.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.lightBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
            <h3 className="text-gray-600 mb-1">{card.title}</h3>
            <p className="text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}
