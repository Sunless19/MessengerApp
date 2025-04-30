import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class ChatGateway implements OnModuleInit {

  constructor(private readonly messageService: MessagesService){}

  private wss: WebSocketServer;

  onModuleInit() {
    this.wss = new WebSocketServer({ port: 3001 });
     
    this.wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (data) => {
        try {
          const { chat, message} = JSON.parse(data.toString());

          this.messageService.addMessage(chat, message);

          console.log(`Message received from chat ${chat}: ${message}`);

          this.wss.clients.forEach((client) => {
              client.send(JSON.stringify({ chat, message }));
          });
        } catch (error) {
          console.error('Invalid message format:', error);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }
}


// Documentation for library: 
// https://github.com/websockets/ws