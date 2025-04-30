import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { UserConversation } from './user-conversation';


@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToMany(() => Tag, {cascade: true})
    @JoinTable()
    tags: Tag[]

    @OneToMany(() => UserConversation, (userConversation) => userConversation.conversation)
    userConversations: UserConversation[];
}


@Entity('tag')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}