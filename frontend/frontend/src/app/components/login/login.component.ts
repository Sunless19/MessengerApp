import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username:string | undefined;
  password:string | undefined;
  id: string | undefined;

  constructor(private authService: AuthService, private router: Router){}

  login(): void{
    if(this.username && this.password){
      this.authService.login(this.username, this.password).subscribe(
        (isAuth: boolean) => {
          if(isAuth){
            console.log('Auhtenticated');
            const user = this.authService.getUser()
            this.router.navigate(['/profile', user?.id]);
          }
          else
          {
            alert("Invalid credentials");
          }
            
        }
      )
    }
  }

  goToRegister() :  void{
    this.router.navigate(['/register'])
  }

  goToRecover(): void{
    this.router.navigate(['/update-password']);
  }
}
