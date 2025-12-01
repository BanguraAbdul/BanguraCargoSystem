import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
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
