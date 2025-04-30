import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importă FormsModule pentru a folosi ngModel
import { Router } from '@angular/router';
import { User, UserService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,  
  imports: [CommonModule, FormsModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: Partial<User> = {
    username: '',
    email: '',
    password: '',
  };

  usernamePattern = /^[a-zA-Z0-9]+$/;
  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  passwordPattern = /^(?=.*\d).{6,}$/;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  register(registerForm: any): void {
    if (registerForm.valid) {
      if (this.user.username && this.user.password) {
        this.userService.register(this.user as User).subscribe(
          (response) => {
            console.log('User registered successfully:', response);
            this.authService.login(this.user.username || '', this.user.password || '').subscribe(success => {
              if (success) {
                const userId = this.authService.getUserId();
                this.router.navigate(['/profile', userId]);
              }
            });
            alert('Registration successful!');
          },
          (error) => {
            console.error('Error registering user:', error);
            alert('Registration failed. Please try again.');
          }
        );
      }
    }
    else
    {
      alert("Wrong form layout");
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
