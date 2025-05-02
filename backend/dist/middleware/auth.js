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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
const User_1 = require("../models/User");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jwt_1.JWT_CONFIG.getToken(req);
        if (!token) {
            res.status(401).json({ error: 'No token, authorization denied' });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwt_1.JWT_CONFIG.secret);
            const user = yield User_1.User.findById(decoded.userId).select('-password');
            if (!user) {
                res.status(401).json({ error: 'User not found' });
                return;
            }
            req.user = user;
            next();
        }
        catch (err) {
            res.status(401).json({ error: 'Token is not valid' });
        }
    }
    catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.auth = auth;
