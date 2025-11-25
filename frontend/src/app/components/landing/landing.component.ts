import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  trackingNumber: string = '';
  showLoginModal: boolean = false;
  showRegisterModal: boolean = false;
  credentials = { email: '', password: '' };
  selectedRole = 'SUPER_ADMIN';
  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    address: '',
    password: '',
    role: 'CUSTOMER'
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.credentials = { email: '', password: '' };
    this.selectedRole = 'SUPER_ADMIN';
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
    this.registerData = {
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      address: '',
      password: '',
      role: 'CUSTOMER'
    };
  }

  trackShipment() {
    if (this.trackingNumber) {
      this.router.navigate(['/tracking'], { queryParams: { number: this.trackingNumber } });
    }
  }

  onRegisterSubmit() {
    console.log('🔵 Registration form submitted');
    console.log('📝 Register data:', this.registerData);
    
    // Show loading
    this.alertService.loading('Creating your account...');
    
    // Make the API call
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('✅ Registration successful:', response);
        this.alertService.close();
        
        // Success! Show success message
        this.alertService.success(
          'Your account is pending approval. You will be notified once approved.',
          'Registration Successful!'
        ).then(() => {
          this.closeRegisterModal();
          this.openLoginModal();
        });
      },
      error: (err) => {
        console.error('❌ Registration error:', err);
        console.error('❌ Full error object:', JSON.stringify(err, null, 2));
        
        this.alertService.close();
        
        // Extract error message
        let errorMessage = 'Registration failed. Please check your input and try again.';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        }
        
        if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Backend may not be running.';
        }
        
        console.error('❌ Showing error:', errorMessage);
        this.alertService.error(errorMessage, 'Registration Failed');
      }
    });
  }

  onLoginSubmit() {
    console.log('🔵 Login form submitted');
    console.log('📝 Login credentials:', { email: this.credentials.email, role: this.selectedRole });
    
    // Show loading
    this.alertService.loading('Signing in...');
    
    // Make the API call
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Login successful:', response);
        this.alertService.close();
        
        // Check role match
        if (response.role !== this.selectedRole) {
          console.warn('⚠️ Role mismatch:', { selected: this.selectedRole, actual: response.role });
          this.alertService.warning(
            `You selected ${this.selectedRole} but your account is ${response.role}. Please select the correct role.`,
            'Role Mismatch'
          );
          return;
        }

        // Success! Redirect to dashboard
        this.alertService.success('Login successful!', 'Welcome!').then(() => {
          this.closeLoginModal();
          if (response.role === 'CUSTOMER') {
            this.router.navigate(['/customer']);
          } else if (response.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (response.role === 'SUPER_ADMIN') {
            this.router.navigate(['/super-admin']);
          }
        });
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        console.error('❌ Full error object:', JSON.stringify(err, null, 2));
        
        this.alertService.close();
        
        // Extract error message
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        }
        
        if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Backend may not be running.';
        }
        
        console.error('❌ Showing error:', errorMessage);
        this.alertService.error(errorMessage, 'Login Failed');
      }
    });
  }
}
