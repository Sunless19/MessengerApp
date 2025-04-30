import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './messages';
import { UsersModule } from 'src/users/users.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]), UsersModule, ConversationModule
  ],
  providers: [MessagesService], 
  controllers: [MessagesController],
  exports: [MessagesService], 
})
export class MessagesModule {}
