"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowLeft, Home } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('haven_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.login(username, password);
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or password. Try homehaven / Haven@123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4 relative selection:bg-black selection:text-white">
      
      {/* Background decoration */}
      <div className="absolute top-10 left-10">
        <a href="/" className="flex items-center space-x-2 text-neutral-500 hover:text-black transition-colors text-xs font-semibold uppercase tracking-wider">
          <ArrowLeft size={14} />
          <span>Back to Site</span>
        </a>
      </div>

      <div className="w-full max-w-md bg-white border border-neutral-200/80 rounded-[2rem] p-10 shadow-lg space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto shadow-md">
            <Lock className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-black font-semibold">Home Haven Console</h2>
            <p className="text-xs text-neutral-400 mt-1">Authenticate to access property & eShop controls</p>
          </div>
        </div>

        {error && (
          <div className="bg-neutral-50 border border-neutral-250 p-4 rounded-xl text-center text-xs text-black font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Username</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-neutral-400" size={16} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="homehaven"
                className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-neutral-400" size={16} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold py-4 rounded-2xl transition-colors uppercase text-xs tracking-widest shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-[10px] text-neutral-400 pt-2">
          Authorized personnel only. Logs are recorded.
        </div>

      </div>

    </div>
  );
}
