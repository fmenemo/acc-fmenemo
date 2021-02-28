import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { SubscriptionE } from './subscription.entity';
import { SubscriptionsService } from './subscriptions.service';

@Controller()
export class SubscriptionsController {
  constructor(private readonly _subscriptionsService: SubscriptionsService) {}

  @MessagePattern({ cmd: 'getAllSubscriptions' })
  getAllSubscriptions(): Observable<SubscriptionE[]> {
    return this._subscriptionsService.getAllSubscriptions();
  }

  @MessagePattern({ cmd: 'getSubscriptionDetails' })
  getSubscriptionDetails(data: string): Observable<SubscriptionE> {
    return this._subscriptionsService.getSubscriptionDetails(data);
  }

  @MessagePattern({ cmd: 'createSubscription' })
  createSubscription(data: SubscriptionE): Observable<{ id: string }> {
    return this._subscriptionsService.createSubscription(data);
  }

  @MessagePattern({ cmd: 'cancelSubscription' })
  cancelSubscription(data: string): Observable<void> {
    return this._subscriptionsService.cancelSubscription(data);
  }
}
