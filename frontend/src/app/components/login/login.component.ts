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
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-container">
            <i class="bi bi-box-seam logo-icon"></i>
          </div>
          <h2 class="text-center mb-2">Bangura Cargo System</h2>
          <p class="text-center" style="color: #010200ff">Sign in to your account</p>
        </div>
        
        <div class="login-body">
          <form (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-person-badge"></i> Login As
              </label>
              <select class="form-select form-select-lg" 
                      [(ngModel)]="selectedRole" 
                      name="role">
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">
                <i class="bi bi-envelope"></i> Email Address
              </label>
              <input type="email" 
                     class="form-control form-control-lg" 
                     [(ngModel)]="credentials.email" 
                     name="email" 
                     placeholder="Enter your email"
                     required>
            </div>

            <div class="mb-4">
              <label class="form-label">
                <i class="bi bi-lock"></i> Password
              </label>
              <input type="password" 
                     class="form-control form-control-lg" 
                     [(ngModel)]="credentials.password" 
                     name="password" 
                     placeholder="Enter your password"
                     required>
            </div>

            <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
              <i class="bi bi-box-arrow-in-right"></i> Sign In
            </button>

            <div class="text-center">
              <p class="mb-0">Don't have an account? 
                <a routerLink="/register" class="text-primary fw-bold">Register here</a>
              </p>
            </div>
          </form>

          <div class="demo-credentials mt-4">
            <p class="text-muted small mb-2"><i class="bi bi-info-circle"></i> NOTE:</p>
            <div class="credential-box">
              <strong>Be sure you choose your login level</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ccc799ff 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 450px;
      overflow: hidden;
    }

    .login-header {
      background: linear-gradient(135deg, #374ca0ff 100%);
      color: white;
      padding: 40px 30px 30px;
      text-align: center;
    }

    .logo-container {
      margin-bottom: 20px;
    }

    .logo-icon {
      font-size: 4rem;
      color: white;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .login-header h2 {
      color: white;
      font-weight: bold;
      margin: 0;
    }

    .login-body {
      padding: 40px 30px;
    }

    .form-label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 8px;
    }

    .form-label i {
      margin-right: 5px;
      color: #667eea;
    }

    .form-control, .form-select {
      border: 2px solid #e9ecef;
      border-radius: 10px;
      padding: 12px 15px;
      transition: all 0.3s;
    }

    .form-control:focus, .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 10px;
      padding: 12px;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .demo-credentials {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      border-left: 4px solid #667eea;
    }

    .credential-box {
      background: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 0.9rem;
      margin-top: 5px;
    }

    a {
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
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
