import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MailI } from './models/mail.interface';

@Injectable()
export class MailsService {
  constructor(@Inject('MAILS_SERVICE') private readonly _mailsMS: ClientProxy) {}

  sendEmail(data: MailI): Observable<void> {
    return this._mailsMS.send<void>({ cmd: 'sendEmail' }, data);
  }
}
