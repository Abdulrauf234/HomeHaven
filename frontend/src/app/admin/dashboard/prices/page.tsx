"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, Edit2, Save, X, Plus, Trash2, 
  TrendingUp, LogOut, ArrowLeft, Check
} from 'lucide-react';
import { api, Snack } from '@/lib/api';

export default function PricingPage() {
  const router = useRouter();
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('haven_token');
    if (!token) {
      router.push('/admin');
    } else {
      fetchSnacks();
    }
  }, [router]);

  const fetchSnacks = async () => {
    try {
      const prods = await api.getSnacks({});
      setSnacks(prods);
    } catch (e) {
      console.error('Error fetching snacks:', e);
    }
  };

  const handleEditStart = (snackId: string, currentPrice: number) => {
    setEditingId(snackId);
    setEditedPrices({ [snackId]: currentPrice });
  };

  const handlePriceChange = (snackId: string, newPrice: number) => {
    setEditedPrices(prev => ({ ...prev, [snackId]: newPrice }));
  };

  const handleSavePrice = async (snackId: string) => {
    if (!editedPrices[snackId]) return;
    setLoading(true);
    try {
      const snack = snacks.find(p => p.id === snackId);
      if (!snack) return;

      await api.updateSnack(snackId, {
        ...snack,
        price: editedPrices[snackId]
      });

      setSnacks(prev =>
        prev.map(p =>
          p.id === snackId ? { ...p, price: editedPrices[snackId] } : p
        )
      );

      setMessage('Price updated successfully!');
      setEditingId(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage('Error updating price');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedPrices({});
  };

  const handleLogout = () => {
    localStorage.removeItem('haven_token');
    router.push('/admin');
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-12 selection:bg-black selection:text-white">
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-black">Price Management</h1>
                <p className="text-xs text-neutral-500">Manage all snack pricing</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
        
        {/* Alert Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.includes('successfully') ? (
              <Check size={20} />
            ) : (
              <X size={20} />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium mb-1">Total Snacks</p>
                <p className="text-3xl font-bold text-black">{snacks.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium mb-1">Average Price</p>
                <p className="text-3xl font-bold text-black">
                  ${(snacks.reduce((sum, p) => sum + p.price, 0) / snacks.length || 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm font-medium mb-1">Total Inventory Value</p>
                <p className="text-3xl font-bold text-black">
                  ${snacks.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Plus className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Snack Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {snacks.map((snack) => (
                  <tr key={snack.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-black text-sm">{snack.name}</p>
                        <p className="text-neutral-500 text-xs mt-1">{snack.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full">
                        {snack.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === snack.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-neutral-600 font-medium">$</span>
                          <input
                            type="number"
                            value={editedPrices[snack.id] || snack.price}
                            onChange={(e) => handlePriceChange(snack.id, parseFloat(e.target.value))}
                            className="w-24 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-black text-sm font-semibold"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      ) : (
                        <p className="font-bold text-black text-lg">${snack.price.toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        snack.availability === 'In Stock'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {snack.stock || 0} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {editingId === snack.id ? (
                          <>
                            <button
                              onClick={() => handleSavePrice(snack.id)}
                              disabled={loading}
                              className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors disabled:opacity-50"
                              title="Save price"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditStart(snack.id, snack.price)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                            title="Edit price"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {snacks.length === 0 && (
            <div className="py-12 text-center text-neutral-500">
              <DollarSign size={48} className="mx-auto opacity-30 mb-4" />
              <p className="font-light">No snacks to manage pricing for</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
