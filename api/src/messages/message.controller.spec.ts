import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import * as request from 'supertest';  
import { DataSource } from 'typeorm';
import { Message } from './messages';
import { Conversation } from 'src/conversation/conversations.entity';
import { User } from 'src/users/user';

describe('MessagesController (integration)', () => {
  let app;
  let messagesService: MessagesService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Conversation, Message],
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User, Conversation, Message]), 
      ],
      controllers: [MessagesController],
      providers: [MessagesService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    messagesService = app.get(MessagesService);
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get all messages for a conversation', async () => {
    const conversationRepository = dataSource.getRepository(Conversation);
    const messageRepository = dataSource.getRepository(Message);
  
    const conversation = new Conversation();
    conversation.title = 'Test Conversation';
    const savedConversation = await conversationRepository.save(conversation);
  
    const message1 = new Message();
    message1.content = 'First message';
    message1.conversationId = savedConversation.id; 
    await messageRepository.save(message1);
  
    const message2 = new Message();
    message2.content = 'Second message';
    message2.conversationId = savedConversation.id;  
    await messageRepository.save(message2);
  
    const response = await request(app.getHttpServer())
      .get(`/messages/${savedConversation.id}`)
      .expect(200);
  
    expect(response.body.length).toBe(2);
    expect(response.body[0].content).toBe('First message');
    expect(response.body[1].content).toBe('Second message');
  });

  it('should add a message to a conversation', async () => {
    const conversationRepository = dataSource.getRepository(Conversation);
    const conversation = new Conversation();
    conversation.title = 'New Conversation';
    const savedConversation = await conversationRepository.save(conversation);
  
    const response = await request(app.getHttpServer())
      .post('/messages')
      .send({
        conversationId: savedConversation.id, 
        content: 'This is a new message',
      })
      .expect(201);
  
    expect(response.body.content).toBe('This is a new message');
    expect(response.body.conversationId).toBe(savedConversation.id);
  });
});
