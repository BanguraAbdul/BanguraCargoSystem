import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3>Register</h3>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="role" class="form-label">Register As</label>
                  <select class="form-select" id="role" 
                          [(ngModel)]="registerData.role" name="role" required>
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <small class="text-muted">Select Admin if you want administrative privileges</small>
                </div>
                <div class="mb-3">
                  <label for="firstName" class="form-label">First Name</label>
                  <input type="text" class="form-control" id="firstName" 
                         [(ngModel)]="registerData.firstName" name="firstName" required>
                </div>
                <div class="mb-3">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="lastName" 
                         [(ngModel)]="registerData.lastName" name="lastName" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" 
                         [(ngModel)]="registerData.email" name="email" required>
                </div>
                <div class="mb-3">
                  <label for="contact" class="form-label">Contact</label>
                  <input type="text" class="form-control" id="contact" 
                         [(ngModel)]="registerData.contact" name="contact" 
                         placeholder="+23212345678" 
                         pattern="^\\+232\\d{8}$" required>
                  <small class="form-text text-muted">Format: +232 followed by 8 digits (e.g., +23288045678)</small>
                </div>
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <textarea class="form-control" id="address" 
                            [(ngModel)]="registerData.address" name="address" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" 
                         [(ngModel)]="registerData.password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
                <a routerLink="/login" class="btn btn-link">Already have an account? Login</a>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
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
    private authService: AuthService, 
    private router: Router,
    private alertService: AlertService
  ) {}

  onSubmit() {
    console.log('Registration data:', this.registerData);
    this.alertService.loading('Creating your account...');
    
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Success response:', response);
        this.alertService.close();
        
        // Backend returns a plain string "Registration successful. Awaiting approval."
        let message = 'Your account is pending approval. You will be notified once approved.';
        if (typeof response === 'string') {
          message = response;
        } else if (response && response.message) {
          message = response.message;
        }
        
        this.alertService.success(message, 'Registration Successful!').then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Error response:', err);
        this.alertService.close();
        let errorMessage = 'Registration failed. Please check your input and try again.';
        
        // Check different error formats
        if (err.status === 400) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error && err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error && err.error.errors) {
            // Validation errors
            const errors = Object.values(err.error.errors);
            errorMessage = errors.join(', ');
          }
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        }
        
        this.alertService.error(errorMessage, 'Registration Failed');
      }
    });
  }
}
