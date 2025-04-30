  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { UsersModule } from './users/users.module';
  import { AppController } from './app.controller';
  import { CounterModule } from './counter/counter.module';
  import { ChatGateway } from './chat/chat.gateway';
  import { ConversationModule } from './conversation/conversation.module';
  import { ConversationsService } from './conversation/conversations.service';
  import { MessagesModule } from './messages/messages.module';
  import { User } from './users/user';
  import { Conversation, Tag } from './conversation/conversations.entity';
  import { UserConversation } from './conversation/user-conversation';
  import { MailService } from './mail/mail.service';
  import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        }),
      }),
      AuthModule,   
      UsersModule,
      CounterModule,
      ConversationModule,
      MessagesModule,
      MailModule
    ],
    providers:[ConversationsService, ChatGateway, MailService],
    controllers: []
  })
  export class AppModule {}
