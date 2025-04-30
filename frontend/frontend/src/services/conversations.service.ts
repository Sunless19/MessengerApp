import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Conversation } from '../app/models/Conversation';
import { Observable, catchError, map, of } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  private readonly mockData: Conversation[] = [
    {
      id: '1',
      title: 'Mocked Literature talks',
      tags: ['books', 'literature']
    },
    {
      id: '2',
      title: 'Mocked Chess players',
      tags: ['chess', 'strategy']
    }
  ];

  private readonly baseUrl = 'https://api.example.com'; 

  constructor(private apiService: ApiService) {}

  private transformApiData(apiData: any[]): Conversation[] {
    return apiData.map(item => ({
      id: item.id.toString(),
      title: item.title,
      tags: item.tags
    }));
  }

  getConversations(): Observable<Conversation[]> {
    return this.apiService.get<any[]>('conversations').pipe(
      map(apiData => this.transformApiData(apiData)) 
    );
  }

  getConversationsOfUser(user:string) : Observable<Conversation[]>{
    return this.apiService.get<any[]>(`conversations/${user}`).pipe(
      map(apiData => this.transformApiData(apiData)) 
    );
  }

  getAllTags(): Observable<String[]>{
    return this.apiService.get<string[]>('conversations/tags');
  }
  
  createConversation(converastion:Conversation, userIds: number[]): Observable<Conversation> {
    const conversationDto={
      title: converastion.title,
      userIds: userIds,
      tags: converastion.tags
    }
    return this.apiService.post<any>('conversations', conversationDto);
  }

  getConversationById(conversationId: string): Observable<string | null> {
    return this.apiService.get<Conversation>(`conversations/${conversationId}`).pipe(
      map(conversation => conversation.title), 
      catchError(() => of(null)) 
    );
  }
  
  getConversationTitleById(conversationId: string): Observable<string | null> {
    return this.getConversations().pipe(
      map((conversations: Conversation[]) => {
        const match = conversations.find(c => c.id === conversationId);
        return match ? match.title : null;
      }),
      catchError(() => of(null))
    );
  }

}
