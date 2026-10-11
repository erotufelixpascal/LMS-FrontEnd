import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from './models/api.models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/']);
  return false;
};

// The '/logout' route previously just showed the login page again without
// ever clearing the session - now that there's a real token to clear, this
// guard does the actual logout as a side effect before cancelling the
// navigation (logout() already redirects to '/').
export const logoutGuard: CanActivateFn = () => {
  inject(AuthService).logout();
  return false;
};

export function roleGuard(...roles: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isLoggedIn()) {
      router.navigate(['/']);
      return false;
    }
    if (!auth.hasRole(...roles)) {
      // Logged in, just not allowed here - send them to their own portal
      // rather than back to the login screen.
      auth.redirectToHome();
      return false;
    }
    return true;
  };
}
