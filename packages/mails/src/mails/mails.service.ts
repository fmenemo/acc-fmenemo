import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Observable, of } from 'rxjs';
import { MailI } from './mail.interface';

@Injectable()
export class MailsService {
  constructor(@Inject('SMTP') private readonly emailTransport: nodemailer.Transporter) {}

  sendEmail({ to, subject, message }: MailI): Observable<boolean> {
    console.log(`Sending email to ${to} with subject ${subject} and message ${message}`);
    return of(true);
    /**
     * Un-mocked code.
     return from(
       this.emailTransport.sendMail({
         from: 'from@test.com',
         to,
         subject,
         html: message,
       }),
     );
     */
  }
}
