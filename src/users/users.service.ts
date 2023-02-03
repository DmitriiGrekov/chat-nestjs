import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserResponseDto } from './dto/user-response.dto';
import { QueryDto } from './dto/query.dto';

interface IUserSearch {
  where: any;
  select?: any;
}

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userExists = await this.prismaService.user.findFirst({ where: { OR: [{ login: createUserDto.login }, { phone: createUserDto.phone }, { email: createUserDto.email }] } })
      if (userExists) throw new HttpException('Данный логин, телефон или почта уже существует', HttpStatus.BAD_REQUEST);
      const hash = await bcrypt.hash(createUserDto.password, 10);
      return await this.prismaService.user.create({ data: { ...createUserDto, password: hash } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(params?): Promise<User[]> {
    try {
      return await this.prismaService.user.findMany(params);
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(params: IUserSearch): Promise<User> {
    try {
      const user = await this.prismaService.user.findFirst(params);
      if (!user) throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prismaService.user.findFirst({ where: { id: id } });
      if (!user) throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      return await this.prismaService.user.update({ where: { id: id }, data: { ...updateUserDto } })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: number): Promise<User> {
    try {
      const user = await this.prismaService.user.findFirst({ where: { id: id } });
      if (!user) throw new HttpException('Пользователь не существует', HttpStatus.NOT_FOUND);
      return await this.prismaService.user.delete({ where: { id: id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }
}


