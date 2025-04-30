import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;
  private messages = new BehaviorSubject<{ chat: string; message: string }[]>([]);

  constructor() {
    this.socket = new WebSocket('ws://localhost:3001');

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    this.socket.addEventListener('message', async (event: MessageEvent) => {
      const currentMessages = this.messages.value; 
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error('Invalid message format:', error);
        return;
      }

      const { chat, message } = data;
      console.log(chat)
      console.log(message)
      console.log(data)
      if (chat) {
        const updatedMessages = [...currentMessages, {chat, message}];
        this.messages.next(updatedMessages);
      }
    });
  }

  sendMessage(payload: { chat: string;  message: string }): void {
    this.socket.send(JSON.stringify(payload));
  }

  getMessages(chatId: string): Observable<string[]> {
    return this.messages.asObservable().pipe(
      map((messages) =>
        messages
          .filter((msg) => msg.chat === chatId) 
          .map((msg) => msg.message) 
      )
    );
  }
}
