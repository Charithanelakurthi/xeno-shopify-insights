import { Package, Hash, DollarSign, Layers } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  sku: string;
  inventory: number;
}

interface ProductsTabProps {
  products: Product[];
}

export function ProductsTab({ products }: ProductsTabProps) {
  // Sort by inventory descending
  const sortedProducts = [...products].sort((a, b) => b.inventory - a.inventory);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-gray-900">Products</h2>
            <p className="text-gray-600">
              Total: {products.length} products
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Product Name</th>
              <th className="px-6 py-3 text-left text-gray-700">SKU</th>
              <th className="px-6 py-3 text-left text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-gray-700">Inventory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-gray-900">{product.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash className="w-4 h-4" />
                    {product.sku}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-900">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span
                      className={`${
                        product.inventory < 30
                          ? 'text-red-600'
                          : product.inventory < 50
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {product.inventory} units
                    </span>
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
