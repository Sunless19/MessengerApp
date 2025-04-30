import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    conversationId: number;
  
    @Column()
    content: string; 
}