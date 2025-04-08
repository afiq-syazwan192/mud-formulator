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
const mongoose_1 = __importDefault(require("mongoose"));
const Formulation_1 = require("../models/Formulation");
const Product_1 = require("../models/Product");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const dummyProducts = [
    {
        name: 'Barite',
        specificGravity: 4.2,
        function: 'Weighting Agent',
    },
    {
        name: 'Bentonite',
        specificGravity: 2.6,
        function: 'Viscosifier',
    },
    {
        name: 'Diesel Oil',
        specificGravity: 0.85,
        function: 'Base Oil',
    },
    {
        name: 'Emulsifier',
        specificGravity: 1.1,
        function: 'Emulsifier',
    },
];
const dummyFormulations = [
    {
        mudType: 'Oil Based Mud',
        mudWeight: 12.5,
        desiredOilPercentage: 65,
        products: [
            { product: '', quantity: 100 },
            { product: '', quantity: 25 },
            { product: '', quantity: 200 },
            { product: '', quantity: 5 },
        ],
    },
    {
        mudType: 'Water Based Mud',
        mudWeight: 10.5,
        desiredOilPercentage: 0,
        products: [
            { product: '', quantity: 50 },
            { product: '', quantity: 15 },
        ],
    },
];
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mud-formulator');
            console.log('Connected to MongoDB');
            // Clear existing data
            yield User_1.User.deleteMany({});
            yield Product_1.Product.deleteMany({});
            yield Formulation_1.Formulation.deleteMany({});
            console.log('Cleared existing data');
            // Create test user
            const hashedPassword = yield bcryptjs_1.default.hash('password123', 10);
            const testUser = yield User_1.User.create({
                email: 'test@example.com',
                password: hashedPassword,
                name: 'Test User'
            });
            console.log('Created test user');
            // Insert products
            const insertedProducts = yield Product_1.Product.insertMany(dummyProducts);
            console.log('Inserted products');
            // Update formulations with product IDs and user
            const formulationsWithProductIds = dummyFormulations.map((formulation) => (Object.assign(Object.assign({}, formulation), { createdBy: testUser._id, products: formulation.products.map((product, productIndex) => (Object.assign(Object.assign({}, product), { product: insertedProducts[productIndex % insertedProducts.length]._id }))) })));
            // Insert formulations
            yield Formulation_1.Formulation.insertMany(formulationsWithProductIds);
            console.log('Inserted formulations');
            console.log('Database seeded successfully');
            process.exit(0);
        }
        catch (error) {
            console.error('Error seeding database:', error);
            process.exit(1);
        }
    });
}
seedDatabase();
