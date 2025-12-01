import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { ShipmentService } from '../../services/shipment.service';
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
  showTrackingModal: boolean = false;
  trackingResult: any = null;
  isTrackingLoading: boolean = false;
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
    private alertService: AlertService,
    private shipmentService: ShipmentService
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

  openTrackingModal() {
    this.showTrackingModal = true;
  }

  closeTrackingModal() {
    this.showTrackingModal = false;
    this.trackingNumber = '';
    this.trackingResult = null;
  }

  trackShipment() {
    if (!this.trackingNumber || this.trackingNumber.trim() === '') {
      this.alertService.error('Please enter a tracking number', 'Tracking Number Required');
      return;
    }

    this.isTrackingLoading = true;
    this.trackingResult = null;

    // Call real API to track shipment
    this.shipmentService.trackShipment(this.trackingNumber.trim()).subscribe({
      next: (shipment: any) => {
        this.isTrackingLoading = false;
        
        // Build tracking history based on actual shipment status
        const history = this.buildTrackingHistory(shipment);
        
        this.trackingResult = {
          trackingNumber: shipment.trackingNumber || 'N/A',
          status: shipment.status || 'UNKNOWN',
          origin: shipment.origin || 'Unknown',
          destination: shipment.destination || 'Unknown',
          currentLocation: this.getCurrentLocation(
            shipment.status || 'UNKNOWN', 
            shipment.origin || 'Unknown', 
            shipment.destination || 'Unknown'
          ),
          estimatedDelivery: this.calculateEstimatedDelivery(shipment),
          customerName: shipment.user ? `${shipment.user.firstName} ${shipment.user.lastName}` : 'N/A',
          productType: shipment.productType?.name || 'N/A',
          weight: shipment.weight || 0,
          history: history
        };

        this.openTrackingModal();
      },
      error: (err: any) => {
        this.isTrackingLoading = false;
        let errorMessage = 'Tracking number not found. Please check and try again.';
        
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        this.alertService.error(errorMessage, 'Tracking Failed');
      }
    });
  }

  private buildTrackingHistory(shipment: any): any[] {
    const history: any[] = [];
    const requestDate = new Date(shipment.requestDate);
    const approvalDate = shipment.approvalDate ? new Date(shipment.approvalDate) : null;
    
    // APPROVED status - always show if status is APPROVED, IN_TRANSIT, or DELIVERED
    if (shipment.status === 'APPROVED' || shipment.status === 'IN_TRANSIT' || shipment.status === 'DELIVERED') {
      const dateToUse = approvalDate || new Date(requestDate.getTime() + 24 * 60 * 60 * 1000);
      history.push({
        date: this.formatDate(dateToUse),
        location: shipment.origin,
        status: 'APPROVED',
        time: this.formatTime(dateToUse),
        completed: true
      });
    }

    // IN_TRANSIT status - show if status is IN_TRANSIT or DELIVERED
    if (shipment.status === 'IN_TRANSIT' || shipment.status === 'DELIVERED') {
      const transitDate = approvalDate 
        ? new Date(approvalDate.getTime() + 24 * 60 * 60 * 1000)
        : new Date(requestDate.getTime() + 2 * 24 * 60 * 60 * 1000);
      history.push({
        date: this.formatDate(transitDate),
        location: 'En route to ' + shipment.destination,
        status: 'IN_TRANSIT',
        time: this.formatTime(transitDate),
        completed: true
      });
    }

    // DELIVERED status - show only if status is DELIVERED
    if (shipment.status === 'DELIVERED') {
      const deliveredDate = new Date(requestDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      history.push({
        date: this.formatDate(deliveredDate),
        location: shipment.destination,
        status: 'DELIVERED',
        time: this.formatTime(deliveredDate),
        completed: true
      });
    }

    // Add pending next step based on current status
    if (shipment.status === 'APPROVED') {
      history.push({
        date: 'Pending',
        location: 'Awaiting dispatch',
        status: 'IN_TRANSIT',
        time: '',
        completed: false
      });
      history.push({
        date: 'Pending',
        location: shipment.destination,
        status: 'DELIVERED',
        time: '',
        completed: false
      });
    } else if (shipment.status === 'IN_TRANSIT') {
      const estimatedDate = this.calculateEstimatedDelivery(shipment);
      history.push({
        date: 'Est: ' + estimatedDate,
        location: shipment.destination,
        status: 'DELIVERED',
        time: '',
        completed: false
      });
    }

    return history;
  }

  private calculateEstimatedDelivery(shipment: any): string {
    const requestDate = new Date(shipment.requestDate);
    const estimatedDate = new Date(requestDate.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days from request
    return this.formatDate(estimatedDate);
  }

  private getCurrentLocation(status: string, origin: string, destination: string): string {
    switch (status) {
      case 'APPROVED':
        return origin + ' - Package approved and ready for dispatch';
      case 'IN_TRANSIT':
        return 'In transit to ' + destination;
      case 'DELIVERED':
        return destination + ' - Package delivered successfully';
      default:
        return origin;
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  }

  handleCreateShipment() {
    console.log('🔵 Create Shipment clicked - Method called!');
    console.log('🔐 Is authenticated?', this.authService.isAuthenticated());
    console.log('🔑 Token:', localStorage.getItem('token'));
    
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      console.log('✅ User is authenticated, navigating to create-shipment');
      // User is logged in, redirect to create shipment page
      this.router.navigate(['/create-shipment']);
    } else {
      console.log('❌ User is NOT authenticated, showing alert and login modal');
      // User not logged in, show login modal with message
      this.alertService.info('Please login to create a shipment', 'Login Required').then((result) => {
        console.log('Alert closed, opening login modal');
        this.openLoginModal();
      });
    }
  }

  handleSchedulePickup() {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      // User is logged in, redirect to schedule pickup page
      this.router.navigate(['/schedule-pickup']);
    } else {
      // User not logged in, show login modal with message
      this.alertService.info('Please login to schedule a pickup', 'Login Required').then(() => {
        this.openLoginModal();
      });
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
