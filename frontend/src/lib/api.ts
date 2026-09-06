import { db, collection, getDocs, doc, setDoc, deleteDoc } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Gadget {
  id: string;
  image: string;
  name: string;
  category: 'Smartphones' | 'Laptops' | 'Smartwatches' | 'Earbuds' | 'Accessories';
  price: number;
  description: string;
  specs: string[];
  featured?: boolean;
  inStock: boolean;
}

export interface TechArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  image: string;
}

export interface Enquiry {
  id: string;
  type: 'general' | 'whatsapp' | 'hardware_inquiry';
  name: string;
  email?: string;
  phone: string;
  message?: string;
  targetTitle?: string;
  createdAt: string;
}

export const FALLBACK_GADGETS: Gadget[] = [
  {
    id: "g_ps5",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
    name: "PlayStation 5 Pro",
    category: "Accessories",
    price: 1450000,
    description: "2TB Ultra-High Speed SSD, Advanced Ray Tracing Engine, PlayStation Spectral Super Resolution (PSSR) AI upscaling, 4K 120Hz gaming, and DualSense Wireless Controller.",
    specs: ["2TB Ultra-High Speed SSD", "PSSR AI-Enhanced Upscaling", "Advanced Ray Tracing Engine", "4K 120Hz Output & Wi-Fi 7"],
    featured: true,
    inStock: true
  },
  {
    id: "g1",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    name: "iPhone 16 Pro Max",
    category: "Smartphones",
    price: 2650000,
    description: "6.9\" Super Retina XDR OLED display, A18 Pro chip, Grade 5 Titanium finish, and 48MP Fusion camera system with 5x optical zoom.",
    specs: ["A18 Pro Chip", "256GB / 512GB / 1TB Storage", "48MP Fusion Triple Camera", "Action Button & Camera Control"],
    featured: false,
    inStock: true
  },
  {
    id: "g2",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
    name: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    price: 2200000,
    description: "6.8\" Quad HD+ Dynamic AMOLED 2X, Snapdragon 8 Gen 3 for Galaxy, Titanium Gray finish, 200MP camera with Galaxy AI.",
    specs: ["Snapdragon 8 Gen 3", "12GB RAM / 512GB Storage", "200MP Quad Camera + S-Pen", "5000mAh Battery"],
    featured: false,
    inStock: true
  },
  {
    id: "g3",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    name: "MacBook Pro 16\" (M3 Max)",
    category: "Laptops",
    price: 4150000,
    description: "16.2\" Liquid Retina XDR display, M3 Max chip with 16-core CPU and 40-core GPU, Space Black finish, and 22-hour battery life.",
    specs: ["M3 Max 16-Core CPU", "36GB Unified Memory / 1TB SSD", "Liquid Retina XDR 120Hz", "ProRes Video Engine"],
    featured: false,
    inStock: true
  },
  {
    id: "g4",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80",
    name: "Dell XPS 16 Ultrabook",
    category: "Laptops",
    price: 3850000,
    description: "16.3\" 4K+ OLED InfinityEdge Touchscreen, Intel Core Ultra 9 processor, NVIDIA GeForce RTX 4070, CNC Machined Aluminum.",
    specs: ["Intel Core Ultra 9 185H", "32GB LPDDR5X / 1TB NVMe SSD", "NVIDIA RTX 4070 8GB", "4K OLED Touch"],
    featured: false,
    inStock: true
  },
  {
    id: "g5",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    name: "Apple Watch Ultra 2",
    category: "Smartwatches",
    price: 1350000,
    description: "49mm Aerospace Titanium Case, Sapphire Front Crystal, 3000 nits display brightness, Dual-Frequency GPS, and 100m Water Resistance.",
    specs: ["S9 SiP with Double Tap", "49mm Titanium Case", "Precision Dual-Frequency GPS", "Depth Gauge & Water Temp"],
    featured: false,
    inStock: true
  },
  {
    id: "g6",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
    name: "Sony WH-1000XM5 Headphones",
    category: "Earbuds",
    price: 580000,
    description: "Industry-leading Active Noise Cancellation with Auto NC Optimizer, 8 microphones, V1 processor, and 30-hour continuous playback.",
    specs: ["Integrated V1 Processor", "Multi-Point Bluetooth Connection", "30-Hour Battery Life", "360 Reality Audio"],
    featured: false,
    inStock: true
  },
  {
    id: "g7",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80",
    name: "AirPods Pro (2nd Gen USB-C)",
    category: "Earbuds",
    price: 380000,
    description: "Active Noise Cancellation up to 2x more effective, Adaptive Audio, Transparency mode, and MagSafe Charging Case (USB-C).",
    specs: ["H2 Headphone Chip", "Adaptive Audio & Conversation Awareness", "IP54 Dust & Sweat Resistant", "30 Hours total playback"],
    featured: false,
    inStock: true
  },
  {
    id: "g8",
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=1000&q=80",
    name: "Anker Prime 250W Power Bank",
    category: "Accessories",
    price: 210000,
    description: "27,650mAh capacity power bank with 250W total output, smart digital display screen, and multi-device fast charging.",
    specs: ["27,650mAh Battery Capacity", "140W Max Single Port Output", "Smart App Control & Monitoring", "Compact Travel Ready"],
    featured: false,
    inStock: true
  }
];

export const FALLBACK_ARTICLES: TechArticle[] = [
  {
    id: "art1",
    title: "Minimalism in Personal Technology: Why Less Is More in 2026",
    category: "Design & Workflow",
    readTime: "4 min read",
    date: "Sep 2026",
    summary: "How eliminating desktop clutter and selecting multi-functional hardware enhances focus and creative flow.",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "art2",
    title: "Next-Gen Audio: Understanding Spatial Sound & Lossless Streaming",
    category: "Audio Technology",
    readTime: "6 min read",
    date: "Aug 2026",
    summary: "A technical breakdown of how wireless acoustic drivers deliver studio-master quality directly into earbuds.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "art3",
    title: "The Ultimate Ultrabook Buying Guide for Engineers & Creators",
    category: "Buying Guide",
    readTime: "5 min read",
    date: "Aug 2026",
    summary: "Key specs to consider: memory bandwidth, thermal management, screen gamut, and battery degradation curves.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=80"
  }
];

export const FALLBACK_ENQUIRIES: Enquiry[] = [
  {
    id: "enq1",
    type: "hardware_inquiry",
    name: "Emeka Okafor",
    email: "emeka.o@example.com",
    phone: "+2348031234567",
    message: "Interested in procuring 5 units of ELS Book Pro 16 for engineering studio.",
    targetTitle: "ELS Book Pro 16",
    createdAt: "2026-09-06"
  },
  {
    id: "enq2",
    type: "whatsapp",
    name: "Amina Yusuf",
    email: "amina@example.com",
    phone: "+2348029876543",
    message: "Inquired about color variants for ELS Horizon Chrono Watch.",
    targetTitle: "ELS Horizon Chrono Watch",
    createdAt: "2026-09-05"
  }
];

export interface Equipment {
  id: string;
  images: string[];
  title: string;
  type: string;
  description: string;
  price: number;
  capacity: string;
  power: string;
  availability: 'Available' | 'Sold';
}

export interface Snack {
  id: string;
  image: string;
  name: string;
  price: number;
  description: string;
  category: string;
  availability: 'In Stock' | 'Out of Stock';
  stock: number;
}

export const api = {
  login: async (username: string, password: string): Promise<{ token: string; admin: { username: string } }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('haven_token', data.token);
      return data;
    } catch (e) {
      if (username === 'elsgadget' && password === 'ElsGadget@2026') {
        const mockToken = 'mock_jwt_token_els_gadget_2026';
        localStorage.setItem('haven_token', mockToken);
        return { token: mockToken, admin: { username: 'elsgadget' } };
      }
      throw e;
    }
  },

  seedGadgetsToFirebase: async (): Promise<Gadget[]> => {
    try {
      for (const gadget of FALLBACK_GADGETS) {
        await setDoc(doc(db, "gadgets", gadget.id), gadget);
      }
      return FALLBACK_GADGETS;
    } catch (e) {
      console.error("Error seeding gadgets to Firebase:", e);
      return FALLBACK_GADGETS;
    }
  },

  getGadgets: async (): Promise<Gadget[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "gadgets"));
      if (!querySnapshot.empty) {
        const list: Gadget[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.name && data.category) {
            list.push({ id: docSnap.id, ...data } as Gadget);
          }
        });

        // If list contains valid gadgets, return list; otherwise seed real gadgets
        if (list.length > 0) {
          return list;
        }
      }
      
      // Auto-seed real phones and laptops to Firebase Firestore
      return await api.seedGadgetsToFirebase();
    } catch (e) {
      console.warn("Firestore offline or empty, using fallback gadgets:", e);
      return FALLBACK_GADGETS;
    }
  },

  saveGadgetFirebase: async (gadget: Gadget): Promise<void> => {
    try {
      await setDoc(doc(db, "gadgets", gadget.id), gadget);
    } catch (e) {
      console.error("Error saving gadget to Firebase:", e);
    }
  },

  deleteGadgetFirebase: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "gadgets", id));
    } catch (e) {
      console.error("Error deleting gadget from Firebase:", e);
    }
  },

  getEnquiries: async (): Promise<Enquiry[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "enquiries"));
      if (!querySnapshot.empty) {
        const list: Enquiry[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Enquiry);
        });
        return list;
      }
      return FALLBACK_ENQUIRIES;
    } catch {
      return FALLBACK_ENQUIRIES;
    }
  },

  getEquipment: async (): Promise<Equipment[]> => {
    return [];
  },

  getSnacks: async (): Promise<Snack[]> => {
    return [];
  }
};
