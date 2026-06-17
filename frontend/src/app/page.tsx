"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Search, MessageCircle, CheckCircle, Menu, X, 
  ChevronLeft, ChevronRight, Star, User, MapPin, Mail, 
  Phone, Clock, Heart, ShoppingCart, Award, Shield, 
  TrendingUp, Users, Eye, HelpCircle, ArrowRight, Upload, Check
} from 'lucide-react';
import { api, Property, Product } from '@/lib/api';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#properties' },
  { label: 'Price List', href: '#apartments' },
  { label: 'Custom Orders', href: '#shop' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('All');
  const [propertySearch, setPropertySearch] = useState<string>('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('All');
  const [productSearch, setProductSearch] = useState<string>('');
  
  // Wishlist and cart states
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Carousel states for property image gallery
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  
  // Review Carousel State
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['home', 'properties', 'apartments', 'shop', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            let label = 'Home';
            if (section === 'properties') label = 'Products';
            if (section === 'apartments') label = 'Price List';
            if (section === 'shop') label = 'Custom Orders';
            if (section === 'about') label = 'About Us';
            if (section === 'contact') label = 'Contact';
            setActiveNav(label);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const props = await api.getProperties({});
      const prods = await api.getProducts({});
      setProperties(props);
      setProducts(prods);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

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

  // Helper to trigger WhatsApp
  const triggerWhatsApp = async (type: 'buy' | 'inspection' | 'agent' | 'product', item: Property | Product) => {
    let message = '';
    const phoneNumber = '+2348000000000'; // Target phone number (replace with custom or default)

    if (type === 'buy' && 'location' in item) {
      message = `Hello Gem Crispy Confectionery, I am interested in ordering: "${item.title}" from ${item.location}. Price: $${item.price.toLocaleString()}. Please share payment details and availability.`;
    } else if (type === 'inspection' && 'location' in item) {
      message = `Hello Gem Crispy, I would like to book a tasting session for the product: "${item.title}" from ${item.location}. Price: $${item.price.toLocaleString()}. When is the best time?`;
    } else if (type === 'agent' && 'location' in item) {
      message = `Hello Gem Crispy Confectionery, I want to discuss a custom order regarding "${item.title}". Please connect me with your team.`;
    } else if (type === 'product' && 'category' in item) {
      message = `Hello Gem Crispy Confectionery, I am interested in ordering "${item.name}" from your collection. Category: ${item.category}. Price: $${item.price.toLocaleString()}. What are the available flavors?`;
    }

    // Log the enquiry
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

  // Product type categories (Bakery items)
  const propertyTypes = ['All', 'Cakes', 'Pastries', 'Breads', 'Doughnuts', 'Specialty Items'];
  
  // Confectionery categories (Shop items)
  const productCategories = ['All', 'Cookies', 'Chocolates', 'Gift Sets', 'Cupcakes', 'Small Chops', 'Hampers'];

  const benefits = [
    { title: 'Verified Products', desc: 'Every baked good is crafted with premium ingredients and strict quality checks.', icon: Shield },
    { title: 'Trusted Bakers', desc: 'Work with elite, experienced pastry chefs dedicated to perfect your treat.', icon: Users },
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
      name: 'Elena Rostova',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'The eShop’s selection of artisanal breads is unmatched. My family loves the sourdough, and the bakery staff are incredibly helpful.',
      property: 'Artisanal Sourdough Bread'
    }
  ];

  const testimonials = [
    {
      client: 'Nia & Samuel',
      achievement: 'Wedding Reception Catering',
      story: 'We entrusted Gem Crispy with our wedding cake and dessert spread. They exceeded every expectation—from the design consultation to flawless execution on the day. Our guests are still talking about those delicious treats!',
      videoThumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
      tag: 'Wedding Showcase'
    },
    {
      client: 'Corporate Events Manager',
      achievement: 'Premium Confectionery Partnership',
      story: 'For our company retreats and events, Gem Crispy has become our trusted premium partner. Their consistency, professionalism, and exquisite taste profiles elevate every corporate function we host. Highly recommended!',
      videoThumbnail: 'https://images.unsplash.com/photo-1585518419759-5a14ed9ead0f?auto=format&fit=crop&w=600&q=80',
      tag: 'Corporate Excellence'
    }
  ];

  const team = [
    { name: 'Amara Okafor', role: 'Head Pastry Chef & Co-Founder', bio: 'Le Cordon Bleu trained with 18 years crafting premium cakes, pastries, and custom confectionery creations for elite events.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { name: 'Kunle Adebayo', role: 'Master Confectioner', bio: 'Specialist in premium chocolates, bonbons, and artisanal sweets with international certification in fine confectionery.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { name: 'Zara Taiwo', role: 'Production & Quality Manager', bio: 'Ensures every product meets our exacting hygiene and quality standards before reaching our valued customers.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
    { name: 'Chidi Ugwu', role: 'Artisanal Bread Master', bio: 'Traditional sourdough specialist with passion for heritage grain baking and organic fermentation techniques.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
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
    <div className="bg-[var(--background)] min-h-screen text-[var(--text)] selection:bg-[var(--accent)] selection:text-white">
      
      {/* Floating Glassmorphism Navbar */}
      <div className={`fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ${isScrolled ? 'top-3' : 'top-6'}`}>
        <nav className={`w-full max-w-6xl rounded-full py-4 px-6 md:px-8 flex items-center justify-between shadow-lg transition-all duration-300 ${
          isScrolled 
            ? 'glass border-[rgba(74,44,29,0.15)] py-3 shadow-xl' 
            : 'bg-white/40 border-[rgba(74,44,29,0.05)] backdrop-blur-sm'
        }`}>
          {/* Logo & Search Area */}
          <div className="flex items-center space-x-3">
            <a href="#home" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-[var(--accent)] rounded-full flex items-center justify-center border border-[var(--primary)] shadow-sm">
                <span className="text-[var(--secondary)] font-extrabold text-sm font-serif">G</span>
              </div>
              <span className="text-[var(--accent)] font-extrabold tracking-wider text-base uppercase font-serif hidden sm:inline-block">Gem Crispy</span>
            </a>
            <button 
              onClick={() => {
                const searchInput = document.querySelector('input[placeholder*="Search"]');
                if (searchInput) {
                  searchInput.scrollIntoView({ behavior: 'smooth' });
                  (searchInput as HTMLInputElement).focus();
                }
              }}
              className="w-8 h-8 rounded-full border border-[rgba(74,44,29,0.12)] flex items-center justify-center text-[var(--accent)] hover:bg-[var(--secondary)] hover:border-[var(--primary)] transition-all cursor-pointer"
            >
              <Search size={14} />
            </button>
          </div>

          {/* Navigation Links - Desktop Centered */}
          <div className="hidden lg:flex items-center space-x-6 text-xs uppercase tracking-widest font-bold">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={() => setActiveNav(item.label)}
                className="relative py-2 text-[var(--accent)] hover:text-[var(--primary)] transition-colors"
              >
                {item.label}
                {activeNav === item.label && (
                  <motion.div 
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* CTA - WhatsApp Button on the right */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://wa.me/2348000000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-[1.03] shadow-md flex items-center space-x-2"
            >
              <MessageCircle size={14} />
              <span>Order Now</span>
            </a>
          </div>

          {/* Hamburger Menu - Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[var(--accent)] hover:text-[var(--primary)] transition-colors p-1"
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
            className="fixed inset-x-4 top-24 z-40 bg-[var(--background)] border border-[rgba(74,44,29,0.1)] rounded-3xl p-6 shadow-2xl lg:hidden flex flex-col space-y-4"
          >
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={() => {
                  setActiveNav(item.label);
                  setMobileMenuOpen(false);
                }} 
                className={`py-2 text-base font-semibold text-[var(--accent)] border-b border-[rgba(74,44,29,0.05)] transition-colors flex items-center justify-between ${activeNav === item.label ? 'text-[var(--primary)] font-bold' : ''}`}
              >
                <span>{item.label}</span>
                {activeNav === item.label && <span className="text-[var(--primary)]">•</span>}
              </a>
            ))}
            <a 
              href="https://wa.me/2348000000000" 
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-center py-3 rounded-full uppercase tracking-wider text-sm flex items-center justify-center space-x-2"
            >
              <MessageCircle size={16} />
              <span>Order Now</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen pt-32 pb-16 flex items-center bg-[var(--background)] overflow-hidden">
        {/* Background decorative elements: subtle floating lines and dots */}
        <div className="absolute top-24 left-10 w-24 h-24 pattern-dots opacity-30 pointer-events-none select-none" />
        <div className="absolute bottom-16 left-1/4 w-32 h-32 pattern-dots opacity-20 pointer-events-none select-none animate-pulse-slow" />
        <div className="absolute top-1/3 right-10 w-20 h-40 border-r border-dashed border-[rgba(74,44,29,0.1)] rounded-r-full opacity-40 pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Side: Editorial copywriting & features */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center lg:justify-start space-x-2 px-3 py-1.5 rounded-full border border-[rgba(212,160,23,0.3)] bg-[rgba(247,233,215,0.4)] text-[var(--primary)] font-bold text-[10px] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span>PREMIUM CONFECTIONERY</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[var(--accent)] font-serif leading-[1.1] text-balance">
                Baked with <span className="text-[var(--primary)] font-light italic">Passion</span>,<br />
                Made for <span className="text-[var(--primary)]">You</span>
              </h1>
            </div>
            
            <p className="text-[var(--accent)] opacity-85 font-light leading-relaxed max-w-lg text-base">
              Experience the sublime taste of our hand-crafted cakes, melt-in-your-mouth pastries, artisanal sourdough breads, and custom confections. Baked fresh daily with heritage techniques and natural premium ingredients.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href="#properties" 
                className="border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--secondary)] font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300"
              >
                Learn More
              </a>
              <a 
                href="https://wa.me/2348000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <MessageCircle size={16} />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Baker Portrait and Mini Feature Card */}
            <div className="flex flex-wrap gap-6 pt-8 items-center justify-center lg:justify-start border-t border-[rgba(74,44,29,0.08)] mt-8">
              {/* Chef Portrait Card */}
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-[rgba(74,44,29,0.06)] rounded-full p-2 pr-6 shadow-sm">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--primary)] flex-shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
                    alt="Head Pastry Chef Amara Okafor" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--accent)]">Amara Okafor</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Head Pastry Chef</p>
                </div>
              </div>
              
              {/* Feature Card */}
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-[rgba(212,160,23,0.15)] rounded-2xl p-2.5 px-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] text-sm">
                  ✨
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--accent)]">Fresh Daily</h4>
                  <p className="text-[10px] text-gray-500 font-medium leading-none mt-0.5">Always Delicious</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Giant Chocolate Cake and Floating Cards */}
          <div className="relative flex justify-center items-center w-full min-h-[350px] lg:min-h-[550px] py-8 lg:py-12">
            {/* Background glow and abstract chocolate shape */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-visible">
              <div className="absolute w-[80%] h-[80%] bg-[var(--primary)] rounded-full opacity-10 filter blur-[80px]" />
              
              {/* Dark chocolate abstract shape */}
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[110%] h-[110%] fill-[#361e12] opacity-15 filter blur-xs animate-pulse-slow">
                <path d="M43.2,-73.4C55.7,-67.2,65.3,-54.6,71.2,-40.4C77,-26.2,79.1,-10.4,78.2,5C77.3,20.4,73.4,35.4,65.3,47.7C57.3,60.1,45.2,69.7,31.5,75.4C17.7,81.1,2.4,82.8,-12.9,80.6C-28.3,78.3,-43.7,72.2,-55.5,62.2C-67.4,52.2,-75.7,38.3,-79.6,23.3C-83.5,8.2,-82.9,-8,-78.3,-22.6C-73.8,-37.2,-65.3,-50.2,-53.4,-56.7C-41.5,-63.3,-26.2,-63.3,-12.2,-67.9C1.8,-72.5,15.8,-81.6,30.8,-79.7C45.8,-77.8,61.8,-64.8,43.2,-73.4Z" transform="translate(100 100)" />
              </svg>
            </div>

            {/* Floating particles around the cake */}
            <div className="absolute inset-0 z-10 pointer-events-none select-none">
              {/* Chocolate Piece 1 */}
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 8, 0], rotate: [0, 25, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-20 right-10 text-3xl filter drop-shadow-md"
              >
                🍫
              </motion.div>
              {/* Chocolate Piece 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0], x: [0, -6, 0], rotate: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute bottom-16 left-8 text-2xl filter drop-shadow-md"
              >
                🍫
              </motion.div>
              {/* Sparkle 1 */}
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-1/3 left-6 text-xl text-[var(--primary)] filter drop-shadow-sm"
              >
                ✨
              </motion.div>
              {/* Sparkle 2 */}
              <motion.div 
                animate={{ scale: [1.2, 0.8, 1.2], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-1/3 right-4 text-lg text-[var(--primary)] filter drop-shadow-sm"
              >
                ✨
              </motion.div>
            </div>

            {/* Rotating luxury quality seal */}
            <div className="absolute top-0 right-4 md:right-12 z-20">
              <div className="w-24 h-24 md:w-28 md:h-28 animate-spin-slow select-none filter drop-shadow-md">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path id="sealCirclePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                  </defs>
                  <circle cx="50" cy="50" r="34" fill="none" stroke="#D4A017" strokeWidth="1" strokeDasharray="3 2" />
                  <circle cx="50" cy="50" r="41" fill="none" stroke="#D4A017" strokeWidth="1.5" />
                  <text fill="#4A2C1D" fontSize="7.8" fontWeight="bold" letterSpacing="1">
                    <textPath href="#sealCirclePath">
                      ★ PREMIUM QUALITY ★ LUXURY BAKERY
                    </textPath>
                  </text>
                  <polygon points="50,34 53,41 60,41 55,45 57,52 50,48 43,52 45,45 40,41 47,41" fill="#D4A017" />
                </svg>
              </div>
            </div>

            {/* Shadow beneath the cake */}
            <motion.div 
              animate={{ scale: [1, 0.85, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-black/30 rounded-full blur-xl -z-10"
            />

            {/* Cake container with float animation */}
            <motion.div 
              animate={{ y: [0, -18, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-[80%] max-w-[380px] aspect-square z-10 flex items-center justify-center"
            >
              <Image 
                src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80" 
                alt="Luxury Ice Cream Cup" 
                width={400}
                height={400}
                className="object-contain filter drop-shadow-[0_25px_60px_rgba(74,44,29,0.35)] select-none pointer-events-none rounded-[2rem]"
                priority
              />
            </motion.div>

            {/* Floating Feature Card 1 (Ingredients) */}
            <div className="absolute top-1/4 -left-4 md:-left-12 z-20 animate-float-slow max-w-[210px]">
              <div className="glass-card rounded-2xl p-3 shadow-md flex items-center gap-3 bg-white/70">
                <div className="w-10 h-10 rounded-xl bg-[var(--secondary)] flex items-center justify-center text-xl shadow-sm">
                  🌾
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--accent)] leading-tight">Premium Ingredients</h4>
                  <p className="text-[9px] text-gray-500 mt-0.5 leading-snug">Only the finest organic sources</p>
                </div>
              </div>
            </div>

            {/* Floating Feature Card 2 (Delivery) */}
            <div className="absolute bottom-1/4 -right-4 md:-right-8 z-20 animate-float-fast max-w-[210px]">
              <div className="glass-card rounded-2xl p-3 shadow-md flex items-center gap-3 bg-white/70">
                <div className="w-10 h-10 rounded-xl bg-[var(--secondary)] flex items-center justify-center text-xl shadow-sm">
                  🚀
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--accent)] leading-tight">Fast Delivery</h4>
                  <p className="text-[9px] text-gray-500 mt-0.5 leading-snug">Freshly delivered to your door</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif tracking-tight text-black mb-4">Why Discerning Customers Choose Gem Crispy</h2>
            <p className="text-neutral-500 font-light">We deliver premium baked goods with meticulous quality, authentic flavors, and exceptional service every single time.</p>
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

      {/* BAKERY PRODUCTS SECTION */}
      <section id="properties" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-extrabold" id="apartments">Freshly Made</span>
              <h2 className="text-4xl font-serif tracking-tight text-black mt-2">Our Specialty Items</h2>
            </div>
            
            {/* Search Form */}
            <form onSubmit={handlePropertySearch} className="flex items-center border border-neutral-200 rounded-full px-4 py-2 w-full md:max-w-md bg-white">
              <input 
                type="text" 
                placeholder="Search by flavor or name..." 
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-black placeholder-neutral-400 px-2"
              />
              <button type="submit" className="p-1.5 bg-black rounded-full text-white hover:bg-neutral-800 transition-colors">
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Filtering buttons */}
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

          {/* Properties Grid */}
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
                    {/* Image Gallery */}
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

                      {/* Availability badge */}
                      <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
                        property.availability === 'Available' ? 'bg-white text-black' : 'bg-red-600 text-white'
                      }`}>
                        {property.availability}
                      </span>

                      {/* Property Type Badge */}
                      <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-black text-white">
                        {property.type}
                      </span>

                      {/* Carousel controls */}
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

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-neutral-400 space-x-1">
                          <MapPin size={12} />
                          <span>{property.location}</span>
                        </div>
                        <h3 className="text-lg font-bold text-black font-serif line-clamp-1">{property.title}</h3>
                        <p className="text-neutral-500 font-light text-xs line-clamp-2 leading-relaxed">{property.description}</p>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center space-x-4 border-t border-neutral-100 pt-4 text-xs font-medium text-neutral-600">
                        {property.bedrooms > 0 && (
                          <span>{property.bedrooms} Portion{property.bedrooms > 1 && 's'}</span>
                        )}
                        {property.bathrooms > 0 && (
                          <span>{property.bathrooms} Serve{property.bathrooms > 1 && 's'}</span>
                        )}
                        <span className="text-black font-semibold ml-auto text-sm">${property.price.toLocaleString()}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-50">
                        <button
                          onClick={() => triggerWhatsApp('inspection', property)}
                          className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-[10px] font-bold py-2 px-1 rounded-lg border border-neutral-200 transition-colors text-center uppercase"
                        >
                          Get Details
                        </button>
                        <button
                          onClick={() => triggerWhatsApp('buy', property)}
                          className="bg-black hover:bg-neutral-900 text-white text-[10px] font-bold py-2 px-1 rounded-lg transition-colors text-center uppercase"
                        >
                          Order Now
                        </button>
                        <button
                          onClick={() => triggerWhatsApp('agent', property)}
                          className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-[10px] font-bold py-2 px-1 rounded-lg border border-[#25D366]/20 transition-colors text-center uppercase"
                        >
                          WhatsApp
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

      {/* SNACKS & BULK ORDERS SECTION */}
      <section id="shop" className="py-24 bg-neutral-950 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-extrabold">Bulk & Wholesale</span>
              <h2 className="text-4xl font-serif tracking-tight text-white mt-2">Gem Crispy Snacks Collection</h2>
            </div>

            {/* Search */}
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

          {/* Filtering */}
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

          {/* Products Grid */}
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
                        <span>Add to Cart</span>
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

      {/* REVIEWS & TESTIMONIALS */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Reviews Carousel */}
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Client Experiences</span>
                <h2 className="text-4xl font-serif text-black mt-2">Hear From Our Owners</h2>
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
                      <p className="text-xs text-neutral-500">Purchased: {reviews[activeReviewIndex].property}</p>
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

            {/* Testimonials Video-Style Showcases */}
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Featured Treats</span>
                <h2 className="text-4xl font-serif text-black mt-2">Our Bakery Collection</h2>
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
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Experts on Demand</span>
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
            
            {/* Story */}
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

            {/* Core Values */}
            <div className="bg-neutral-900 text-white rounded-3xl p-8 space-y-6">
              <h4 className="text-xl font-bold font-serif border-b border-neutral-800 pb-4">Our Core Directives</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Uncompromising Quality</span>
                  </h5>
                  <p className="text-neutral-400 text-xs font-light pl-3.5 mt-1">Every cake and pastry cataloged passes exhaustive design and quality inspections.</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Strict Discretion</span>
                  </h5>
                  <p className="text-neutral-400 text-xs font-light pl-3.5 mt-1">We respect privacy for private events and high-end celebrations.</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span>Holistic E-Commerce Support</span>
                  </h5>
                  <p className="text-neutral-400 text-xs font-light pl-3.5 mt-1">We supply designer accessories and gift sets directly for your celebrations.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRODUCTION PROCESS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Craftsmanship</span>
            <h2 className="text-4xl font-serif text-black mt-2">Our Production Process</h2>
            <p className="text-neutral-500 font-light text-sm mt-3">From premium ingredients to your table—every step is meticulously executed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Ingredient Selection', desc: 'Premium ingredients sourced from trusted suppliers worldwide', icon: '🌾' },
              { step: 2, title: 'Preparation', desc: 'Expert preparation and mixing of batters with precision', icon: '🥣' },
              { step: 3, title: 'Baking', desc: 'Perfect temperature control for flawless baked goods', icon: '🔥' },
              { step: 4, title: 'Decoration', desc: 'Artistic finishing touches by our master decorators', icon: '✨' },
              { step: 5, title: 'Quality Inspection', desc: 'Rigorous quality checks ensure perfection every time', icon: '✅' },
              { step: 6, title: 'Packaging', desc: 'Beautiful, secure packaging maintains freshness', icon: '📦' },
              { step: 7, title: 'Delivery', desc: 'Fast, careful delivery to your doorstep', icon: '🚚' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-center space-y-3 h-full flex flex-col items-center justify-center hover:shadow-lg transition-all">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-black">{item.title}</h3>
                  <p className="text-neutral-600 text-xs font-light">{item.desc}</p>
                </div>
                {item.step < 7 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-neutral-300">
                    <ArrowRight size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Visual Showcase</span>
            <h2 className="text-4xl font-serif text-black mt-2">Our Gallery</h2>
            <p className="text-neutral-500 font-light text-sm mt-3">Explore our exquisite creations and satisfied customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Wedding Cakes', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80' },
              { title: 'Artisanal Pastries', image: 'https://images.unsplash.com/photo-1585518419759-5a14ed9ead0f?auto=format&fit=crop&w=500&q=80' },
              { title: 'Fresh Bread', image: 'https://images.unsplash.com/photo-1549365776-b866e0ed968f?auto=format&fit=crop&w=500&q=80' },
              { title: 'Cupcake Collections', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80' },
              { title: 'Event Catering', image: 'https://images.unsplash.com/photo-1464430521811-c03f2311d2ba?auto=format&fit=crop&w=500&q=80' },
              { title: 'Production', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80' }
            ].map((gallery, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="relative group overflow-hidden rounded-2xl aspect-square cursor-pointer"
              >
                <Image
                  src={gallery.image}
                  alt={gallery.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <h3 className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {gallery.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM ORDERS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Information */}
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Personalized Creations</span>
                <h2 className="text-4xl font-serif text-black mt-2">Custom Orders</h2>
                <p className="text-neutral-500 font-light text-sm mt-3">Create your dream confectionery experience with our bespoke ordering service.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">Request Custom Design</h4>
                    <p className="text-neutral-600 text-sm font-light">Describe your vision and we'll bring it to life</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">Upload Inspiration</h4>
                    <p className="text-neutral-600 text-sm font-light">Share reference images or design ideas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">Choose Event Type</h4>
                    <p className="text-neutral-600 text-sm font-light">Wedding, birthday, corporate, or special occasion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-1">Select Delivery Date</h4>
                    <p className="text-neutral-600 text-sm font-light">We accommodate most timelines with advance notice</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8">
              <h4 className="text-lg font-bold font-serif mb-6 text-black border-b border-neutral-200 pb-4">Request Custom Order</h4>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Event Type</label>
                  <select className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black">
                    <option>Birthday Cake</option>
                    <option>Wedding Cake</option>
                    <option>Corporate Event</option>
                    <option>Anniversary</option>
                    <option>Custom Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Delivery Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Budget (Optional)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 50000" 
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Special Instructions</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your custom order requirements, dietary preferences, flavor choices, design ideas..."
                    className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Inspiration Images (Upload)</label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-black transition-colors cursor-pointer">
                    <Upload size={24} className="mx-auto text-neutral-400 mb-2" />
                    <p className="text-xs text-neutral-500 font-light">Click to upload reference images</p>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3.5 rounded-xl transition-colors uppercase text-xs tracking-wider mt-6"
                >
                  Submit Custom Order Request
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* WHAT WE OFFER SECTION */}
      <section className="py-24 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Our Expertise</span>
            <h2 className="text-4xl font-serif text-black mt-2">What Our Team Offers</h2>
            <p className="text-neutral-500 font-light text-sm mt-3">Comprehensive baking and confectionery solutions for every need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Cakes & Pastries',
                desc: 'Custom-designed cakes for birthdays, weddings, anniversaries, and special occasions. All freshly baked with premium ingredients.',
                items: ['Birthday Cakes', 'Wedding Cakes', 'Anniversary Cakes', 'Themed Designs', 'Fondant & Buttercream']
              },
              {
                title: 'Snacks & Small Chops',
                desc: 'Delicious finger foods perfect for parties, corporate events, and gatherings. Ready to serve or bulk orders available.',
                items: ['Meat Pies', 'Chin Chin', 'Samosas', 'Spring Rolls', 'Puff Puff']
              },
              {
                title: 'Breads & Baked Goods',
                desc: 'Artisanal breads baked fresh daily. From traditional sourdough to specialty grain combinations.',
                items: ['Sourdough', 'Sandwich Bread', 'Whole Wheat', 'Rye Bread', 'Special Orders']
              },
              {
                title: 'Event Catering',
                desc: 'Full catering services for weddings, corporate functions, and private events. Customized menu planning available.',
                items: ['Menu Planning', 'Large Orders', 'Delivery & Setup', 'Professional Service', 'Flexible Pricing']
              },
              {
                title: 'Cookies & Confections',
                desc: 'Handmade cookies, chocolates, and premium confectionery items. Perfect for gifts or personal indulgence.',
                items: ['Chocolate Truffles', 'Macarons', 'Sugar Cookies', 'Gift Boxes', 'Bulk Orders']
              },
              {
                title: 'Bulk & Wholesale',
                desc: 'Wholesale pricing for businesses, restaurants, and retailers. Consistent quality and timely delivery guaranteed.',
                items: ['Restaurant Supply', 'Wholesale Pricing', 'Bulk Discounts', 'Contract Orders', 'Recurring Delivery']
              }
            ].map((offer, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 space-y-4 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-black">{offer.title}</h3>
                <p className="text-neutral-600 text-sm font-light leading-relaxed">{offer.desc}</p>
                <div className="pt-4 border-t border-neutral-200 space-y-2">
                  {offer.items.map((item, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Check size={14} className="text-black flex-shrink-0" />
                      <span className="text-xs text-neutral-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Information */}
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Sweet Concierge</span>
                <h2 className="text-4xl font-serif text-black mt-2">Contact Us</h2>
                <p className="text-neutral-500 font-light text-sm mt-3">Reach out for custom cake orders, catering, or any sweet inquiries.</p>
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
                    <h5 className="text-xs text-neutral-400 uppercase font-semibold">Email Concierge</h5>
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

              {/* Map Mockup */}
              <div className="h-60 rounded-3xl overflow-hidden border border-neutral-200 relative bg-neutral-200 shadow-inner">
                <div className="absolute inset-0 bg-neutral-900/10 flex items-center justify-center font-serif text-neutral-600 font-bold">
                  [Interactive Location Map]
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-neutral-200/60 rounded-3xl p-8 shadow-sm">
              <h4 className="text-lg font-bold font-serif mb-6 text-black border-b border-neutral-50 pb-4">Send Enquiry</h4>
              
              {enquirySuccess ? (
                <div className="bg-neutral-50 text-black border border-neutral-250 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle className="mx-auto text-black" size={32} />
                  <h5 className="font-bold">Enquiry Logged</h5>
                  <p className="text-xs text-neutral-500">Our senior representative will reach out to you via call/email shortly.</p>
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
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Phone Number</label>
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
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Message Details</label>
                    <textarea 
                      rows={4}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({...enquiryForm, message: e.target.value})}
                      placeholder="Specify requirements, budget or event dates..."
                      className="w-full bg-neutral-50 text-black border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3.5 rounded-xl transition-colors uppercase text-xs tracking-wider"
                  >
                    Submit Request
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
              Premium agency representing luxury sweets, designer fittings, and concierge tasting logistics.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <div className="flex flex-col space-y-2 text-xs">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#properties" className="hover:text-white transition-colors">Products</a>
              <a href="#shop" className="hover:text-white transition-colors">Bakery Shop</a>
              <a href="#reviews" className="hover:text-white transition-colors">Customer Testimonials</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Headquarters</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              102 Noir Executive Boulevard,<br />
              Beverly Hills, California,<br />
              United States
            </p>
            <p className="text-xs text-white">+234 800 000 0000</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Private Catalog</h4>
            <p className="text-xs text-neutral-500 font-light">Subscribe to get early off-market premium listings.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex space-x-2">
              <input 
                type="email" 
                required
                placeholder="Email address..." 
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
            <a href="/admin" className="hover:text-white transition-colors">Admin Dashboard Login</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <button 
        onClick={() => window.open('https://wa.me/2348000000000?text=Hello%20Gem%20Crispy%20Confectionery!%20I%20would%20like%20to%20place%20an%20order', '_blank')}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={28} />
      </button>

    </div>
  );
}
