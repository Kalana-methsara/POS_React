import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Customer from './pages/Customer'
import Item from './pages/Item'
import Order from './pages/Order'
import MainLayout from './components/MainLayout' 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mulinma load wenne meka (Root Path) */}
        <Route path="/" element={<Login />} />
        
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Layout ekath ekka yana routes */}
        <Route element={<MainLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/item" element={<Item />} />
          <Route path='/order' element={<Order />} />
        </Route>

        {/* Nathi path ekak gahuwoth login ekata redirect karanna */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App