import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    // console.log('init')
  }

  sendMessage(event: string, data: any) {
    return this.server.emit(event, data);
  }
}


