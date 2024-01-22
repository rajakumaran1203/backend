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
exports.EmailInboxService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const Imap = require("node-imap");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const email_count_model_1 = require("./email-count.model");
const user_details_1 = require("./user_details");
let EmailInboxService = class EmailInboxService {
    constructor(emailCountModel, emailCredentialsModel) {
        this.emailCountModel = emailCountModel;
        this.emailCredentialsModel = emailCredentialsModel;
        this.imap = new Imap({});
    }
    async create(email, password) {
        const createdEmailCredentials = new this.emailCredentialsModel({ user: email, password });
        return createdEmailCredentials.save();
    }
    async getEmailCredentials() {
        const credentials = await this.emailCredentialsModel.findOne().exec();
        return credentials ? { user: credentials.user, password: credentials.password } : null;
    }
    async fetchEmails() {
        const credentials = await this.getEmailCredentials();
        try {
            const credentials = await this.getEmailCredentials();
            if (!credentials) {
                throw new Error('Email credentials not found.');
            }
            this.imap = new Imap({
                user: credentials.user,
                password: credentials.password,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
            });
        }
        catch (error) {
            throw error;
        }
        return new Promise((resolve, reject) => {
            const emails = [];
            let failureCount = 0;
            this.imap.once('ready', () => {
                this.openInbox((err, box) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const totalMessages = box.messages.total;
                        const f = this.imap.seq.fetch('1:*', {
                            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                            struct: true,
                        });
                        f.on('message', (msg, seqno) => {
                            const prefix = '(#' + seqno + ') ';
                            const email = {};
                            msg.on('body', (stream, info) => {
                                let buffer = '';
                                stream.on('data', (chunk) => {
                                    buffer += chunk.toString('utf8');
                                });
                                stream.once('end', () => {
                                    const headers = Imap.parseHeader(buffer);
                                    const fromAddress = headers['from'] && headers['from'].length > 0 ? headers['from'][0] : '';
                                    email.sender = fromAddress;
                                    email.header = (0, util_1.inspect)(headers);
                                    const subjectArray = headers.subject || [];
                                    const subjectString = subjectArray.join(', ');
                                    const isFailure = subjectString.toLowerCase().includes('failure');
                                    if (isFailure) {
                                        failureCount++;
                                    }
                                });
                            });
                            msg.once('attributes', (attrs) => {
                                email.attributes = attrs;
                            });
                            msg.once('end', () => {
                                emails.push(email);
                            });
                        });
                        f.once('error', (fetchErr) => {
                            reject(fetchErr);
                        });
                        f.once('end', () => {
                            this.imap.end();
                            const emptyFlagsCount = emails.filter((email) => !email.attributes.flags || email.attributes.flags.length === 0).length;
                            let nonEmptyFlagsCount = 0;
                            emails.forEach((email) => {
                                if (email.attributes.flags && email.attributes.flags.length > 0) {
                                    email.attributes.flags.forEach((flag) => {
                                        if (typeof flag === 'string' && flag.trim() !== '') {
                                            nonEmptyFlagsCount++;
                                        }
                                    });
                                }
                            });
                            console.log('Empty Flags Count:', emptyFlagsCount);
                            console.log('Non-Empty Flags Count:', nonEmptyFlagsCount);
                            const emailAddress = credentials.user;
                            this.updateEmailStats(emailAddress, totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount);
                            resolve({ emails, totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount });
                        });
                    }
                });
            });
            this.imap.once('error', (err) => {
                reject(err);
            });
            this.imap.once('end', () => {
                console.log('Connection ended');
            });
            this.imap.connect();
        });
    }
    openInbox(cb) {
        this.imap.openBox('INBOX', true, cb);
    }
    async updateEmailStats(emailAddress, totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount) {
        let emailCount = await this.emailCountModel.findOne({ emailAddress }).exec();
        if (!emailCount) {
            emailCount = new this.emailCountModel({ emailAddress, totalMessages, failureCount, emptyFlagsCount, nonEmptyFlagsCount });
        }
        else {
            emailCount.emailSent = totalMessages;
            emailCount.warmupEmailSent = failureCount;
            emailCount.Seen = nonEmptyFlagsCount;
            emailCount.Unseen = emptyFlagsCount;
        }
        await emailCount.save();
    }
    async getAllEmailDetails() {
        return this.emailCountModel.find().exec();
    }
};
EmailInboxService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(email_count_model_1.EmailCount.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_details_1.EmailCredentials.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EmailInboxService);
exports.EmailInboxService = EmailInboxService;
//# sourceMappingURL=email.service.js.map