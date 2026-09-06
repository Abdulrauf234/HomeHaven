"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Laptop, Watch, Headphones, Cable, 
  ArrowUpRight, Check, Menu, X, ArrowRight, ShieldCheck, 
  Truck, Headset, Award, ChevronRight, Search, Zap, ExternalLink,
  BookOpen, Clock, Sparkles
} from 'lucide-react';
import { api, Gadget, FALLBACK_GADGETS, FALLBACK_ARTICLES, TechArticle } from '@/lib/api';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Featured', href: '#featured' },
  { label: 'Categories', href: '#categories' },
  { label: 'Spotlight', href: '#spotlight' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Tech Hub', href: '#tech-hub' }
];

const categoryTabs = [
  { id: 'All', label: 'All Devices', icon: Sparkles },
  { id: 'Smartphones', label: 'Smartphones', icon: Smartphone },
  { id: 'Laptops', label: 'Laptops', icon: Laptop },
  { id: 'Smartwatches', label: 'Smartwatches', icon: Watch },
  { id: 'Earbuds', label: 'Earbuds', icon: Headphones },
  { id: 'Accessories', label: 'Accessories', icon: Cable },
];

export default function HomePage() {
  const [gadgets, setGadgets] = useState<Gadget[]>(FALLBACK_GADGETS);
  const [articles] = useState<TechArticle[]>(FALLBACK_ARTICLES);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const [activeNav, setActiveNav] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    fetchGadgets();

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['home', 'featured', 'categories', 'spotlight', 'why-us', 'tech-hub'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            if (section === 'home') setActiveNav('Home');
            if (section === 'featured') setActiveNav('Featured');
            if (section === 'categories') setActiveNav('Categories');
            if (section === 'spotlight') setActiveNav('Spotlight');
            if (section === 'why-us') setActiveNav('Why Us');
            if (section === 'tech-hub') setActiveNav('Tech Hub');
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(splashTimer);
    };
  }, []);

  const fetchGadgets = async () => {
    try {
      const data = await api.getGadgets();
      if (data && data.length > 0) {
        setGadgets(data);
      }
    } catch (e) {
      console.error('API load error:', e);
    }
  };

  const handleWhatsApp = (productName: string) => {
    const phoneNumber = '+2348000000000';
    const message = `Hello ELS Gadget, I am interested in inquiring about ${productName}. Please share availability and details.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  const filteredGadgets = activeCategory === 'All' 
    ? gadgets 
    : gadgets.filter(g => g.category === activeCategory);

  const spotlightGadget = gadgets.find(g => g.featured) || gadgets[0];

  return (
    <div className="bg-white min-h-screen text-slate-900 selection:bg-slate-900 selection:text-white font-sans antialiased">
      
      {/* Splash Screen Loading Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-white"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="w-14 h-14 bg-white text-slate-950 rounded-2xl flex items-center justify-center font-heading font-extrabold text-xl tracking-wider shadow-2xl animate-pulse">
                ELS
              </div>
              <h2 className="font-heading text-lg font-bold tracking-wider">ELS GADGET</h2>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">PREMIUM MODERN TECH HUB</p>
              
              {/* Animated Progress Bar */}
              <div className="w-36 h-1 bg-slate-800 rounded-full overflow-hidden mt-6">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="w-full h-full bg-white rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Header / Navigation */}
      <header className={`fixed left-0 right-0 z-50 flex justify-center px-4 md:px-8 transition-all duration-500 ${isScrolled ? 'top-3' : 'top-5'}`}>
        <nav className={`w-full max-w-7xl rounded-full px-6 py-3.5 flex items-center justify-between transition-all duration-500 ${
          isScrolled 
            ? 'glass-nav' 
            : 'bg-white/60 backdrop-blur-md border border-slate-200/50'
        }`}>
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white font-heading font-bold text-sm tracking-wider group-hover:scale-105 transition-transform">
              ELS
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-slate-950 text-base tracking-tight leading-none">ELS GADGET</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">TECH HUB</span>
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-7 text-xs font-medium text-slate-600 uppercase tracking-widest">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={() => setActiveNav(item.label)}
                className={`relative py-1 hover:text-slate-950 transition-colors ${activeNav === item.label ? 'text-slate-950 font-semibold' : ''}`}
              >
                {item.label}
                {activeNav === item.label && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-slate-950"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <button 
              onClick={() => handleWhatsApp('ELS Premium Hardware')}
              className="bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs tracking-wider px-5 py-2.5 rounded-full transition-all flex items-center space-x-2 shadow-xs"
            >
              <span>Contact Hub</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-20 z-40 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl md:hidden flex flex-col space-y-4"
          >
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={() => { setActiveNav(item.label); setMobileMenuOpen(false); }} 
                className="py-3 text-sm font-semibold text-slate-900 border-b border-slate-100 flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronRight size={16} className="text-slate-400" />
              </a>
            ))}
            <button 
              onClick={() => { setMobileMenuOpen(false); handleWhatsApp('ELS Product Line'); }}
              className="w-full bg-slate-950 text-white font-medium text-xs tracking-wider py-3.5 rounded-2xl flex items-center justify-center space-x-2 mt-2"
            >
              <span>Direct Sales Inquiry</span>
              <ArrowUpRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* 1. HERO SECTION */}
        <section id="home" className="relative pt-32 sm:pt-36 md:pt-44 pb-8 md:pb-16 bg-white overflow-hidden pattern-grid">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
            
            {/* Top Minimal Pill */}
            <div className="flex justify-center mb-3">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200/80 rounded-full px-3 py-1 text-[10px] text-slate-600 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                <span>The 2026 Hardware Collection</span>
              </motion.div>
            </div>

            {/* Headline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-heading font-bold text-2xl sm:text-4xl md:text-6xl tracking-tight text-slate-950 leading-[1.08]">
                Technology, beautifully simplified.
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal max-w-sm sm:max-w-xl mx-auto leading-relaxed">
                Discover quality gadgets, flagship smartphones, ultrabooks, and high-performance audio — curated with precision.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 flex flex-wrap items-center justify-center gap-2.5"
            >
              <a 
                href="#featured"
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs tracking-wide rounded-xl transition-all flex items-center space-x-2 shadow-xs group"
              >
                <span>Explore Devices</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#spotlight"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium text-xs tracking-wide rounded-xl transition-all"
              >
                <span>View Spotlight</span>
              </a>
            </motion.div>

            {/* Compact Hero Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 md:mt-8 relative max-w-3xl mx-auto"
            >
              <div className="relative bg-slate-50 rounded-2xl md:rounded-3xl p-2 sm:p-3 border border-slate-200/80 shadow-xs group">
                
                <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full rounded-xl overflow-hidden bg-white border border-slate-200/60 flex items-center justify-center">
                  <Image 
                    src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1600&q=85"
                    alt="ELS Apex Flagship Hardware"
                    fill
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    priority
                  />
                  
                  {/* Subtle Floating Feature Tag */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-950 leading-tight">ELS Apex Flagship Edition</p>
                      <p className="text-[9px] text-slate-500 font-mono">Titanium Finish • 2026 Series</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* 2. FEATURED GADGETS */}
        <section id="featured" className="py-12 md:py-20 bg-slate-50/50 border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 md:mb-10">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">01 / COLLECTION</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-slate-950 mt-1">
                  Featured Gadgets
                </h2>
              </div>
              <p className="hidden md:block text-sm text-slate-500 max-w-sm mt-4 md:mt-0 font-normal text-center md:text-right">
                Minimal horizontal presentation of our primary hardware tiers. Select a category to inspect.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive 
                        ? 'bg-slate-950 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredGadgets.map((item) => (
                <div 
                  key={item.id}
                  className="tech-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between group cursor-pointer"
                  onClick={() => setSelectedGadget(item)}
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-200/60">
                      <Image 
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider text-slate-800 uppercase border border-slate-200/60">
                        {item.category}
                      </div>
                    </div>

                    <h3 className="font-heading text-base font-semibold text-slate-950 group-hover:text-slate-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono block">STARTING FROM</span>
                      <span className="font-heading text-sm font-bold text-slate-950">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsApp(item.name);
                      }}
                      className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-slate-950 group-hover:text-white flex items-center justify-center transition-colors"
                      aria-label="Inquire product"
                    >
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 3. CATEGORIES SECTION */}
        <section id="categories" className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            
            <div className="max-w-2xl mb-8 md:mb-12 text-center sm:text-left">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">02 / ARCHITECTURE</span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-slate-950 mt-1">
                Hardware Categories
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-2 font-normal">
                Engineered for work, creativity, and seamless daily integration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              
              {/* Category Card 1 */}
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200/80 flex flex-col justify-between min-h-[300px] md:min-h-[380px] relative overflow-hidden group">
                <div className="z-10 text-center sm:text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">CATEGORY 01</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-950 mt-1">Smartphones & Mobile</h3>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Flagship processing power, pro camera systems, and surgical-grade titanium frames.
                  </p>
                </div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mt-4 border border-slate-200/60 z-10">
                  <Image 
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
                    alt="Smartphones category"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Category Card 2 */}
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200/80 flex flex-col justify-between min-h-[300px] md:min-h-[380px] relative overflow-hidden group">
                <div className="z-10 text-center sm:text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">CATEGORY 02</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-950 mt-1">Ultrabooks & Laptops</h3>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    High thermal efficiency, high-gamut displays, and multi-day battery endurance.
                  </p>
                </div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mt-4 border border-slate-200/60 z-10">
                  <Image 
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
                    alt="Laptops category"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Category Card 3 */}
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200/80 flex flex-col justify-between min-h-[300px] md:min-h-[380px] relative overflow-hidden group">
                <div className="z-10 text-center sm:text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">CATEGORY 03</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-950 mt-1">Acoustics & Audio</h3>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Spatial sound mapping, hybrid noise cancellation, and beryllium driver precision.
                  </p>
                </div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mt-4 border border-slate-200/60 z-10">
                  <Image 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
                    alt="Audio category"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Category Card 4 */}
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200/80 flex flex-col justify-between min-h-[300px] md:min-h-[380px] relative overflow-hidden group">
                <div className="z-10 text-center sm:text-left">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400">CATEGORY 04</span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-950 mt-1">Wearables & Docks</h3>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Bio-frequency monitoring, sapphire displays, and minimal magnetic charging platforms.
                  </p>
                </div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mt-4 border border-slate-200/60 z-10">
                  <Image 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
                    alt="Wearables category"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. FEATURED PRODUCT SHOWCASE */}
        <section id="spotlight" className="py-12 md:py-20 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center">
              
              {/* Product Visual */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl group">
                  <Image 
                    src={spotlightGadget.image}
                    alt={spotlightGadget.name}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-white uppercase border border-white/15">
                    FLAGSHIP SPOTLIGHT
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">FEATURED HARDWARE</span>
                
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-2 leading-tight">
                  {spotlightGadget.name}
                </h2>
                
                <p className="text-xs text-slate-300 mt-3 leading-relaxed font-normal">
                  {spotlightGadget.description}
                </p>

                {/* Specs List */}
                <div className="mt-5 space-y-2 border-y border-white/10 py-4 text-left">
                  {spotlightGadget.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 text-[11px] text-slate-300 font-mono">
                      <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Price & CTA */}
                <div className="mt-5 flex items-center justify-center lg:justify-between gap-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono block">PRICE</span>
                    <span className="font-heading text-xl font-bold text-white">
                      ₦{spotlightGadget.price.toLocaleString()}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleWhatsApp(spotlightGadget.name)}
                    className="bg-white hover:bg-slate-200 text-slate-950 font-medium text-xs tracking-wider px-5 py-2.5 rounded-full transition-all flex items-center space-x-2"
                  >
                    <span>View Product</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* 5. WHY ELS GADGET */}
        <section id="why-us" className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            
            <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">03 / STANDARDS</span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-slate-950 mt-1">
                Why ELS Gadget
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-500 mt-2 font-normal">
                Built on uncompromising quality, verified origin, and straightforward customer service.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              
              {/* Feature 1 */}
              <div className="bg-slate-50 rounded-2xl p-5 md:p-7 border border-slate-200/80 hover:border-slate-950 transition-colors group text-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 mb-4 group-hover:scale-105 transition-transform mx-auto">
                  <Award size={18} />
                </div>
                <h3 className="font-heading font-semibold text-sm md:text-base text-slate-950">Quality Products</h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Every device undergoes multi-point inspection to ensure authentic hardware performance.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 rounded-2xl p-5 md:p-7 border border-slate-200/80 hover:border-slate-950 transition-colors group text-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 mb-4 group-hover:scale-105 transition-transform mx-auto">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-heading font-semibold text-sm md:text-base text-slate-950">Trusted Service</h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Transparent warranty coverage and direct resolution for peace of mind on all purchases.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 rounded-2xl p-5 md:p-7 border border-slate-200/80 hover:border-slate-950 transition-colors group text-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 mb-4 group-hover:scale-105 transition-transform mx-auto">
                  <Truck size={18} />
                </div>
                <h3 className="font-heading font-semibold text-sm md:text-base text-slate-950">Fast Delivery</h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Insured dispatch and swift transit straight to your home or office address.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-50 rounded-2xl p-5 md:p-7 border border-slate-200/80 hover:border-slate-950 transition-colors group text-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 mb-4 group-hover:scale-105 transition-transform mx-auto">
                  <Headset size={18} />
                </div>
                <h3 className="font-heading font-semibold text-sm md:text-base text-slate-950">Expert Support</h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Direct guidance from technical specialists who understand your workflow requirements.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 6. TECH HUB (News, Tips & Reviews) */}
        <section id="tech-hub" className="py-12 md:py-20 bg-slate-50/50 border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 md:mb-12">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">04 / KNOWLEDGE BASE</span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-slate-950 mt-1">
                  Tech Hub & Insights
                </h2>
              </div>
              <p className="hidden md:block text-sm text-slate-500 max-w-sm mt-4 md:mt-0 font-normal text-center md:text-right">
                Hardware reviews, workflow optimizations, and buying guides from our engineering desk.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {articles.map((art) => (
                <div key={art.id} className="tech-card rounded-2xl overflow-hidden flex flex-col group">
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                    <Image 
                      src={art.image}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-mono text-slate-900 uppercase">
                      {art.category}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mb-2">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{art.readTime}</span>
                        </span>
                        <span>•</span>
                        <span>{art.date}</span>
                      </div>

                      <h3 className="font-heading text-sm font-semibold text-slate-950 leading-snug group-hover:text-slate-700 transition-colors">
                        {art.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-950 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read Article</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 text-white pt-10 pb-8 md:pt-16 md:pb-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          
          <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-10 pb-8 md:pb-12 border-b border-white/10">
            
            {/* Brand Intro */}
            <div className="col-span-2 md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="w-8 h-8 bg-white text-slate-950 rounded-lg flex items-center justify-center font-heading font-bold text-sm">
                    ELS
                  </div>
                  <span className="font-heading font-bold text-base tracking-tight text-white">ELS GADGET</span>
                </div>
                
                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed font-normal">
                  Modern technology. Clear design. Zero clutter. Premium hardware curated for high performance.
                </p>
              </div>

              <div className="mt-4 text-[10px] text-slate-500 font-mono">
                Lagos • Abuja • Port Harcourt
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3">NAVIGATION</h4>
              <ul className="space-y-2 text-[11px] text-slate-300 font-medium">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social Links */}
            <div className="md:col-span-4">
              <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3">CONNECT & INQUIRE</h4>
              <p className="text-[11px] text-slate-400 mb-3">
                Questions on procurement or warranty service?
              </p>
              
              <button 
                onClick={() => handleWhatsApp('General Hub Inquiry')}
                className="w-full bg-white hover:bg-slate-200 text-slate-950 font-medium text-[11px] tracking-wide py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>WhatsApp Support</span>
                <ArrowUpRight size={13} />
              </button>

              <div className="mt-4 flex items-center gap-4 text-[11px] text-slate-400">
                <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono">
            <p>© {new Date().getFullYear()} ELS Gadget. All rights reserved.</p>
            <p className="mt-1.5 sm:mt-0">Premium Modern Tech Hub</p>
          </div>

        </div>
      </footer>

      {/* Product Inspection Modal */}
      <AnimatePresence>
        {selectedGadget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-200 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedGadget(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 mb-6 border border-slate-200/60">
                <Image 
                  src={selectedGadget.image}
                  alt={selectedGadget.name}
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                {selectedGadget.category}
              </span>

              <h3 className="font-heading text-xl font-bold text-slate-950 mt-1">
                {selectedGadget.name}
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {selectedGadget.description}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {selectedGadget.specs.map((spec, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-slate-700 font-mono">
                    <Check size={12} className="text-slate-950" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">PRICE</span>
                  <span className="font-heading text-xl font-bold text-slate-950">
                    ₦{selectedGadget.price.toLocaleString()}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    handleWhatsApp(selectedGadget.name);
                    setSelectedGadget(null);
                  }}
                  className="bg-slate-950 text-white text-xs font-medium px-6 py-3 rounded-full hover:bg-slate-800 transition-colors flex items-center space-x-2"
                >
                  <span>Order via WhatsApp</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
