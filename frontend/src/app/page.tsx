"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Search, MessageCircle, CheckCircle, Menu, X, 
  ChevronLeft, ChevronRight, Star, User, MapPin, Mail, 
  Phone, Clock, Heart, ShoppingBag, Award, Shield, 
  TrendingUp, Users, Eye, HelpCircle, ArrowRight, BookOpen, Settings, Zap
} from 'lucide-react';
import { api, Equipment, Snack } from '@/lib/api';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Training', href: '#training' },
  { label: 'Equipment', href: '#equipment' },
  { label: 'Contact', href: '#contact' }
];

export default function HomePage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [activeNav, setActiveNav] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchData();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['home', 'about', 'products', 'training', 'equipment', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            let label = 'Home';
            if (section === 'about') label = 'About Us';
            if (section === 'products') label = 'Products';
            if (section === 'training') label = 'Training';
            if (section === 'equipment') label = 'Equipment';
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
      const eq = await api.getEquipment({});
      const snks = await api.getSnacks({});
      setEquipment(eq);
      setSnacks(snks);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  const handleWhatsApp = (item: string) => {
    const phoneNumber = '+2348000000000';
    const message = `Hello Gem Crispy Confectioneries, I am interested in ${item}. Please share more details.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--text)] selection:bg-[var(--primary)] selection:text-white font-sans" suppressHydrationWarning>
      
      {/* Floating Navbar */}
      <div className={`fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ${isScrolled ? 'top-3' : 'top-6'}`}>
        <nav className={`w-full max-w-7xl rounded-full py-4 px-6 md:px-8 flex items-center justify-between transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg border border-neutral-100' 
            : 'bg-white/40 border-[rgba(74,44,29,0.05)] backdrop-blur-sm'
        }`}>
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[var(--text-dark)] font-extrabold text-xl">G</span>
            </div>
            <span className="text-[var(--text-dark)] font-bold tracking-tight text-lg hidden sm:block">Gem Crispy</span>
          </a>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-[var(--text-dark)] uppercase tracking-widest">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={() => setActiveNav(item.label)}
                className="relative hover:text-[var(--primary)] transition-colors"
              >
                {item.label}
                {activeNav === item.label && (
                  <motion.div 
                    layoutId="activeUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[var(--primary)] rounded-full"
                  />
                )}
              </a>
            ))}
          </div>

          <div className="hidden md:flex">
            <button 
              onClick={() => handleWhatsApp('ordering your products')}
              className="bg-[var(--accent)] hover:bg-[#CC5200] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <ShoppingBag size={16} />
              <span>Order Now</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-[var(--text-dark)]">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 bg-white border border-neutral-100 rounded-3xl p-6 shadow-2xl lg:hidden flex flex-col space-y-4"
          >
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                onClick={() => { setActiveNav(item.label); setMobileMenuOpen(false); }} 
                className="py-3 text-base font-bold text-[var(--text-dark)] border-b border-neutral-50 uppercase tracking-wider"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen pt-32 pb-16 flex items-center bg-[var(--secondary)] overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[var(--green-main)] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-[var(--primary)] bg-white/50 text-[var(--text-dark)] font-bold text-xs uppercase tracking-widest backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span>Premium Production & Supply</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[var(--text-dark)] leading-[1.1]">
              Quality Snacks, <br/>
              Professional Training & <br/>
              <span className="text-[var(--accent)]">Processing Equipment</span>
            </h1>
            
            <p className="text-lg text-[var(--text-dark)] opacity-80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Gem Crispy Confectioneries specializes in the production of premium Plantain Chips, Peanut Burger, and Kuli Kuli while empowering entrepreneurs through hands-on training and equipment supply.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a href="#products" className="bg-[var(--text-dark)] hover:bg-black text-white font-bold px-8 py-4 rounded-full transition-all shadow-xl hover:-translate-y-1">
                View Products
              </a>
              <a href="#training" className="border-2 border-[var(--text-dark)] text-[var(--text-dark)] hover:bg-[var(--text-dark)] hover:text-white font-bold px-8 py-4 rounded-full transition-all">
                Enrol for Training
              </a>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            {/* Using a rich placeholder image of plantain chips/snacks */}
            <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image 
                src="https://images.unsplash.com/photo-1658951863040-508467c9a1f4?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Premium Plantain Chips" 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -left-6 top-1/4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float-slow">
              <div className="bg-[var(--primary)] p-2 rounded-xl text-white"><Award size={20} /></div>
              <div>
                <p className="text-xs text-neutral-500 font-bold uppercase">Quality Standard</p>
                <p className="text-sm font-black text-[var(--text-dark)]">NAFDAC Approved</p>
              </div>
            </div>

            <div className="absolute -right-6 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float-fast">
              <div className="bg-[var(--green-main)] p-2 rounded-xl text-white"><Users size={20} /></div>
              <div>
                <p className="text-xs text-neutral-500 font-bold uppercase">Empowerment</p>
                <p className="text-sm font-black text-[var(--text-dark)]">100+ Trained</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-3xl overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1633536706502-8072f956614a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Snack production" fill className="object-cover" />
              </div>
              <div className="relative h-32 rounded-3xl overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1717386255886-6ae56e497f9a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Equipment" fill className="object-cover" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-32 rounded-3xl overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1658951863040-508467c9a1f4?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Plantain chips" fill className="object-cover" />
              </div>
              <div className="bg-[var(--secondary)] p-6 rounded-3xl border border-[var(--primary)] flex flex-col justify-center">
                <span className="text-3xl font-black text-[var(--accent)] mb-1">10+</span>
                <span className="text-xs font-bold text-[var(--text-dark)] uppercase">Years of Excellence in Food Processing</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <span className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">About Gem Crispy</span>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-dark)] leading-tight">More Than Just Snacks. We Build Businesses.</h2>
            <p className="text-neutral-600 text-lg leading-relaxed">
              At Gem Crispy Confectioneries, we are deeply committed to producing high-quality, delicious snacks like our signature Plantain Chips, Peanut Burger, and Kuli Kuli. 
            </p>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Beyond production, our passion lies in empowering the next generation of entrepreneurs. We offer comprehensive training programs in food processing and supply robust, industrial-grade processing equipment to help you launch and scale your own food production business.
            </p>
            <div className="pt-4 flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-[var(--primary)]" />
                <span className="font-bold">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-[var(--primary)]" />
                <span className="font-bold">Expert Training</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PRODUCTS */}
      <section id="products" className="py-16 bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">Our Products</span>
            <h2 className="text-3xl font-black text-[var(--text-dark)] mt-2">Premium Snacks Line</h2>
            <p className="text-neutral-500 mt-4 text-sm">Made with carefully selected natural ingredients, offering the perfect crunch and unforgettable taste.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {snacks.map((snack) => (
              <div key={snack.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-neutral-100 group transition-all">
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <Image src={snack.image} alt={snack.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-[var(--primary)] text-[var(--text-dark)] text-[10px] font-black px-2 py-1 rounded-full uppercase">
                    {snack.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-[var(--text-dark)] mb-2">{snack.name}</h3>
                  <p className="text-neutral-500 text-xs mb-4 line-clamp-3 leading-relaxed">{snack.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase mb-0.5">Packaging</p>
                      <p className="text-xs font-bold">Wholesale & Retail</p>
                    </div>
                    <button onClick={() => handleWhatsApp(`ordering ${snack.name}`)} className="bg-[var(--text-dark)] hover:bg-black text-white p-2.5 rounded-full transition-colors shadow-sm">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINING PROGRAMS */}
      <section id="training" className="py-24 bg-[var(--text-dark)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Image src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhaW5pbmclMjBidXNpbmVzc3xlbnwwfHwwfHx8MA%3D%3D" alt="Training bg" fill className="object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[var(--primary)] font-bold tracking-widest uppercase text-sm">Empowerment</span>
              <h2 className="text-4xl md:text-5xl font-black mt-2 mb-6">Start Your Own Food Processing Business</h2>
              <p className="text-neutral-300 text-lg mb-8">
                Learn the secrets of successful commercial snack production from industry experts. Our comprehensive training covers everything from raw material selection to packaging and marketing.
              </p>
              
              <div className="space-y-4 mb-10">
                {['Plantain Chips Production', 'Peanut Burger Production', 'Kuli Kuli Production', 'Business Startup Guidance', 'Packaging & Branding'].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/10">
                    <CheckCircle className="text-[var(--primary)]" size={20} />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
              
              <button onClick={() => handleWhatsApp('enrolling for your training programs')} className="bg-[var(--primary)] hover:bg-[#E6A11D] text-[var(--text-dark)] font-black px-8 py-4 rounded-full uppercase tracking-wider transition-all">
                Enrol for Training Today
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 text-center hover:-translate-y-2 transition-transform">
                <BookOpen className="text-[var(--primary)] mx-auto mb-4" size={40} />
                <h3 className="font-black text-xl mb-2">Practical Training</h3>
                <p className="text-neutral-300 text-sm">100% hands-on experience in our active production facility.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 text-center hover:-translate-y-2 transition-transform translate-y-8">
                <Award className="text-[var(--primary)] mx-auto mb-4" size={40} />
                <h3 className="font-black text-xl mb-2">Certification</h3>
                <p className="text-neutral-300 text-sm">Receive a recognized certificate upon completion of your program.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 text-center hover:-translate-y-2 transition-transform">
                <TrendingUp className="text-[var(--primary)] mx-auto mb-4" size={40} />
                <h3 className="font-black text-xl mb-2">Business Support</h3>
                <p className="text-neutral-300 text-sm">Post-training mentorship and access to processing equipment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPMENT SUPPLY */}
      <section id="equipment" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">Equipment Supply</span>
              <h2 className="text-4xl font-black text-[var(--text-dark)] mt-2">Industrial Processing Equipment</h2>
              <p className="text-neutral-500 mt-4 text-lg">We supply reliable, high-efficiency machinery to help you automate and scale your food production business.</p>
            </div>
            <button onClick={() => handleWhatsApp('requesting a quotation for equipment')} className="bg-[var(--text-dark)] text-white px-6 py-3 rounded-full font-bold whitespace-nowrap">
              Request Quotation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipment.map((eq) => (
              <div key={eq.id} className="border border-neutral-200 rounded-[2rem] p-4 hover:shadow-xl transition-shadow group flex flex-col">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                  <Image src={eq.images[0]} alt={eq.title} fill className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform" />
                  <div className="absolute top-3 left-3 bg-white text-[var(--text-dark)] text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase">
                    {eq.type}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg mb-2 leading-tight">{eq.title}</h3>
                  <div className="space-y-1 mb-4 text-sm text-neutral-500">
                    <p><span className="font-bold text-neutral-400">Capacity:</span> {eq.capacity}</p>
                    <p><span className="font-bold text-neutral-400">Power:</span> {eq.power}</p>
                  </div>
                </div>
                <button onClick={() => handleWhatsApp(`purchasing the ${eq.title}`)} className="w-full bg-[var(--secondary)] text-[var(--accent)] font-bold py-3 rounded-xl border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--text-dark)] transition-colors">
                  Inquire Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER PROCESS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">How to Buy</span>
            <h2 className="text-4xl font-black text-[var(--text-dark)] mt-2">Simple Order Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Browse Products', desc: 'Choose your favorite snacks or required equipment.' },
              { step: '2', title: 'Contact Us', desc: 'Click the order button to chat with us directly on WhatsApp.' },
              { step: '3', title: 'Confirm Details', desc: 'We confirm your order, quantities, and delivery location.' },
              { step: '4', title: 'Fast Delivery', desc: 'Receive your premium products right at your doorstep.' }
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 bg-[var(--primary)] text-[var(--text-dark)] text-2xl font-black rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg">{s.step}</div>
                <h3 className="text-xl font-bold text-[var(--text-dark)] mb-2">{s.title}</h3>
                <p className="text-neutral-500 text-sm">{s.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-neutral-200 -z-0"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">Inside Gem Crispy</span>
            <h2 className="text-4xl font-black text-[var(--text-dark)] mt-2">Our Gallery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative h-64 rounded-3xl overflow-hidden group shadow-lg">
              <Image src="https://images.unsplash.com/photo-1658951863040-508467c9a1f4?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Plantain chips" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-lg">Plantain Chips</div>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group shadow-lg">
              <Image src="https://images.unsplash.com/photo-1633536706502-8072f956614a?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Snack productions" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-lg text-center px-4">Production Facility</div>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group shadow-lg">
              <Image src="https://images.unsplash.com/photo-1717386255886-6ae56e497f9a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Equipment" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-lg text-center px-4">Industrial Equipment</div>
            </div>
            <div className="relative h-64 rounded-3xl overflow-hidden group shadow-lg">
              <Image src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhaW5pbmclMjBidXNpbmVzc3xlbnwwfHwwfHx8MA%3D%3D" alt="Training" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-lg text-center px-4">Business Training</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US & TESTIMONIALS */}
      <section className="py-24 bg-[var(--secondary)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-[var(--text-dark)]">Why Choose Gem Crispy?</h2>
            <p className="text-neutral-600 mt-4 text-lg">We bring expertise, quality, and dedication to everything we do.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              { icon: Shield, title: 'Quality Products', desc: 'Sourced from the finest natural ingredients and processed under strict hygienic conditions.' },
              { icon: Zap, title: 'Reliable Equipment', desc: 'Durable, high-efficiency machinery designed for rigorous commercial use.' },
              { icon: Users, title: 'Expert Support', desc: 'Ongoing mentorship, technical support, and business guidance for our trainees.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] text-center shadow-sm hover:shadow-xl transition-shadow">
                <feature.icon className="text-[var(--primary)] mx-auto mb-6" size={48} />
                <h3 className="font-black text-xl mb-3 text-[var(--text-dark)]">{feature.title}</h3>
                <p className="text-neutral-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">Testimonials</span>
            <h2 className="text-4xl font-black text-[var(--text-dark)] mt-2">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--text-dark)] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-xl border border-white/10">
              <Star className="text-[var(--primary)] mb-6" size={32} />
              <p className="text-lg font-medium leading-relaxed italic mb-8">
                "The training program at Gem Crispy changed my life. I learned how to produce quality Plantain Chips and they supplied the exact equipment I needed to start. Today, my brand is in over 50 supermarkets!"
              </p>
              <div>
                <p className="font-bold text-lg text-[var(--primary)]">Samuel O.</p>
                <p className="text-sm text-neutral-400">CEO, Samuel's Snacks (Alumni)</p>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 text-[var(--text-dark)] shadow-xl relative overflow-hidden border border-neutral-100">
              <Star className="text-[var(--primary)] mb-6" size={32} />
              <p className="text-lg font-medium leading-relaxed italic mb-8">
                "Gem Crispy's Peanut Burger is simply the best in the market. We've been buying wholesale from them for over a year and our customers keep coming back for more. Highly recommended!"
              </p>
              <div>
                <p className="font-bold text-lg text-[var(--text-dark)]">Aisha M.</p>
                <p className="text-sm text-neutral-500">Retail Store Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[var(--text-dark)] text-white pt-20 pb-10 border-t-4 border-[var(--primary)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <a href="#home" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center">
                <span className="text-[var(--text-dark)] font-extrabold text-xl">G</span>
              </div>
              <span className="text-white font-bold tracking-tight text-xl">Gem Crispy</span>
            </a>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Leading the industry in premium snack production, professional entrepreneurship training, and industrial equipment supply.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-[var(--primary)]">Quick Links</h4>
            <ul className="space-y-3 text-neutral-400 text-sm font-medium">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#training" className="hover:text-white transition-colors">Training Programs</a></li>
              <li><a href="#equipment" className="hover:text-white transition-colors">Equipment Supply</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-[var(--primary)]">Contact Us</h4>
            <ul className="space-y-4 text-neutral-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <span>123 Industrial Layout, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-[var(--primary)] flex-shrink-0" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-[var(--primary)] flex-shrink-0" />
                <span>info@gemcrispy.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-[var(--primary)]">Ready to Start?</h4>
            <p className="text-neutral-400 text-sm mb-4">Send us a message on WhatsApp for instant replies regarding orders or training.</p>
            <button onClick={() => handleWhatsApp('making a general inquiry')} className="bg-[#25D366] hover:bg-[#1EBE55] text-white font-bold py-3 px-6 rounded-xl flex items-center space-x-2 transition-colors w-full justify-center">
              <MessageCircle size={18} />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Gem Crispy Confectioneries. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
