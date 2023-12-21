"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const graph_controller_1 = require("./graph.controller");
const graph_service_1 = require("./graph.service");
const graph_model_1 = require("./graph.model");
let GraphModule = class GraphModule {
};
GraphModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: graph_model_1.UserSchema }])],
        controllers: [graph_controller_1.UserController],
        providers: [graph_service_1.UserService],
    })
], GraphModule);
exports.GraphModule = GraphModule;
//# sourceMappingURL=graph.module.js.map