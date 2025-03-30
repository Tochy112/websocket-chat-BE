import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    Column, 
    JoinColumn
  } from 'typeorm';
  import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
  
@Entity({ name: 'members' })
  export class ChatMember {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
  
    @ManyToOne(() => Chat)
    @JoinColumn()
    chat: Chat;
  
    @Column({ default: false })
    isAdmin: boolean;
  }