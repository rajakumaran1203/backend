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
exports.EmailInboxController = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
let EmailInboxController = class EmailInboxController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async fetchEmails() {
        return this.emailService.fetchEmails();
    }
    async getAllEmailDetails() {
        try {
            return await this.emailService.getAllEmailDetails();
        }
        catch (error) {
            throw error;
        }
    }
    async createEmailCredentials(email, password) {
        try {
            const createdEmailCredentials = await this.emailService.create(email, password);
            return { message: 'Email credentials created successfully', data: createdEmailCredentials };
        }
        catch (error) {
            return { error: error.message };
        }
    }
};
__decorate([
    (0, common_1.Get)('fetch-emails'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailInboxController.prototype, "fetchEmails", null);
__decorate([
    (0, common_1.Get)('details'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailInboxController.prototype, "getAllEmailDetails", null);
__decorate([
    (0, common_1.Post)("add-user"),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmailInboxController.prototype, "createEmailCredentials", null);
EmailInboxController = __decorate([
    (0, common_1.Controller)('email'),
    __metadata("design:paramtypes", [email_service_1.EmailInboxService])
], EmailInboxController);
exports.EmailInboxController = EmailInboxController;
//# sourceMappingURL=email.controller.js.map