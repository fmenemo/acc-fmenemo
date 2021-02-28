import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { from, noop, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { UserE } from './user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserE) private readonly _userRepo: Repository<UserE>, private readonly _jwtService: JwtService) {}

  register(username: string, password: string): Observable<void> {
    return from(this._userRepo.findOne({ where: { username } })).pipe(
      concatMap((user: UserE) => {
        if (!user) {
          return from(this._userRepo.save({ username, password: bcrypt.hashSync(password, 10) })).pipe(map(noop));
        }
        // throw internal server error to avoid giving idea of the current database data
        throw new InternalServerErrorException();
      }),
    );
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return from(this._userRepo.findOne({ where: { username } })).pipe(
      map((user: UserE) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          // throw internal server error to avoid giving idea of the current database data
          throw new InternalServerErrorException();
        }

        const payload = Object.assign({}, { id: user.id, username: user.username });
        const token = this._jwtService.sign(payload);

        return { token };
      }),
    );
  }
}
