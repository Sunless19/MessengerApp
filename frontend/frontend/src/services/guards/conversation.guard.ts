import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';


export const ConversationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const convId = authService.getConversationId()
  const routeConvId = route.params['chat'];

  if (convId === routeConvId) { 
    return true;
  }

  router.navigate(['/not-authorized']);
  return false;
};
