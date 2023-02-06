import { OnModuleInit, Session, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { getUserFromSocket } from 'src/common/getUserFromSocket';

@WebSocketGateway(8080, {
  cors: true,
  namespace: "rooms"
})
export class RoomsGateway implements OnModuleInit, OnGatewayConnection {
  constructor(private jwtService: JwtService, @InjectRedis() private redis: Redis) { }

  @WebSocketServer()
  server: Server;

  private userData;

  onModuleInit() {
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const user = await getUserFromSocket(client);
    if (user === null)
      return false;
    await this.redis.set(user.userId.toString(), user.socketId.toString());
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: Socket) {
    const data = await getUserFromSocket(client);
    if (data === null)
      return false;
    let redisRoom = await this.redis.get(data.userId?.toString());
    if (redisRoom)
      await this.redis.del(data.userId.toString());
  }

  sendMessage(event: string, data: any) {
    this.server.to(this.userData.socketId).emit(data)
  }

  sentNotification(socketId: string, data: any) {
    this.server.to(socketId).emit('addUserRoom', data)
  }
}
