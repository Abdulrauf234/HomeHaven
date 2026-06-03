"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building, ShoppingBag, Mail, TrendingUp, LogOut, Plus, Trash2, 
  Edit, CheckCircle, XCircle, Home, Upload, Layers, PlusCircle, Check
} from 'lucide-react';
import { api, Property, Product, Enquiry } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'properties' | 'shop' | 'leads'>('analytics');
  
  // Data lists
  const [properties, setProperties] = useState<Property[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  // CRUD Forms
  const [propertyForm, setPropertyForm] = useState({
    id: '', // Empty if creating
    title: '',
    type: 'Apartment',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    images: [] as string[],
    availability: 'Available' as 'Available' | 'Sold'
  });

  const [productForm, setProductForm] = useState({
    id: '', // Empty if creating
    name: '',
    category: 'Furniture',
    price: '',
    description: '',
    image: '',
    availability: 'In Stock' as 'In Stock' | 'Out of Stock',
    stock: ''
  });

  // Modal / Editing states
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // File upload helper loading states
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prodFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auth Validation
    const token = localStorage.getItem('haven_token');
    if (!token) {
      router.push('/admin');
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const props = await api.getProperties();
      const prods = await api.getProducts();
      const enqs = await api.getEnquiries();
      setProperties(props);
      setProducts(prods);
      setEnquiries(enqs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('haven_token');
    router.push('/admin');
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'property' | 'product') => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const url = await api.uploadImage(file);
      if (target === 'property') {
        setPropertyForm(prev => ({
          ...prev,
          images: [...prev.images, url]
        }));
      } else {
        setProductForm(prev => ({
          ...prev,
          image: url
        }));
      }
    } catch (err) {
      alert("Failed to upload image. Fallback base64 used.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Property CRUD
  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyForm.title || !propertyForm.location || !propertyForm.price) return;

    const payload = {
      title: propertyForm.title,
      type: propertyForm.type,
      location: propertyForm.location,
      price: Number(propertyForm.price),
      bedrooms: Number(propertyForm.bedrooms || 0),
      bathrooms: Number(propertyForm.bathrooms || 0),
      description: propertyForm.description,
      images: propertyForm.images.length > 0 ? propertyForm.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"],
      availability: propertyForm.availability
    };

    try {
      if (isEditingProperty) {
        await api.updateProperty(propertyForm.id, payload);
      } else {
        await api.createProperty(payload);
      }
      setIsPropertyModalOpen(false);
      resetPropertyForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editProperty = (prop: Property) => {
    setIsEditingProperty(true);
    setPropertyForm({
      id: prop.id,
      title: prop.title,
      type: prop.type,
      location: prop.location,
      price: String(prop.price),
      bedrooms: String(prop.bedrooms),
      bathrooms: String(prop.bathrooms),
      description: prop.description,
      images: prop.images,
      availability: prop.availability
    });
    setIsPropertyModalOpen(true);
  };

  const deleteProperty = async (id: string) => {
    if (confirm("Are you sure you want to delete this property listing?")) {
      try {
        await api.deleteProperty(id);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const togglePropertyStatus = async (prop: Property) => {
    const nextStatus = prop.availability === 'Available' ? 'Sold' : 'Available';
    try {
      await api.updateProperty(prop.id, { availability: nextStatus });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const resetPropertyForm = () => {
    setIsEditingProperty(false);
    setPropertyForm({
      id: '',
      title: '',
      type: 'Apartment',
      location: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      images: [],
      availability: 'Available'
    });
  };

  // Product CRUD
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) return;

    const payload = {
      name: productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      description: productForm.description,
      image: productForm.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
      availability: productForm.availability,
      stock: Number(productForm.stock)
    };

    try {
      if (isEditingProduct) {
        await api.updateProduct(productForm.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setIsProductModalOpen(false);
      resetProductForm();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editProduct = (prod: Product) => {
    setIsEditingProduct(true);
    setProductForm({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      price: String(prod.price),
      description: prod.description,
      image: prod.image,
      availability: prod.availability,
      stock: String(prod.stock)
    });
    setIsProductModalOpen(true);
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to remove this product from the shop?")) {
      try {
        await api.deleteProduct(id);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleProductStatus = async (prod: Product) => {
    const nextStatus = prod.availability === 'In Stock' ? 'Out of Stock' : 'In Stock';
    try {
      await api.updateProduct(prod.id, { availability: nextStatus });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const resetProductForm = () => {
    setIsEditingProduct(false);
    setProductForm({
      id: '',
      name: '',
      category: 'Furniture',
      price: '',
      description: '',
      image: '',
      availability: 'In Stock',
      stock: ''
    });
  };

  // Analytics helper calculations
  const totalProperties = properties.length;
  const soldProperties = properties.filter(p => p.availability === 'Sold').length;
  const availableProperties = totalProperties - soldProperties;
  const totalProducts = products.length;
  const totalEnquiries = enquiries.length;
  const whatsappLeadsCount = enquiries.filter(e => e.type === 'whatsapp').length;
  
  // Estimate revenue as sum of sold properties + mock multiplier
  const estimatedRevenue = properties
    .filter(p => p.availability === 'Sold')
    .reduce((sum, p) => sum + p.price, 0);

  const categories = ['Apartment', 'Duplex', 'Bungalow', 'Villa', 'Commercial Properties'];
  const shopCategories = ['Furniture', 'Home Appliances', 'Electronics', 'Home Decor', 'Kitchen Equipment', 'Security Devices'];

  return (
    <div className="bg-neutral-50 min-h-screen flex text-black font-sans selection:bg-black selection:text-white">
      
      {/* Sidebar Panel */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col justify-between hidden md:flex border-r border-neutral-850">
        <div className="space-y-8">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 border-b border-neutral-800 pb-6">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">H</span>
            </div>
            <span className="text-white font-extrabold tracking-widest text-sm uppercase font-serif">Home Haven</span>
          </a>

          {/* Nav */}
          <nav className="flex flex-col space-y-2 text-xs font-semibold uppercase tracking-wider">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'analytics' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <TrendingUp size={16} />
              <span>Overview Analytics</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('properties')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'properties' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Building size={16} />
              <span>Properties</span>
            </button>

            <button 
              onClick={() => setActiveTab('shop')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'shop' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ShoppingBag size={16} />
              <span>E-Shop Products</span>
            </button>

            <button 
              onClick={() => setActiveTab('leads')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'leads' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Mail size={16} />
              <span>Leads & Enquiries</span>
            </button>
          </nav>
        </div>

        {/* User / Logout */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <div>
              <p className="font-bold text-white">admin</p>
              <p className="text-[10px] text-neutral-500">homehaven</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-neutral-950 rounded-lg hover:text-white transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-serif text-black uppercase tracking-wide">
              {activeTab === 'analytics' && 'Dashboard Overview'}
              {activeTab === 'properties' && 'Properties Portfolio'}
              {activeTab === 'shop' && 'eShop Inventory'}
              {activeTab === 'leads' && 'Customer Enquiries Log'}
            </h1>
            <p className="text-xs text-neutral-400">Manage real estate listings and customer sales pipelines</p>
          </div>

          <div className="flex items-center space-x-3">
            <a href="/" className="text-xs border border-neutral-300 hover:border-black font-semibold text-black px-4 py-2 rounded-xl transition-colors">
              View Website
            </a>
            <button 
              onClick={handleLogout}
              className="md:hidden text-xs bg-black text-white px-4 py-2 rounded-xl"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Tab switcher for mobile screens */}
        <div className="flex md:hidden items-center overflow-x-auto border-b border-neutral-200 pb-3 mb-6 gap-2 text-[10px] font-bold uppercase tracking-wider">
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-lg ${activeTab === 'analytics' ? 'bg-black text-white':'bg-white border'}`}>Overview</button>
          <button onClick={() => setActiveTab('properties')} className={`px-4 py-2 rounded-lg ${activeTab === 'properties' ? 'bg-black text-white':'bg-white border'}`}>Props</button>
          <button onClick={() => setActiveTab('shop')} className={`px-4 py-2 rounded-lg ${activeTab === 'shop' ? 'bg-black text-white':'bg-white border'}`}>Shop</button>
          <button onClick={() => setActiveTab('leads')} className={`px-4 py-2 rounded-lg ${activeTab === 'leads' ? 'bg-black text-white':'bg-white border'}`}>Leads</button>
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Total Properties</span>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-3xl font-serif font-bold text-black">{totalProperties}</span>
                  <span className="text-xs text-neutral-400">({availableProperties} available)</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Sold Listings</span>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-3xl font-serif font-bold text-black">{soldProperties}</span>
                  <span className="text-xs text-neutral-400">({Math.round((soldProperties / (totalProperties || 1)) * 100)}% conversion)</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Inventory Products</span>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-3xl font-serif font-bold text-black">{totalProducts}</span>
                  <span className="text-xs text-neutral-400">Items in Shop</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Leads Logged</span>
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-3xl font-serif font-bold text-black">{totalEnquiries}</span>
                  <span className="text-xs text-neutral-400">({whatsappLeadsCount} WhatsApp clicks)</span>
                </div>
              </div>

            </div>

            {/* Sub stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Financial Box */}
              <div className="bg-neutral-900 text-white rounded-[2rem] p-8 lg:col-span-2 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Estimated Total Revenue Flow</span>
                  <h3 className="text-4xl font-serif font-bold text-white">${estimatedRevenue.toLocaleString()}</h3>
                </div>
                <div className="text-xs text-neutral-400 border-t border-neutral-850 pt-4 mt-6 leading-relaxed">
                  Sum total calculated based on property listings updated as **Sold** in the database. Product purchases are tracked separately via private WhatsApp endpoints.
                </div>
              </div>

              {/* Quick links box */}
              <div className="bg-white border border-neutral-200/60 p-8 rounded-[2rem] shadow-sm flex flex-col justify-between">
                <h4 className="font-serif font-bold text-base text-black mb-4">Quick Admin Controls</h4>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => { resetPropertyForm(); setIsPropertyModalOpen(true); }}
                    className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center space-x-2"
                  >
                    <PlusCircle size={14} />
                    <span>Post New Property</span>
                  </button>
                  <button 
                    onClick={() => { resetProductForm(); setIsProductModalOpen(true); }}
                    className="w-full border border-neutral-350 hover:border-black text-black py-3 rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center space-x-2"
                  >
                    <PlusCircle size={14} />
                    <span>Add Shop Product</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="bg-white border border-neutral-200/60 rounded-[2rem] p-8 shadow-sm">
              <h4 className="font-serif font-bold text-base text-black mb-6">Recent Customer Enquiries</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider pb-3">
                      <th className="py-3">Client</th>
                      <th>Phone</th>
                      <th>Type</th>
                      <th>Reference Title</th>
                      <th>Details</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.slice(0, 5).map((enq) => (
                      <tr key={enq.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                        <td className="py-4 font-bold text-black">{enq.name}</td>
                        <td className="text-neutral-500">{enq.phone}</td>
                        <td>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            enq.type === 'whatsapp' ? 'bg-[#25D366]/10 text-[#25D366]' :
                            enq.type === 'inspection' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {enq.type}
                          </span>
                        </td>
                        <td className="font-medium text-black">{enq.targetTitle || 'General Enquiry'}</td>
                        <td className="text-neutral-500 font-light max-w-xs truncate">{enq.message || '-'}</td>
                        <td className="text-neutral-400">{new Date(enq.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-400 font-light">
                          No recent customer leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{properties.length} Listings</span>
              <button 
                onClick={() => { resetPropertyForm(); setIsPropertyModalOpen(true); }}
                className="bg-black hover:bg-neutral-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Post Property</span>
              </button>
            </div>

            {/* List Table */}
            <div className="bg-white border border-neutral-200/60 rounded-[2.0rem] p-6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider pb-3">
                      <th className="py-3">Property</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Rooms</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((prop) => (
                      <tr key={prop.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                        <td className="py-4 font-bold text-black flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                            <img src={prop.images[0]} alt={prop.title} className="object-cover w-full h-full" />
                          </div>
                          <span className="max-w-[200px] truncate">{prop.title}</span>
                        </td>
                        <td className="text-neutral-500">{prop.location}</td>
                        <td className="font-bold text-black">${prop.price.toLocaleString()}</td>
                        <td className="text-neutral-500">{prop.bedrooms}B / {prop.bathrooms}B</td>
                        <td>
                          <span className="bg-neutral-100 text-neutral-800 font-semibold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
                            {prop.type}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => togglePropertyStatus(prop)}
                            className={`flex items-center space-x-1.5 font-bold uppercase tracking-widest text-[9px] ${
                              prop.availability === 'Available' ? 'text-black' : 'text-neutral-400'
                            }`}
                          >
                            {prop.availability === 'Available' ? (
                              <><CheckCircle size={12} /> <span>Available</span></>
                            ) : (
                              <><XCircle size={12} /> <span>Sold</span></>
                            )}
                          </button>
                        </td>
                        <td className="text-right space-x-2">
                          <button 
                            onClick={() => editProperty(prop)}
                            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-700 hover:text-black transition-all"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteProperty(prop.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-neutral-400 font-light">
                          No properties available in DB. Click "Post Property" to add.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: E-SHOP */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{products.length} Products</span>
              <button 
                onClick={() => { resetProductForm(); setIsProductModalOpen(true); }}
                className="bg-black hover:bg-neutral-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-neutral-200/60 rounded-[2.0rem] p-6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider pb-3">
                      <th className="py-3">Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Level</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                        <td className="py-4 font-bold text-black flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                            <img src={prod.image} alt={prod.name} className="object-cover w-full h-full" />
                          </div>
                          <span className="max-w-[200px] truncate">{prod.name}</span>
                        </td>
                        <td className="text-neutral-500">{prod.category}</td>
                        <td className="font-bold text-black">${prod.price.toLocaleString()}</td>
                        <td className="text-neutral-500 font-medium">{prod.stock} units</td>
                        <td>
                          <button 
                            onClick={() => toggleProductStatus(prod)}
                            className={`flex items-center space-x-1.5 font-bold uppercase tracking-widest text-[9px] ${
                              prod.availability === 'In Stock' ? 'text-black' : 'text-neutral-400'
                            }`}
                          >
                            {prod.availability === 'In Stock' ? (
                              <><CheckCircle size={12} /> <span>In Stock</span></>
                            ) : (
                              <><XCircle size={12} /> <span>Out of Stock</span></>
                            )}
                          </button>
                        </td>
                        <td className="text-right space-x-2">
                          <button 
                            onClick={() => editProduct(prod)}
                            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-700 hover:text-black transition-all"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => deleteProduct(prod.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-400 font-light">
                          No products found. Click "Add Product" to populate your store.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200/60 rounded-[2.0rem] p-6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider pb-3">
                      <th className="py-3">Client</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Reference Listing</th>
                      <th>Message Details</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                        <td className="py-4 font-bold text-black">{enq.name}</td>
                        <td className="text-neutral-500 font-semibold">{enq.phone}</td>
                        <td className="text-neutral-400 font-light">{enq.email || '-'}</td>
                        <td>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                            enq.type === 'whatsapp' ? 'bg-[#25D366]/10 text-[#25D366]' :
                            enq.type === 'inspection' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {enq.type}
                          </span>
                        </td>
                        <td className="font-bold text-black">{enq.targetTitle || 'General Enquiry'}</td>
                        <td className="text-neutral-500 font-light max-w-sm truncate whitespace-pre-wrap">{enq.message || '-'}</td>
                        <td className="text-neutral-400">{new Date(enq.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-neutral-400 font-light">
                          No leads logged yet. Perform inspection bookings or WhatsApp clicks on the client page to test.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: PROPERTY FORM */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-[2rem] w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-lg font-bold font-serif text-black uppercase tracking-wide">
                {isEditingProperty ? 'Edit Property Listing' : 'Post New Property'}
              </h3>
              <button 
                onClick={() => setIsPropertyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handlePropertySubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Property Title</label>
                  <input 
                    type="text" 
                    required
                    value={propertyForm.title}
                    onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
                    placeholder="e.g. Noir Crest Penthouse"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Category Type</label>
                  <select 
                    value={propertyForm.type}
                    onChange={(e) => setPropertyForm({...propertyForm, type: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Location</label>
                  <input 
                    type="text" 
                    required
                    value={propertyForm.location}
                    onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
                    placeholder="e.g. Manhattan, NY"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Price (USD)</label>
                  <input 
                    type="number" 
                    required
                    value={propertyForm.price}
                    onChange={(e) => setPropertyForm({...propertyForm, price: e.target.value})}
                    placeholder="e.g. 1500000"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Bedrooms</label>
                  <input 
                    type="number" 
                    value={propertyForm.bedrooms}
                    onChange={(e) => setPropertyForm({...propertyForm, bedrooms: e.target.value})}
                    placeholder="e.g. 4"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Bathrooms</label>
                  <input 
                    type="number" 
                    value={propertyForm.bathrooms}
                    onChange={(e) => setPropertyForm({...propertyForm, bathrooms: e.target.value})}
                    placeholder="e.g. 3.5"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  value={propertyForm.description}
                  onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                  placeholder="Describe the architectural design assets, building automation etc..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                />
              </div>

              {/* Image upload widget */}
              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Property Images</label>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-4 py-2.5 rounded-xl text-neutral-700 flex items-center space-x-2"
                  >
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'property')}
                    className="hidden"
                  />
                </div>
                
                {/* Image Previews */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {propertyForm.images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 border rounded-lg overflow-hidden bg-neutral-50">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setPropertyForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg p-0.5"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Listing Status</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="availability" 
                      value="Available"
                      checked={propertyForm.availability === 'Available'}
                      onChange={() => setPropertyForm({...propertyForm, availability: 'Available'})}
                    />
                    <span>Available</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="availability" 
                      value="Sold"
                      checked={propertyForm.availability === 'Sold'}
                      onChange={() => setPropertyForm({...propertyForm, availability: 'Sold'})}
                    />
                    <span>Mark as Sold</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-350 hover:border-black transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl transition-colors uppercase tracking-wider text-[10px]"
                >
                  {isEditingProperty ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRODUCT FORM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-[2rem] w-full max-w-xl p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-lg font-bold font-serif text-black uppercase tracking-wide">
                {isEditingProduct ? 'Edit Shop Product' : 'Add New E-Shop Product'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    placeholder="e.g. Bouclé Lounge Chair"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Category</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  >
                    {shopCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Price (USD)</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="e.g. 599"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    placeholder="e.g. 10"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Detail features, sizing, upholstery specs, smart capabilities..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Product Image</label>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button"
                    onClick={() => prodFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-4 py-2.5 rounded-xl text-neutral-700 flex items-center space-x-2"
                  >
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                  <input 
                    type="file" 
                    ref={prodFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'product')}
                    className="hidden"
                  />
                </div>
                {productForm.image && (
                  <div className="relative w-20 h-20 border rounded-lg overflow-hidden bg-neutral-50 mt-3">
                    <img src={productForm.image} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setProductForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg p-0.5"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[9px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Availability</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="prodAvailability" 
                      value="In Stock"
                      checked={productForm.availability === 'In Stock'}
                      onChange={() => setProductForm({...productForm, availability: 'In Stock'})}
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="prodAvailability" 
                      value="Out of Stock"
                      checked={productForm.availability === 'Out of Stock'}
                      onChange={() => setProductForm({...productForm, availability: 'Out of Stock'})}
                    />
                    <span>Out of Stock (Unavailable)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-350 hover:border-black transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl transition-colors uppercase tracking-wider text-[10px]"
                >
                  {isEditingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
