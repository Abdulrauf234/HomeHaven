import mongoose from 'mongoose';
import { PropertySchema, ProductSchema, EnquirySchema, UserSchema } from './schemas';
import { MockStore, Property, Product, Enquiry } from '../data/mockStore';

let isMongoConnected = false;

// Mongoose Models
let PropertyModel: mongoose.Model<any>;
let ProductModel: mongoose.Model<any>;
let EnquiryModel: mongoose.Model<any>;
let UserModel: mongoose.Model<any>;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log("No MONGODB_URI environment variable found. Falling back to local file-based database store.");
    return false;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    isMongoConnected = true;
    console.log("Successfully connected to MongoDB.");
    
    // Initialize models
    PropertyModel = mongoose.models.Property || mongoose.model('Property', PropertySchema);
    ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    EnquiryModel = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
    UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
    
    return true;
  } catch (error) {
    console.error("Error connecting to MongoDB, falling back to local database store:", error);
    isMongoConnected = false;
    return false;
  }
}

export const DB = {
  isUsingMongo: () => isMongoConnected,

  // Properties API
  properties: {
    find: async (filter: any = {}): Promise<Property[]> => {
      if (isMongoConnected) {
        const query: any = {};
        if (filter.type) query.type = filter.type;
        if (filter.search) {
          query.$or = [
            { title: { $regex: filter.search, $options: 'i' } },
            { description: { $regex: filter.search, $options: 'i' } },
            { location: { $regex: filter.search, $options: 'i' } }
          ];
        }
        const list = await PropertyModel.find(query);
        return list.map(item => ({
          id: item._id.toString(),
          images: item.images,
          title: item.title,
          type: item.type,
          location: item.location,
          price: item.price,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          description: item.description,
          availability: item.availability
        }));
      } else {
        let list = MockStore.getProperties();
        if (filter.type) {
          list = list.filter(p => p.type.toLowerCase() === filter.type.toLowerCase());
        }
        if (filter.search) {
          const s = filter.search.toLowerCase();
          list = list.filter(p => 
            p.title.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.location.toLowerCase().includes(s)
          );
        }
        return list;
      }
    },

    findById: async (id: string): Promise<Property | null> => {
      if (isMongoConnected) {
        try {
          const item = await PropertyModel.findById(id);
          if (!item) return null;
          return {
            id: item._id.toString(),
            images: item.images,
            title: item.title,
            type: item.type,
            location: item.location,
            price: item.price,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            description: item.description,
            availability: item.availability
          };
        } catch {
          return null;
        }
      } else {
        return MockStore.getPropertyById(id) || null;
      }
    },

    create: async (data: Omit<Property, 'id'>): Promise<Property> => {
      if (isMongoConnected) {
        const item = await PropertyModel.create(data);
        return { ...data, id: item._id.toString() };
      } else {
        return MockStore.createProperty(data);
      }
    },

    findByIdAndUpdate: async (id: string, updates: Partial<Property>): Promise<Property | null> => {
      if (isMongoConnected) {
        try {
          const item = await PropertyModel.findByIdAndUpdate(id, updates, { new: true });
          if (!item) return null;
          return {
            id: item._id.toString(),
            images: item.images,
            title: item.title,
            type: item.type,
            location: item.location,
            price: item.price,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            description: item.description,
            availability: item.availability
          };
        } catch {
          return null;
        }
      } else {
        return MockStore.updateProperty(id, updates) || null;
      }
    },

    findByIdAndDelete: async (id: string): Promise<boolean> => {
      if (isMongoConnected) {
        try {
          const res = await PropertyModel.findByIdAndDelete(id);
          return !!res;
        } catch {
          return false;
        }
      } else {
        return MockStore.deleteProperty(id);
      }
    }
  },

  // Products API
  products: {
    find: async (filter: any = {}): Promise<Product[]> => {
      if (isMongoConnected) {
        const query: any = {};
        if (filter.category) query.category = filter.category;
        if (filter.search) {
          query.$or = [
            { name: { $regex: filter.search, $options: 'i' } },
            { description: { $regex: filter.search, $options: 'i' } }
          ];
        }
        const list = await ProductModel.find(query);
        return list.map(item => ({
          id: item._id.toString(),
          image: item.image,
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          availability: item.availability,
          stock: item.stock
        }));
      } else {
        let list = MockStore.getProducts();
        if (filter.category) {
          list = list.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
        }
        if (filter.search) {
          const s = filter.search.toLowerCase();
          list = list.filter(p => 
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s)
          );
        }
        return list;
      }
    },

    findById: async (id: string): Promise<Product | null> => {
      if (isMongoConnected) {
        try {
          const item = await ProductModel.findById(id);
          if (!item) return null;
          return {
            id: item._id.toString(),
            image: item.image,
            name: item.name,
            price: item.price,
            description: item.description,
            category: item.category,
            availability: item.availability,
            stock: item.stock
          };
        } catch {
          return null;
        }
      } else {
        return MockStore.getProductById(id) || null;
      }
    },

    create: async (data: Omit<Product, 'id'>): Promise<Product> => {
      if (isMongoConnected) {
        const item = await ProductModel.create(data);
        return { ...data, id: item._id.toString() };
      } else {
        return MockStore.createProduct(data);
      }
    },

    findByIdAndUpdate: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
      if (isMongoConnected) {
        try {
          const item = await ProductModel.findByIdAndUpdate(id, updates, { new: true });
          if (!item) return null;
          return {
            id: item._id.toString(),
            image: item.image,
            name: item.name,
            price: item.price,
            description: item.description,
            category: item.category,
            availability: item.availability,
            stock: item.stock
          };
        } catch {
          return null;
        }
      } else {
        return MockStore.updateProduct(id, updates) || null;
      }
    },

    findByIdAndDelete: async (id: string): Promise<boolean> => {
      if (isMongoConnected) {
        try {
          const res = await ProductModel.findByIdAndDelete(id);
          return !!res;
        } catch {
          return false;
        }
      } else {
        return MockStore.deleteProduct(id);
      }
    }
  },

  // Enquiries API
  enquiries: {
    find: async (): Promise<Enquiry[]> => {
      if (isMongoConnected) {
        const list = await EnquiryModel.find().sort({ createdAt: -1 });
        return list.map(item => ({
          id: item._id.toString(),
          type: item.type,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message,
          targetId: item.targetId,
          targetTitle: item.targetTitle,
          createdAt: item.createdAt.toISOString()
        }));
      } else {
        return MockStore.getEnquiries();
      }
    },

    create: async (data: Omit<Enquiry, 'id' | 'createdAt'>): Promise<Enquiry> => {
      if (isMongoConnected) {
        const item = await EnquiryModel.create(data);
        return {
          ...data,
          id: item._id.toString(),
          createdAt: item.createdAt.toISOString()
        };
      } else {
        return MockStore.createEnquiry(data);
      }
    }
  }
};
