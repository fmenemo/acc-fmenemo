import { Module } from '@nestjs/common';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [MailsModule],
})
export class AppModule {}
