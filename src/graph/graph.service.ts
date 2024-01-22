import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User} from './graph.model';
import { EmailCount } from '../email_inbox/email-count.model';
@Injectable()
export class UserService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>,
  @InjectModel(EmailCount.name) private readonly emailCountModel: Model<EmailCount>) {}

  async getUserCreationData(): Promise<any[]> {
    const userCreationDates = await this.userModel.find({}, 'createdAt').exec();

    const userCountPerDate = userCreationDates.reduce((acc, user) => {
      const date = user.createdAt.toISOString().split('T')[0];

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    }, {});

    return Object.entries(userCountPerDate).map(([date, count]) => ({ date, count }));
  }

  async getTotalSeenAndUnseen(): Promise<{emailSent: number, totalSeen: number; totalUnseen: number; totalWarmupEmailSent: number }> {
    const result = await this.emailCountModel.aggregate([
      {
        $group: {
          _id: null,
          emailSent: {$sum: '$emailSent'},
          totalSeen: { $sum: '$Seen' },
          totalUnseen: { $sum: '$Unseen' },
          totalWarmupEmailSent: { $sum: '$warmupEmailSent' },
        },
      },
    ]).exec();

    return result.length > 0 ? result[0] : { emailSent:0, totalSeen: 0, totalUnseen: 0, totalWarmupEmailSent: 0 };
  }

}
