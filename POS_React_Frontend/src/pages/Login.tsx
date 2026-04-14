import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const navigate = useNavigate();

    const handleLogin = async (e) =>{
        e.preventDefault();
        try{

            if(true){
                alert("Login Success!");
                navigate('/dashboard'); // Dashboard එකට යවන්න
            }
        }catch(error){
            alert("Invalid Credentials!");
            console.error(error);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Please enter your details to login</p>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Email/Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="text" 
              placeholder="example@mail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>

          {/* Login Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md" onClick={handleLogin}>
            Sign In
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? 
          <a href="/register" className="text-blue-600 font-bold ml-1 hover:underline">Register here</a>
        </div>
      </div>
    </div>
  )
}

export default Login    