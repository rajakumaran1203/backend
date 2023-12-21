import { Model } from 'mongoose';
import { User } from './graph.model';
export declare class UserService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    getUserCreationData(): Promise<any[]>;
}
