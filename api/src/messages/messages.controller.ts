import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessagesController 
{
    constructor(private readonly messagesService: MessagesService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get all messages for a conversation' }) 
    @Get(":id")
    async getById(@Param('id') id:number){
        return this.messagesService.getMessagesByConversationId(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Add one message to converesation' }) 
    @Post()
    async addMessage(@Body() body: {id:number, content:string}){
        return this.messagesService.addMessage(body.id, body.content);
    }
}
