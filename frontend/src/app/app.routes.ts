import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'create-shipment', 
    loadComponent: () => import('./components/create-shipment/create-shipment.component').then(m => m.CreateShipmentComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'rates', 
    loadComponent: () => import('./components/shipping-rates/shipping-rates.component').then(m => m.ShippingRatesComponent)
  },
  { 
    path: 'schedule-pickup', 
    loadComponent: () => import('./components/schedule-pickup/schedule-pickup.component').then(m => m.SchedulePickupComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'manage-return', 
    loadComponent: () => import('./components/manage-returns/manage-returns.component').then(m => m.ManageReturnsComponent)
  },
  { 
    path: 'international-guide', 
    loadComponent: () => import('./components/international-guide/international-guide.component').then(m => m.InternationalGuideComponent)
  },
  { 
    path: 'customer', 
    loadComponent: () => import('./components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'super-admin', 
    loadComponent: () => import('./components/super-admin-dashboard/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
