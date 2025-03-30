import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Chat)
  @JoinColumn()
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;
}
