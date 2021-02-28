import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionEI } from '../models/subscription-entity.interface';
import { SubscriptionDto } from '../models/subscription.dto';

@Injectable()
export class SubscriptionInternalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context?.switchToHttp()?.getRequest();
    const subscriptionRequestDto: SubscriptionDto = request?.body;
    request.body = new SubscriptionDto().fromDto(subscriptionRequestDto);

    return next.handle().pipe(
      map((data: SubscriptionEI) => {
        return new SubscriptionDto().toDto(data);
      }),
    );
  }
}
