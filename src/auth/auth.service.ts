import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ where: { phone: phone } });
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(authLoginDto: AuthLoginDto) {
    try {
      const validateUser = await this.validateUser(authLoginDto.phone, authLoginDto.password)
      if (!validateUser) throw new HttpException('Вы ввели не правильный логин или пароль', HttpStatus.FORBIDDEN)
      const payload = { phone: validateUser.phone, sub: validateUser.id };
      return {
        access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
