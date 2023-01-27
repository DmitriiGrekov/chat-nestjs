import { CacheModule, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { RoomsModule } from './rooms/rooms.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtStrategy } from './auth/strategies/jwt-auth.strategies';
import { MessagesModule } from './messages/messages.module';
import { EventsModule } from './events/events.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    UsersModule, AuthModule, RoomsModule, MessagesModule, EventsModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: 'sp7p6LYn'
      }
    })
  ],
  controllers: [],
  providers: [JwtAuthGuard, JwtStrategy, JwtService],
})
export class AppModule { }
