import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat } from './entities/chat.entity';
import { Message } from 'src/message/message.entity';
import { User } from 'src/user/entities/user.entity';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from 'src/chat-member/chat-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message, User, ChatMember]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
