import { useState, useMemo, useEffect, type FormEvent } from 'react';

type Item = {
  id: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
};

const UNIT_OPTIONS = ['KG', 'L', 'PCS', 'PACKET', 'BOTTLE'] as const;
const UNIT_LABELS: Record<(typeof UNIT_OPTIONS)[number], string> = {
  KG: 'Kg',
  L: 'L',
  PCS: 'Pcs',
  PACKET: 'Pkt',
  BOTTLE: 'Btl',
};

const ItemPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Item>({
    id: '',
    description: '',
    price: 0,
    quantity: 0,
    unit: '',
  });

  // form.id තියෙනවා නම් = edit mode
  const isEdit = useMemo(() => form.id.trim().length > 0, [form.id]);

  // localStorage එකෙන් token ගන්නවා
  const authHeaders = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }, []);

  // ── Fetch ──────────────────────────────────────────
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/item/all', {
        headers: authHeaders,
      });
      const json = await response.json();
      setItems(Array.isArray(json?.data) ? json.data : []);
    } finally {
      setLoading(false);
    }
  };

  // Mount වෙද්දී එකපාරක් run වෙනවා
  useEffect(() => {
    void fetchItems();
  }, []);

  // ── Helpers ────────────────────────────────────────
  const resetForm = () => {
    setForm({ id: '', description: '', price: 0, quantity: 0, unit: '' });
  };

  const startEdit = (item: Item) => {
    setForm({
      id: item.id,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
    });
  };

  // ── Save / Update ──────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      id: form.id.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      quantity: Number(form.quantity) || 0,
      unit: form.unit.trim().toUpperCase(),
    };

    if (!payload.description) { alert('Description is required'); return; }
    if (!payload.unit) { alert('Unit is required'); return; }
    if (!UNIT_OPTIONS.includes(payload.unit as (typeof UNIT_OPTIONS)[number])) {
      alert('Invalid unit selected');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/item', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...(authHeaders ?? {}) },
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.message || 'Request failed');

      await fetchItems();
      resetForm();
      alert(isEdit ? 'Item Updated Successfully' : 'Item Saved Successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm(`Delete item ${id}?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/item/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.message || 'Delete failed');

      // State එකෙන් deleted item remove කරනවා
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (form.id === id) resetForm();
      alert('Item Deleted Successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  // ── UI ─────────────────────────────────────────────
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Item Management</h1>

      {/* Form Section */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Item' : 'Add Item'}</h2>
          <button type="button" onClick={resetForm} className="text-sm text-gray-600 hover:underline">
            Clear
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Code (only for update)</label>
            <input
              value={form.id}
              onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
              placeholder="I001"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Milk Powder"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
              placeholder="0.00"
              min={0}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qty On Hand</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))}
              placeholder="0"
              min={0}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select unit</option>
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit} value={unit}>
                  {UNIT_LABELS[unit]}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 flex gap-3 items-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-60"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Item' : 'Save Item'}
            </button>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Code</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Qty</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Unit</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  {loading ? 'Loading...' : 'No items available.'}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{item.id}</td>
                  <td className="px-6 py-4 text-sm">{item.description}</td>
                  <td className="px-6 py-4 text-sm">{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm">{UNIT_LABELS[item.unit as keyof typeof UNIT_LABELS] ?? item.unit}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemPage;