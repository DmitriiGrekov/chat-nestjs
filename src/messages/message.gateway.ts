import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { parse } from 'cookie';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
  namespace: "message"
})
export class MessageGateway implements OnModuleInit, OnGatewayConnection {
  constructor(private jwtService: JwtService) { }
  @WebSocketServer()
  server: Server;

  private userData;

  onModuleInit() {
    console.log('Message INIT')
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    await this.getUserFromSocket(client);
  }

  sendMessage(event: string, data: any) {
    // return this.server.emit(event, data);
    console.log(this.userData);
    this.server.to(this.userData.socketId).emit('message', 'hi')
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
