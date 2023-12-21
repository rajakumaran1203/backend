import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signUp(firstName: string, lastName: string, email: string, password: string): Promise<any>;
    getUsers(): string;
    loginUser(email: string, password: string): Promise<any>;
}
