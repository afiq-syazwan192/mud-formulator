"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const formulations_1 = __importDefault(require("./routes/formulations"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Detailed CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log('=================================');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('=================================');
    next();
});
// Test root route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});
// Mount routes - auth routes should be mounted at /api/auth
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/formulations', formulations_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});
// Handle 404
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mud-formulator';
// Connect to MongoDB and start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log('=================================');
            console.log(`Server is running on port ${PORT}`);
            console.log('Available routes:');
            console.log(`- GET    http://localhost:${PORT}/`);
            console.log(`- POST   http://localhost:${PORT}/api/auth/signup`);
            console.log(`- POST   http://localhost:${PORT}/api/auth/login`);
            console.log(`- GET    http://localhost:${PORT}/api/auth/me`);
            console.log('=================================');
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
