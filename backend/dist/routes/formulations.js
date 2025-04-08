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
const Formulation_1 = require("../models/Formulation");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all formulations for current user
router.get('/', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const formulations = yield Formulation_1.Formulation.find({ createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
            .populate('products.product')
            .sort({ createdAt: -1 });
        res.json(formulations);
    }
    catch (error) {
        console.error('Get formulations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
// Add a new formulation
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('mudType').notEmpty().withMessage('Mud type is required'),
    (0, express_validator_1.body)('mudWeight').isNumeric().withMessage('Mud weight must be a number'),
    (0, express_validator_1.body)('desiredOilPercentage').isNumeric().withMessage('Desired oil percentage must be a number'),
    (0, express_validator_1.body)('products').isArray().withMessage('Products must be an array'),
    (0, express_validator_1.body)('products.*.product').notEmpty().withMessage('Product ID is required'),
    (0, express_validator_1.body)('products.*.quantity').isNumeric().withMessage('Product quantity must be a number'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { mudType, mudWeight, desiredOilPercentage, products } = req.body;
        const formulation = new Formulation_1.Formulation({
            mudType,
            mudWeight,
            desiredOilPercentage,
            products,
            createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        yield formulation.save();
        const populatedFormulation = yield Formulation_1.Formulation.findById(formulation._id)
            .populate('products.product');
        res.status(201).json(populatedFormulation);
    }
    catch (error) {
        console.error('Add formulation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
// Delete a formulation
router.delete('/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const formulation = yield Formulation_1.Formulation.findById(req.params.id).populate('createdBy');
        if (!formulation) {
            res.status(404).json({ error: 'Formulation not found' });
            return;
        }
        const populatedFormulation = formulation.toObject();
        const createdBy = populatedFormulation.createdBy;
        if (createdBy._id.toString() !== ((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString())) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }
        yield formulation.deleteOne();
        res.json({ message: 'Formulation removed' });
    }
    catch (error) {
        console.error('Delete formulation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
