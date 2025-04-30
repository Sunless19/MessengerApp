import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private apiService: ApiService) { }

  getByChat(chat: string): Observable<string[]>{
    return this.apiService.get<string[]>(`messages/${chat}`);
  }

  addUserToConversation(convId: string, userIds: number[]): Observable<any>{
    return this.apiService.post<any>(`conversations/${convId}/users`, { userIds });
  }
}
