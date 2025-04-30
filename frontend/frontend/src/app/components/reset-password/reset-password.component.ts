import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/users.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  userId: number = 0; 

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  user = {
    password: ''
  };

  passwordPattern = /^(?=.*\d).{6,}$/;

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    console.log("User ID: ", this.userId);
  }

  update() {
    console.log(this.user.password);
    this.userService.updatePassword(this.userId, this.user.password).subscribe((res) => {
      alert("User updated");
    });
  }
}
