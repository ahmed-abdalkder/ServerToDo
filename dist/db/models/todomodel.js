"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    text: { type: String },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: null },
});
const todoSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    title: { type: String },
    image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
    },
    tasks: [TaskSchema],
}, {
    versionKey: false,
    timestamps: true,
});
const todoModel = (0, mongoose_1.model)("Todo", todoSchema);
exports.default = todoModel;
