import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message) 
        private readonly messageRepository: Repository<Message>,
    ){}

    async addMessage(conversationId:number, content:string): Promise<Message>{
        const message = this.messageRepository.create({conversationId, content});
        return this.messageRepository.save(message);
    }

    async getMessagesByConversationId(conversationId: number): Promise<string[]>{
        const messages = this.messageRepository.find({where: {conversationId}});
        
        return (await messages).map(message => message.content);
    }

}