"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const todoListSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        unique: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Completed"],
        default: "Pending",
    },
    create_at: {
        type: String,
        required: true,
    },
    updated_at: {
        type: String,
        required: true,
    },
    end_at: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
});
todoListSchema.index({ title: "text" });
exports.default = mongoose_1.default.model("todoListModel", todoListSchema);
