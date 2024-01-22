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
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: "rajakumarandevloper@gmail.com",
                clientId: "828057784769-aplbedrfjfqqo8tnuoohdsdfl7te33ip.apps.googleusercontent.com",
                clientSecret: "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",
                refreshToken: "1//04megLYWIry7xCgYIARAAGAQSNwF-L9IrF6hwiOQqV8f7E3ccOvv8lhUp4XaRTQpwZo_AY_VIuzJgytz6_IoH-sNM5ckmUxTo1vc",
                accessToken: "ya29.a0AfB_byBxBaWLqydpG-sW7L3yD2cMkXTF4E61QxFVWlzQ1wHnwxDeh1FlLCcEsJgMozacJ9Mp-_fEYism4JIGoAtpyi1xJ5WAwBoSfLABplAVtl7SDvS6L6r3-UI20f0C3Qw71XN3lVvUR0AY-RJ5Bm34K2PYl-Fm3bBDaCgYKAawSARASFQHGX2Mi9zo0rK3btsfKGGYYKf8gDA0171",
                expires: 3599,
            },
        });
    }
    async sendEmail(to, subject, text) {
        for (const recipient of to) {
            const mailOptions = {
                from: "rajakumarandevloper@gmail.com",
                to: recipient,
                subject,
                text,
            };
            try {
                const info = await this.transporter.sendMail(mailOptions);
                console.log('Email sent:', info);
                const email = new this.emailModel({
                    from: "rajakumarandevloper@gmail.com",
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