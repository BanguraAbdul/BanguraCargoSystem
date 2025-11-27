import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';
import { User } from '../../models/user.model';
import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})


    export class AdminDashboardComponent implements OnInit {
  navLinks = [
    { path: '/', label: 'Home', icon: 'bi bi-house-door' },
    { path: '/admin', label: 'Dashboard', icon: 'bi bi-speedometer2' }
  ];

  activeTab = 'customers';
  pendingCustomers: User[] = [];
  filteredPendingCustomers: User[] = [];
  allUsers: User[] = [];
  filteredAllUsers: User[] = [];
  shipments: Shipment[] = [];
  filteredShipments: Shipment[] = [];
  searchTermCustomers: string = '';
  searchTermUsers: string = '';
  searchTermShipments: string = '';

  get deliveredCount(): number {
    return this.shipments.filter(s => s.status === 'DELIVERED').length;
  }

  constructor(
    private userService: UserService,
    private shipmentService: ShipmentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getPendingCustomers().subscribe(users => {
      this.pendingCustomers = users;
      this.filteredPendingCustomers = users;
    });
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users;
      this.filteredAllUsers = users;
    });
    this.shipmentService.getAllShipments().subscribe(shipments => {
      this.shipments = shipments;
      this.filteredShipments = shipments;
    });
  }

  filterPendingCustomers() {
    const term = this.searchTermCustomers.toLowerCase();
    this.filteredPendingCustomers = this.pendingCustomers.filter(user =>
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.contact?.includes(term)
    );
  }

  filterAllUsers() {
    const term = this.searchTermUsers.toLowerCase();
    this.filteredAllUsers = this.allUsers.filter(user =>
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.contact?.includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  }

  filterShipments() {
    const term = this.searchTermShipments.toLowerCase();
    this.filteredShipments = this.shipments.filter(shipment =>
      shipment.id?.toString().includes(term) ||
      shipment.origin?.toLowerCase().includes(term) ||
      shipment.destination?.toLowerCase().includes(term) ||
      shipment.status?.toLowerCase().includes(term) ||
      shipment.trackingNumber?.toLowerCase().includes(term) ||
      shipment.user?.email?.toLowerCase().includes(term)
    );
  }

  approveCustomer(userId: number) {
    this.alertService.confirm('This will approve the customer account.', 'Approve Customer?').then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Approving customer...');
        this.userService.approveUser(userId).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.success('Customer approved successfully!');
            this.loadData();
          },
          error: () => {
            this.alertService.close();
            this.alertService.error('Failed to approve customer');
          }
        });
      }
    });
  }

  deleteUser(userId: number) {
    this.alertService.confirm('This action cannot be undone!', 'Delete User?').then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Deleting user...');
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.success('User deleted successfully!');
            this.loadData();
          },
          error: () => {
            this.alertService.close();
            this.alertService.error('Failed to delete user');
          }
        });
      }
    });
  }

  approveShipment(shipmentId: number) {
    this.alertService.confirm('This will approve the shipment.', 'Approve Shipment?').then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Approving shipment...');
        this.shipmentService.approveShipment(shipmentId).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.success('Shipment approved successfully!');
            this.loadData();
          },
          error: () => {
            this.alertService.close();
            this.alertService.error('Failed to approve shipment');
          }
        });
      }
    });
  }

  updateShipmentStatus(shipmentId: number, event: any) {
    const status = event.target.value;
    this.alertService.loading('Updating shipment status...');
    this.shipmentService.updateShipmentStatus(shipmentId, status).subscribe({
      next: () => {
        this.alertService.close();
        this.alertService.success('Shipment status updated!');
        this.loadData();
      },
      error: () => {
        this.alertService.close();
        this.alertService.error('Failed to update status');
      }
    });
  }

  deleteShipment(shipmentId: number) {
    this.alertService.confirm('This action cannot be undone!', 'Delete Shipment?').then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Deleting shipment...');
        this.shipmentService.deleteShipment(shipmentId).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.success('Shipment deleted successfully!');
            this.loadData();
          },
          error: (err) => {
            this.alertService.close();
            console.error('Full delete error:', err);
            console.error('Error status:', err.status);
            console.error('Error error:', err.error);
            
            // Check if it's actually a success (status 200) but Angular thinks it's an error
            if (err.status === 200 || err.status === 0) {
              this.alertService.success('Shipment deleted successfully!');
              this.loadData();
              return;
            }
            
            // Extract error message
            let errorMessage = 'Failed to delete shipment';
            if (err.error && err.error.message) {
              errorMessage = err.error.message;
            } else if (err.message) {
              errorMessage = err.message;
            }
            
            this.alertService.error(errorMessage);
          }
        });
      }
    });
  }
}
