import { Controller , Post ,Get, Body} from "@nestjs/common";
import { EmailService } from "./email.service";




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
        const {to, subject, body} = formData 

        try{
            await this.emailService.sendEmail(to, subject, body);
            return 'successfully sent !'
        } catch (error) {
            return {success: false ,message : 'failed to send email'}
        }
    }
}

// @Controller('emaillist')
// export class EmailListController {
//     constructor(private readonly emailService : EmailService) {}
//     private emails =[{value:'rajakumarkumaran736@gmail.com',label:'rajakumarkumaran736@gmail.com'},
//                      {value:'rajardevloper@gmail.com', label: 'rajardevloper@gmail.com'}]

// @Get()
// getEmails(){
//     return this.emails
// }
// }


// @Controller('emaillists')
// export class EmailListController {
//   constructor(private readonly emailService: EmailService) {}

//   @Get()
//   async getEmails(): Promise<string[]> {
//     return this.emailService.getEmails();
//   }
// }

@Controller('emaillists')
export class EmailListController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async getEmails(): Promise<{ value: string; label: string }[]> {
    return this.emailService.getEmails();
  }
}

