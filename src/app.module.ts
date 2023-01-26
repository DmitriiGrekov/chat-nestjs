import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RoomsModule } from './rooms/rooms.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtStrategy } from './auth/strategies/jwt-auth.strategies';
import { MessagesModule } from './messages/messages.module';
import { EventsModule } from './events/events.module';
import { RadisCacheModule } from './rdis-cache/radis-cache.module';

@Module({
  imports: [
    UsersModule, AuthModule, RoomsModule, MessagesModule, EventsModule, RadisCacheModule
  ],
  controllers: [],
  providers: [JwtAuthGuard, JwtStrategy, JwtService],
})
export class AppModule { }
