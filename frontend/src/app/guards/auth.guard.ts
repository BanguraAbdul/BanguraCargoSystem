import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AlertService } from '../services/alert.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alertService = inject(AlertService);
  const token = localStorage.getItem('token');
  
  if (token) {
    return true;
  }
  
  // Show message and redirect to landing page where user can use login modal
  alertService.info('Please login to access this page', 'Login Required');
  router.navigate(['/']);
  return false;
};
