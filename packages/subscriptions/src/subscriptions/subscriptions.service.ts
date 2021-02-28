import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { from, noop, Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { SubscriptionStatus } from './subscription-status.enum';
import { SubscriptionE } from './subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(@InjectRepository(SubscriptionE) private readonly _subscriptionsRepo: Repository<SubscriptionE>) {}

  getAllSubscriptions(): Observable<SubscriptionE[]> {
    return from(this._subscriptionsRepo.find());
  }

  getSubscriptionDetails(subscriptionId: string): Observable<SubscriptionE> {
    return from(this._subscriptionsRepo.findOneOrFail({ where: { id: subscriptionId } })).pipe(
      catchError((error) => {
        if (error.name === 'EntityNotFound') {
          throw new RpcException('Entity not found');
        }
        throw new RpcException('Internal microservice error');
      }),
    );
  }

  createSubscription(subscription: SubscriptionE): Observable<{ id: string }> {
    return from(this._subscriptionsRepo.save(subscription)).pipe(
      map((createdSubscription: SubscriptionE) => {
        return { id: createdSubscription.id };
      }),
      catchError(() => {
        throw new RpcException('Internal microservice error');
      }),
    );
  }

  cancelSubscription(subscriptionId: string): Observable<void> {
    // if typeorm's update function actually worked there wouldn't be a need for this
    return this.getSubscriptionDetails(subscriptionId).pipe(
      concatMap((entity: SubscriptionE) => {
        if (entity.status === SubscriptionStatus.CANCELLED) {
          throw new RpcException('Entity is already cancelled');
        }
        return from(this._subscriptionsRepo.save(Object.assign(entity, { status: SubscriptionStatus.CANCELLED }))).pipe(map(noop));
      }),
      catchError((error) => {
        if (error.message === 'Entity not found') {
          throw new RpcException('Entity not found');
        }
        if (error.message === 'Entity is already cancelled') {
          throw new RpcException('Entity is already cancelled');
        }
        throw new RpcException('Internal microservice error');
      }),
    );
  }
}
