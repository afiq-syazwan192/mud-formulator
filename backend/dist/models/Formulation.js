"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formulation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const formulationSchema = new mongoose_1.default.Schema({
    mudType: {
        type: String,
        required: true,
        trim: true,
    },
    mudWeight: {
        type: Number,
        required: true,
    },
    desiredOilPercentage: {
        type: Number,
        required: true,
    },
    products: [{
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.Formulation = mongoose_1.default.model('Formulation', formulationSchema);
