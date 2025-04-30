import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  register(user: User): Observable<User> {
    return this.apiService.post<User>('users', user);
  }

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('users');
  }

  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`users/${id}`);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`users/${id}`);
  }

  addConversation(userId:number, convId:string): Observable<void>{
    alert(`${userId}   ${convId}`)
    return this.apiService.post<void>(`users/${userId}/conversations/${convId}`);
  }

  updatePassword(userId: number, password: string): Observable<void>{
    const body = {
      password: password
    }
    return this.apiService.post<void>(`users/${userId}`, body);
  }
}
