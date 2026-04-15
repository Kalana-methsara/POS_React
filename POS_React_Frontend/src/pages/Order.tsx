import React from 'react';

const Order = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Place New Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Order & Customer Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Order Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Order ID</label>
                <input type="text" readOnly value="ORD-001" className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Customer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Item Selection & Cart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-green-600">Select Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Item</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Item</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Qty</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-end">
                <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Cart Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Qty</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Your cart is empty</td>
                </tr>
              </tbody>
            </table>
            
            {/* Footer / Total */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">Total: $0.00</h3>
              <button className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700">
                Place Order
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Order;