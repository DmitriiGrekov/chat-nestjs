import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService, private prismaService: PrismaService) { }

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findFirst({ where: { login: login } });
    if (!user)
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(authLoginDto: AuthLoginDto) {
    try {
      const validateUser = await this.validateUser(authLoginDto.login, authLoginDto.password)
      if (!validateUser) throw new HttpException('Вы ввели не правильный логин или пароль', HttpStatus.FORBIDDEN)
      const payload = { login: validateUser.login, sub: validateUser.id, name: `${validateUser.firstname} ${validateUser.lastname}` };
      return {
        access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
        user_id: validateUser.id,
        login: validateUser.login
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
