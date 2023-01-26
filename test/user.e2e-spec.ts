import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

const userTest: CreateUserDto = {
  phone: '+79279624040',
  password: 'ganavo72e2'
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) SUCCESS', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(userTest)
      .expect(201).then(({ body }: request.Response) => {
        userId = body.id;
        expect(userId).toBeDefined();
      });
  });

  it('/users (POST) ERROR PHONE EXISTS', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(userTest)
      .expect(400);
  });

  it('/users/list (GET)', async () => {
    return request(app.getHttpServer())
      .get('/users/list')
      .expect(200).then(({ body }: request.Response) => {
      });
  });

  it('/users/${id} (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200).then(({ body }: request.Response) => {
        expect(body.id).toEqual(userId);
      });
  });

  it('/users/${id} (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200).then(({ body }: request.Response) => {
        expect(body.id).toEqual(userId);
        expect(body.phone).toEqual(userTest.phone);
      });
  });
});
