import React, {useState} from 'react';
import bgImage from '../assets/login-bg.png'; 
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  };

  return (
    <div className="h-screen w-screen overflow-hidden  text-white flex flex-col md:flex-row">
      
      <div className="hidden md:block md:flex-1 relative h-full">
        <img
          src={bgImage}
          alt="Cloudr background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      
      <div className="flex-1 h-full flex items-center justify-center p-6">
        <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
          
        
          <div className="flex items-center justify-center gap-3 mb-8">
            <i className="fa-brands fa-soundcloud text-[#ff7a00] text-4xl"></i>
            <h1 className="text-3xl font-bold tracking-wide">Cloudr</h1>
          </div>

          
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-neutral-300" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00] transition"
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
                />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-neutral-300" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff7a00] transition"
              />
            </div>

            <button
              type="submit"
              className="mt-3 w-full bg-[#ff7a00] hover:bg-[#e06b00] text-white font-semibold py-2.5 rounded-lg transition duration-200 active:scale-[0.98]"
              
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-neutral-400 mt-6">
            Don't have an account?{' '}
            <a href="http://localhost:5173/signup" className="text-[#ff7a00] hover:underline font-medium">
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;