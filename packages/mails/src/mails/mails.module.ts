import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailsController } from './mails.controller';
import { MailsService } from './mails.service';

@Module({
  controllers: [MailsController],
  providers: [
    {
      provide: 'SMTP',
      useFactory: (): nodemailer.Transporter => {
        return nodemailer.createTransport(<any>{
          host: 'host',
          port: 'port',
          secure: false,
          auth: {
            user: 'user',
            pass: 'pass',
          },
        });
      },
    },
    MailsService,
  ],
})
export class MailsModule {}
