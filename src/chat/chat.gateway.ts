import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Message } from 'src/message/message.entity';
import { User } from 'src/user/entities/user.entity';
import { Server, Socket } from 'socket.io';
import { BadGatewayException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() data: { chatId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Fetch chat
    const chat = await this.chatRepository.findOne({
      where: { id: +data.chatId },
    });

    console.log('chat', chat);
    
    //validates if chat exists
    if (!chat) {
      console.log('Chat does not exist');
      client.emit('error', 'Chat does not exist');
      return;
    }

    // Join the specific chat room
    client.join(`chat_${data.chatId}`);

    // Optional: Validate user is part of the chat
    const chatRoom = await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('chat.id = :chatId', { chatId: data.chatId })
      .andWhere('user.id = :userId', { userId: data.userId })
      .getOne();

      
      if (!chatRoom) {
        client.emit('error', 'Not a member of this chat');
        return;
      }
      
      console.log('chatRoom', chatRoom.members);

    if (chat.type === 'GROUP') {
      // Broadcast to chat room that user has joined
      this.server
        .to(`chat_${data.chatId}`)
        .emit('joinedChat', { text: `user_${data.userId} joined chat` });
    }

    // Send a welcome message to the user that joined
    client.emit('reply', `you have joined the chat_${data.chatId} room`);

    console.log(`chat_${data.chatId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      chatId: number;
      senderId: number;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    // Fetch sender and chat
    const sender = await this.userRepository.findOne({
      where: { id: data.senderId },
    });

    console.log('sender', sender);

    const chat = await this.chatRepository.findOne({
      where: { id: data.chatId },
    });

    console.log('chat', chat);

    if (!sender || !chat) {
      this.server.emit('error', 'Invalid sender or chat');
      return;
    }

    // Create and save message
    const message = this.messageRepository.create({
      content: data.content,
      sender,
      chat,
    });
    await this.messageRepository.save(message);

    // Fetch full message with sender details
    const fullMessage = await this.messageRepository.findOne({
      where: { id: message.id },
      relations: ['sender'],
    });

    // Broadcast to chat room
    this.server.to(`chat_${data.chatId}`).emit('newMessage', fullMessage);
    // client.to(`chat_${data.chatId}`).emit('newMessage', fullMessage);
  }
}
