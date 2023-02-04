import { OnModuleInit, Session, UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { parse } from "cookie";
import { JwtService } from "@nestjs/jwt";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { getUserFromSocket } from "src/common/getUserFromSocket";

@WebSocketGateway(8080, {
  cors: true,
  namespace: "chat",
})
export class ChatGateway implements OnModuleInit, OnGatewayConnection {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private redis: Redis
  ) { }

  @WebSocketServer()
  server: Server;

  private userData;

  onModuleInit() { }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket) {
    const user = await getUserFromSocket(client);
    if (user === null) return false;
    const siteConnectedArray = JSON.parse(
      await this.redis.get("siteConnected")
    );
    if (!siteConnectedArray) return false;

    if (siteConnectedArray.find((conn: any) => Object.keys(conn).includes(user.userId.toString())))
      return false;
    siteConnectedArray.push({ [user.userId]: user.socketId });
    await this.redis.set("siteConnected", JSON.stringify(siteConnectedArray));
    console.log(`Connect chat ${user.socketId} `);
  }

  @UseGuards(JwtAuthGuard)
  async handleDisconnect(client: Socket) {
    const user = await getUserFromSocket(client);
    if (user === null) return false;
    const siteConnectedArray = JSON.parse(
      await this.redis.get("siteConnected")
    );
    if (!siteConnectedArray) return false;
    siteConnectedArray.pop({ [user.userId.toString()]: user.socketId });
    console.log(siteConnectedArray);
    await this.redis.set("siteConnected", JSON.stringify(siteConnectedArray));
    console.log(`Disconnect site ${client.id}`);
  }

  sendUnreadedMessage(data: any, sockets: string[]) {
    this.server.to(sockets).emit("chatsUnreadedMessage", data);
  }
}
