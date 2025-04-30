import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',  
      auth: {
        user: this.configService.get<string>('E-MAIL'), 
        pass: this.configService.get<string>('E-MAIL-PASSWORD'), 
      },
    });
  }

  async sendRecoveryLink(email: string, recoveryLink: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('E-MAIL'),
      to: email,
      subject: 'Recuperare parolă',
      text: `Click pe linkul de mai jos pentru a-ți recupera parola: ${recoveryLink}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
