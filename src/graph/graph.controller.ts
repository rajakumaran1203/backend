// user.controller.ts

import { Controller, Get } from '@nestjs/common';
import { UserService } from './graph.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users-data')
  async getUserCreationData(): Promise<any[]> {
    return this.userService.getUserCreationData();
  }
  @Get('email-counts')
  async getEmailCounts(): Promise<{emailSent: number, totalSeen: number; totalUnseen: number; totalWarmupEmailSent: number }> {
    return this.userService.getTotalSeenAndUnseen();
  }
}
