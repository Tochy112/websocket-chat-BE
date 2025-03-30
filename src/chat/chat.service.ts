import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatType } from './entities/chat.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ChatMember } from 'src/chat-member/chat-member.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ChatMember)
    private chatMemberRepository: Repository<ChatMember>,
  ) {}

  async createGroupChat(createChatDto: CreateChatDto): Promise<Chat> {
    // Fetch creator and members
    const creator = await this.userRepository.findOne({
      where: { id: createChatDto.creatorId },
    });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const members = await this.userRepository.find({
      where: { id: In(createChatDto.memberIds) },
    });
    if (members.length !== createChatDto.memberIds.length) {
      throw new NotFoundException('Some users not found');
    }

    // Create chat
    const chat = this.chatRepository.create({
      name: createChatDto.name,
      type: ChatType.GROUP,
    });
    await this.chatRepository.save(chat);

    // Create chat members
    const chatMembers = [
      // Creator is always an admin
      this.chatMemberRepository.create({
        user: creator,
        chat,
        isAdmin: true,
      }),
      // Add other members
      ...members.map((member) =>
        this.chatMemberRepository.create({
          user: member,
          chat,
          isAdmin: false,
        }),
      ),
    ];

    await this.chatMemberRepository.save(chatMembers);

    return chat;
  }

  async addMemberToGroupChat(
    chatId: number,
    adderId: number,
    newMemberId: number,
  ): Promise<ChatMember> {
    // Check if chat exists and is a group chat
    const chat = await this.chatRepository.findOne({
      where: { id: chatId, type: ChatType.GROUP },
      relations: ['members', 'members.user'],
    });
    if (!chat) {
      throw new NotFoundException('Group chat not found');
    }

    // Check if adder is an admin
    const adderMembership = chat.members.find(
      (m) => m.user.id === adderId && m.isAdmin,
    );
    if (!adderMembership) {
      throw new NotFoundException('Only admins can add members');
    }

    // Check if new member exists
    const newMember = await this.userRepository.findOne({
      where: { id: newMemberId },
    });
    if (!newMember) {
      throw new NotFoundException('User not found');
    }

    // Check if already a member
    const existingMembership = chat.members.find(
      (m) => m.user.id === newMemberId,
    );
    if (existingMembership) {
      throw new NotFoundException('User is already a member');
    }

    // Create new chat member
    const chatMember = this.chatMemberRepository.create({
      user: newMember,
      chat,
      isAdmin: false,
    });

    return this.chatMemberRepository.save(chatMember);
  }


// fethches all chats of a user
  async getUserChats(userId: number): Promise<Chat[]> {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

// fetches all messages of a single chat
  async getChatMessages(chatId: number) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages')
      .leftJoinAndSelect('messages.sender', 'sender')
      .where('chat.id = :chatId', { chatId })
      .orderBy('messages.createdAt', 'ASC')
      .getOne();
  }

  // fetches all members of a single chat
  async getChatMembers(chatId: number) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('chat.id = :chatId', { chatId })
      .getOne();
  }
}
