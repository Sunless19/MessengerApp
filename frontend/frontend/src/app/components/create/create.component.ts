import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ConversationsService } from '../../../services/conversations.service';
import { Conversation } from '../../models/Conversation';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CreateComponent implements OnInit {
  title: string = '';
  tags: string = '';
  users: string = '';
  mainUser: number = 0;
  availableTags: String[] = [];
  searchQuery: String = ''; 
  filteredTags: String[] = []; 


  constructor(
    private router: Router,
    private authService: AuthService,
    private conversationService: ConversationsService
  ) {}


  ngOnInit(): void {
    const user =  this.authService.getUser()
    this.mainUser = this.mainUser = user && user.id ? user.id : 0;
    this.conversationService.getAllTags().pipe(
      catchError(error => {
        console.error('Error fetching tags', error);
        return of([]);
      })
    ).subscribe(tags => {
      this.availableTags = tags; 
      this.filteredTags = tags;
    });
  }

  createConversation(event: Event): void {
    event.preventDefault();

    const validTags = this.tags.split(' ').filter(tag => tag.trim() !== '');

    const newConversation : Conversation = {
      id: '0',
      title: this.title,
      tags: validTags,
    };

    console.log('Creating conversation:', newConversation);

    this.conversationService.createConversation(newConversation, [this.mainUser]).subscribe({
      next: (data) => { 
        this.authService.setConversationId(data.id); 
        this.router.navigate(['/mess', this.mainUser, data.id]);
      },
    })
  }


  filterTags() {
    console.log(this.searchQuery)
    if (this.searchQuery) {
      this.filteredTags = this.availableTags.filter(tag =>
        tag.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredTags = this.availableTags;
    }
  }
  
}
