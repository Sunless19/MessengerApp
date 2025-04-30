import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { Conversation } from '../conversation/conversations.entity';
import { UserConversation } from '../conversation/user-conversation';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Conversation, UserConversation]), 
    // forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],   
  exports: [UsersService],      
})
export class UsersModule {}
