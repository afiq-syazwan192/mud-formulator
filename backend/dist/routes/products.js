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
const express_validator_1 = require("express-validator");
const Product_1 = require("../models/Product");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all products
router.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.Product.find();
        res.json(products);
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
// Add a new product
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('specificGravity').isNumeric().withMessage('Specific gravity must be a number'),
    (0, express_validator_1.body)('function').notEmpty().withMessage('Function is required'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { name, specificGravity, function: productFunction } = req.body;
        const product = new Product_1.Product({
            name,
            specificGravity,
            function: productFunction,
            createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
// Delete a product
router.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const product = yield Product_1.Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        if (product.createdBy.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        yield product.deleteOne();
        res.json({ message: 'Product removed' });
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
