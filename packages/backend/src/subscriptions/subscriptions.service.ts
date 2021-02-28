import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { MailsService } from '../mails/mails.service';
import { MailI } from '../mails/models/mail.interface';
import { SubscriptionEI } from './models/subscription-entity.interface';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject('SUBSCRIPTIONS_SERVICE') private readonly _subscriptionsMS: ClientProxy,
    private readonly _mailsService: MailsService,
  ) {}

  getAllSubscriptions(): Observable<SubscriptionEI[]> {
    return this._subscriptionsMS.send<SubscriptionEI[]>({ cmd: 'getAllSubscriptions' }, '');
  }

  getSubscriptionDetails(subscriptionId: string): Observable<SubscriptionEI> {
    return this._subscriptionsMS.send<SubscriptionEI>({ cmd: 'getSubscriptionDetails' }, subscriptionId).pipe(
      catchError((error) => {
        if (error.message === 'Entity not found') {
          throw new NotFoundException();
        }
        throw new InternalServerErrorException();
      }),
    );
  }

  createSubscription(subscription: SubscriptionEI): Observable<{ id: string }> {
    return this._subscriptionsMS.send<{ id: string }>({ cmd: 'createSubscription' }, subscription).pipe(
      concatMap((result: { id: string }) => {
        return this._mailsService
          .sendEmail({ to: subscription.email, subject: 'Success!', message: 'Subscription successful!' } as MailI)
          .pipe(map(() => result));
      }),
    );
  }

  cancelSubscription(subscriptionId: string): Observable<void> {
    return this._subscriptionsMS.send<void>({ cmd: 'cancelSubscription' }, subscriptionId).pipe(
      catchError((error) => {
        if (error.message === 'Entity is already cancelled') {
          throw new BadRequestException();
        }
        if (error.message === 'Entity not found') {
          throw new NotFoundException();
        }
        throw new InternalServerErrorException();
      }),
    );
  }
}
