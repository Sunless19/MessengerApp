import { Component, OnInit } from '@angular/core';
import { Conversation } from '../../models/Conversation';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConversationsService } from '../../../services/conversations.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username: string = "Andreea"
  userId : string = ''
  user: string = ''
  conversations: Conversation[] = [];

  constructor(
    private router: Router, 
    private conversationService: ConversationsService,
    private authService: AuthService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId().toString()

    this.username = this.authService.getUsername()
    console.log(this.conversations);

    this.conversationService.getConversationsOfUser(this.userId).subscribe((data) =>
      this.conversations = data
    )

  }

  navigateToConversation(id: string): void {
    this.authService.setConversationId(id);
    this.router.navigate(['/mess', this.userId, id]); 
  }

  createConversation(): void {
    this.router.navigate(['/create', this.userId])
  }

  exploreConversations(): void {
    this.router.navigate(['/explore', this.userId])
  }
}