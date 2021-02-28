import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionEI } from './subscription-entity.interface';

export class SubscriptionDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName?: string;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  dateOfBirth: string;
  @ApiProperty()
  consent: boolean;
  @ApiProperty()
  newsletterId: string;

  fromDto(dto: SubscriptionDto): SubscriptionEI {
    return {
      email: dto.email,
      firstName: dto.firstName,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth,
      consent: dto.consent,
      newsletterId: dto.newsletterId,
    } as SubscriptionEI;
  }

  toDto(entity: SubscriptionEI): SubscriptionDto {
    this.id = entity?.id;
    this.email = entity?.email;
    this.firstName = entity?.firstName;
    this.gender = entity?.gender;
    this.dateOfBirth = entity?.dateOfBirth;
    this.consent = entity?.consent;
    this.newsletterId = entity?.newsletterId;
    return this;
  }
}
