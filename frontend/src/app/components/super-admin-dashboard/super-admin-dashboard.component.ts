import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar [navLinks]="navLinks"></app-navbar>
    
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-12">
          <h2 class="mb-4">
            <i class="bi bi-shield-check"></i> Super Admin Dashboard
          </h2>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card text-white bg-info">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-people"></i> Total Users
              </h5>
              <h2>{{ allUsers.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-warning">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-clock-history"></i> Pending Admins
              </h5>
              <h2>{{ pendingAdmins.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-white bg-success">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-check-circle"></i> Approved Users
              </h5>
              <h2>{{ approvedCount }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'pending'" 
             (click)="activeTab = 'pending'" style="cursor: pointer;">
            <i class="bi bi-hourglass-split"></i> Pending Admins ({{ pendingAdmins.length }})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'all'" 
             (click)="activeTab = 'all'" style="cursor: pointer;">
            <i class="bi bi-people"></i> All Users ({{ allUsers.length }})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'customers'" 
             (click)="activeTab = 'customers'" style="cursor: pointer;">
            <i class="bi bi-person"></i> Pending Customers ({{ pendingCustomers.length }})
          </a>
        </li>
      </ul>

      <!-- Pending Admins Tab -->
      <div *ngIf="activeTab === 'pending'">
        <div class="card">
          <div class="card-header bg-warning text-white">
            <h5 class="mb-0">
              <i class="bi bi-person-badge"></i> Pending Admin Approvals
            </h5>
          </div>
          <div class="card-body">
            <div *ngIf="pendingAdmins.length === 0" class="alert alert-info">
              <i class="bi bi-info-circle"></i> No pending admin approvals
            </div>
            <div class="table-responsive" *ngIf="pendingAdmins.length > 0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of pendingAdmins">
                    <td>{{ user.firstName }} {{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.contact }}</td>
                    <td><span class="badge bg-primary">{{ user.role }}</span></td>
                    <td><span class="badge bg-warning">{{ user.status }}</span></td>
                    <td>
                      <button class="btn btn-success btn-sm me-2" 
                              (click)="approveAdmin(user.id!)"
                              title="Approve admin">
                        <i class="bi bi-check-circle"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" 
                              (click)="deleteUser(user.id!)"
                              title="Delete admin">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Customers Tab -->
      <div *ngIf="activeTab === 'customers'">
        <div class="card">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">
              <i class="bi bi-person"></i> Pending Customer Approvals
            </h5>
          </div>
          <div class="card-body">
            <div *ngIf="pendingCustomers.length === 0" class="alert alert-info">
              <i class="bi bi-info-circle"></i> No pending customer approvals
            </div>
            <div class="table-responsive" *ngIf="pendingCustomers.length > 0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of pendingCustomers">
                    <td>{{ user.firstName }} {{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.contact }}</td>
                    <td>{{ user.address }}</td>
                    <td><span class="badge bg-warning">{{ user.status }}</span></td>
                    <td>
                      <button class="btn btn-success btn-sm me-2" 
                              (click)="approveCustomer(user.id!)"
                              title="Approve customer">
                        <i class="bi bi-check-circle"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" 
                              (click)="deleteUser(user.id!)"
                              title="Delete customer">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- All Users Tab -->
      <div *ngIf="activeTab === 'all'">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-people"></i> All Users
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of allUsers">
                    <td>{{ user.firstName }} {{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.contact }}</td>
                    <td><span class="badge bg-primary">{{ user.role }}</span></td>
                    <td>
                      <span class="badge" 
                            [class.bg-success]="user.status === 'APPROVED'"
                            [class.bg-warning]="user.status === 'PENDING'"
                            [class.bg-danger]="user.status === 'DELETED'">
                        {{ user.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-danger btn-sm" 
                              (click)="deleteUser(user.id!)"
                              *ngIf="user.role !== 'SUPER_ADMIN'"
                              title="Delete user">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .table {
      margin-bottom: 0;
    }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {
  navLinks = [
    { path: '/', label: 'Home', icon: 'bi bi-house-door' },
    { path: '/super-admin', label: 'Dashboard', icon: 'bi bi-speedometer2' }
  ];

  activeTab = 'pending';
  pendingAdmins: User[] = [];
  pendingCustomers: User[] = [];
  allUsers: User[] = [];

  get approvedCount(): number {
    return this.allUsers.filter(u => u.status === 'APPROVED').length;
  }

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.userService.getPendingAdmins().subscribe(users => this.pendingAdmins = users);
    this.userService.getPendingCustomers().subscribe(users => this.pendingCustomers = users);
    this.userService.getAllUsersSuperAdmin().subscribe(users => this.allUsers = users);
  }

  approveAdmin(userId: number) {
    this.alertService.confirm('This will approve the admin account.', 'Approve Admin?').then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Approving admin...');
        this.userService.approveAdmin(userId).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.success('Admin approved successfully!');
            this.loadData();
          },
          error: () => {
            this.alertService.close();
            this.alertService.error('Failed to approve admin');
          }
        });
      }
    });
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
        this.userService.deleteSuperAdminUser(userId).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.success('User deleted successfully!');
            this.loadData();
          },
          error: (err) => {
            this.alertService.close();
            this.alertService.error(err.error?.message || 'Failed to delete user');
          }
        });
      }
    });
  }
}
