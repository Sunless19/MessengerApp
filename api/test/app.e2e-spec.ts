import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], 
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users') 
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('username');
  });

  it('/POST users', async () => {
    const createUserDto = { username: 'newuser', email: 'newuser@example.com', password: 'password' };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body.username).toBe('newuser');
    expect(response.body.email).toBe('newuser@example.com');
  });

  it('/PUT users', async () => {
    const updatedUserDto = { username: 'updateduser', email: 'updated@example.com' };

    const response = await request(app.getHttpServer())
      .put('/users/1') 
      .send(updatedUserDto)
      .expect(200);

    expect(response.body.username).toBe('updateduser');
    expect(response.body.email).toBe('updated@example.com');
  });

  it('/DELETE users', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/1') 
      .expect(200);

    expect(response.body).toHaveProperty('message', 'User deleted successfully');
  });

  afterAll(async () => {
    await app.close(); 
  });
});
