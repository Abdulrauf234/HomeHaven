"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbAdapter_1 = require("./models/dbAdapter");
const auth_1 = __importDefault(require("./routes/auth"));
const properties_1 = __importDefault(require("./routes/properties"));
const products_1 = __importDefault(require("./routes/products"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins for dev simplicity
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', database: dbAdapter_1.DB.isUsingMongo() ? 'mongodb' : 'mock' });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/properties', properties_1.default);
app.use('/api/products', products_1.default);
app.use('/api/enquiries', enquiries_1.default);
app.use('/api/upload', upload_1.default);
// Main Server Runner
async function startServer() {
    await (0, dbAdapter_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`[HomeHaven Backend] Server running on http://localhost:${PORT}`);
    });
}
startServer();
