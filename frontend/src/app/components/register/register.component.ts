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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
