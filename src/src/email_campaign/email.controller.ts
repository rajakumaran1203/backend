import { Controller , Post ,Get, Body} from "@nestjs/common";
import { EmailService, } from "./email.service";

@Controller('email')
export class EmailController {
    constructor(private readonly emailService : EmailService) {}

    @Get()
    async getAllTemplates() {
      const emails = await this.emailService.findAll();
      return emails;
    }
    
    @Post('send-email')
    async sendEmail(@Body() formData:any ) {
        const { subject, text, senderIds} = formData 

        try{
            await this.emailService.sendEmail( subject, text, senderIds);
            return 'successfully sent !'
        } catch (error) {
            return {success: false ,message : 'failed to send email'}
        }
    }


@Post('schedule-emails')
async createCronSchedule(@Body() data: {
  startTime: string;
  endTime: string;
  rampUpCount: number;
  senderIds: { selectedSenders: string[] };
}): Promise<any> {
  try {
    const savedCronModel = await this.emailService.createCronSchedule(data);
    return { success: true, data: savedCronModel };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

}

@Controller('emaillists')
export class EmailListController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async getEmails(): Promise<{ value: string; label: string }[]> {
    return this.emailService.getEmails();
  }

}


