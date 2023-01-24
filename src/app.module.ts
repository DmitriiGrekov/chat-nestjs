import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [

    UsersModule, AuthModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
