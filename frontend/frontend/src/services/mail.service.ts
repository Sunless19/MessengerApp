import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private apiService: ApiService) 
  {

  }

  requestUpdate(email: string){
    const body = {
      "email": email
    }
    console.log(body);
    return this.apiService.post<any>("mail", { "email": email});
  } 
}
