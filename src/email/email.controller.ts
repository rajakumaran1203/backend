import { Controller , Post ,Get, Body} from "@nestjs/common";
import { EmailService } from "./email.service";



@Controller('email')
export class EmailController {
    constructor(private readonly emailService : EmailService) {}


    @Get()
    getEmail(): any {
        return 'all emails here'
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