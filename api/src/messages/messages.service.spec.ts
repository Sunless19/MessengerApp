import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from './messages';
import { Repository } from 'typeorm';

describe('MessagesService', () => {
  let service: MessagesService;
  let messageRepository: Repository<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: {
            create: jest.fn().mockReturnValue({ conversationId: 1, content: 'Test Message' }),
            save: jest.fn().mockResolvedValue({ id: 1, conversationId: 1, content: 'Test Message' }),
            find: jest.fn().mockResolvedValue([{ id: 1, conversationId: 1, content: 'Test Message' }]),
          },
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messageRepository = module.get<Repository<Message>>(getRepositoryToken(Message));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMessage', () => {
    it('should create and save a message', async () => {
      const conversationId = 1;
      const content = 'Test Message';

      const result = await service.addMessage(conversationId, content);

      expect(result).toEqual({ id: 1, conversationId: 1, content: 'Test Message' });
      expect(messageRepository.create).toHaveBeenCalledWith({ conversationId, content });
      expect(messageRepository.save).toHaveBeenCalledWith({ conversationId, content });
    });
  });

  describe('getMessagesByConversationId', () => {
    it('should return an array of message contents', async () => {
      const conversationId = 1;

      const result = await service.getMessagesByConversationId(conversationId);

      expect(result).toEqual(['Test Message']);
      expect(messageRepository.find).toHaveBeenCalledWith({ where: { conversationId } });
    });
  });
});
