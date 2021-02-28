import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MailsModule } from '../mails/mails.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'SUBSCRIPTIONS_SERVICE', transport: Transport.TCP, options: { host: 'acc-fmenemo-subscriptions', port: 3001 } },
    ]),
    MailsModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
