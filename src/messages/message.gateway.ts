import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
  namespace: "message"
})
export class MessageGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis
  ) { }

  @WebSocketServer()
  server: Server;

  private userData;

  onModuleInit() {
    console.log('Message INIT')
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const data = await this.getUserFromSocket(client);
    const redisRoom = JSON.parse(await this.redis.get(data.roomId.toString()));
    if (!redisRoom) {
      console.log(`Connect ${data.socketId}`)
      return await this.redis.set(data.roomId.toString(), JSON.stringify([data.socketId]).toString());
    }
    redisRoom.push(data.socketId);
    await this.redis.set(data.roomId.toString(), JSON.stringify(redisRoom));
    console.log(`Connect ${data.socketId}`)
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: Socket) {
    const data = await this.getUserFromSocket(client);
    let redisRoom = JSON.parse(await this.redis.get(data.roomId.toString()));
    if (redisRoom.includes(data.socketId))
      redisRoom = redisRoom.filter((socket) => socket != data.socketId);
    await this.redis.set(data.roomId.toString(), JSON.stringify(redisRoom));
    console.log(`Disconnect ${data.socketId}`);
  }

  async sendMessage(data: any, roomId: number) {
    // return this.server.emit(event, data);
    let redisRoom = JSON.parse(await this.redis.get(roomId.toString()));
    if (redisRoom)
      this.server.to(redisRoom).emit('message', data)
  }

  private async getUserFromSocket(socket: Socket) {
    const token = socket.handshake.headers.authorization?.split(' ')[1]
    let userId: number;
    if (token)
      userId = this.jwtService.decode(token).sub;
    const roomId = +socket.handshake.query.room_id
    const socketId = socket.id;
    return { userId, roomId, socketId }
  }
}
