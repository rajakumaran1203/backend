import { UserService } from './graph.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserCreationData(): Promise<any[]>;
}
