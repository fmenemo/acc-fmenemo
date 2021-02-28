import { SubscriptionStatus } from './subscription-status.enum';

export interface SubscriptionEI {
  id: string;
  email: string;
  firstName?: string;
  gender?: string;
  dateOfBirth: string;
  consent: boolean;
  newsletterId: string;
  status: SubscriptionStatus;
}
