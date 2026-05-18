import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Table from '../components/Table';
import api from '../services/api';
import axios from 'axios';

type Customer = {
  id: string;
  name: string;
  contact: string;
  points: number;
};

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Customer>({
    id: '',
    name: '',
    contact: '',
    points: 0,
  });


  const isEdit = useMemo(() => form.id.trim().length > 0, [form.id]);

  // 1. Fetching logic aligned with your Spring Boot ApiResponse
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/customer/all');
      setCustomers(Array.isArray(response.data?.data) ? response.data.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({ id: '', name: '', contact: '', points: 0 });
  };

  const startEdit = (c: Customer) => {
    setForm({
      id: c.id ?? '',
      name: c.name ?? '',
      contact: c.contact ?? '',
      points: Number.isFinite(c.points) ? c.points : 0,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      contact: form.contact.trim(),
      points: Number(form.points) || 0,
    };

    if (!payload.name) {
      alert('Name is required');
      return;
    }
    if (!payload.contact) {
      alert('Contact is required');
      return;
    }

    setSubmitting(true);
    try {
      await (isEdit ? api.put('/customer', payload) : api.post('/customer', payload));

      // Optimistic UI update (backend returns message string; list refresh is safest)
      await fetchCustomers();
      resetForm();
      alert(isEdit ? 'Customer Updated Successfully' : 'Customer Saved Successfully');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message || err.message
        : err instanceof Error
          ? err.message
          : 'Save failed';
      alert(message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    const ok = confirm(`Delete customer ${id}?`);
    if (!ok) return;

    try {
      await api.delete(`/customer/${encodeURIComponent(id)}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (form.id === id) resetForm();
      alert('Customer Deleted Successfully');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message || err.message
        : err instanceof Error
          ? err.message
          : 'Delete failed';
      alert(message);
      console.error(err);
    }
  };

  const columns = [
    { header: 'ID', key: 'id' as const },
    { header: 'Name', key: 'name' as const },
    { header: 'Contact', key: 'contact' as const },
    { header: 'Points', key: 'points' as const },
    {
      header: 'Actions', 
      render: (row: Customer) => (
        <div className="flex gap-2">
          <button onClick={() => startEdit(row)} className="text-blue-600 hover:underline">Edit</button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>

      <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Customer' : 'Add Customer'}</h2>
          <button
            type="button"
            onClick={resetForm}
            className="text-sm text-gray-600 hover:underline"
            disabled={submitting}
          >
            Clear
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID (only for update)</label>
            <input
              value={form.id}
              onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
              placeholder="C001"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="John"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <input
              value={form.contact}
              onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))}
              placeholder="0771234567"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <input
              type="number"
              value={form.points}
              onChange={(e) => setForm((p) => ({ ...p, points: Number(e.target.value) }))}
              min={0}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-4 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Save'}
            </button>
            {loading ? <span className="text-sm text-gray-500 self-center">Loading...</span> : null}
          </div>
        </form>
      </div>

      <Table columns={columns} data={customers} />
    </div>
  );
};

export default CustomerPage;
