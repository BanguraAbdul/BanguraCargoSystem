import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../navbar/navbar.component';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';
import { Shipment } from '../../models/shipment.model';

@Pipe({
  name: 'sanitizeUrl',
  standalone: true
})
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule, SanitizeUrlPipe],
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
        <button class="btn btn-success btn-lg" (click)="openCreateModal()">
          <i class="bi bi-plus-circle"></i> Create New Shipment
        </button>
      </div>

      <!-- My Shipments -->
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0"><i class="bi bi-box-seam"></i> My Shipments</h5>
        </div>
        <div class="card-body">
          <div class="mb-3" *ngIf="shipments.length > 0">
            <input type="text" 
                   class="form-control" 
                   [(ngModel)]="searchTerm" 
                   (ngModelChange)="filterShipments()"
                   placeholder="🔍 Search shipments by ID, origin, destination, status, or tracking number...">
          </div>
          <div *ngIf="shipments.length === 0" class="alert alert-info">
            <i class="bi bi-info-circle"></i> You don't have any shipments yet. Create one to get started!
          </div>
          <div *ngIf="filteredShipments.length === 0 && shipments.length > 0" class="alert alert-warning">
            <i class="bi bi-search"></i> No shipments match your search.
          </div>
          <div class="table-responsive" *ngIf="filteredShipments.length > 0">
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
                <tr *ngFor="let shipment of filteredShipments">
                  <td><strong>{{ shipment.id }}</strong></td>
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

    <!-- Create Shipment Modal -->
    <div class="modal fade" [class.show]="showCreateModal" [style.display]="showCreateModal ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title"><i class="bi bi-plus-circle"></i> Create New Shipment</h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeCreateModal()"></button>
          </div>
          <div class="modal-body">
            <iframe [src]="'/create-shipment' | sanitizeUrl" 
                    style="width: 100%; height: 70vh; border: none;"
                    (load)="onIframeLoad($event)"></iframe>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="showCreateModal" *ngIf="showCreateModal" (click)="closeCreateModal()"></div>

    <!-- Edit Shipment Modal -->
    <div class="modal fade" [class.show]="showEditModal" [style.display]="showEditModal ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title"><i class="bi bi-pencil"></i> Edit Shipment</h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeEditModal()"></button>
          </div>
          <div class="modal-body">
            <iframe [src]="('/edit-shipment/' + selectedShipmentId) | sanitizeUrl" 
                    style="width: 100%; height: 70vh; border: none;"
                    *ngIf="selectedShipmentId"
                    (load)="onIframeLoad($event)"></iframe>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade" [class.show]="showEditModal" *ngIf="showEditModal" (click)="closeEditModal()"></div>
  `
})
export class CustomerDashboardComponent implements OnInit {
  navLinks = [
    { path: '/', label: 'Home', icon: 'bi bi-house-door' },
    { path: '/customer', label: 'Dashboard', icon: 'bi bi-speedometer2' }
  ];

  shipments: Shipment[] = [];
  filteredShipments: Shipment[] = [];
  searchTerm: string = '';
  showCreateModal = false;
  showEditModal = false;
  selectedShipmentId: number | null = null;

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
      next: (shipments) => {
        this.shipments = shipments;
        this.filteredShipments = shipments;
      },
      error: () => this.alertService.error('Failed to load shipments')
    });
  }

  filterShipments() {
    const term = this.searchTerm.toLowerCase();
    this.filteredShipments = this.shipments.filter(shipment =>
      shipment.id?.toString().includes(term) ||
      shipment.origin?.toLowerCase().includes(term) ||
      shipment.destination?.toLowerCase().includes(term) ||
      shipment.status?.toLowerCase().includes(term) ||
      shipment.productType?.name?.toLowerCase().includes(term) ||
      shipment.trackingNumber?.toLowerCase().includes(term)
    );
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.loadShipments(); // Refresh list after creating
  }

  openEditModal(shipmentId: number) {
    this.selectedShipmentId = shipmentId;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedShipmentId = null;
    this.loadShipments(); // Refresh list after editing
  }

  editShipment(shipmentId: number) {
    this.openEditModal(shipmentId);
  }

  onIframeLoad(event: any) {
    // Listen for messages from iframe to close modal after successful submission
    window.addEventListener('message', (e) => {
      if (e.data === 'shipment-created' || e.data === 'shipment-updated') {
        this.closeCreateModal();
        this.closeEditModal();
      }
    });
  }

  deleteShipment(shipmentId: number) {
    this.alertService.confirm('This action cannot be undone!', 'Delete Shipment?').then((result) => {
      if (result.isConfirmed) {
        this.alertService.loading('Deleting shipment...');
        this.shipmentService.deleteCustomerShipment(shipmentId).subscribe({
          next: (response) => {
            console.log('Delete shipment response:', response);
            this.alertService.close();
            this.alertService.success('Shipment deleted successfully!');
            this.loadShipments();
          },
          error: (err) => {
            console.error('Delete shipment error:', err);
            this.alertService.close();
            
            // Check if it's actually a success (status 200) but with text response
            if (err.status === 200 || err.status === 0) {
              this.alertService.success('Shipment deleted successfully!');
              this.loadShipments();
            } else {
              let errorMessage = 'Failed to delete shipment';
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
