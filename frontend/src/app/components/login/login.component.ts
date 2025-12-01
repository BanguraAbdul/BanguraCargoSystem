import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  selectedRole = 'SUPER_ADMIN';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertService: AlertService
  ) {}

  onSubmit() {
    this.alertService.loading('Signing in...');
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.alertService.close();
        
        if (response.role !== this.selectedRole) {
          this.alertService.warning(
            `You selected ${this.selectedRole} but your account is ${response.role}. Please select the correct role.`,
            'Role Mismatch'
          );
          return;
        }

        this.alertService.success('Login successful!', 'Welcome to Bangura Cargo System!').then(() => {
          if (response.role === 'CUSTOMER') {
            this.router.navigate(['/customer']);
          } else if (response.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (response.role === 'SUPER_ADMIN') {
            this.router.navigate(['/super-admin']);
          } else {
            this.router.navigate(['/customer']);
          }
        });
      },
      error: (err) => {
        this.alertService.close();
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        
        this.alertService.error(errorMessage, 'Login Failed');
      }
    });
  }
}
