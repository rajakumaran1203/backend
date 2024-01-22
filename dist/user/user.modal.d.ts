import * as mongoose from 'mongoose';
export declare const UserSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    first_name: string;
    last_name: string;
    createdAt: Date;
    hash_password: string;
}>;
export interface User {
    first_name: string;
    last_name: string;
    email: string;
    hash_password: string;
    createdAt: Date;
}
