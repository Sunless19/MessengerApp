import { Body, Controller, Get, Param, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Conversation, Tag } from './conversations.entity';
import { ConversationsService } from './conversations.service';
import { ConversationDto } from './conversation.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('conversations')
export class ConversationsController {
    constructor(private readonly conversationService: ConversationsService) {}

    @UseGuards({
      canActivate: () => {
        throw new UnauthorizedException('Blocked!');
      },
    })
    @ApiOperation({ summary: 'Returns tags' }) 
    @Get('tags')
    async getAllTags(): Promise<String[]> {
      return this.conversationService.getAllTags();
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get converation for user' }) 
    @Get(':userId')
    async getConversationsForUser(@Param('userId') userId: number): Promise<Conversation[]> {
      return this.conversationService.getConversationsForUser(userId);
    }
  
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create conversation' }) 
    @Post()
    async createConversation(
      @Body() createConversationDto: { title: string; userIds: number[]; tags: string[] },
    ): Promise<Conversation> {
      return this.conversationService.createConversation(
        createConversationDto.title,
        createConversationDto.userIds,
        createConversationDto.tags,
      );
    }
  
    @UseGuards(AuthGuard('jwt'))  
    @ApiOperation({ summary: 'Add tags to specific converastion' }) 
    @Put(':conversationId/tags')
    async updateTagsForConversation(
      @Param('conversationId') conversationId: number,
      @Body() updateTagsDto: { tags: string[] },
    ): Promise<Conversation> {
      return this.conversationService.updateTagsForConversation(conversationId, updateTagsDto.tags);
    }

    
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Add one or more users to conversations' }) 
    @Put(':conversationId/users')
    async addUsersToConversation(
    @Param('conversationId') conversationId: number,
    @Body() addUsersDto: { userIds: number[] },
    ): Promise<Conversation> {
    return this.conversationService.addUsersToConversation(conversationId, addUsersDto.userIds);
    }
  
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get tags for conversation' }) 
    @Get(':conversationId/tags')
    async getTagsForConversation(@Param('conversationId') conversationId: number): Promise<Tag[]> {
      return this.conversationService.getTagsForConversation(conversationId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllConversationsDto(): Promise<ConversationDto[]> {
      return this.conversationService.getAllConversationsDto();
    }
}
