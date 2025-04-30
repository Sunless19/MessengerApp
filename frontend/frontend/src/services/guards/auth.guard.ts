import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';


export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userId = authService.getUserId();
  const routeUserId = Number(route.params['name']);

  if (userId === routeUserId) { 
    return true;
  }

  router.navigate(['/not-authorized']);
  return false;
};
