import { ChatMember } from 'src/chat-member/chat-member.entity';
import { Message } from 'src/message/message.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';


export enum ChatType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

@Entity({ name: 'chat' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.PRIVATE,
  })
  type: ChatType;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => ChatMember, chatMember => chatMember.chat)
  members: ChatMember[];

  @OneToMany(() => Message, chatMessage => chatMessage.chat)
  messages: ChatMember[];

  @CreateDateColumn()
  createdAt: Date;
}
