import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { SubscriptionStatus } from './subscription-status.enum';

@Entity()
@Unique(['email', 'status'])
export class SubscriptionE {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  firstName?: string;

  @Column({
    nullable: true,
  })
  gender?: string;

  @Column()
  dateOfBirth: string;

  @Column({
    default: false,
  })
  consent: boolean;

  @Column()
  newsletterId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  constructor(
    email: string,
    firstName: string | undefined = undefined,
    gender: string | undefined = undefined,
    dateOfBirth: string,
    consent: boolean,
    newsletterId: string,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.consent = consent;
    this.newsletterId = newsletterId;
  }
}
