'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  reservedStock: number;
  incomingStock: number;
  lastRestocked: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface StockMovement {
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  notes?: string;
}

export default function InventoryTracker() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementData, setMovementData] = useState<StockMovement>({
    type: 'in',
    quantity: 0,
    reason: '',
    notes: '',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/admin/inventory');
      setInventory(response.data);
    } catch (error) {
      setError('Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleStockMovement = async () => {
    if (!selectedItem) return;

    try {
      await api.post(`/admin/inventory/${selectedItem._id}/movement`, movementData);
      await fetchInventory();
      setShowMovementModal(false);
      setMovementData({
        type: 'in',
        quantity: 0,
        reason: '',
        notes: '',
      });
    } catch (error) {
      setError('Failed to update inventory');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <p className="mt-2 text-sm text-gray-600">
          Track and manage your product inventory
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.currentStock}</div>
                    {item.incomingStock > 0 && (
                      <div className="text-xs text-green-600">
                        +{item.incomingStock} incoming
                      </div>
                    )}
                    {item.reservedStock > 0 && (
                      <div className="text-xs text-blue-600">
                        {item.reservedStock} reserved
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowMovementModal(true);
                      }}
                    >
                      Update Stock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Modal */}
      {showMovementModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Stock - {selectedItem.productName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Movement Type
                </label>
                <select
                  value={movementData.type}
                  onChange={(e) =>
                    setMovementData({ ...movementData, type: e.target.value as 'in' | 'out' })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={movementData.quantity}
                  onChange={(e) =>
                    setMovementData({ ...movementData, quantity: parseInt(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <select
                  value={movementData.reason}
                  onChange={(e) =>
                    setMovementData({ ...movementData, reason: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a reason</option>
                  <option value="purchase">Purchase Order</option>
                  <option value="return">Customer Return</option>
                  <option value="damage">Damaged/Lost</option>
                  <option value="adjustment">Inventory Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={movementData.notes}
                  onChange={(e) =>
                    setMovementData({ ...movementData, notes: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowMovementModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleStockMovement}>Update Stock</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
