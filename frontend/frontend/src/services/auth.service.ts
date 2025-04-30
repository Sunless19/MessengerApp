import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, catchError, map, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userKey = 'user';

  private conversationId = '';

  constructor(private apiService: ApiService) { }

  login(username: string, password: string): Observable<boolean> {
    return this.apiService.post<{ accessToken: string }>('auth/login', { username, password }).pipe(
      map(response => {
        if (response && response.accessToken) {
          localStorage.setItem('access_token', response.accessToken);
  
          const decoded = jwtDecode<{ username: string; sub: number }>(response.accessToken);
          const user = {
            id: decoded.sub,
            username: decoded.username
          };
          sessionStorage.setItem(this.userKey, JSON.stringify(user));
  
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
  
  setConversationId(id:string) : void {
    this.conversationId = id;
  }

  getConversationId(): string {
    return this.conversationId;
  }

  getUser(): { id: number; username: string } | null {
    const user = sessionStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number {
    const user = this.getUser();
    return user?.id ?? 0;
  }

  getUsername(): string{
    const user = this.getUser()
    return user?.username ?? '';
  }

  clearUser(): void {
    sessionStorage.removeItem('user');
  }
}
