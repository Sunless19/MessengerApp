import { Component, OnInit } from '@angular/core';
import { Conversation } from '../../models/Conversation'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversationsService } from '../../../services/conversations.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ExploreComponent implements OnInit {
  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  tags: String[] = ['literature', 'books', 'nerds'];
  searchQuery: string = '';
  user:string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private conversationService: ConversationsService
    ) {}

  ngOnInit(): void {
    this.filteredConversations = this.conversations
    this.route.params.subscribe((params) =>{
      this.user = params['name']
    })

    this.conversationService.getConversations().subscribe((data)=>{
      this.conversations = data
      this.filteredConversations = [...this.conversations];
      })

    this.conversationService.getAllTags().subscribe((data) => {
      this.tags = data
    })
  }

  searchConversations(): void {
    if (this.searchQuery.startsWith('#')) {
      const tagToSearch = this.searchQuery.slice(1).toLowerCase();
      this.filteredConversations = this.conversations.filter((conversation) =>
        conversation.tags?.some(tag => tag.toLowerCase().includes(tagToSearch)) 
      );
    } else {
      this.filteredConversations = this.conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  joinConversation(id: string): void {
    this.authService.setConversationId(id);
    alert(`User: ${this.user}, Chat ID: ${id}`);
    this.router.navigate(['/mess', this.user, id]);
  }

  randomConversation(): void {
    const randomIndex = Math.floor(Math.random() * this.conversations.length);
    const randomConversation = this.conversations[randomIndex];
    this.authService.setConversationId(randomIndex.toString());
    this.router.navigate(['/mess', this.user, randomIndex]);
  }

  onTagClick(tag: String): void {
    console.log(`Clicked tag: ${tag}`);
    this.searchQuery = `#${tag}`;
    this.searchConversations();
  }

  clearQuery(): void {
    this.searchQuery = ''; 
    this.filteredConversations = this.conversations; 
  }

  
  goToPorfile(): void{
    this.router.navigate(['profile', this.user])
  }
}
