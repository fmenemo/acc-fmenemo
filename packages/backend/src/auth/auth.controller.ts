import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserE } from './user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  @ApiBody({ required: true, type: UserE, description: 'username and password to register user' })
  register(@Body('username') username: string, @Body('password') password: string): Observable<void> {
    return this._authService.register(username, password);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'jwt token containing credentials for authenticated routes' })
  @ApiBody({ required: true, type: UserE, description: 'username and password to log in user' })
  login(@Body('username') username: string, @Body('password') password: string): Observable<{ token: string }> {
    return this._authService.login(username, password);
  }
}
