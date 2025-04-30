import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Tag } from './conversations.entity';
import { Repository } from 'typeorm';
import { UserConversation } from './user-conversation';
import { User } from '../users/user';
import { ConversationDto } from './conversation.dto';

@Injectable()
export class ConversationsService 
{
    constructor(
        @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserConversation) private userConversationRepository: Repository<UserConversation>,
    ){}

  async createConversation(title: string, userIds: number[], tagNames: string[]): Promise<Conversation> {
    const tags = await this.ensureTagsExist(tagNames);

    const conversation = this.conversationRepository.create({ title, tags });
    const savedConversation = await this.conversationRepository.save(conversation);

    for (const userId of userIds) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (user) {
        const userConversation = this.userConversationRepository.create({ user, conversation: savedConversation });
        await this.userConversationRepository.save(userConversation);
      }
    }

    return savedConversation;
  }

  async getAllConversations(): Promise<Conversation[]> {
    return await this.conversationRepository.find({ relations: ['tags', 'userConversations', 'userConversations.user'] });
  }

  async getConversationsForUser(userId: number): Promise<Conversation[]> {
    const userConversations = await this.userConversationRepository.find({
      where: { user: { id: userId } },
      relations: ['conversation', 'conversation.tags'],
    });
    return userConversations.map((uc) => uc.conversation);
  }

  async updateTagsForConversation(conversationId: number, tagNames: string[]): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['tags'],
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    const tags = await this.ensureTagsExist(tagNames);
    conversation.tags = tags;

    return await this.conversationRepository.save(conversation);
  }

  async getTagsForConversation(conversationId: number): Promise<Tag[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['tags'],
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    return conversation.tags;
  }

  private async ensureTagsExist(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    for (const name of tagNames) {
      let tag = await this.tagRepository.findOne({ where: { name } });
      if (!tag) {
        tag = this.tagRepository.create({ name });
        await this.tagRepository.save(tag);
      }
      tags.push(tag);
    }
    return tags;
  }

  async addUsersToConversation(conversationId: number, userIds: number[]): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['userConversations', 'userConversations.user'],
    });
  
    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }
  
    for (const userId of userIds) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
  
      const existingUserConversation = conversation.userConversations.find(
        (uc) => uc.user.id === userId,
      );
  
      if (!existingUserConversation) {
        const userConversation = this.userConversationRepository.create({
          user,
          conversation,
        });
        await this.userConversationRepository.save(userConversation);
      }
    }
  
    return await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['userConversations', 'userConversations.user'],
    });
  }

  async getAllConversationsDto(): Promise<ConversationDto[]> {
    const conversations = await this.conversationRepository.find({
      relations: ['tags', 'userConversations', 'userConversations.user'],
    });

    return conversations.map((conversation) => {
      return {
        id: conversation.id,
        title: conversation.title,
        tags: conversation.tags.map((tag) => tag.name),
        users: conversation.userConversations.map((uc) => uc.user.id),
      };
    });
  }

  async getAllTags(): Promise<String[]> {
    try {
      const totalCount = await this.tagRepository.count();
      console.log(totalCount);
      const tags = await this.tagRepository.find();
      const tagName = tags.map(tag => tag.name);
      return tagName;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Error fetching tags');
    }
  }
}
