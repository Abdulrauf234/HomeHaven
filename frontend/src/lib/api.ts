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
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Classic Wedding Cake",
    type: "Cakes",
    location: "Main Bakery",
    price: 250,
    bedrooms: 3,
    bathrooms: 50,
    description: "Elegant three-tier wedding cake with smooth buttercream finish and delicate sugar flowers.",
    availability: "Available"
  },
  {
    id: "prop2",
    images: [
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Assorted French Pastries",
    type: "Pastries",
    location: "Main Bakery",
    price: 45,
    bedrooms: 12,
    bathrooms: 12,
    description: "A delightful box of 12 assorted French pastries including eclairs, fruit tarts, and mille-feuille.",
    availability: "Available"
  },
  {
    id: "prop3",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Artisan Sourdough Loaf",
    type: "Breads",
    location: "Main Bakery",
    price: 8,
    bedrooms: 1,
    bathrooms: 8,
    description: "Freshly baked artisan sourdough bread with a perfectly crisp crust and chewy interior.",
    availability: "Available"
  },
  {
    id: "prop4",
    images: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Glazed Gourmet Doughnuts",
    type: "Doughnuts",
    location: "Main Bakery",
    price: 24,
    bedrooms: 6,
    bathrooms: 6,
    description: "Box of 6 gourmet doughnuts with assorted glazes and toppings.",
    availability: "Available"
  },
  {
    id: "prop5",
    images: [
      "https://images.unsplash.com/photo-1563805042-7684c8e9e5cb?auto=format&fit=crop&w=800&q=80"
    ],
    title: "Signature Red Velvet Cake",
    type: "Cakes",
    location: "Main Bakery",
    price: 65,
    bedrooms: 1,
    bathrooms: 12,
    description: "Our signature moist red velvet cake with rich cream cheese frosting.",
    availability: "Available"
  }
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "prod1",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    name: "Chocolate Chip Cookies",
    price: 18,
    description: "Dozen freshly baked, chewy chocolate chip cookies made with premium Belgian chocolate.",
    category: "Cookies",
    availability: "In Stock",
    stock: 50
  },
  {
    id: "prod2",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80",
    name: "Luxury Chocolate Truffles",
    price: 35,
    description: "Box of 16 handcrafted chocolate truffles in assorted flavors.",
    category: "Chocolates",
    availability: "In Stock",
    stock: 30
  },
  {
    id: "prod3",
    image: "https://images.unsplash.com/photo-1577222409054-944a9557b779?auto=format&fit=crop&w=800&q=80",
    name: "Celebration Hamper",
    price: 120,
    description: "A beautiful gift hamper packed with our finest cookies, chocolates, and a bottle of sparkling cider.",
    category: "Hampers",
    availability: "In Stock",
    stock: 10
  },
  {
    id: "prod4",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80",
    name: "Mini Vanilla Cupcakes",
    price: 22,
    description: "Pack of 12 mini vanilla cupcakes with swirl buttercream frosting.",
    category: "Cupcakes",
    availability: "In Stock",
    stock: 40
  },
  {
    id: "prod5",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
    name: "Party Small Chops Box",
    price: 45,
    description: "Assorted savory finger foods perfect for small gatherings. Includes spring rolls, samosas, and puff-puff.",
    category: "Small Chops",
    availability: "In Stock",
    stock: 25
  },
  {
    id: "prod6",
    image: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?auto=format&fit=crop&w=800&q=80",
    name: "Macaron Gift Box",
    price: 28,
    description: "Colorful assortment of 12 French macarons in classic flavors.",
    category: "Gift Sets",
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

let memoryProperties: Property[] | null = null;
let memoryProducts: Product[] | null = null;
let memoryEnquiries: Enquiry[] | null = null;

// Memory-based clientside store fallback for testing/demoing when server is unavailable
class ClientsideStore {
  static getProperties() {
    if (typeof window === 'undefined') return FALLBACK_PROPERTIES;
    if (memoryProperties) return memoryProperties;
    try {
      const stored = localStorage.getItem('local_properties');
      if (!stored) {
        try {
          localStorage.setItem('local_properties', JSON.stringify(FALLBACK_PROPERTIES));
        } catch {}
        memoryProperties = FALLBACK_PROPERTIES;
        return FALLBACK_PROPERTIES;
      }
      memoryProperties = JSON.parse(stored);
      return memoryProperties!;
    } catch {
      memoryProperties = FALLBACK_PROPERTIES;
      return FALLBACK_PROPERTIES;
    }
  }

  static saveProperties(props: Property[]) {
    memoryProperties = props;
    try {
      localStorage.setItem('local_properties', JSON.stringify(props));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving properties to localStorage:", e);
      if (typeof window !== 'undefined') {
        alert("Warning: Local storage quota exceeded (likely due to large base64 image uploads). Changes are saved in-memory for this session but will be lost on page reload.");
      }
    }
  }

  static getProducts() {
    if (typeof window === 'undefined') return FALLBACK_PRODUCTS;
    if (memoryProducts) return memoryProducts;
    try {
      const stored = localStorage.getItem('local_products');
      if (!stored) {
        try {
          localStorage.setItem('local_products', JSON.stringify(FALLBACK_PRODUCTS));
        } catch {}
        memoryProducts = FALLBACK_PRODUCTS;
        return FALLBACK_PRODUCTS;
      }
      memoryProducts = JSON.parse(stored);
      return memoryProducts!;
    } catch {
      memoryProducts = FALLBACK_PRODUCTS;
      return FALLBACK_PRODUCTS;
    }
  }

  static saveProducts(prods: Product[]) {
    memoryProducts = prods;
    try {
      localStorage.setItem('local_products', JSON.stringify(prods));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving products to localStorage:", e);
      if (typeof window !== 'undefined') {
        alert("Warning: Local storage quota exceeded (likely due to large base64 image uploads). Changes are saved in-memory for this session but will be lost on page reload.");
      }
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
                // Compress to JPEG with 0.6 quality
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
