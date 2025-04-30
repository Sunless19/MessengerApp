import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { ApiOperation, ApiResponse, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';
import { UserDto } from './userDto'; 
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser(username, email, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users.',
    type: [UserDto],  
  })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Get user by Id',
    description: 'This endpoint retrieves a user by their unique ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user.',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user.',
    type: UserDto,  
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ 
    summary: 'Add conversation to user', 
    description: 'This endpoint allows you to add a conversation to a user by their ID and the conversation\'s ID.' 
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user to whom the conversation will be added.',
    type: Number,
  })
  @ApiParam({
    name: 'conversationId',
    description: 'The unique identifier of the conversation to be added.',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully added the conversation to the user.',
  })
  @Post(':userId/conversations/:conversationId')
  async addConversationToUser(
    @Param('userId') userId: number,
    @Param('conversationId') conversationId: number,
  ) {
    return this.usersService.addConversationToUser(userId, conversationId);
  }

  @ApiOperation({ 
    summary: 'Update user password', 
    description: 'This endpoint allows you to update the password of a user by their ID.'
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user whose password will be updated.',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the user password.',
  })
  @Post(':userId')
  async updatePassword(
    @Param('userId') userId: number,
    @Body('password') password: string,
  ) {
    return this.usersService.updatePassword(userId, password);
  }
}
