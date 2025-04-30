import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from '../messages/messages.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from '../messages/messages';

const mockMessageRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(Message), useValue: mockMessageRepository },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMessage', () => {
    it('should create and save a new message', async () => {
      const conversationId = 1;
      const content = 'Hello, World!';
      const createdMessage = { conversationId, content };
      const savedMessage = { id: 1, conversationId, content };

      mockMessageRepository.create.mockReturnValue(createdMessage);
      mockMessageRepository.save.mockResolvedValue(savedMessage);

      const result = await service.addMessage(conversationId, content);

      expect(mockMessageRepository.create).toHaveBeenCalledWith({ conversationId, content });
      expect(mockMessageRepository.save).toHaveBeenCalledWith(createdMessage);
      expect(result).toEqual(savedMessage);
    });
  });

  describe('getMessagesByConversationId', () => {
    it('should return messages content for a given conversation', async () => {
      const conversationId = 1;
      const messages = [
        { id: 1, conversationId, content: 'Hello, World!' },
        { id: 2, conversationId, content: 'Hi there!' },
      ];

      mockMessageRepository.find.mockResolvedValue(messages);

      const result = await service.getMessagesByConversationId(conversationId);

      expect(mockMessageRepository.find).toHaveBeenCalledWith({ where: { conversationId } });
      expect(result).toEqual(['Hello, World!', 'Hi there!']);
    });

    it('should return an empty array if no messages are found', async () => {
      const conversationId = 1;

      mockMessageRepository.find.mockResolvedValue([]);

      const result = await service.getMessagesByConversationId(conversationId);

      expect(mockMessageRepository.find).toHaveBeenCalledWith({ where: { conversationId } });
      expect(result).toEqual([]);
    });
  });
});
