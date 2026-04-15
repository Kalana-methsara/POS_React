import React, { useEffect, useState } from 'react';
import Table from '../components/Table';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);

  // 1. Fetching logic aligned with your Spring Boot ApiResponse
  const fetchCustomers = async () => {
    const response = await fetch('http://localhost:8080/api/v1/customer/all');
    const json = await response.json();
    // Accessing json.data because your backend wraps the list in ApiResponse
    setCustomers(json.data); 
  };

  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Address', key: 'address' },
    { 
      header: 'Actions', 
      render: (row) => (
        <div className="flex gap-2">
          <button className="text-blue-600 hover:underline">Edit</button>
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
      <Table columns={columns} data={customers} />
    </div>
  );
};