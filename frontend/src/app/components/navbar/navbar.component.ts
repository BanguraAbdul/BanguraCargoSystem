import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-box-seam"></i> Bangura Cargo System
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" *ngFor="let link of navLinks">
              <a class="nav-link" [routerLink]="link.path" routerLinkActive="active">
                <i [class]="link.icon"></i> {{ link.label }}
              </a>
            </li>
          </ul>
          <div class="d-flex align-items-center text-white">
            <span class="me-3">
              <i class="bi bi-person-circle"></i> {{ userEmail }}
              <span class="badge bg-light text-primary ms-2">{{ userRole }}</span>
            </span>
            <button class="btn btn-outline-light btn-sm" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
      font-size: 1.3rem;
    }
    .nav-link {
      font-weight: 500;
    }
    .nav-link.active {
      background-color: rgba(255,255,255,0.1);
      border-radius: 5px;
    }
  `]
})
export class NavbarComponent {
  @Input() navLinks: Array<{path: string, label: string, icon: string}> = [];
  userEmail: string = '';
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.userRole = user.role;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
