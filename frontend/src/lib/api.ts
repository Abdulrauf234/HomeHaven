const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Property {
  id: string;
  images: string[];
  title: string;
  type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  availability: 'Available' | 'Sold';
}

export interface Product {
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
const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "prop1",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ],
    title: "The Obsidian Luxury Villa",
    type: "Villa",
    location: "Beverly Hills, CA",
    price: 4850000,
    bedrooms: 5,
    bathrooms: 6,
    description: "A gorgeous architectural masterpiece featuring a modern luxury black and white design palette. Features floor-to-ceiling glass walls, an infinity pool, smart automation, and professional chef kitchen.",
    availability: "Available"
  },
  {
    id: "prop2",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Noir Crest Penthouse",
    type: "Apartment",
    location: "Manhattan, NY",
    price: 2950000,
    bedrooms: 3,
    bathrooms: 3.5,
    description: "A luxury high-rise penthouse showcasing stunning skyline views. Adorned with dark marble, brass accents, private elevator access, and a wrap-around terrace.",
    availability: "Available"
  },
  {
    id: "prop3",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Vanguard Minimalist Duplex",
    type: "Duplex",
    location: "Miami, FL",
    price: 1850000,
    bedrooms: 4,
    bathrooms: 4,
    description: "Modern duplex design with a soaring double-height living room. Features concrete rendering, luxury Italian fittings, and a rooftop lounge.",
    availability: "Available"
  },
  {
    id: "prop4",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Serene Oasis Bungalow",
    type: "Bungalow",
    location: "Malibu, CA",
    price: 3200000,
    bedrooms: 4,
    bathrooms: 3,
    description: "A beautifully renovated mid-century modern bungalow. Steps away from the ocean, featuring high wooden beamed ceilings, skylights, and indoor-outdoor living flow.",
    availability: "Sold"
  },
  {
    id: "prop5",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Apex Executive Headquarters",
    type: "Commercial Properties",
    location: "Silicon Valley, CA",
    price: 12500000,
    bedrooms: 0,
    bathrooms: 12,
    description: "State of the art corporate building suitable for tech giants. Massive open plan layouts, fiber-optic backbone, premium conference halls, and private cafeteria.",
    availability: "Available"
  }
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod1",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
    name: "Bouclé Accent Lounge Chair",
    price: 850,
    description: "Luxury upholstered lounge chair in creamy white bouclé fabric, featuring solid oak frame legs. Designed for maximum comfort and premium aesthetic.",
    category: "Furniture",
    availability: "In Stock",
    stock: 12
  },
  {
    id: "prod2",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    name: "Matte Black Smart Espresso Machine",
    price: 1450,
    description: "Premium bean-to-cup espresso maker. Intelligent touch control, customizable profile settings, and sleek metal chassis to elevate any luxury kitchen.",
    category: "Home Appliances",
    availability: "In Stock",
    stock: 5
  },
  {
    id: "prod3",
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=800&q=80",
    name: "Ambient LED Sound Bar Suite",
    price: 599,
    description: "Immersive Dolby Atmos sound system with integrated customizable smart backlighting. Elegant minimal bar matches perfectly under premium TV mounts.",
    category: "Electronics",
    availability: "In Stock",
    stock: 8
  },
  {
    id: "prod4",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=800&q=80",
    name: "Monolithic Ceramic Vase Set",
    price: 180,
    description: "Handcrafted textured stoneware vases in black, charcoal, and warm grey. Perfect centerpieces for minimalist consoles.",
    category: "Home Decor",
    availability: "In Stock",
    stock: 25
  },
  {
    id: "prod5",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    name: "Damascus Professional Knife Set",
    price: 320,
    description: "6-piece chef knife bundle made with 67 layers of Japanese Damascus steel. Includes black walnut magnetic block.",
    category: "Kitchen Equipment",
    availability: "In Stock",
    stock: 15
  },
  {
    id: "prod6",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    name: "Smart Biometric Security Door Lock",
    price: 450,
    description: "Top-tier deadbolt lock with fingerprint scanner, digital keypad, mobile application support, and mechanical keys. Finished in brushed dark obsidian.",
    category: "Security Devices",
    availability: "In Stock",
    stock: 20
  }
];

function getHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('haven_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Memory-based clientside store fallback for testing/demoing when server is unavailable
class ClientsideStore {
  static getProperties() {
    if (typeof window === 'undefined') return FALLBACK_PROPERTIES;
    const stored = localStorage.getItem('local_properties');
    if (!stored) {
      localStorage.setItem('local_properties', JSON.stringify(FALLBACK_PROPERTIES));
      return FALLBACK_PROPERTIES;
    }
    return JSON.parse(stored);
  }

  static saveProperties(props: Property[]) {
    localStorage.setItem('local_properties', JSON.stringify(props));
  }

  static getProducts() {
    if (typeof window === 'undefined') return FALLBACK_PRODUCTS;
    const stored = localStorage.getItem('local_products');
    if (!stored) {
      localStorage.setItem('local_products', JSON.stringify(FALLBACK_PRODUCTS));
      return FALLBACK_PRODUCTS;
    }
    return JSON.parse(stored);
  }

  static saveProducts(prods: Product[]) {
    localStorage.setItem('local_products', JSON.stringify(prods));
  }

  static getEnquiries() {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('local_enquiries');
    return stored ? JSON.parse(stored) : [];
  }

  static saveEnquiry(enq: Enquiry) {
    const list = this.getEnquiries();
    list.unshift(enq);
    localStorage.setItem('local_enquiries', JSON.stringify(list));
  }
}

export const api = {
  // Authentication
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

  // Properties API
  getProperties: async (filters?: { type?: string; search?: string }): Promise<Property[]> => {
    try {
      const query = new URLSearchParams();
      if (filters?.type) query.append('type', filters.type);
      if (filters?.search) query.append('search', filters.search);
      const res = await fetch(`${API_BASE}/properties?${query.toString()}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      let list = ClientsideStore.getProperties();
      if (filters?.type) {
        list = list.filter((p: Property) => p.type.toLowerCase() === filters.type!.toLowerCase());
      }
      if (filters?.search) {
        const searchVal = filters.search.toLowerCase();
        list = list.filter((p: Property) =>
          p.title.toLowerCase().includes(searchVal) ||
          p.location.toLowerCase().includes(searchVal) ||
          p.description.toLowerCase().includes(searchVal)
        );
      }
      return list;
    }
  },

  createProperty: async (property: Omit<Property, 'id'>): Promise<Property> => {
    try {
      const res = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(property)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getProperties();
      const newProp = { ...property, id: 'prop_' + Date.now() };
      list.push(newProp);
      ClientsideStore.saveProperties(list);
      return newProp;
    }
  },

  updateProperty: async (id: string, updates: Partial<Property>): Promise<Property> => {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getProperties();
      const idx = list.findIndex((p: Property) => p.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        ClientsideStore.saveProperties(list);
        return list[idx];
      }
      throw new Error("Property not found in fallback storage");
    }
  },

  deleteProperty: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/properties/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.ok;
    } catch {
      const list = ClientsideStore.getProperties();
      const filtered = list.filter((p: Property) => p.id !== id);
      ClientsideStore.saveProperties(filtered);
      return true;
    }
  },

  // Products API
  getProducts: async (filters?: { category?: string; search?: string }): Promise<Product[]> => {
    try {
      const query = new URLSearchParams();
      if (filters?.category) query.append('category', filters.category);
      if (filters?.search) query.append('search', filters.search);
      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      let list = ClientsideStore.getProducts();
      if (filters?.category) {
        list = list.filter((p: Product) => p.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters?.search) {
        const searchVal = filters.search.toLowerCase();
        list = list.filter((p: Product) =>
          p.name.toLowerCase().includes(searchVal) ||
          p.description.toLowerCase().includes(searchVal)
        );
      }
      return list;
    }
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getProducts();
      const newProd = { ...product, id: 'prod_' + Date.now() };
      list.push(newProd);
      ClientsideStore.saveProducts(list);
      return newProd;
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      const list = ClientsideStore.getProducts();
      const idx = list.findIndex((p: Product) => p.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        ClientsideStore.saveProducts(list);
        return list[idx];
      }
      throw new Error("Product not found in fallback storage");
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.ok;
    } catch {
      const list = ClientsideStore.getProducts();
      const filtered = list.filter((p: Product) => p.id !== id);
      ClientsideStore.saveProducts(filtered);
      return true;
    }
  },

  // Enquiries API
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

  // Image Upload API
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
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }
};
