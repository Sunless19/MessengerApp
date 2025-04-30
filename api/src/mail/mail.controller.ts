import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { UsersService } from 'src/users/user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('mail')
export class MailController 
{
    constructor(private mailService: MailService, private userService: UsersService){}

    @ApiOperation({ 
      summary: 'Sends e-mail to user password', 
      description: 'This endpoint allows you to send an e-mail to an user basend on their id.'
    })
    @Post()
    async recoverPassword(@Body('email') email: string) {
      const userId = await this.userService.findByEmail(email);

      if(userId){
        const recoveryLink = `http://localhost:4200/reset-password/${userId}`
   
        await this.mailService.sendRecoveryLink(email, recoveryLink);
  
        return { message: 'Successfully send recovery link.' };
      }
    }
}
