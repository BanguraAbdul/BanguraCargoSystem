import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';
import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
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

      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'shipments'" 
             (click)="activeTab = 'shipments'" style="cursor: pointer;">
            <i class="bi bi-box"></i> My Shipments
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" [class.active]="activeTab === 'create'" 
             (click)="activeTab = 'create'" style="cursor: pointer;">
            <i class="bi bi-plus-circle"></i> Create Shipment
          </a>
        </li>
      </ul>

      <!-- My Shipments -->
      <div *ngIf="activeTab === 'shipments'" class="card">
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
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let shipment of shipments">
                  <td><strong>#{{ shipment.id }}</strong></td>
                  <td>{{ shipment.originCountry }}</td>
                  <td>{{ shipment.destinationCountry }}</td>
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
                  <td>{{ shipment.createdAt | date:'short' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Create Shipment -->
      <div *ngIf="activeTab === 'create'" class="card">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0"><i class="bi bi-plus-circle"></i> Create New Shipment</h5>
        </div>
        <div class="card-body">
          <form (ngSubmit)="createShipment()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Origin Country</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="newShipment.originCountry" 
                       name="originCountry" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Destination Country</label>
                <input type="text" class="form-control" 
                       [(ngModel)]="newShipment.destinationCountry" 
                       name="destinationCountry" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Origin Address</label>
                <textarea class="form-control" 
                          [(ngModel)]="newShipment.originAddress" 
                          name="originAddress" required></textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Destination Address</label>
                <textarea class="form-control" 
                          [(ngModel)]="newShipment.destinationAddress" 
                          name="destinationAddress" required></textarea>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">Product Type ID</label>
                <input type="number" class="form-control" 
                       [(ngModel)]="newShipment.productTypeId" 
                       name="productTypeId" required>
                <small class="text-muted">1=Electronics, 2=Documents, 3=Clothing, 4=Food</small>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Weight (kg)</label>
                <input type="number" class="form-control" 
                       [(ngModel)]="newShipment.weight" 
                       name="weight" step="0.1" required>
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">Quantity</label>
                <input type="number" class="form-control" 
                       [(ngModel)]="newShipment.quantity" 
                       name="quantity" required>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" 
                        [(ngModel)]="newShipment.description" 
                        name="description" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-success">
              <i class="bi bi-plus-circle"></i> Create Shipment
            </button>
          </form>
        </div>
      </div>


    </div>
  `
})
export class CustomerDashboardComponent implements OnInit {
  navLinks = [
    { path: '/customer', label: 'Dashboard', icon: 'bi bi-speedometer2' }
  ];

  activeTab = 'shipments';
  shipments: Shipment[] = [];
  newShipment: any = {
    originCountry: '',
    destinationCountry: '',
    originAddress: '',
    destinationAddress: '',
    productTypeId: 1,
    weight: 0,
    quantity: 1,
    description: ''
  };

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
    private alertService: AlertService
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

  createShipment() {
    this.alertService.loading('Creating shipment...');
    this.shipmentService.createShipment(this.newShipment).subscribe({
      next: () => {
        this.alertService.close();
        this.alertService.success('Your shipment has been created and is pending approval!', 'Shipment Created!').then(() => {
          this.activeTab = 'shipments';
          this.loadShipments();
          this.resetForm();
        });
      },
      error: (err) => {
        this.alertService.close();
        const errorMessage = err.error?.message || 'Failed to create shipment';
        this.alertService.error(errorMessage);
      }
    });
  }

  resetForm() {
    this.newShipment = {
      originCountry: '',
      destinationCountry: '',
      originAddress: '',
      destinationAddress: '',
      productTypeId: 1,
      weight: 0,
      quantity: 1,
      description: ''
    };
  }
}
