"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }
    async createUser(userData) {
        try {
            const existingUser = await this.userModel.findOne({ email: userData.email });
            if (existingUser) {
                return { error: "Email address already exists" };
            }
            else if (!this.isValidEmail(userData.email)) {
                return { error: "Invalid email" };
            }
            else {
                const createdUser = new this.userModel({
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    email: userData.email,
                    hash_password: userData.password,
                    createdAt: userData.createdAt,
                });
                createdUser.hash_password = bcrypt.hashSync(userData.password, 10);
                await createdUser.save();
                const token = jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET);
                return { user: createdUser, token };
            }
        }
        catch (error) {
            console.log(error.message);
            return { error: error.message };
        }
    }
    async getUserByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async validateUser(email, password) {
        try {
            const user = await this.userModel.findOne({ email }).exec();
            console.log(bcrypt.hashSync(user.hash_password, 10));
            if (!user || !bcrypt.compareSync(password, user.hash_password)) {
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            return { token, user };
        }
        catch (error) {
            throw new Error('An error occurred during login');
        }
    }
    async getAllUsers() {
        const users = await this.userModel.find().exec();
        return users;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map