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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("./user.model");
let EmailService = class EmailService {
    constructor(emailModel, userModel) {
        this.emailModel = emailModel;
        this.userModel = userModel;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '@gmail.com',
                pass: '',
            },
        });
        this.transporter.on('sentMail', async (info) => {
            console.log('Email sent:', info.response);
            if (info.response && info.response.includes('550 5.1.1')) {
                console.error(`Email to ${info.envelope.to} does not exist. Deleting user account.`);
                await this.userModel.deleteOne({ email: info.envelope.to }).exec();
            }
            await this.emailModel.deleteMany({ to: [info.envelope.to], sentAt: new Date() }).exec();
        });
    }
    async sendEmail(to, subject, text) {
        for (const recipient of to) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: recipient,
                subject,
                text,
            };
            try {
                const info = await this.transporter.sendMail(mailOptions);
                console.log(`Email sent to ${recipient}:`, info.response);
                const email = new this.emailModel({
                    from: process.env.EMAIL_USER,
                    to: [recipient],
                    subject,
                    text,
                    sentAt: new Date(),
                });
                await email.save();
            }
            catch (error) {
                console.error(`Error sending email to ${recipient}:`, error);
            }
        }
    }
    async findAll() {
        return this.emailModel.find().exec();
    }
    async getEmails() {
        const users = await this.userModel.find({}, 'email').exec();
        const emails = users.map(user => user.email);
        return emails.map(email => ({ value: email, label: email }));
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Email')),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map