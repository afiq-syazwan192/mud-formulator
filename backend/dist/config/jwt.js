"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_CONFIG = {
    secret: (process.env.JWT_SECRET || 'mud-formulator-secret-key-2024'),
    expiresIn: '7d',
    getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    }
};
