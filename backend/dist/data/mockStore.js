"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_FILE = path_1.default.join(__dirname, 'db.json');
const DEFAULT_PROPERTIES = [
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
const DEFAULT_PRODUCTS = [
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
class MockStore {
    static load() {
        try {
            if (fs_1.default.existsSync(DB_FILE)) {
                const fileContent = fs_1.default.readFileSync(DB_FILE, 'utf-8');
                return JSON.parse(fileContent);
            }
        }
        catch (e) {
            console.error("Failed to read mock DB file, recreating", e);
        }
        const initial = {
            properties: DEFAULT_PROPERTIES,
            products: DEFAULT_PRODUCTS,
            enquiries: []
        };
        this.save(initial);
        return initial;
    }
    static save(data) {
        try {
            fs_1.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (e) {
            console.error("Failed to save mock DB file", e);
        }
    }
    // Properties CRUD
    static getProperties() {
        return this.load().properties;
    }
    static getPropertyById(id) {
        return this.load().properties.find(p => p.id === id);
    }
    static createProperty(property) {
        const db = this.load();
        const newProperty = { ...property, id: 'prop_' + Date.now() };
        db.properties.push(newProperty);
        this.save(db);
        return newProperty;
    }
    static updateProperty(id, updates) {
        const db = this.load();
        const idx = db.properties.findIndex(p => p.id === id);
        if (idx === -1)
            return undefined;
        db.properties[idx] = { ...db.properties[idx], ...updates };
        this.save(db);
        return db.properties[idx];
    }
    static deleteProperty(id) {
        const db = this.load();
        const filtered = db.properties.filter(p => p.id !== id);
        if (filtered.length === db.properties.length)
            return false;
        db.properties = filtered;
        this.save(db);
        return true;
    }
    // Products CRUD
    static getProducts() {
        return this.load().products;
    }
    static getProductById(id) {
        return this.load().products.find(p => p.id === id);
    }
    static createProduct(product) {
        const db = this.load();
        const newProduct = { ...product, id: 'prod_' + Date.now() };
        db.products.push(newProduct);
        this.save(db);
        return newProduct;
    }
    static updateProduct(id, updates) {
        const db = this.load();
        const idx = db.products.findIndex(p => p.id === id);
        if (idx === -1)
            return undefined;
        db.products[idx] = { ...db.products[idx], ...updates };
        this.save(db);
        return db.products[idx];
    }
    static deleteProduct(id) {
        const db = this.load();
        const filtered = db.products.filter(p => p.id !== id);
        if (filtered.length === db.products.length)
            return false;
        db.products = filtered;
        this.save(db);
        return true;
    }
    // Enquiries CRUD
    static getEnquiries() {
        return this.load().enquiries;
    }
    static createEnquiry(enquiry) {
        const db = this.load();
        const newEnquiry = {
            ...enquiry,
            id: 'enq_' + Date.now(),
            createdAt: new Date().toISOString()
        };
        db.enquiries.push(newEnquiry);
        this.save(db);
        return newEnquiry;
    }
}
exports.MockStore = MockStore;
