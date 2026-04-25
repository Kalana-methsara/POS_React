import { useEffect, useMemo, useState } from 'react';

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

type CartItem = {
  id: string;
  description: string;
  price: number;
  qty: number;
  unit: string;
};

const Order = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [orderDate, setOrderDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [orderQty, setOrderQty] = useState<number>(1);
  const [orderSeq, setOrderSeq] = useState(1);

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }, []);

  const orderId = useMemo(() => `ORD-${String(orderSeq).padStart(3, '0')}`, [orderSeq]);
  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );
  const grandTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.qty, 0),
    [cart]
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customerRes, itemRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/customer/all', { headers: authHeaders }),
        fetch('http://localhost:8080/api/v1/item/all', { headers: authHeaders }),
      ]);

      const customerJson = await customerRes.json().catch(() => ({}));
      const itemJson = await itemRes.json().catch(() => ({}));

      setCustomers(Array.isArray(customerJson?.data) ? customerJson.data : []);
      setItems(Array.isArray(itemJson?.data) ? itemJson.data : []);
    } catch (error) {
      console.error(error);
      alert('Failed to load customers or items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAvailableQty = (itemId: string) => {
    const stockQty = items.find((item) => item.id === itemId)?.quantity ?? 0;
    const qtyInCart = cart.find((line) => line.id === itemId)?.qty ?? 0;
    return stockQty - qtyInCart;
  };

  const addToCart = () => {
    if (!selectedItem) {
      alert('Please select an item');
      return;
    }
    if (!Number.isFinite(orderQty) || orderQty <= 0) {
      alert('Order quantity must be greater than zero');
      return;
    }

    const availableQty = getAvailableQty(selectedItem.id);
    if (orderQty > availableQty) {
      alert(`Only ${availableQty} item(s) available`);
      return;
    }

    setCart((prev) => {
      const index = prev.findIndex((line) => line.id === selectedItem.id);
      if (index === -1) {
        return [
          ...prev,
          {
            id: selectedItem.id,
            description: selectedItem.description,
            price: Number(selectedItem.price) || 0,
            qty: orderQty,
            unit: selectedItem.unit,
          },
        ];
      }

      const updated = [...prev];
      updated[index] = { ...updated[index], qty: updated[index].qty + orderQty };
      return updated;
    });

    setSelectedItemId('');
    setOrderQty(1);
  };

  const removeLine = (itemId: string) => {
    setCart((prev) => prev.filter((line) => line.id !== itemId));
  };


const placeOrder = async () => {
  if (!selectedCustomerId || cart.length === 0) {
    alert('Please select a customer and add items to cart');
    return;
  }

  const orderRequest = {
    customerId: selectedCustomerId,
    orderDetails: cart.map((item) => ({
      itemId: item.id,
      quantity: item.qty,
      unitPrice: item.price,
    })),
  };

  try {
    setLoading(true);
    const response = await fetch('http://localhost:8080/api/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeaders ?? {}),
      },
      body: JSON.stringify(orderRequest),
    });

    const result = await response.json().catch(() => null);
    if (!response.ok) {
      const msg = result?.message || 'Failed to place order';
      throw new Error(msg);
    }

    alert(result?.message || 'Order placed successfully!');
    setCart([]);
    setSelectedItemId('');
    setOrderQty(1);
    setOrderSeq((prev) => prev + 1);
    await fetchData();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error while placing order';
    alert(message);
    console.error('Place order failed:', error);
  } finally {
    setLoading(false);
  }
};

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
                <input type="text" readOnly value={orderId} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.id} - {customer.name}
                    </option>
                  ))}
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
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} - {item.description} (Stock: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Qty</label>
                <input
                  type="number"
                  min={1}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addToCart}
                  className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
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
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      {loading ? 'Loading...' : 'Your cart is empty'}
                    </td>
                  </tr>
                ) : (
                  cart.map((line) => (
                    <tr key={line.id}>
                      <td className="px-6 py-3">{line.description}</td>
                      <td className="px-6 py-3">Rs. {line.price.toFixed(2)}</td>
                      <td className="px-6 py-3">{line.qty}</td>
                      <td className="px-6 py-3">Rs. {(line.price * line.qty).toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Footer / Total */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">Total: Rs. {grandTotal.toFixed(2)}</h3>
              <button
                type="button"
                disabled={loading} // Prevent double-clicking
                onClick={placeOrder}
                className={`px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Order;