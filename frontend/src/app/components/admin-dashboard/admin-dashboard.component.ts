import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';
import { User } from '../../models/user.model';
import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})


    export class AdminDashboardComponent implements OnInit {
  navLinks = [
    { path: '/admin', label: 'Dashboard', icon: 'bi bi-speedometer2' }
  ];

  activeTab = 'customers';
  pendingCustomers: User[] = [];
  allUsers: User[] = [];
  shipments: Shipment[] = [];

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
    this.userService.getPendingCustomers().subscribe(users => this.pendingCustomers = users);
    this.userService.getAllUsers().subscribe(users => this.allUsers = users);
    this.shipmentService.getAllShipments().subscribe(shipments => this.shipments = shipments);
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
          error: () => {
            this.alertService.close();
            this.alertService.error('Failed to delete shipment');
          }
        });
      }
    });
  }
}
