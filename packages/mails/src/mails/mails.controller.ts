import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MailI } from './mail.interface';
import { MailsService } from './mails.service';

@Controller()
export class MailsController {
  constructor(private readonly _mailsService: MailsService) {}

  @MessagePattern({ cmd: 'sendEmail' })
  sendEmail(data: MailI): Observable<boolean> {
    return this._mailsService.sendEmail(data);
  }
}
