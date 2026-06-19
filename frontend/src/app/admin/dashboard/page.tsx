"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LogOut, Plus, Edit2, Trash2, X, Upload, 
  Settings, ShoppingBag, MessageSquare, Menu, CheckCircle
} from 'lucide-react';
import { api, Equipment, Snack, Enquiry } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();

  // Data lists
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<'equipment' | 'snacks' | 'enquiries'>('equipment');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modals
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isSnackModalOpen, setIsSnackModalOpen] = useState(false);

  // Editing state
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
  const [editingSnackId, setEditingSnackId] = useState<string | null>(null);

  // Forms
  const [equipmentForm, setEquipmentForm] = useState({
    title: '',
    type: 'Slicing',
    capacity: '',
    power: '',
    price: '',
    description: '',
    images: [] as string[],
    availability: 'Available' as 'Available' | 'Sold'
  });

  const [snackForm, setSnackForm] = useState({
    name: '',
    category: 'Plantain Chips',
    price: '',
    stock: '',
    description: '',
    image: '',
    availability: 'In Stock' as 'In Stock' | 'Out of Stock'
  });

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const eqFileInputRef = useRef<HTMLInputElement>(null);
  const snackFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('haven_token');
    if (!token) {
      router.push('/admin');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const eq = await api.getEquipment({});
      const snks = await api.getSnacks({});
      const enqs = await api.getEnquiries();
      setEquipment(eq);
      setSnacks(snks);
      setEnquiries(enqs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haven_token');
    router.push('/admin');
  };

  // EQUIPMENT CRUD
  const resetEquipmentForm = () => {
    setEquipmentForm({
      title: '',
      type: 'Slicing',
      capacity: '',
      power: '',
      price: '',
      description: '',
      images: [],
      availability: 'Available'
    });
    setEditingEquipmentId(null);
  };

  const handleEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: equipmentForm.title,
        type: equipmentForm.type,
        capacity: equipmentForm.capacity,
        power: equipmentForm.power,
        price: Number(equipmentForm.price),
        description: equipmentForm.description,
        images: equipmentForm.images.length > 0 ? equipmentForm.images : ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"],
        availability: equipmentForm.availability
      };

      if (editingEquipmentId) {
        await api.updateEquipment(editingEquipmentId, payload);
      } else {
        await api.createEquipment(payload);
      }
      setIsEquipmentModalOpen(false);
      resetEquipmentForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editEquipment = (eq: Equipment) => {
    setEditingEquipmentId(eq.id);
    setEquipmentForm({
      title: eq.title,
      type: eq.type,
      capacity: eq.capacity,
      power: eq.power,
      price: String(eq.price),
      description: eq.description,
      images: eq.images,
      availability: eq.availability
    });
    setIsEquipmentModalOpen(true);
  };

  const deleteEquipment = async (id: string) => {
    if (confirm('Delete this equipment?')) {
      await api.deleteEquipment(id);
      fetchData();
    }
  };

  // SNACK CRUD
  const resetSnackForm = () => {
    setSnackForm({
      name: '',
      category: 'Plantain Chips',
      price: '',
      stock: '',
      description: '',
      image: '',
      availability: 'In Stock'
    });
    setEditingSnackId(null);
  };

  const handleSnackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: snackForm.name,
        category: snackForm.category,
        price: Number(snackForm.price),
        stock: Number(snackForm.stock),
        description: snackForm.description,
        image: snackForm.image || "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80",
        availability: snackForm.availability
      };

      if (editingSnackId) {
        await api.updateSnack(editingSnackId, payload);
      } else {
        await api.createSnack(payload);
      }
      setIsSnackModalOpen(false);
      resetSnackForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editSnack = (snk: Snack) => {
    setEditingSnackId(snk.id);
    setSnackForm({
      name: snk.name,
      category: snk.category,
      price: String(snk.price),
      stock: String(snk.stock),
      description: snk.description,
      image: snk.image,
      availability: snk.availability
    });
    setIsSnackModalOpen(true);
  };

  const deleteSnack = async (id: string) => {
    if (confirm('Delete this snack?')) {
      await api.deleteSnack(id);
      fetchData();
    }
  };

  // UPLOAD
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'equipment' | 'snack') => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const url = await api.uploadImage(file);
      if (target === 'equipment') {
        setEquipmentForm(prev => ({ ...prev, images: [...prev.images, url] }));
      } else {
        setSnackForm(prev => ({ ...prev, image: url }));
      }
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center mr-3">
            <span className="text-[var(--text-dark)] font-bold text-lg">G</span>
          </div>
          <span className="font-bold text-[var(--text-dark)]">Admin Panel</span>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('equipment')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'equipment' ? 'bg-[var(--primary)] text-[var(--text-dark)] font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Settings size={20} />
            <span>Equipment</span>
          </button>
          <button onClick={() => setActiveTab('snacks')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'snacks' ? 'bg-[var(--primary)] text-[var(--text-dark)] font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ShoppingBag size={20} />
            <span>Snacks</span>
          </button>
          <button onClick={() => setActiveTab('enquiries')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'enquiries' ? 'bg-[var(--primary)] text-[var(--text-dark)] font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
            <MessageSquare size={20} />
            <span>Enquiries</span>
          </button>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 lg:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 p-2 -ml-2">
            <Menu size={24} />
          </button>
          <span className="font-bold text-[var(--text-dark)] ml-4">Admin Panel</span>
        </div>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'equipment' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Processing Equipment</h1>
                <button onClick={() => { resetEquipmentForm(); setIsEquipmentModalOpen(true); }} className="bg-[var(--text-dark)] text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <Plus size={18} />
                  <span>Add Equipment</span>
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map(eq => (
                      <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                              {eq.images?.[0] ? (
                                <Image src={eq.images[0]} alt="" fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-200"></div>
                              )}
                            </div>
                            <span>{eq.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{eq.type}</td>
                        <td className="px-6 py-4">${eq.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${eq.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {eq.availability}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => editEquipment(eq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 size={16} /></button>
                          <button onClick={() => deleteEquipment(eq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'snacks' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Snacks Inventory</h1>
                <button onClick={() => { resetSnackForm(); setIsSnackModalOpen(true); }} className="bg-[var(--text-dark)] text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <Plus size={18} />
                  <span>Add Snack</span>
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Stock</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snacks.map(snk => (
                      <tr key={snk.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative flex-shrink-0">
                              {snk.image ? (
                                <Image src={snk.image} alt="" fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-200"></div>
                              )}
                            </div>
                            <span>{snk.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{snk.category}</td>
                        <td className="px-6 py-4">{snk.stock}</td>
                        <td className="px-6 py-4">${snk.price}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => editSnack(snk)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Edit2 size={16} /></button>
                          <button onClick={() => deleteSnack(snk.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Recent Enquiries</h1>
              <div className="grid gap-4">
                {enquiries.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500">
                    No enquiries yet.
                  </div>
                ) : (
                  enquiries.map(enq => (
                    <div key={enq.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{enq.name}</h3>
                          <p className="text-sm text-gray-500">{enq.phone} {enq.email && `• ${enq.email}`}</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full uppercase tracking-wider">
                          {enq.type}
                        </span>
                      </div>
                      {enq.message && <p className="text-gray-700 bg-gray-50 p-4 rounded-xl text-sm">{enq.message}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Equipment Modal */}
      {isEquipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden my-8">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold">{editingEquipmentId ? 'Edit Equipment' : 'Add Equipment'}</h2>
              <button onClick={() => setIsEquipmentModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleEquipmentSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input required type="text" value={equipmentForm.title} onChange={e => setEquipmentForm({...equipmentForm, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select value={equipmentForm.type} onChange={e => setEquipmentForm({...equipmentForm, type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none">
                    <option>Slicing</option>
                    <option>Frying</option>
                    <option>Grinding</option>
                    <option>Packaging</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input required type="number" value={equipmentForm.price} onChange={e => setEquipmentForm({...equipmentForm, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input type="text" value={equipmentForm.capacity} onChange={e => setEquipmentForm({...equipmentForm, capacity: e.target.value})} placeholder="e.g. 500kg/hr" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Power</label>
                  <input type="text" value={equipmentForm.power} onChange={e => setEquipmentForm({...equipmentForm, power: e.target.value})} placeholder="e.g. 2.2kW" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea required rows={4} value={equipmentForm.description} onChange={e => setEquipmentForm({...equipmentForm, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select value={equipmentForm.availability} onChange={e => setEquipmentForm({...equipmentForm, availability: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none">
                  <option>Available</option>
                  <option>Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <input type="file" accept="image/*" className="hidden" ref={eqFileInputRef} onChange={e => handleImageUpload(e, 'equipment')} />
                <div className="flex gap-4 flex-wrap">
                  {equipmentForm.images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={img} alt="" fill className="object-cover" />
                      <button type="button" onClick={() => setEquipmentForm({...equipmentForm, images: equipmentForm.images.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500"><X size={12} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => eqFileInputRef.current?.click()} className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                    {uploadingImage ? <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div> : <Upload size={24} />}
                  </button>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white z-10 pb-4">
                <button type="button" onClick={() => setIsEquipmentModalOpen(false)} className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl mr-3">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-[var(--text-dark)] text-white font-medium rounded-xl hover:bg-black transition-colors">Save Equipment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snack Modal */}
      {isSnackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden my-8">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold">{editingSnackId ? 'Edit Snack' : 'Add Snack'}</h2>
              <button onClick={() => setIsSnackModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSnackSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input required type="text" value={snackForm.name} onChange={e => setSnackForm({...snackForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={snackForm.category} onChange={e => setSnackForm({...snackForm, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none">
                    <option>Plantain Chips</option>
                    <option>Peanut Burger</option>
                    <option>Kuli Kuli</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input required type="number" value={snackForm.price} onChange={e => setSnackForm({...snackForm, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input required type="number" value={snackForm.stock} onChange={e => setSnackForm({...snackForm, stock: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select value={snackForm.availability} onChange={e => setSnackForm({...snackForm, availability: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none">
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea required rows={4} value={snackForm.description} onChange={e => setSnackForm({...snackForm, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[var(--primary)] outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input type="file" accept="image/*" className="hidden" ref={snackFileInputRef} onChange={e => handleImageUpload(e, 'snack')} />
                <div className="flex gap-4">
                  {snackForm.image && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={snackForm.image} alt="" fill className="object-cover" />
                      <button type="button" onClick={() => setSnackForm({...snackForm, image: ''})} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500"><X size={12} /></button>
                    </div>
                  )}
                  {!snackForm.image && (
                    <button type="button" onClick={() => snackFileInputRef.current?.click()} className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                      {uploadingImage ? <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div> : <Upload size={24} />}
                    </button>
                  )}
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white z-10 pb-4">
                <button type="button" onClick={() => setIsSnackModalOpen(false)} className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl mr-3">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-[var(--text-dark)] text-white font-medium rounded-xl hover:bg-black transition-colors">Save Snack</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
