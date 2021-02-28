import { Body, Controller, Get, HttpCode, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SubscriptionInternalInterceptor } from './interceptors/subscription-internal.interceptor';
import { SubscriptionEI } from './models/subscription-entity.interface';
import { SubscriptionDto } from './models/subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@ApiTags('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly _subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiResponse({ status: 200, type: SubscriptionDto, isArray: true, description: 'subscriptions in database' })
  getAllSubscriptions(): Observable<SubscriptionEI[]> {
    return this._subscriptionsService.getAllSubscriptions();
  }

  @Get(':subscriptionId')
  @UseInterceptors(SubscriptionInternalInterceptor)
  @ApiParam({ name: 'subscriptionId', required: true, type: String, description: 'id of a subscription' })
  @ApiResponse({ status: 200, type: SubscriptionDto, description: 'subscription by given id' })
  getSubscriptionDetails(@Param('subscriptionId') subscriptionId: string): Observable<SubscriptionEI> {
    return this._subscriptionsService.getSubscriptionDetails(subscriptionId);
  }

  @Post()
  @UseInterceptors(SubscriptionInternalInterceptor)
  @ApiResponse({ status: 201 })
  @ApiBody({ required: true, type: SubscriptionDto, description: 'data to create a subscription' })
  createSubscription(@Body() newSubscription: SubscriptionEI): Observable<{ id: string }> {
    return this._subscriptionsService.createSubscription(newSubscription);
  }

  @Post(':subscriptionId/cancel')
  @HttpCode(200)
  @ApiParam({ name: 'subscriptionId', required: true, type: String, description: 'id of a subscription to cancel' })
  @ApiResponse({ status: 200 })
  cancelSubscription(@Param('subscriptionId') subscriptionId: string): Observable<void> {
    return this._subscriptionsService.cancelSubscription(subscriptionId);
  }
}
