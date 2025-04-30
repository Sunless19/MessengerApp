import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user';
import { Conversation } from '../conversation/conversations.entity';
import { UserConversation } from '../conversation/user-conversation';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let conversationsRepository: Repository<Conversation>;
  let userConversationsRepository: Repository<UserConversation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue({ username: 'testuser', email: 'test@example.com', password: 'password' }),
            save: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', email: 'test@example.com', password: 'password' }),
            findOne: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', email: 'test@example.com', password: 'password' })
          },
        },
        {
          provide: getRepositoryToken(Conversation),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test Conversation' }),
          },
        },
        {
          provide: getRepositoryToken(UserConversation),
          useValue: {
            create: jest.fn().mockReturnValue({
              user: { id: 1, username: 'testuser', email: 'test@example.com', password: 'password' },
              conversation: { id: 1, title: 'Test Conversation' },
            }),
            save: jest.fn().mockResolvedValue({
              user: { id: 1, username: 'testuser', email: 'test@example.com', password: 'password' },
              conversation: { id: 1, title: 'Test Conversation' },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    conversationsRepository = module.get<Repository<Conversation>>(getRepositoryToken(Conversation));
    userConversationsRepository = module.get<Repository<UserConversation>>(getRepositoryToken(UserConversation));
  });

  it('should create and save a user', async () => {
    const username = 'testuser';
    const email = 'test@example.com';
    const password = 'password';

    const result = await service.createUser(username, email, password);

    expect(result).toEqual({ id: 1, username: 'testuser', email: 'test@example.com', password: 'password' });
    expect(usersRepository.create).toHaveBeenCalledWith({ username, email, password});
    expect(usersRepository.save).toHaveBeenCalledWith({ username, email, password});
  });

  it('should add a conversation to a user', async () => {
    const userId = 1;
    const conversationId = 1;

    const result = await service.addConversationToUser(userId, conversationId);

    expect(userConversationsRepository.create).toHaveBeenCalledWith({
      user: { id: 1, username: 'testuser', email: 'test@example.com', password: 'password' },
      conversation: { id: 1, title: 'Test Conversation' },
    });

    expect(userConversationsRepository.save).toHaveBeenCalledWith({
      user: { id: 1, username: 'testuser', email: 'test@example.com', password: 'password' },
      conversation: { id: 1, title: 'Test Conversation' },
    });
    
  });

});
