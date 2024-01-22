"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailInboxModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email.service");
const email_controller_1 = require("./email.controller");
const mongoose_1 = require("@nestjs/mongoose");
const email_count_model_1 = require("./email-count.model");
const user_details_1 = require("./user_details");
let EmailInboxModule = class EmailInboxModule {
};
EmailInboxModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'EmailCount', schema: email_count_model_1.EmailCountSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'EmailCredentials', schema: user_details_1.EmailCredentialsSchema }]),],
        controllers: [email_controller_1.EmailInboxController],
        providers: [email_service_1.EmailInboxService],
    })
], EmailInboxModule);
exports.EmailInboxModule = EmailInboxModule;
//# sourceMappingURL=email.module.js.map