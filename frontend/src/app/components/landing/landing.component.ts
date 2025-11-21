import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  trackingNumber: string = '';

  constructor(private router: Router) {}

  openLoginModal() {
    // TODO: Implement modal
    this.router.navigate(['/login']);
  }

  openRegisterModal() {
    // TODO: Implement modal
    this.router.navigate(['/register']);
  }

  trackShipment() {
    if (this.trackingNumber) {
      this.router.navigate(['/tracking'], { queryParams: { number: this.trackingNumber } });
    }
  }
}
