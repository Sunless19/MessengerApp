import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../../services/mail.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent {

  constructor(private mailService: MailService, private router: Router){}

  user = {
    email: ' '
  }

  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  update()
  {
    this.mailService.requestUpdate(this.user.email).subscribe(
      res => {
        alert("E-mail send for request");
      }
  )
    console.log("update");
  }
}
