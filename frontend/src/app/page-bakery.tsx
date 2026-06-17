"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Search, MessageCircle, CheckCircle, Menu, X, 
  ChevronLeft, ChevronRight, Star, User, MapPin, Mail, 
  Phone, Clock, Heart, ShoppingCart, Award, Shield, 
  TrendingUp, Users, Eye, HelpCircle, ArrowRight
} from 'lucide-react';
import { api, Property, Product } from '@/lib/api';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('All');
  const [propertySearch, setPropertySearch] = useState<string>('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('All');
  const [productSearch, setProductSearch] = useState<string>('');
  
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
    const savedWish = localStorage.getItem('haven_wishlist');
    if (savedWish) setWishlist(JSON.parse(savedWish));
  }, []);

  const fetchData = async () => {
    try {
      const props = await api.getProperties();
      const prods = await api.getProducts();
      setProperties(props);
      setProducts(prods);
    } catch (e) {
      console.error("Error loading data", e);
    }
  };

  if (!mounted) {
    return <div className="bg-white min-h-screen" />;
  }

  const handlePropertyFilter = async (type: string) => {
    setSelectedPropertyType(type);
    const filterType = type === 'All' ? undefined : type;
    const list = await api.getProperties({ type: filterType, search: propertySearch });
    setProperties(list);
  };

  const handlePropertySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const filterType = selectedPropertyType === 'All' ? undefined : selectedPropertyType;
    const list = await api.getProperties({ type: filterType, search: propertySearch });
    setProperties(list);
  };

  const handleProductFilter = async (category: string) => {
    setSelectedProductCategory(category);
    const filterCat = category === 'All' ? undefined : category;
    const list = await api.getProducts({ category: filterCat, search: productSearch });
    setProducts(list);
  };

  const handleProductSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const filterCat = selectedProductCategory === 'All' ? undefined : selectedProductCategory;
    const list = await api.getProducts({ category: filterCat, search: productSearch });
    setProducts(list);
  };

  const toggleWishlist = (id: string) => {
    let updated = [...wishlist];
    if (updated.includes(id)) {
      updated = updated.filter(x => x !== id);
    } else {
      updated.push(id);
    }
    setWishlist(updated);
    localStorage.setItem('haven_wishlist', JSON.stringify(updated));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) return;
    try {
      await api.submitEnquiry({
        type: 'general',
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        message: enquiryForm.message
      });
      setEnquirySuccess(true);
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setEnquirySuccess(false), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerWhatsApp = async (type: 'buy' | 'inspection' | 'agent' | 'product', item: Property | Product) => {
    let message = '';
    const phoneNumber = '+2348000000000';

    if (type === 'buy' && 'location' in item) {
      message = `Hello Gem Crispy, I'm interested in ordering "${item.title}". Please provide details on customization options and delivery. Price: $${item.price.toLocaleString()}.`;
    } else if (type === 'inspection' && 'location' in item) {
      message = `Hello Gem Crispy, I would like to book a tasting and preview for "${item.title}". (Price: $${item.price.toLocaleString()}).`;
    } else if (type === 'agent' && 'location' in item) {
      message = `Hello Gem Crispy, I want more information about "${item.title}". Please connect me with a specialist.`;
    } else if (type === 'product' && 'category' in item) {
      message = `Hello Gem Crispy, I'm interested in purchasing "${item.name}" from your collection. Category: ${item.category}. Price: $${item.price.toLocaleString()}.`;
    }

    try {
      await api.submitEnquiry({
        type: 'whatsapp',
        name: 'WhatsApp User',
        phone: phoneNumber,
        message,
        targetId: item.id,
        targetTitle: 'title' in item ? item.title : item.name
      });
    } catch (e) {
      console.error(e);
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  const propertyTypes = ['All', 'Cakes', 'Pastries', 'Breads', 'Doughnuts', 'Specialty Items'];
  const productCategories = ['All', 'Cookies', 'Chocolates', 'Gift Sets', 'Cupcakes', 'Small Chops', 'Hampers'];

  const benefits = [
    { title: 'Verified Products', desc: 'Every baked good is crafted with premium ingredients and strict quality checks.', icon: Shield },
    { title: 'Trusted Bakers', desc: 'Work with elite, experienced pastry chefs dedicated to perfecting your treat.', icon: Users },
    { title: 'Affordable Delights', desc: 'Premium confectionery at prices that delight every palate.', icon: TrendingUp },
    { title: 'Fast Delivery', desc: 'Swift order processing to get your treats fresh and fast.', icon: Award },
    { title: 'Secure Transactions', desc: 'Secure checkout and transparent order tracking.', icon: CheckCircle },
    { title: 'Customer Support', desc: '24/7 concierge support for all your confectionery needs.', icon: HelpCircle }
  ];

  const reviews = [
    {
      name: 'Chioma Okafor',
      photo: 'https://images.unsplash.com/photo-1491841573634-28fb1ddc5da6?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Gem Crispy delivered an exquisite three-tier chocolate cake for my wedding. Every layer was perfectly crafted, and guests couldn\'t stop raving about the taste and presentation.',
      property: 'Custom Wedding Cake'
    },
    {
      name: 'Tunde Adeyemi',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'I ordered their premium pastry assortment for a corporate event. The variety was stunning, quality impeccable, and delivery timing was absolutely on point.',
      property: 'Corporate Pastry Collection'
    },
    {
      name: 'Zainab Ibrahim',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Their artisanal sourdough bread is extraordinary. My family is obsessed with the crust and the soft interior. Now I order every week without fail.',
      property: 'Premium Sourdough Range'
    }
  ];

  const testimonials = [
    {
      client: 'Nia & Samuel',
      achievement: 'Wedding Reception Catering',
      story: 'We entrusted Gem Crispy with our wedding cake and pastry spread. They exceeded every expectation—from the design consultation to the flawless execution on the day. Our guests are still talking about those desserts!',
      videoThumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
      tag: 'Wedding Showcase'
    },
    {
      client: 'Corporate Events Manager',
      achievement: 'Premium Confectionery Partnership',
      story: 'For our company retreats and events, Gem Crispy has become our trusted premium partner. Their consistency, professionalism, and exquisite taste profiles elevate every corporate function we host.',
      videoThumbnail: 'https://images.unsplash.com/photo-1585518419759-5a14ed9ead0f?auto=format&fit=crop&w=600&q=80',
      tag: 'Corporate Excellence'
    }
  ];

  const team = [
    { name: 'Amara Okafor', role: 'Head Pastry Chef & Co-Founder', bio: 'Amara trained at Le Cordon Bleu and brings 18 years of elite pastry expertise to every creation at Gem Crispy.', image: 'https://images.unsplash.com/photo-1532073150508-0c1df022bdd7?auto=format&fit=crop&w=300&q=80' },
    { name: 'Kunle Adebayo', role: 'Master Confectioner', bio: 'Kunle specializes in premium chocolate work and artisanal bonbons, crafting each piece as an edible work of art.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Zara Taiwo', role: 'Production & Quality Manager', bio: 'Zara ensures every batch meets our exacting standards. Her attention to detail is legendary in the bakery world.', image: 'https://images.unsplash.com/photo-1539571696357-5a69c006ae47?auto=format&fit=crop&w=300&q=80' },
    { name: 'Chidi Ugwu', role: 'Artisanal Bread Master', bio: 'Chidi hand-crafts sourdoughs and specialty breads using traditional techniques and premium heritage grains.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
  ];

  const handleNextImage = (propId: string, max: number) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) + 1) % max
    }));
  };

  const handlePrevImage = (propId: string, max: number) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) - 1 + max) % max
    }));
  };

  return (
    <div className="bg-white min-h-screen selection:bg-black selection:text-white">
      
      {/* Floating Glassmorphism Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-6xl glass rounded-full py-4 px-6 md:px-8 flex items-center justify-between shadow-lg">
          <a href="#home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-black font-extrabold tracking-widest text-lg uppercase font-serif">Gem Crispy Confectionery</span>
          </a>

          <div className="hidden lg:flex items-center space-x-4 text-sm font-medium">
            <a href="#home" className="hover:text-neutral-500 transition-colors">Home</a>
            <a href="#properties" className="hover:text-neutral-500 transition-colors">Products</a>
            <a href="#apartments" className="hover:text-neutral-500 transition-colors">Specialties</a>
            <a href="#shop" className="hover:text-neutral-500 transition-colors">Shop</a>
            <a href="#reviews" className="hover:text-neutral-500 transition-colors">Reviews</a>
            <a href="#team" className="hover:text-neutral-500 transition-colors">Team</a>
            <a href="#about" className="hover:text-neutral-500 transition-colors">About</a>
            <a href="#contact" className="hover:text-neutral-500 transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#contact" 
              className="bg-black hover:bg-neutral-800 text-white font-medium text-sm px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-[1.02]"
            >
              Book Tasting
            </a>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-black hover:text-neutral-600 transition-colors p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 bg-white border border-neutral-100 rounded-3xl p-6 shadow-2xl lg:hidden flex flex-col space-y-4"
          >
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black border-b border-neutral-50">Home</a>
            <a href="#properties" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black border-b border-neutral-50">Products</a>
            <a href="#apartments" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black border-b border-neutral-50">Specialties</a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black border-b border-neutral-50">Shop</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black border-b border-neutral-50">Reviews</a>
            <a href="#team" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black border-b border-neutral-50">Team</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black border-b border-neutral-50">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-black pb-4">Contact</a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="bg-black hover:bg-neutral-800 text-white font-medium py-3 rounded-full text-center block"
            >
              Book Tasting
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="min-h-screen pt-32 pb-16 flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex justify-center relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-radial-gradient from-neutral-100 to-transparent opacity-50 blur-3xl -z-10" />
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-lg aspect-square overflow-hidden rounded-[2.5rem] shadow-2xl border border-neutral-100"
            >
              <Image 
                src="/images/hero.png" 
                alt="Gem Crispy Confectionery Illustration" 
                fill 
                className="object-cover"
                priority
              />
            </motion.div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <span className="text-sm font-extrabold uppercase tracking-widest text-neutral-400">Welcome to Sweetness</span>
              <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-black font-serif leading-tight">
                Delicious <br />
                <span className="font-semibold">Treats</span>
              </h1>
            </div>
            
            <div className="space-y-4 text-neutral-500 font-light leading-relaxed max-w-lg">
              <p>
                At Gem Crispy Confectionery, we bring you the finest selection of premium baked goods and confectionery delights. Our curated collection showcases handcrafted cakes, pastries, and sweets made with unparalleled craftsmanship and exquisite flavors.
              </p>
              <p>
                Whether you seek an artisanal birthday cake, a tower of minimalist pastries, or high-end gift sets, our collection provides elite treats matching your sophisticated taste.
              </p>
              <p>
                We handle the entire process with meticulous detail, ensuring complete freshness, verified quality, and direct access to personal concierge tastings.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a 
                href="#properties" 
                className="bg-black hover:bg-neutral-800 text-white font-medium text-center px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Search Treats</span>
                <ArrowRight size={16} />
              </a>
              <a 
                href="#contact" 
                className="border border-neutral-300 hover:border-black text-black font-medium text-center px-8 py-3.5 rounded-full transition-all duration-300"
              >
                Book Tasting
              </a>
              <button 
                onClick={() => window.open('https://wa.me/2348000000000', '_blank')}
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-center px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Order</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif tracking-tight text-black mb-4">Why Discerning Customers Choose Us</h2>
            <p className="text-neutral-500 font-light">We redefine premium confectionery by merging elite craftsmanship, comprehensive transparency, and impeccable service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div 
                  key={index}
                  whileHover={{ y: -6 }}
                  className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-6">
                      <Icon className="text-black" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-3">{benefit.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed font-light">{benefit.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="properties" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-extrabold" id="apartments">Signature Portfolio</span>
              <h2 className="text-4xl font-serif tracking-tight text-black mt-2">Our Products</h2>
            </div>
            
            <form onSubmit={handlePropertySearch} className="flex items-center border border-neutral-200 rounded-full px-4 py-2 w-full md:max-w-md bg-white">
              <input 
                type="text" 
                placeholder="Search flavor, title..." 
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-black placeholder-neutral-400 px-2"
              />
              <button type="submit" className="p-1.5 bg-black rounded-full text-white hover:bg-neutral-800 transition-colors">
                <Search size={16} />
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-neutral-100">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => handlePropertyFilter(type)}
                className={`text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 ${
                  selectedPropertyType === type 
                    ? 'bg-black text-white' 
                    : 'bg-neutral-50 text-neutral-500 border border-neutral-200/50 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {properties.map((property) => {
                const imgIdx = activeImageIndexes[property.id] || 0;
                return (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="border border-neutral-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 group">
                      {property.images && property.images.length > 0 ? (
                        <Image 
                          src={property.images[imgIdx]} 
                          alt={property.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                          <Home size={32} className="text-neutral-400" />
                        </div>
                      )}

                      <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                        property.availability === 'Available' ? 'bg-white text-black' : 'bg-red-600 text-white'
                      }`}>
                        {property.availability}
                      </span>

                      <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-black text-white">
                        {property.type}
                      </span>

                      {property.images && property.images.length > 1 && (
                        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(property.id, property.images.length); }}
                            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md text-black"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleNextImage(property.id, property.images.length); }}
                            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md text-black"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-neutral-400 space-x-1">
                          <MapPin size={12} />
                          <span>{property.location}</span>
                        </div>
                        <h3 className="text-lg font-bold text-black font-serif line-clamp-1">{property.title}</h3>
                        <p className="text-neutral-500 font-light text-xs line-clamp-2 leading-relaxed">{property.description}</p>
                      </div>

                      <div className="flex items-center space-x-4 border-t border-neutral-100 pt-4 text-xs font-medium text-neutral-600">
                        {property.bedrooms > 0 && (
                          <span>{property.bedrooms} Portion{property.bedrooms > 1 && 's'}</span>
                        )}
                        {property.bathrooms > 0 && (
                          <span>{property.bathrooms} Serve{property.bathrooms > 1 && 's'}</span>
                        )}
                        <span className="text-black font-semibold ml-auto text-sm">${property.price.toLocaleString()}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-50">
                        <button
                          onClick={() => triggerWhatsApp('inspection', property)}
                          className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-[10px] font-bold py-2 px-1 rounded-lg border border-neutral-200 transition-colors text-center uppercase"
                        >
                          Book Taste
                        </button>
                        <button
                          onClick={() => triggerWhatsApp('buy', property)}
                          className="bg-black hover:bg-neutral-900 text-white text-[10px] font-bold py-2 px-1 rounded-lg transition-colors text-center uppercase"
                        >
                          Order
                        </button>
                        <button
                          onClick={() => triggerWhatsApp('agent', property)}
                          className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold py-2 px-1 rounded-lg border border-[#25D366]/20 transition-colors text-center uppercase"
                        >
                          Info
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {properties.length === 0 && (
              <div className="col-span-full py-16 text-center text-neutral-400 font-light">
                No products matched your filters. Try checking other categories.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* E-SHOP SECTION */}
      <section id="shop" className="py-24 bg-neutral-950 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-extrabold">Artisanal Confections</span>
              <h2 className="text-4xl font-serif tracking-tight text-white mt-2">Gem Crispy eShop</h2>
            </div>

            <form onSubmit={handleProductSearch} className="flex items-center border border-neutral-800 rounded-full px-4 py-2 w-full md:max-w-md bg-neutral-900">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 px-2"
              />
              <button type="submit" className="p-1.5 bg-white rounded-full text-black hover:bg-neutral-200 transition-colors">
                <Search size={16} />
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-neutral-900">
            {productCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleProductFilter(cat)}
                className={`text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all duration-300 ${
                  selectedProductCategory === cat 
                    ? 'bg-white text-black' 
                    : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-900 border border-neutral-850 rounded-3xl overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral-900/60 border border-white/10 flex items-center justify-center backdrop-blur-sm text-white hover:bg-white hover:text-black transition-colors"
                    >
                      <Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                    {product.availability === 'Out of Stock' && (
                      <span className="absolute bottom-4 left-4 bg-red-600 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">{product.category}</span>
                      <h3 className="text-lg font-bold text-white line-clamp-1">{product.name}</h3>
                      <p className="text-neutral-400 font-light text-xs line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-800 pt-4 mt-2">
                      <span className="text-lg font-semibold text-white">${product.price.toLocaleString()}</span>
                      <button
                        onClick={() => triggerWhatsApp('product', product)}
                        disabled={product.availability === 'Out of Stock'}
                        className="bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase flex items-center space-x-2"
                      >
                        <ShoppingCart size={14} />
                        <span>Order via WA</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {products.length === 0 && (
              <div className="col-span-full py-16 text-center text-neutral-500 font-light">
                No products found matching filters.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Customer Love</span>
                <h2 className="text-4xl font-serif text-black mt-2">Hear From Our Customers</h2>
              </div>

              <div className="relative bg-neutral-50 border border-neutral-100 rounded-3xl p-8 min-h-[250px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-black mb-6">
                    {[...Array(reviews[activeReviewIndex].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-neutral-700 font-light text-base leading-relaxed italic">
                    "{reviews[activeReviewIndex].text}"
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200/50 pt-6 mt-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-100 bg-neutral-100">
                      <Image 
                        src={reviews[activeReviewIndex].photo} 
                        alt={reviews[activeReviewIndex].name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">{reviews[activeReviewIndex].name}</h4>
                      <p className="text-xs text-neutral-500">Ordered: {reviews[activeReviewIndex].property}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setActiveReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length)}
                      className="w-9 h-9 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center text-black transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={() => setActiveReviewIndex(prev => (prev + 1) % reviews.length)}
                      className="w-9 h-9 rounded-full border border-neutral-300 hover:border-black flex items-center justify-center text-black transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Featured Collections</span>
                <h2 className="text-4xl font-serif text-black mt-2">Signature Creations</h2>
              </div>

              <div className="space-y-6">
                {testimonials.map((test, index) => (
                  <div key={index} className="border border-neutral-150 rounded-3xl p-6 flex flex-col md:flex-row gap-6 bg-white hover:shadow-md transition-all">
                    <div className="relative w-full md:w-40 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image 
                        src={test.videoThumbnail} 
                        alt={test.client} 
                        fill 
                        className="object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[8px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded-full tracking-wider">
                        {test.tag}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-neutral-400">{test.achievement}</span>
                        <h4 className="text-base font-bold text-black">{test.client}</h4>
                        <p className="text-neutral-500 font-light text-xs leading-relaxed">{test.story}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Master Artisans</span>
            <h2 className="text-3xl font-serif text-black mt-2">Meet Our Elite Pastry Chefs</h2>
            <p className="text-neutral-500 font-light text-sm mt-3">Our team of master bakers crafts each treat with passion and precision.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white border border-neutral-100 rounded-3xl p-6 text-center space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-black bg-neutral-100">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-black">{member.name}</h4>
                  <p className="text-xs text-neutral-400 font-medium">{member.role}</p>
                </div>
                <p className="text-neutral-500 text-xs font-light leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Our Story</span>
              <h2 className="text-4xl font-serif text-black leading-tight">Crafting Sweet Memories for Over a Decade</h2>
              <p className="text-neutral-500 font-light leading-relaxed">
                Founded with a passion for exquisite pastries and cakes, Gem Crispy Confectionery blends artisanal baking with a dedication to customer delight. We believe every dessert tells a story.
              </p>
              
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-neutral-150">
                <div>
                  <h5 className="text-3xl font-bold font-serif text-black">12+</h5>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-1">Years Experience</p>
                </div>
                <div>
                  <h5 className="text-3xl font-bold font-serif text-black">450+</h5>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-1">Events Catered</p>
                </div>
                <div>
                  <h5 className="text-3xl font-bold font-serif text-black">99%</h5>
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-1">Happy Clients</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 text-white rounded-3xl p-8 space-y-6">
              <h4 className="text-xl font-bold font-serif border-b border-neutral-800 pb-4">Our Core Commitments</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Uncompromising Quality</span>
                  </h5>
                  <p className="text-neutral-400 text-xs font-light pl-3.5 mt-1">Every cake and pastry passes exhaustive craftsmanship and quality inspections.</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Premium Freshness</span>
                  </h5>
                  <p className="text-neutral-400 text-xs font-light pl-3.5 mt-1">We deliver fresh confections crafted to order for maximum flavor impact.</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Holistic E-Commerce</span>
                  </h5>
                  <p className="text-neutral-400 text-xs font-light pl-3.5 mt-1">We supply premium gift sets and curated collections for all celebrations.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Sweet Concierge</span>
                <h2 className="text-4xl font-serif text-black mt-2">Contact Us</h2>
                <p className="text-neutral-500 font-light text-sm mt-3">Reach out for custom cake orders, catering, or any confectionery inquiries.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-200">
                    <Phone size={16} className="text-black" />
                  </div>
                  <div>
                    <h5 className="text-xs text-neutral-400 uppercase font-semibold">Direct Call</h5>
                    <p className="text-sm text-black font-semibold">+234 800 000 0000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-200">
                    <Mail size={16} className="text-black" />
                  </div>
                  <div>
                    <h5 className="text-xs text-neutral-400 uppercase font-semibold">Email Support</h5>
                    <p className="text-sm text-black font-semibold">concierge@gemcrispy.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-200">
                    <Clock size={16} className="text-black" />
                  </div>
                  <div>
                    <h5 className="text-xs text-neutral-400 uppercase font-semibold">Business Hours</h5>
                    <p className="text-sm text-black font-semibold">Mon - Fri, 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="h-60 rounded-3xl overflow-hidden border border-neutral-200 relative bg-neutral-200 shadow-inner">
                <div className="absolute inset-0 bg-neutral-900/10 flex items-center justify-center font-serif text-neutral-600 font-bold">
                  [Location Map]
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/60 rounded-3xl p-8 shadow-sm">
              <h4 className="text-lg font-bold font-serif mb-6 text-black border-b border-neutral-50 pb-4">Send Inquiry</h4>
              
              {enquirySuccess ? (
                <div className="bg-neutral-50 text-black border border-neutral-250 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle className="mx-auto text-black" size={32} />
                  <h5 className="font-bold">Inquiry Received</h5>
                  <p className="text-xs text-neutral-500">Our pastry concierge will contact you shortly with personalized recommendations.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Name</label>
                    <input 
                      type="text" 
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({...enquiryForm, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Email</label>
                    <input 
                      type="email" 
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({...enquiryForm, email: e.target.value})}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Phone</label>
                    <input 
                      type="tel" 
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({...enquiryForm, phone: e.target.value})}
                      placeholder="e.g. +234 800 000 0000"
                      className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Details</label>
                    <textarea 
                      rows={4}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                      placeholder="Order type, date needed, dietary requirements..."
                      className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3.5 rounded-xl transition-colors uppercase text-xs tracking-wider"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-neutral-400 py-16 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <a href="#home" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">G</span>
              </div>
              <span className="text-white font-extrabold tracking-widest text-lg uppercase font-serif">Gem Crispy Confectionery</span>
            </a>
            <p className="text-neutral-500 font-light text-xs leading-relaxed">
              Premium artisanal bakery and confectionery, crafting exquisite treats with passion and precision for Nigerian celebrations and events.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
            <div className="flex flex-col space-y-2 text-xs">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#properties" className="hover:text-white transition-colors">Baked Goods</a>
              <a href="#shop" className="hover:text-white transition-colors">Confectionery Shop</a>
              <a href="#reviews" className="hover:text-white transition-colors">Customer Reviews</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Headquarters</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Gem Crispy Bakery<br />
              Lagos, Nigeria<br />
              <br />
              <span className="text-white">+234 800 000 0000</span>
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Premium Updates</h4>
            <p className="text-xs text-neutral-500 font-light">Subscribe for exclusive seasonal collections and event specials.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to updates!'); }} className="flex space-x-2">
              <input 
                type="email" 
                required
                placeholder="Email..." 
                className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none w-full"
              />
              <button type="submit" className="bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase">
                Join
              </button>
            </form>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-neutral-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} Gem Crispy Confectionery. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/admin" className="hover:text-white transition-colors">Admin Portal</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button 
        onClick={() => window.open('https://wa.me/2348000000000?text=Hello%20Gem%20Crispy', '_blank')}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={28} />
      </button>

    </div>
  );
}
