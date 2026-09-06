"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LogOut, Plus, Edit2, Trash2, X, 
  Smartphone, Laptop, Watch, Headphones, Cable,
  MessageSquare, CheckCircle, ArrowLeft, BookOpen, Loader2, LayoutGrid
} from 'lucide-react';
import { api, Gadget, Enquiry, TechArticle, FALLBACK_GADGETS, FALLBACK_ENQUIRIES, FALLBACK_ARTICLES } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();

  // Data state
  const [gadgets, setGadgets] = useState<Gadget[]>(FALLBACK_GADGETS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(FALLBACK_ENQUIRIES);
  const [articles, setArticles] = useState<TechArticle[]>(FALLBACK_ARTICLES);

  // UI State
  const [activeTab, setActiveTab] = useState<'gadgets' | 'enquiries' | 'articles'>('gadgets');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isGadgetModalOpen, setIsGadgetModalOpen] = useState(false);
  const [editingGadgetId, setEditingGadgetId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'danger' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Form State
  const [gadgetForm, setGadgetForm] = useState({
    name: '',
    category: 'Smartphones' as Gadget['category'],
    price: '',
    description: '',
    image: '',
    specs: '',
    inStock: true,
    featured: false
  });

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
      const gData = await api.getGadgets();
      const eData = await api.getEnquiries();
      if (gData && gData.length > 0) setGadgets(gData);
      if (eData && eData.length > 0) setEnquiries(eData);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haven_token');
    router.push('/admin');
  };

  const resetGadgetForm = () => {
    setGadgetForm({
      name: '',
      category: 'Smartphones',
      price: '',
      description: '',
      image: '',
      specs: '',
      inStock: true,
      featured: false
    });
    setEditingGadgetId(null);
  };

  const openAddGadgetModal = () => {
    resetGadgetForm();
    setIsGadgetModalOpen(true);
  };

  const openEditGadgetModal = (gadget: Gadget) => {
    setEditingGadgetId(gadget.id);
    setGadgetForm({
      name: gadget.name,
      category: gadget.category,
      price: gadget.price.toString(),
      description: gadget.description,
      image: gadget.image,
      specs: gadget.specs.join('\n'),
      inStock: gadget.inStock,
      featured: gadget.featured || false
    });
    setIsGadgetModalOpen(true);
  };

  const handleSaveGadget = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const newGadget: Gadget = {
        id: editingGadgetId || `g_${Date.now()}`,
        name: gadgetForm.name,
        category: gadgetForm.category,
        price: parseFloat(gadgetForm.price) || 0,
        description: gadgetForm.description,
        image: gadgetForm.image || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
        specs: gadgetForm.specs.split('\n').filter(s => s.trim().length > 0),
        inStock: gadgetForm.inStock,
        featured: gadgetForm.featured
      };

      if (editingGadgetId) {
        setGadgets(gadgets.map(g => g.id === editingGadgetId ? newGadget : g));
        showToast(`Updated "${newGadget.name}" successfully`, 'success');
      } else {
        setGadgets([newGadget, ...gadgets]);
        showToast(`Added "${newGadget.name}" to inventory`, 'success');
      }

      await api.saveGadgetFirebase(newGadget);
      setIsGadgetModalOpen(false);
      resetGadgetForm();
    } catch (err) {
      showToast('Failed to save gadget to database', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGadget = async (id: string) => {
    const gadgetToDelete = gadgets.find(g => g.id === id);
    const gadgetName = gadgetToDelete ? gadgetToDelete.name : 'Gadget';
    if (confirm(`Are you sure you want to remove ${gadgetName} from inventory?`)) {
      setGadgets(gadgets.filter(g => g.id !== id));
      await api.deleteGadgetFirebase(id);
      showToast(`Deleted "${gadgetName}" from inventory`, 'danger');
    }
  };

  const tabItems = [
    { id: 'gadgets' as const, label: 'Inventory', shortLabel: 'Items', icon: LayoutGrid, count: gadgets.length },
    { id: 'enquiries' as const, label: 'Inquiries', shortLabel: 'Chats', icon: MessageSquare, count: enquiries.length },
    { id: 'articles' as const, label: 'Articles', shortLabel: 'Posts', icon: BookOpen, count: articles.length },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans antialiased relative">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl bg-slate-950 text-white border border-slate-800 transition-all duration-300 max-w-[90vw] md:max-w-sm`}>
          {toast.type === 'success' ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={14} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
              <Trash2 size={14} />
            </div>
          )}
          <span className="text-xs font-medium tracking-wide flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ─── DESKTOP LAYOUT ─────────────────────────────────────────────── */}
      <div className="hidden md:flex min-h-screen">

        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white p-6 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-8 h-8 bg-white text-slate-950 rounded-lg flex items-center justify-center font-heading font-bold text-xs tracking-wider">
                ELS
              </div>
              <div>
                <span className="font-heading font-bold text-sm tracking-tight text-white block leading-tight">ELS GADGET</span>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">ADMIN CONSOLE</span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 text-xs font-medium">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label} ({tab.count})</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-800 space-y-2">
            <a
              href="/"
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs transition-colors"
            >
              <ArrowLeft size={16} />
              <span>View Live Website</span>
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Desktop Main Content */}
        <div className="ml-64 flex-1 flex flex-col">
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <h1 className="font-heading text-lg font-bold text-slate-950">
              {activeTab === 'gadgets' && 'Hardware Inventory Management'}
              {activeTab === 'enquiries' && 'Customer Inquiries & WhatsApp Orders'}
              {activeTab === 'articles' && 'Tech Hub Articles & Content'}
            </h1>

            {activeTab === 'gadgets' && (
              <div className="flex items-center space-x-3">
                <button
                  disabled={isSyncing}
                  onClick={async () => {
                    setIsSyncing(true);
                    try {
                      const seeded = await api.seedGadgetsToFirebase();
                      setGadgets(seeded);
                      showToast('Pushed real flagship devices to Firebase!', 'success');
                    } catch {
                      showToast('Failed to sync devices', 'danger');
                    } finally {
                      setIsSyncing(false);
                    }
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 border border-slate-200 disabled:opacity-50"
                >
                  {isSyncing ? (
                    <><Loader2 size={14} className="animate-spin" /><span>Syncing...</span></>
                  ) : (
                    <span>Sync Real Hardware to DB</span>
                  )}
                </button>
                <button
                  onClick={openAddGadgetModal}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-xs"
                >
                  <Plus size={16} />
                  <span>Add New Gadget</span>
                </button>
              </div>
            )}
          </header>

          <main className="p-6 md:p-8 flex-1">
            <TabContent
              activeTab={activeTab}
              gadgets={gadgets}
              enquiries={enquiries}
              articles={articles}
              onEditGadget={openEditGadgetModal}
              onDeleteGadget={handleDeleteGadget}
            />
          </main>
        </div>
      </div>

      {/* ─── MOBILE LAYOUT ─────────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col min-h-screen pb-20">

        {/* Mobile Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-slate-950 text-white rounded-lg flex items-center justify-center font-heading font-bold text-[10px]">
              ELS
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-slate-950 block leading-tight">ELS GADGET</span>
              <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">ADMIN</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'gadgets' && (
              <button
                onClick={openAddGadgetModal}
                className="bg-slate-950 text-white font-medium text-[11px] px-3 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Mobile Sub-header with sync */}
        {activeTab === 'gadgets' && (
          <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Hardware Inventory ({gadgets.length} items)</span>
            <button
              disabled={isSyncing}
              onClick={async () => {
                setIsSyncing(true);
                try {
                  const seeded = await api.seedGadgetsToFirebase();
                  setGadgets(seeded);
                  showToast('Synced to Firebase!', 'success');
                } catch {
                  showToast('Sync failed', 'danger');
                } finally {
                  setIsSyncing(false);
                }
              }}
              className="bg-slate-100 text-slate-700 font-medium text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-200 disabled:opacity-50"
            >
              {isSyncing ? <><Loader2 size={12} className="animate-spin" /><span>Syncing...</span></> : <span>Sync to DB</span>}
            </button>
          </div>
        )}

        {/* Mobile Content */}
        <main className="p-4 flex-1">
          <TabContent
            activeTab={activeTab}
            gadgets={gadgets}
            enquiries={enquiries}
            articles={articles}
            onEditGadget={openEditGadgetModal}
            onDeleteGadget={handleDeleteGadget}
          />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 flex items-stretch">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                  isActive ? 'text-slate-950' : 'text-slate-400'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-slate-950' : 'text-slate-400'}`}>
                  {tab.shortLabel}
                </span>
                {isActive && <div className="absolute bottom-0 w-10 h-0.5 bg-slate-950 rounded-full" />}
              </button>
            );
          })}
          <a
            href="/"
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-slate-400"
          >
            <ArrowLeft size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-medium">Site</span>
          </a>
        </nav>
      </div>

      {/* Gadget Edit/Create Modal */}
      {isGadgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl p-5 sm:p-8 relative border border-slate-200 shadow-2xl max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <h3 className="font-heading text-base font-bold text-slate-950">
                {editingGadgetId ? 'Edit Gadget Specs' : 'Add New Hardware Gadget'}
              </h3>
              <button
                onClick={() => setIsGadgetModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile drag handle */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 rounded-full sm:hidden" />

            <form onSubmit={handleSaveGadget} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gadget Title / Model Name</label>
                <input
                  type="text"
                  required
                  value={gadgetForm.name}
                  onChange={(e) => setGadgetForm({ ...gadgetForm, name: e.target.value })}
                  placeholder="e.g. ELS Apex Pro Max"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={gadgetForm.category}
                    onChange={(e) => setGadgetForm({ ...gadgetForm, category: e.target.value as Gadget['category'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Smartwatches">Smartwatches</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={gadgetForm.price}
                    onChange={(e) => setGadgetForm({ ...gadgetForm, price: e.target.value })}
                    placeholder="1250000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={gadgetForm.image}
                  onChange={(e) => setGadgetForm({ ...gadgetForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={gadgetForm.description}
                  onChange={(e) => setGadgetForm({ ...gadgetForm, description: e.target.value })}
                  placeholder="Short product summary..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specifications (One per line)</label>
                <textarea
                  rows={3}
                  value={gadgetForm.specs}
                  onChange={(e) => setGadgetForm({ ...gadgetForm, specs: e.target.value })}
                  placeholder={"Snapdragon 8 Gen 3\n16GB RAM / 512GB Storage\n5000mAh 90W Fast Charge"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-slate-950"
                />
              </div>

              <div className="flex items-center gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gadgetForm.inStock}
                    onChange={(e) => setGadgetForm({ ...gadgetForm, inStock: e.target.checked })}
                    className="rounded text-slate-950 focus:ring-slate-950"
                  />
                  <span className="font-semibold text-slate-800">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gadgetForm.featured}
                    onChange={(e) => setGadgetForm({ ...gadgetForm, featured: e.target.checked })}
                    className="rounded text-slate-950 focus:ring-slate-950"
                  />
                  <span className="font-semibold text-slate-800">Featured Spotlight</span>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsGadgetModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 text-white font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <><Loader2 size={14} className="animate-spin" /><span>Saving...</span></>
                  ) : (
                    <span>Save Gadget</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

// ─── Shared Tab Content Component ─────────────────────────────────────────
function TabContent({
  activeTab, gadgets, enquiries, articles, onEditGadget, onDeleteGadget
}: {
  activeTab: 'gadgets' | 'enquiries' | 'articles';
  gadgets: Gadget[];
  enquiries: Enquiry[];
  articles: TechArticle[];
  onEditGadget: (g: Gadget) => void;
  onDeleteGadget: (id: string) => void;
}) {

  if (activeTab === 'gadgets') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gadgets.map((gadget) => (
          <div key={gadget.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200/60">
                <Image src={gadget.image} alt={gadget.name} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-slate-950 text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                  {gadget.category}
                </div>
                {gadget.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                    Featured
                  </div>
                )}
              </div>

              <h3 className="font-heading text-sm font-bold text-slate-950 leading-tight">{gadget.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{gadget.description}</p>

              <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-950">₦{gadget.price.toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] ${gadget.inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                  {gadget.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-1">
              <button
                onClick={() => onEditGadget(gadget)}
                className="p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit gadget"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDeleteGadget(gadget.id)}
                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete gadget"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === 'enquiries') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <h2 className="font-heading text-sm font-bold text-slate-950 mb-4">Received Hardware Inquiries</h2>
        <div className="divide-y divide-slate-100">
          {enquiries.map((enq) => (
            <div key={enq.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-3">
              <div>
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className="font-bold text-slate-950 text-sm">{enq.name}</span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase">
                    {enq.type}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{enq.message}</p>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 font-mono mt-1.5">
                  <span>{enq.phone}</span>
                  {enq.email && <span>{enq.email}</span>}
                  <span>{enq.createdAt}</span>
                </div>
              </div>
              <a
                href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-colors text-center"
              >
                Reply via WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'articles') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((art) => (
          <div key={art.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200/60">
              <Image src={art.image} alt={art.title} fill className="object-cover" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">{art.category}</span>
            <h3 className="font-heading text-sm font-bold text-slate-950 mt-1 leading-tight">{art.title}</h3>
            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-3 leading-relaxed">{art.summary}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
