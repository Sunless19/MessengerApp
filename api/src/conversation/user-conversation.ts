import { User } from '../users/user';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Conversation } from './conversations.entity';

@Entity()
export class UserConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.id, { onDelete: 'CASCADE' })
  conversation: Conversation;
}
