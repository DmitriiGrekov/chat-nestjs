import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';


export async function getUserFromSocket(socket: Socket) {
  const jwtService = new JwtService();
  const token = socket.handshake.headers.authorization?.split(' ')[1]
  let userId: any;
  const payload = jwtService.decode(token);
  if (!payload) {
    return null
  }
  userId = payload.sub;
  const roomId = +socket.handshake.query.room_id
  const socketId = socket.id;
  return { userId, roomId, socketId }
}
