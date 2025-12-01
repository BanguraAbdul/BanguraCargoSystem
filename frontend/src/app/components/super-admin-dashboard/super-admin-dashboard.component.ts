import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  navLinks = [
    { path: '/', label: 'Home', icon: 'bi bi-house-door' },
    { path: '/super-admin', label: 'Dashboard', icon: 'bi bi-speedometer2' }
  ];

  activeTab = 'pending';
  pendingAdmins: User[] = [];
  filteredPendingAdmins: User[] = [];
  pendingCustomers: User[] = [];
  filteredPendingCustomers: User[] = [];
  allUsers: User[] = [];
  filteredAllUsers: User[] = [];
  searchTermAdmins: string = '';
  searchTermCustomers: string = '';
  searchTermAllUsers: string = '';
  
  // Filters
  filterAdminRole: string = 'ALL';
  filterAllUsersRole: string = 'ALL';
  filterAllUsersStatus: string = 'ALL';

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
    this.userService.getPendingAdmins().subscribe(users => {
      this.pendingAdmins = users;
      this.filteredPendingAdmins = users;
    });
    this.userService.getPendingCustomers().subscribe(users => {
      this.pendingCustomers = users;
      this.filteredPendingCustomers = users;
    });
    this.userService.getAllUsersSuperAdmin().subscribe(users => {
      this.allUsers = users;
      this.filteredAllUsers = users;
    });
  }

  filterPendingAdmins() {
    const term = this.searchTermAdmins.toLowerCase();
    this.filteredPendingAdmins = this.pendingAdmins.filter(user => {
      const matchesSearch = user.firstName?.toLowerCase().includes(term) ||
                           user.lastName?.toLowerCase().includes(term) ||
                           user.email?.toLowerCase().includes(term) ||
                           user.contact?.includes(term) ||
                           user.role?.toLowerCase().includes(term);
      
      const matchesRole = this.filterAdminRole === 'ALL' || 
                         user.role === this.filterAdminRole;
      
      return matchesSearch && matchesRole;
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
    const term = this.searchTermAllUsers.toLowerCase();
    this.filteredAllUsers = this.allUsers.filter(user => {
      const matchesSearch = user.firstName?.toLowerCase().includes(term) ||
                           user.lastName?.toLowerCase().includes(term) ||
                           user.email?.toLowerCase().includes(term) ||
                           user.contact?.includes(term) ||
                           user.role?.toLowerCase().includes(term);
      
      const matchesRole = this.filterAllUsersRole === 'ALL' || 
                         user.role === this.filterAllUsersRole;
      
      const matchesStatus = this.filterAllUsersStatus === 'ALL' || 
                           user.status === this.filterAllUsersStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
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
          next: (response) => {
            console.log('Delete response:', response);
            this.alertService.close();
            this.alertService.success('User deleted successfully!').then(() => {
              this.loadData();
            });
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.alertService.close();
            
            // Check if it's actually a success (status 200) but with text response
            if (err.status === 200 || err.status === 0) {
              this.alertService.success('User deleted successfully!').then(() => {
                this.loadData();
              });
            } else {
              let errorMessage = 'Failed to delete user';
              if (typeof err.error === 'string') {
                errorMessage = err.error;
              } else if (err.error?.message) {
                errorMessage = err.error.message;
              }
              this.alertService.error(errorMessage);
            }
          }
        });
      }
    });
  }
}
