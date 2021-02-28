import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { mock } from 'ts-mockito';
import { DeepPartial, Repository } from 'typeorm';
import { SubscriptionStatus } from '../src/subscriptions/subscription-status.enum';
import { SubscriptionE } from '../src/subscriptions/subscription.entity';
import { SubscriptionsService } from '../src/subscriptions/subscriptions.service';

describe('subscriptions service', () => {
  const subscriptionMockRepo = mock<Repository<SubscriptionE>>(Repository);
  let subscriptionsService: SubscriptionsService;

  describe('should do database operations properly', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [{ provide: 'SubscriptionERepository', useValue: subscriptionMockRepo }, SubscriptionsService],
      }).compile();
      subscriptionsService = module.get<SubscriptionsService>(SubscriptionsService);

      // Initialize jest to make sure that whenever the repo's find function is called, it returns an empty array
      jest.spyOn(subscriptionMockRepo, 'find').mockResolvedValue([]);
      jest.spyOn(subscriptionMockRepo, 'findOneOrFail').mockRejectedValue({ name: 'EntityNotFound' });

      // When saving something into the mockRepo, make sure that afterwards when trying to find it, it has the expected data
      jest.spyOn(subscriptionMockRepo, 'save').mockImplementation((subscription: DeepPartial<SubscriptionE>) => {
        const subscriptionToReturn = new SubscriptionE(
          subscription.email ?? '',
          subscription.firstName,
          subscription.gender,
          subscription.dateOfBirth ?? '',
          subscription.consent ?? false,
          subscription.newsletterId ?? '',
        );
        subscriptionToReturn.id = '1234asdf';
        subscriptionToReturn.status = subscription.status ?? SubscriptionStatus.ACTIVE;
        jest.spyOn(subscriptionMockRepo, 'find').mockResolvedValue([subscriptionToReturn]);
        jest.spyOn(subscriptionMockRepo, 'findOneOrFail').mockResolvedValue(subscriptionToReturn);
        return Promise.resolve(subscriptionToReturn);
      });
    });
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('return empty if no data', async () => {
      const serviceData = await subscriptionsService.getAllSubscriptions().toPromise();
      expect(serviceData).toHaveLength(0);

      const savedSubscriptions: SubscriptionE[] = await subscriptionMockRepo.find();
      expect(savedSubscriptions).toHaveLength(0);
    });

    it('properly save data', async () => {
      const createdSubscription = await subscriptionsService
        .createSubscription(new SubscriptionE('test@test.com', null, null, '01/01/2001', true, '1234'))
        .toPromise();

      const serviceData = await subscriptionsService.getAllSubscriptions().toPromise();
      expect(serviceData).toHaveLength(1);
      expect(serviceData[0]).toHaveProperty('email', 'test@test.com');
      expect(serviceData[0]).toHaveProperty('firstName', null);
      expect(serviceData[0]).toHaveProperty('gender', null);
      expect(serviceData[0]).toHaveProperty('dateOfBirth', '01/01/2001');
      expect(serviceData[0]).toHaveProperty('consent', true);
      expect(serviceData[0]).toHaveProperty('newsletterId', '1234');

      const savedSubscriptions: SubscriptionE[] = await subscriptionMockRepo.find();
      expect(savedSubscriptions).toHaveLength(1);
      expect(savedSubscriptions[0]).toHaveProperty('email', 'test@test.com');
      expect(savedSubscriptions[0]).toHaveProperty('firstName', null);
      expect(savedSubscriptions[0]).toHaveProperty('gender', null);
      expect(savedSubscriptions[0]).toHaveProperty('dateOfBirth', '01/01/2001');
      expect(savedSubscriptions[0]).toHaveProperty('consent', true);
      expect(savedSubscriptions[0]).toHaveProperty('newsletterId', '1234');

      const serviceDetailsData = await subscriptionsService.getSubscriptionDetails(createdSubscription?.id).toPromise();
      expect(serviceDetailsData).toHaveProperty('email', 'test@test.com');
      expect(serviceDetailsData).toHaveProperty('firstName', null);
      expect(serviceDetailsData).toHaveProperty('gender', null);
      expect(serviceDetailsData).toHaveProperty('dateOfBirth', '01/01/2001');
      expect(serviceDetailsData).toHaveProperty('consent', true);
      expect(serviceDetailsData).toHaveProperty('newsletterId', '1234');
    });

    it('properly update a subscription data', async () => {
      const createdSubscription = await subscriptionsService
        .createSubscription(new SubscriptionE('test@test.com', null, null, '01/01/2001', true, '1234'))
        .toPromise();

      const serviceDetailsData = await subscriptionsService.getSubscriptionDetails(createdSubscription?.id).toPromise();
      expect(serviceDetailsData).toHaveProperty('email', 'test@test.com');
      expect(serviceDetailsData).toHaveProperty('firstName', null);
      expect(serviceDetailsData).toHaveProperty('gender', null);
      expect(serviceDetailsData).toHaveProperty('dateOfBirth', '01/01/2001');
      expect(serviceDetailsData).toHaveProperty('consent', true);
      expect(serviceDetailsData).toHaveProperty('newsletterId', '1234');
      expect(serviceDetailsData).toHaveProperty('status', SubscriptionStatus.ACTIVE);

      await subscriptionsService.cancelSubscription(createdSubscription?.id).toPromise();

      const serviceDetailsDataCancelled = await subscriptionsService.getSubscriptionDetails(createdSubscription?.id).toPromise();
      expect(serviceDetailsDataCancelled).toHaveProperty('email', 'test@test.com');
      expect(serviceDetailsDataCancelled).toHaveProperty('firstName', null);
      expect(serviceDetailsDataCancelled).toHaveProperty('gender', null);
      expect(serviceDetailsDataCancelled).toHaveProperty('dateOfBirth', '01/01/2001');
      expect(serviceDetailsDataCancelled).toHaveProperty('consent', true);
      expect(serviceDetailsDataCancelled).toHaveProperty('newsletterId', '1234');
      expect(serviceDetailsDataCancelled).toHaveProperty('status', SubscriptionStatus.CANCELLED);
    });

    it('return error when finding unexisting subscription', async () => {
      try {
        await subscriptionsService.getSubscriptionDetails('12345').toPromise();
      } catch (error) {
        expect(error).toStrictEqual(new RpcException('Entity not found'));
      }
    });

    it('return error when cancelling already cancelled subscription', async () => {
      try {
        const createdSubscription = await subscriptionsService
          .createSubscription(new SubscriptionE('test@test.com', null, null, '01/01/2001', true, '1234'))
          .toPromise();

        const serviceDetailsData = await subscriptionsService.getSubscriptionDetails(createdSubscription?.id).toPromise();
        expect(serviceDetailsData).toHaveProperty('email', 'test@test.com');
        expect(serviceDetailsData).toHaveProperty('firstName', null);
        expect(serviceDetailsData).toHaveProperty('gender', null);
        expect(serviceDetailsData).toHaveProperty('dateOfBirth', '01/01/2001');
        expect(serviceDetailsData).toHaveProperty('consent', true);
        expect(serviceDetailsData).toHaveProperty('newsletterId', '1234');
        expect(serviceDetailsData).toHaveProperty('status', SubscriptionStatus.ACTIVE);

        await subscriptionsService.cancelSubscription(createdSubscription?.id).toPromise();

        const serviceDetailsDataCancelled = await subscriptionsService.getSubscriptionDetails(createdSubscription?.id).toPromise();
        expect(serviceDetailsDataCancelled).toHaveProperty('email', 'test@test.com');
        expect(serviceDetailsDataCancelled).toHaveProperty('firstName', null);
        expect(serviceDetailsDataCancelled).toHaveProperty('gender', null);
        expect(serviceDetailsDataCancelled).toHaveProperty('dateOfBirth', '01/01/2001');
        expect(serviceDetailsDataCancelled).toHaveProperty('consent', true);
        expect(serviceDetailsDataCancelled).toHaveProperty('newsletterId', '1234');
        expect(serviceDetailsDataCancelled).toHaveProperty('status', SubscriptionStatus.CANCELLED);

        await subscriptionsService.cancelSubscription(createdSubscription?.id).toPromise();
      } catch (error) {
        expect(error).toStrictEqual(new RpcException('Entity is already cancelled'));
      }
    });

    it('return errors when error is thrown in subscription details', async () => {
      try {
        jest.spyOn(subscriptionMockRepo, 'findOneOrFail').mockRejectedValue({ name: 'other' });
        jest.spyOn(subscriptionMockRepo, 'save').mockRejectedValue({ name: 'other' });

        await subscriptionsService.getSubscriptionDetails('1234').toPromise();
      } catch (error) {
        expect(error).toStrictEqual(new RpcException('Internal microservice error'));
      }
    });

    it('return errors when error is thrown in create subscription', async () => {
      try {
        jest.spyOn(subscriptionMockRepo, 'findOneOrFail').mockRejectedValue({ name: 'other' });
        jest.spyOn(subscriptionMockRepo, 'save').mockRejectedValue({ name: 'other' });

        await subscriptionsService.createSubscription(new SubscriptionE('', '', '', '', false, '')).toPromise();
      } catch (error) {
        expect(error).toStrictEqual(new RpcException('Internal microservice error'));
      }
    });

    it('return not found errors when error is thrown in cancel subscription', async () => {
      try {
        await subscriptionsService.cancelSubscription('1234').toPromise();
      } catch (error) {
        expect(error).toStrictEqual(new RpcException('Entity not found'));
      }
    });

    it('return internal errors when error is thrown in cancel subscription', async () => {
      try {
        jest.spyOn(subscriptionMockRepo, 'findOneOrFail').mockRejectedValue({ name: 'other' });
        jest.spyOn(subscriptionMockRepo, 'save').mockRejectedValue({ name: 'other' });

        await subscriptionsService.cancelSubscription('1234').toPromise();
      } catch (error) {
        expect(error).toStrictEqual(new RpcException('Internal microservice error'));
      }
    });
  });
});
