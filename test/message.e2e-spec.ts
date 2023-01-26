import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { CreateRoomDto } from '../src/rooms/dto/create-room.dto';
import { RoomsModule } from '../src/rooms/rooms.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { UpdateRoomDto } from '../src/rooms/dto/update-room.dto';
import { MessagesModule } from '../src/messages/messages.module';
import { CreateMessageDto } from '../src/messages/dto/create-message.dto';

const messageTest: CreateMessageDto = {
  user_id: 48,
  room_id: 37,
  message: "Сообщение тестовое"
}

const userTest: AuthLoginDto = {
  phone: '+79279624038',
  password: 'ganavo72e2'
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let messageId: number;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RoomsModule, AuthModule, MessagesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(userTest)
      .expect(200).then(({ body }: request.Response) => {
        jwtToken = body.access_token;
        expect(jwtToken).toBeDefined();
      });
  });

  it('/messages/send (POST) SUCCESS', async () => {
    return request(app.getHttpServer())
      .post('/messages/send')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(messageTest)
      .expect(201).then(({ body }: request.Response) => {
        messageId = body.id;
        expect(messageId).toBeDefined();
      });
  });
  //
  it('/messagesrooms/$id/list (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/messages/rooms/${messageTest.room_id}/list`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });
  //
  it('/messages/${id}/delete (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/messages/${messageId}/delete`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200).then(({ body }: request.Response) => {
        expect(body.id).toEqual(messageId);
      });
  });
});
