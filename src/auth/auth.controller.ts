import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @Post('/login')
  login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Get('/login/view')
  @Render("login")
  async rootOne() {
    return { data: true };
  }
}
