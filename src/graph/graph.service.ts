import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User} from './graph.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async getUserCreationData(): Promise<any[]> {
    const userCreationDates = await this.userModel.find({}, 'createdAt').exec();

    const userCountPerDate = userCreationDates.reduce((acc, user) => {
      const date = user.createdAt.toISOString().split('T')[0];

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    }, {});

    return Object.entries(userCountPerDate).map(([date, count]) => ({ date, count }));
  }
}
