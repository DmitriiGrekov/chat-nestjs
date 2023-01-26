import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { CreateRoomDto } from '../src/rooms/dto/create-room.dto';
import { RoomsModule } from '../src/rooms/rooms.module';
import { AuthLoginDto } from '../src/auth/dto/auth-login.dto';
import { AuthModule } from '../src/auth/auth.module';
import { UpdateRoomDto } from 'src/rooms/dto/update-room.dto';

const roomTest: CreateRoomDto = {
  name: 'Тестовая комната',
  image: ''
}

const updateRoomTest: UpdateRoomDto = {
  name: "Измененная тестовая комната",
  image: ''
}

const userTest: AuthLoginDto = {
  phone: '+79279624039',
  password: 'ganavo72e2'
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let roomId: number;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RoomsModule, AuthModule],
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

  it('/rooms (POST) SUCCESS', async () => {
    return request(app.getHttpServer())
      .post('/rooms')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(roomTest)
      .expect(201).then(({ body }: request.Response) => {
        roomId = body.id;
        expect(roomId).toBeDefined();
      });
  });
  //
  it('/rooms/list (GET)', async () => {
    return request(app.getHttpServer())
      .get('/rooms/list')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });

  it('/rooms/${id} (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200).then(({ body }: request.Response) => {
        expect(body.id).toEqual(roomId);
      });
  });

  it('/rooms/${id} (PATCH)', async () => {
    return request(app.getHttpServer())
      .patch(`/rooms/${roomId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateRoomTest)
      .expect(200).then(({ body }: request.Response) => {
        expect(body.name).toEqual(updateRoomTest.name);
      });
  });
  //
  // it('/rooms/${id} (DELETE)', async () => {
  //   return request(app.getHttpServer())
  //     .delete(`/rooms/${roomId}`)
  //     .set('Authorization', `Bearer ${jwtToken}`)
  //     .expect(200).then(({ body }: request.Response) => {
  //       expect(body.id).toEqual(roomId);
  //       expect(body.name).toEqual(updateRoomTest.name);
  //     });
  // });
});
