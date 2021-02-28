import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailsService } from './mails.service';

@Module({
  imports: [
    ClientsModule.register([{ name: 'MAILS_SERVICE', transport: Transport.TCP, options: { host: 'acc-fmenemo-mails', port: 3002 } }]),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
