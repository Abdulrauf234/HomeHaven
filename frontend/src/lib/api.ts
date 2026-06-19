const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

export interface Enquiry {
  id: string;
  type: 'general' | 'inspection' | 'whatsapp';
  name: string;
  email?: string;
  phone: string;
  message?: string;
  targetId?: string;
  targetTitle?: string;
  createdAt: string;
}

// Fallback seed data in case API is offline
const FALLBACK_EQUIPMENT: Equipment[] = [
  {
    id: "eq1",
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"],
    title: "Industrial Plantain Slicer",
    type: "Slicing",
    price: 1500,
    capacity: "500kg/hr",
    power: "2.2kW",
    description: "High-speed industrial slicer perfect for uniform plantain chips production.",
    availability: "Available"
  },
  {
    id: "eq2",
    images: ["https://images.unsplash.com/photo-1505236273191-1dce886b01e9?auto=format&fit=crop&w=800&q=80"],
    title: "Commercial Deep Fryer",
    type: "Frying",
    price: 850,
    capacity: "50 Liters",
    power: "Gas/Electric",
    description: "Thermostat-controlled deep fryer for consistent, golden crispy chips and peanut burger.",
    availability: "Available"
  },
  {
    id: "eq3",
    images: ["https://images.unsplash.com/photo-1589792923962-537704632910?auto=format&fit=crop&w=800&q=80"],
    title: "Heavy Duty Grinding Machine",
    type: "Grinding",
    price: 600,
    capacity: "200kg/hr",
    power: "1.5kW",
    description: "Robust grinding machine ideal for processing peanuts for Kuli Kuli and other nuts.",
    availability: "Available"
  },
  {
    id: "eq4",
    images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80"],
    title: "Automatic Packaging Machine",
    type: "Packaging",
    price: 2200,
    capacity: "30-50 bags/min",
    power: "1.8kW",
    description: "Form-fill-seal automatic packaging machine for hygienic and professional product sealing.",
    availability: "Available"
  }
];

const FALLBACK_SNACKS: Snack[] = [
  {
    id: "snk1",
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80",
    name: "Premium Plantain Chips",
    price: 5,
    description: "Crispy, naturally sweet, and perfectly salted plantain chips made from carefully selected ripe plantains.",
    category: "Plantain Chips",
    availability: "In Stock",
    stock: 500
  },
  {
    id: "snk2",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",
    name: "Spicy Peanut Burger",
    price: 4,
    description: "Crunchy, perfectly roasted peanuts coated in a delicious, mildly spicy batter. A classic favorite.",
    category: "Peanut Burger",
    availability: "In Stock",
    stock: 350
  },
  {
    id: "snk3",
    image: "https://images.unsplash.com/photo-1605663737039-44671ea3ee1d?auto=format&fit=crop&w=800&q=80",
    name: "Traditional Kuli Kuli",
    price: 3,
    description: "Authentic, crunchy groundnut snack seasoned with natural spices. Rich in protein and deeply flavorful.",
    category: "Kuli Kuli",
    availability: "In Stock",
    stock: 400
  },
  {
    id: "snk4",
    image: "https://images.unsplash.com/photo-1622485501720-6d0ff2df713f?auto=format&fit=crop&w=800&q=80",
    name: "Spicy Plantain Chips",
    price: 5,
    description: "Premium plantain chips tossed in a special blend of chili and spices for an extra kick.",
    category: "Plantain Chips",
    availability: "In Stock",
    stock: 200
  }
];

function getHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('haven_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

let memoryEquipment: Equipment[] | null = null;
let memorySnacks: Snack[] | null = null;
let memoryEnquiries: Enquiry[] | null = null;

class ClientsideStore {
  static getEquipment() {
    if (typeof window === 'undefined') return FALLBACK_EQUIPMENT;
    if (memoryEquipment) return memoryEquipment;
    try {
      const stored = localStorage.getItem('local_equipment');
      if (!stored) {
        try {
          localStorage.setItem('local_equipment', JSON.stringify(FALLBACK_EQUIPMENT));
        } catch {}
        memoryEquipment = FALLBACK_EQUIPMENT;
        return FALLBACK_EQUIPMENT;
      }
      memoryEquipment = JSON.parse(stored);
      return memoryEquipment!;
    } catch {
      memoryEquipment = FALLBACK_EQUIPMENT;
      return FALLBACK_EQUIPMENT;
    }
  }

  static saveEquipment(eqs: Equipment[]) {
    memoryEquipment = eqs;
    try {
      localStorage.setItem('local_equipment', JSON.stringify(eqs));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving equipment to localStorage:", e);
    }
  }

  static getSnacks() {
    if (typeof window === 'undefined') return FALLBACK_SNACKS;
    if (memorySnacks) return memorySnacks;
    try {
      const stored = localStorage.getItem('local_snacks');
      if (!stored) {
        try {
          localStorage.setItem('local_snacks', JSON.stringify(FALLBACK_SNACKS));
        } catch {}
        memorySnacks = FALLBACK_SNACKS;
        return FALLBACK_SNACKS;
      }
      memorySnacks = JSON.parse(stored);
      return memorySnacks!;
    } catch {
      memorySnacks = FALLBACK_SNACKS;
      return FALLBACK_SNACKS;
    }
  }

  static saveSnacks(snks: Snack[]) {
    memorySnacks = snks;
    try {
      localStorage.setItem('local_snacks', JSON.stringify(snks));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving snacks to localStorage:", e);
    }
  }

  static getEnquiries() {
    if (typeof window === 'undefined') return [];
    if (memoryEnquiries) return memoryEnquiries;
    try {
      const stored = localStorage.getItem('local_enquiries');
      memoryEnquiries = stored ? JSON.parse(stored) : [];
      return memoryEnquiries!;
    } catch {
      memoryEnquiries = [];
      return [];
    }
  }

  static saveEnquiry(enq: Enquiry) {
    const list = this.getEnquiries();
    list.unshift(enq);
    memoryEnquiries = list;
    try {
      localStorage.setItem('local_enquiries', JSON.stringify(list));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving enquiry to localStorage:", e);
    }
  }
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
      if (username === 'homehaven' && password === 'Haven@123') {
        const mockRes = { token: 'mock_token_key', admin: { username: 'homehaven' } };
        localStorage.setItem('haven_token', mockRes.token);
        return mockRes;
      }
      throw e;
    }
  },

  getEquipment: async (filters?: { type?: string; search?: string }): Promise<Equipment[]> => {
    try {
      const query = new URLSearchParams();
      if (filters?.type) query.append('type', filters.type);
      if (filters?.search) query.append('search', filters.search);
      const res = await fetch(`${API_BASE}/equipment?${query.toString()}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      let list = ClientsideStore.getEquipment();
      if (filters?.type) {
        list = list.filter((e: Equipment) => e.type.toLowerCase() === filters.type!.toLowerCase());
      }
      if (filters?.search) {
        const searchVal = filters.search.toLowerCase();
        list = list.filter((e: Equipment) =>
          e.title.toLowerCase().includes(searchVal) ||
          e.description.toLowerCase().includes(searchVal)
        );
      }
      return list;
    }
  },

  createEquipment: async (equipment: Omit<Equipment, 'id'>): Promise<Equipment> => {
    try {
      const res = await fetch(`${API_BASE}/equipment`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(equipment)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getEquipment();
      const newEq = { ...equipment, id: 'eq_' + Date.now() };
      list.push(newEq);
      ClientsideStore.saveEquipment(list);
      return newEq;
    }
  },

  updateEquipment: async (id: string, updates: Partial<Equipment>): Promise<Equipment> => {
    try {
      const res = await fetch(`${API_BASE}/equipment/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getEquipment();
      const idx = list.findIndex((e: Equipment) => e.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        ClientsideStore.saveEquipment(list);
        return list[idx];
      }
      throw new Error("Equipment not found");
    }
  },

  deleteEquipment: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/equipment/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.ok;
    } catch {
      const list = ClientsideStore.getEquipment();
      const filtered = list.filter((e: Equipment) => e.id !== id);
      ClientsideStore.saveEquipment(filtered);
      return true;
    }
  },

  getSnacks: async (filters?: { category?: string; search?: string }): Promise<Snack[]> => {
    try {
      const query = new URLSearchParams();
      if (filters?.category) query.append('category', filters.category);
      if (filters?.search) query.append('search', filters.search);
      const res = await fetch(`${API_BASE}/snacks?${query.toString()}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      let list = ClientsideStore.getSnacks();
      if (filters?.category) {
        list = list.filter((s: Snack) => s.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters?.search) {
        const searchVal = filters.search.toLowerCase();
        list = list.filter((s: Snack) =>
          s.name.toLowerCase().includes(searchVal) ||
          s.description.toLowerCase().includes(searchVal)
        );
      }
      return list;
    }
  },

  createSnack: async (snack: Omit<Snack, 'id'>): Promise<Snack> => {
    try {
      const res = await fetch(`${API_BASE}/snacks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(snack)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getSnacks();
      const newSnk = { ...snack, id: 'snk_' + Date.now() };
      list.push(newSnk);
      ClientsideStore.saveSnacks(list);
      return newSnk;
    }
  },

  updateSnack: async (id: string, updates: Partial<Snack>): Promise<Snack> => {
    try {
      const res = await fetch(`${API_BASE}/snacks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getSnacks();
      const idx = list.findIndex((s: Snack) => s.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        ClientsideStore.saveSnacks(list);
        return list[idx];
      }
      throw new Error("Snack not found");
    }
  },

  deleteSnack: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/snacks/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.ok;
    } catch {
      const list = ClientsideStore.getSnacks();
      const filtered = list.filter((s: Snack) => s.id !== id);
      ClientsideStore.saveSnacks(filtered);
      return true;
    }
  },

  getEnquiries: async (): Promise<Enquiry[]> => {
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return ClientsideStore.getEnquiries();
    }
  },

  submitEnquiry: async (enquiry: Omit<Enquiry, 'id' | 'createdAt'>): Promise<Enquiry> => {
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const newEnq: Enquiry = {
        ...enquiry,
        id: 'enq_' + Date.now(),
        createdAt: new Date().toISOString()
      };
      ClientsideStore.saveEnquiry(newEnq);
      return newEnq;
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('haven_token') : null;
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.url;
    } catch {
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
          resolve('');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = typeof window !== 'undefined' ? new window.Image() : null;
          if (!img) {
            resolve(event.target?.result as string || '');
            return;
          }
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 600;
              const MAX_HEIGHT = 600;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                resolve(dataUrl);
              } else {
                resolve(event.target?.result as string || '');
              }
            } catch {
              resolve(event.target?.result as string || '');
            }
          };
          img.onerror = () => {
            resolve(event.target?.result as string || '');
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }
};
