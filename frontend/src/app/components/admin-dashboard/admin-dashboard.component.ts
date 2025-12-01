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
  
  // Advanced filters
  filterCustomerStatus: string = 'ALL';
  filterUserRole: string = 'ALL';
  filterUserStatus: string = 'ALL';
  filterShipmentStatus: string = 'ALL';
  filterShipmentCustomer: string = '';
  
  // Edit User Modal
  showEditUserModal = false;
  editingUser: User = {
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    address: '',
    role: 'CUSTOMER',
    status: 'PENDING'
  };

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
    this.filteredPendingCustomers = this.pendingCustomers.filter(user => {
      const matchesSearch = user.firstName?.toLowerCase().includes(term) ||
                           user.lastName?.toLowerCase().includes(term) ||
                           user.email?.toLowerCase().includes(term) ||
                           user.contact?.includes(term);
      
      const matchesStatus = this.filterCustomerStatus === 'ALL' || 
                           user.status === this.filterCustomerStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  filterAllUsers() {
    const term = this.searchTermUsers.toLowerCase();
    this.filteredAllUsers = this.allUsers.filter(user => {
      const matchesSearch = user.firstName?.toLowerCase().includes(term) ||
                           user.lastName?.toLowerCase().includes(term) ||
                           user.email?.toLowerCase().includes(term) ||
                           user.contact?.includes(term) ||
                           user.role?.toLowerCase().includes(term);
      
      const matchesRole = this.filterUserRole === 'ALL' || 
                         user.role === this.filterUserRole;
      
      const matchesStatus = this.filterUserStatus === 'ALL' || 
                           user.status === this.filterUserStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  filterShipments() {
    const term = this.searchTermShipments.toLowerCase();
    const customerTerm = this.filterShipmentCustomer.toLowerCase();
    
    this.filteredShipments = this.shipments.filter(shipment => {
      const matchesSearch = shipment.id?.toString().includes(term) ||
                           shipment.origin?.toLowerCase().includes(term) ||
                           shipment.destination?.toLowerCase().includes(term) ||
                           shipment.trackingNumber?.toLowerCase().includes(term);
      
      const matchesStatus = this.filterShipmentStatus === 'ALL' || 
                           shipment.status === this.filterShipmentStatus;
      
      const matchesCustomer = !customerTerm || 
                             shipment.user?.firstName?.toLowerCase().includes(customerTerm) ||
                             shipment.user?.lastName?.toLowerCase().includes(customerTerm) ||
                             shipment.user?.email?.toLowerCase().includes(customerTerm);
      
      return matchesSearch && matchesStatus && matchesCustomer;
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
        this.userService.deleteUser(userId).subscribe({
          next: (response) => {
            console.log('Delete user response:', response);
            this.alertService.close();
            this.alertService.success('User deleted successfully!').then(() => {
              this.loadData();
            });
          },
          error: (err) => {
            console.error('Delete user error:', err);
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

  editUser(user: User) {
    // Create a copy of the user to edit
    this.editingUser = { ...user };
    this.showEditUserModal = true;
  }

  closeEditUserModal() {
    this.showEditUserModal = false;
    this.editingUser = {
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      address: '',
      role: 'CUSTOMER',
      status: 'PENDING'
    };
  }

  saveUserChanges() {
    if (!this.editingUser.id) {
      this.alertService.error('Invalid user ID');
      return;
    }

    // Validate required fields
    if (!this.editingUser.firstName || !this.editingUser.lastName || 
        !this.editingUser.email || !this.editingUser.contact) {
      this.alertService.error('Please fill in all required fields');
      return;
    }

    this.alertService.loading('Updating user...');
    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: () => {
        this.alertService.close();
        this.alertService.success('User updated successfully!').then(() => {
          this.closeEditUserModal();
          this.loadData();
        });
      },
      error: (err) => {
        this.alertService.close();
        let errorMessage = 'Failed to update user';
        if (typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        this.alertService.error(errorMessage);
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
          next: (response) => {
            console.log('Delete shipment response:', response);
            this.alertService.close();
            this.alertService.success('Shipment deleted successfully!').then(() => {
              this.loadData();
            });
          },
          error: (err) => {
            this.alertService.close();
            console.error('Full delete error:', err);
            console.error('Error status:', err.status);
            console.error('Error error:', err.error);
            
            // Check if it's actually a success (status 200) but Angular thinks it's an error
            if (err.status === 200 || err.status === 0) {
              this.alertService.success('Shipment deleted successfully!').then(() => {
                this.loadData();
              });
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
