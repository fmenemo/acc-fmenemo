import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailsModule } from './mails/mails.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'acc-fmenemo-mariadb',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'acc-fmenemo',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    SubscriptionsModule,
    MailsModule,
  ],
})
export class AppModule {}
