import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { WebSocketService } from '../../../services/web-socket.service';
import { MessagesService } from '../../../services/messages.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/users.service';
import { ConversationsService } from '../../../services/conversations.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  message: string = '';
  messages: string[] = [];
  staticMessages: string[] = [];
  name: string | null = ''
  chat: string | null = ''
  chatName: string | null = ''

  constructor(
    private websocketService: WebSocketService,
    private route:ActivatedRoute,
    private messagesService: MessagesService,
    private authService: AuthService,
    private conversationService: ConversationsService
  ){}

  ngOnInit(): void {
    this.name = this.authService.getUsername()
    this.chat = this.route.snapshot.paramMap.get('chat');
    console.log(this.chat);
    if (this.chat) {
      
      this.conversationService.getConversationTitleById(this.chat).subscribe(title => {
        this.chatName = title;
        console.log('Title', title);
      });

      this.messagesService.getByChat(this.chat).subscribe((messages) => {
        this.staticMessages = messages; 
      });
      
      this.websocketService.getMessages(this.chat).subscribe((messages) => {
        console.log(`received: ${this.message}`);
        this.messages = messages;
      });
    } else {
      console.error('Chat ID is null');
    }
  }

  sendMessage(): void {
    if (this.message.trim() && this.chat) {

      const payload = {
        chat : this.chat,
        message : `${this.name}:${this.message}`
      }

      const userId = this.authService.getUserId();
      this.messagesService.addUserToConversation(this.chat, [userId]);

      this.websocketService.sendMessage(payload)
      console.log('send: this.message');
      this.message = '';
    }
  } 

}
