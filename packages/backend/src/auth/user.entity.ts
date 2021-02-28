import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserE {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
