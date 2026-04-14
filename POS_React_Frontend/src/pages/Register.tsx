import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../services/api';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {

      // Data matches your Spring Boot RegisterDTO
      const registerData = {
        username: username.trim(),
        email: email.trim(),
        password: password,
        role: "USER"
      };

      const response = await api.post('/register', registerData);

      if (response.status === 200) {
        alert("Registration Successful!");
        navigate('/login')
      }
    } catch (error) {
      alert("Registration failed. Email might already exist.");
      console.error(error);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join us today! It only takes a minute</p>
        </div>

        {/* Form Sections */}
        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="JohnDoe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Register Button */}
          <button type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md">
            Create Account
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?
          <a href="/login" className="text-green-600 font-bold ml-1 hover:underline">Login here</a>
        </div>
      </div>
    </div>
  )
}

export default Register