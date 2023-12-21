"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    hash_password: { type: String, required: true },
    createdAt: { type: Date, required: true },
});
//# sourceMappingURL=user.modal.js.map