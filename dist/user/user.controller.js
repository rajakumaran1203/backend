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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async signUp(firstName, lastName, email, password) {
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            createdAt: new Date(),
        };
        const newUser = await this.userService.createUser(userData);
        if (newUser.error) {
            switch (newUser.error) {
                case "Email address already exists":
                    return { error: "Email address already exists" };
                case "Invalid email":
                    return { error: "Invalid email format" };
                default:
                    return { error: "Signup failed. Please try again later." };
            }
        }
        else {
            return newUser;
        }
    }
    getUsers() {
        return 'users';
    }
    async loginUser(email, password) {
        try {
            const response = await this.userService.validateUser(email, password);
            console.log(response);
            if (!response.token) {
                throw new common_1.HttpException('Authentication failed. Invalid user or password.', common_1.HttpStatus.UNAUTHORIZED);
            }
            return response;
        }
        catch (error) {
            throw new common_1.HttpException('Oops , something went wrong', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)('firstName')),
    __param(1, (0, common_1.Body)('lastName')),
    __param(2, (0, common_1.Body)('email')),
    __param(3, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, common_1.Get)('signup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map