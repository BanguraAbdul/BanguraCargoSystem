import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';
import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  template: `
    <app-navbar [navLinks]="navLinks"></app-navbar>
    
    <div class="container mt-4">
      <h2 class="mb-4">
        <i class="bi bi-person"></i> Customer Dashboard
      </h2>

      <!-- Stats -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h5><i class="bi bi-box-seam"></i> Total Shipments</h5>
              <h2>{{ shipments.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-warning">
            <div class="card-body">
              <h5><i class="bi bi-clock"></i> Pending</h5>
              <h2>{{ pendingCount }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-info">
            <div class="card-body">
              <h5><i class="bi bi-truck"></i> In Transit</h5>
              <h2>{{ inTransitCount }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-white bg-success">
            <div class="card-body">
              <h5><i class="bi bi-check-circle"></i> Delivered</h5>
              <h2>{{ deliveredCount }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mb-4">
        <button class="btn btn-success btn-lg" routerLink="/create-shipment">
          <i class="bi bi-plus-circle"></i> Create New Shipment
        </button>
      </div>

      <!-- My Shipments -->
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="bi bi-box-seam"></i> My Shipments</h5>
        </div>
        <div class="card-body">
          <div *ngIf="shipments.length === 0" class="alert alert-info">
            <i class="bi bi-info-circle"></i> You don't have any shipments yet. Create one to get started!
          </div>
          <div class="table-responsive" *ngIf="shipments.length > 0">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Product Type</th>
                  <th>Weight (kg)</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let shipment of shipments">
                  <td><strong>#{{ shipment.id }}</strong></td>
                  <td>{{ shipment.origin }}</td>
                  <td>{{ shipment.destination }}</td>
                  <td>{{ shipment.productType?.name }}</td>
                  <td>{{ shipment.weight }}</td>
                  <td>
                    <span class="badge" 
                          [class.bg-warning]="shipment.status === 'REQUESTED'"
                          [class.bg-info]="shipment.status === 'APPROVED'"
                          [class.bg-primary]="shipment.status === 'IN_TRANSIT'"
                          [class.bg-success]="shipment.status === 'DELIVERED'">
                      {{ shipment.status }}
                    </span>
                  </td>
                  <td>{{ shipment.requestDate | date:'short' }}</td>
                  <td>
                    <button class="btn btn-primary btn-sm me-1" 
                            (click)="editShipment(shipment.id!)"
                            [disabled]="shipment.status !== 'REQUESTED'"
                            [title]="shipment.status !== 'REQUESTED' ? 'Can only edit shipments in REQUESTED status' : 'Edit shipment'">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" 
                            (click)="deleteShipment(shipment.id!)"
                            [disabled]="shipment.status !== 'REQUESTED'"
                            [title]="shipment.status !== 'REQUESTED' ? 'Can only delete shipments in REQUESTED status' : 'Delete shipment'">
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
  `
})
export class CustomerDashboardComponent implements OnInit {
  navLinks = [
    { path: '/', label: 'Home', icon: 'bi bi-house-door' },
    { path: '/customer', label: 'Dashboard', icon: 'bi bi-speedometer2' }
  ];

  shipments: Shipment[] = [];

  get pendingCount(): number {
    return this.shipments.filter(s => s.status === 'REQUESTED').length;
  }

  get inTransitCount(): number {
    return this.shipments.filter(s => s.status === 'IN_TRANSIT').length;
  }

  get deliveredCount(): number {
    return this.shipments.filter(s => s.status === 'DELIVERED').length;
  }

  constructor(
    private shipmentService: ShipmentService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadShipments();
  }

  loadShipments() {
    this.shipmentService.getCustomerShipments().subscribe({
      next: (shipments) => this.shipments = shipments,
      error: () => this.alertService.error('Failed to load shipments')
    });
  }

  editShipment(shipmentId: number) {
    // Navigate to edit page (we'll create this)
    this.router.navigate(['/edit-shipment', shipmentId]);
  }

  deleteShipment(shipmentId: number) {
    this.alertService.confirm('This action cannot be undone!', 'Delete Shipment?').then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Deleting shipment...');
        this.shipmentService.deleteCustomerShipment(shipmentId).subscribe({
          next: () => {
            this.alertService.close();
            this.alertService.success('Shipment deleted successfully!');
            this.loadShipments();
          },
          error: (err) => {
            this.alertService.close();
            this.alertService.error(err.error?.message || 'Failed to delete shipment');
          }
        });
      }
    });
  }
}
