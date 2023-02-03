import { HttpException, HttpStatus, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { getUserFromSocket } from 'src/common/getUserFromSocket';

@WebSocketGateway(8080, {
  // cors: true,
  namespace: "message"
})
export class MessageGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis
  ) { }

  @WebSocketServer()
  server: Server;

  onModuleInit() {
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const data = await getUserFromSocket(client);
    if (!data)
      return
    const redisRoom = JSON.parse(await this.redis.get(`room_id-${data?.roomId}`));
    const userSocket = { userId: data.userId, socketId: data.socketId }
    if (!redisRoom) {
      return await this.redis.set(`room_id-${data?.roomId}`, JSON.stringify([userSocket]).toString());
    }
    let userExists = redisRoom.findIndex((user) => user.userId === data.userId);
    if (userExists >= 0) {
      redisRoom[userExists].socketId = data.socketId
      return await this.redis.set(`room_id-${data?.roomId}`, JSON.stringify(redisRoom));
    }
    redisRoom.push(userSocket);
    await this.redis.set(`room_id-${data?.roomId}`, JSON.stringify(redisRoom));
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: Socket) {
    const data = await getUserFromSocket(client);
    if (!data)
      return;
    const dateDisconected = new Date();
    const redisUser = JSON.parse(await this.redis.get(`user_id-${data?.userId}`));
    if (!redisUser) {
      const newUser = [{ [data.roomId]: { date_closed: dateDisconected.toString() } }];
      console.log(`Disconnect Message ${client.id} `);
      return await this.redis.set(`user_id-${data?.userId}`, JSON.stringify(newUser));
    }
    redisUser.forEach(user => {
      if (user[data.roomId])
        return user[data.roomId] = dateDisconected;
      user[data.roomId] = dateDisconected;
    });
    await this.redis.set(`user_id-${data?.userId}`, JSON.stringify(redisUser))
    console.log(`Disconnect Message ${client.id} `);
  }

  async sendMessage(data: any, roomId: number) {
    let redisRoom = JSON.parse(await this.redis.get(`room_id-${roomId.toString()}`));
    if (!redisRoom)
      throw new HttpException('Ошибка отправки сообщения', HttpStatus.BAD_GATEWAY);
    const socketIds = redisRoom.map(r => { return r.socketId });
    console.log(socketIds);
    if (redisRoom)
      this.server.to(socketIds).emit('message', data)
  }
}
