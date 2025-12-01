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
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
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
  
  // Filters
  filterStatus: string = 'ALL';
  filterProductType: string = 'ALL';
  
  get uniqueProductTypes(): string[] {
    const types = this.shipments
      .map(s => s.productType?.name)
      .filter((type, index, self) => type && self.indexOf(type) === index) as string[];
    return types;
  }

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
    
    this.filteredShipments = this.shipments.filter(shipment => {
      const matchesSearch = shipment.id?.toString().includes(term) ||
                           shipment.origin?.toLowerCase().includes(term) ||
                           shipment.destination?.toLowerCase().includes(term) ||
                           shipment.productType?.name?.toLowerCase().includes(term) ||
                           shipment.trackingNumber?.toLowerCase().includes(term);
      
      const matchesStatus = this.filterStatus === 'ALL' || 
                           shipment.status === this.filterStatus;
      
      const matchesProductType = this.filterProductType === 'ALL' || 
                                 shipment.productType?.name === this.filterProductType;
      
      return matchesSearch && matchesStatus && matchesProductType;
    });
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
            this.alertService.success('Shipment deleted successfully!').then(() => {
              this.loadShipments();
            });
          },
          error: (err) => {
            console.error('Delete shipment error:', err);
            this.alertService.close();
            
            // Check if it's actually a success (status 200) but with text response
            if (err.status === 200 || err.status === 0) {
              this.alertService.success('Shipment deleted successfully!').then(() => {
                this.loadShipments();
              });
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

  copyTrackingNumber(trackingNumber: string) {
    navigator.clipboard.writeText(trackingNumber).then(() => {
      this.alertService.success('Tracking number copied to clipboard!');
    }).catch(() => {
      this.alertService.error('Failed to copy tracking number');
    });
  }
}
