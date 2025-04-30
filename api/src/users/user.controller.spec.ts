import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { User } from './user';
import * as request from 'supertest';  // Folosește supertest
import { DataSource } from 'typeorm';
import { Conversation, Tag } from '../conversation/conversations.entity';
import { UserConversation } from '../conversation/user-conversation';

describe('UsersController (integration)', () => {
  let app;
  let usersService: UsersService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Conversation, Tag, UserConversation],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User, Conversation, Tag, UserConversation]), 
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    usersService = app.get(UsersService);
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new user', async () => {
    const newUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);  

    expect(response.body.id).toBeDefined();
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('test@example.com');
  });


  it('should find all users', async () => {
    const user2 = await usersService.createUser('user2', 'user2@example.com', 'password123');
    
    const users = await usersService.findAll();

    expect(users.length).toBe(2);
    expect(users[0].username).toBe('testuser');
    expect(users[1].username).toBe('user2');
  });

  it('should find user by username', async () => {
    const user = await usersService.createUser('user3', 'user3@example.com', 'password123');
    const foundUser = await usersService.findByUsername('user3');

    expect(foundUser).toBeDefined();
    expect(foundUser.username).toBe('user3');
    expect(foundUser.email).toBe('user3@example.com');
  });

  it('should find user by ID', async () => {
    const user = await usersService.createUser('user4', 'user4@example.com', 'password123');
    const foundUser = await usersService.findOne(user.id);

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(user.id);
  });

  it('should add conversation to user', async () => {
    const user = await usersService.createUser('user5', 'user5@example.com', 'password123');
    
    const conversationRepository = dataSource.getRepository(Conversation);  
    const conversation = new Conversation();
    conversation.title = 'Test Conversation';
    const savedConversation = await conversationRepository.save(conversation);  
    
    const userConversation = await usersService.addConversationToUser(user.id, savedConversation.id);
  
    expect(userConversation).toBeDefined();
    expect(userConversation.user.id).toBe(user.id);
    expect(userConversation.conversation.id).toBe(savedConversation.id);
  });
  

  it('should find user by email', async () => {
    const user = await usersService.createUser('user6', 'user6@example.com', 'password123');
    const userId = await usersService.findByEmail('user6@example.com');
    
    expect(userId).toBeDefined();
    expect(userId).toBe(user.id);
  });

  it('should update user password', async () => {
    const user = await usersService.createUser('user7', 'user7@example.com', 'password123');
    const newPassword = 'newpassword123';

    const updatedUser = await usersService.updatePassword(user.id, newPassword);

    expect(updatedUser.password).toBe(newPassword);
  });
});
