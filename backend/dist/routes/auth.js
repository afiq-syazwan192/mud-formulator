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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const jwt_1 = require("../config/jwt");
const router = (0, express_1.Router)();
// Debug route to test auth router
router.get('/', (_req, res) => {
    res.json({ message: 'Auth router is working' });
});
// Register/Signup user
router.post('/signup', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Enter a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Signup request received:', Object.assign(Object.assign({}, req.body), { password: '[HIDDEN]' }));
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password, name } = req.body;
        let user = yield User_1.User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        user = new User_1.User({ email, password, name });
        yield user.save();
        console.log('New user created:', email);
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        };
        const signOptions = {
            expiresIn: jwt_1.JWT_CONFIG.expiresIn
        };
        const token = jsonwebtoken_1.default.sign(payload, jwt_1.JWT_CONFIG.secret, signOptions);
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        next(error);
    }
}));
// Login user
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Enter a valid email'),
    (0, express_validator_1.body)('password').exists().withMessage('Password is required'),
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Login request received:', { email: req.body.email });
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', email);
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        const payload = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        };
        const signOptions = {
            expiresIn: jwt_1.JWT_CONFIG.expiresIn
        };
        const token = jsonwebtoken_1.default.sign(payload, jwt_1.JWT_CONFIG.secret, signOptions);
        console.log('Login successful:', email);
        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        next(error);
    }
}));
// Get current user
// router.get('/me', auth, async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     if (!req.user?._id) {
//       res.status(401).json({ error: 'Not authorized' });
//       return;
//     }
//     const user = await User.findById(req.user._id).select('-password');
//     if (!user) {
//       res.status(404).json({ error: 'User not found' });
//       return;
//     }
//     res.json(user);
//   } catch (error) {
//     console.error('Get user error:', error);
//     next(error);
//   }
// });
exports.default = router;
