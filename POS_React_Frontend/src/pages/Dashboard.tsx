import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

type Customer = {
  id: string;
  name: string;
  contact: string;
  points: number;
};

type Item = {
  id: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
};

const LOW_STOCK_LIMIT = 10;

const Dashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [customerRes, itemRes] = await Promise.all([
        api.get('/customer/all'),
        api.get('/item/all'),
      ]);
      setCustomers(Array.isArray(customerRes.data?.data) ? customerRes.data.data : []);
      setItems(Array.isArray(itemRes.data?.data) ? itemRes.data.data : []);
    } catch (error) {
      console.error(error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalCustomers = customers.length;
  const totalItems = items.length;
  const totalStock = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const lowStockItems = items
    .filter((item) => (Number(item.quantity) || 0) <= LOW_STOCK_LIMIT)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);
  const recentCustomers = customers.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your POS system</p>
        </div>
        <button
          type="button"
          onClick={() => void fetchDashboardData()}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm text-blue-700">Total Customers</p>
          <h3 className="text-2xl font-bold text-blue-900 mt-2">{totalCustomers}</h3>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-5">
          <p className="text-sm text-green-700">Total Items</p>
          <h3 className="text-2xl font-bold text-green-900 mt-2">{totalItems}</h3>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
          <p className="text-sm text-purple-700">Stock Units</p>
          <h3 className="text-2xl font-bold text-purple-900 mt-2">{totalStock}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Low Stock Items</h2>
            <Link to="/item" className="text-sm text-blue-600 hover:underline">
              Manage Items
            </Link>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-gray-500">No low stock items found.</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs text-gray-500">{item.id}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{item.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Customers</h2>
            <Link to="/customer" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          {recentCustomers.length === 0 ? (
            <p className="text-sm text-gray-500">No customers available.</p>
          ) : (
            <div className="space-y-3">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="font-medium text-sm">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.contact}</p>
                  </div>
                  <span className="text-xs rounded-full px-2 py-1 bg-gray-100 text-gray-600">{customer.id}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/order" className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
            Place New Order
          </Link>
          <Link to="/customer" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
            Add Customer
          </Link>
          <Link to="/item" className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700">
            Add Item
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
