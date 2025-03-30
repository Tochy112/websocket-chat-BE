import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller({
    path: "chats",
    version: '1',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('group')
  async createGroupChat(@Body() createChatDto: CreateChatDto) {
    return await this.chatService.createGroupChat(createChatDto);
  }

  @Get('user/:userId')
  async getUserChats(@Param('userId') userId: string) {
    return await this.chatService.getUserChats(+userId);
  }

  @Get(':chatId/messages')
  async getChatMessages(@Param('chatId') chatId: string) {
    return await this.chatService.getChatMessages(+chatId);
  }

  @Get(':chatId/members')
  async getChatMembers(@Param('chatId') chatId: string) {
    const data = await this.chatService.getChatMembers(+chatId);
    console.log("data", data);
    
    return data
  }

  @Patch(':chatId/add-member')
  async addMemberToGroupChat(
    @Param('chatId') chatId: string,
    @Body('adderId') adderId: number,
    @Body('newMemberId') newMemberId: number,
  ) {
    return await this.chatService.addMemberToGroupChat(+chatId, adderId, newMemberId);
  }

}