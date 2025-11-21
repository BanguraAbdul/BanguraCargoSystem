import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-create-shipment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css']
})
export class CreateShipmentComponent implements OnInit {
  shipmentForm!: FormGroup;
  productTypes = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Documents' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Food Items' }
  ];

  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.shipmentForm = this.fb.group({
      originCountry: ['', [Validators.required, Validators.minLength(2)]],
      originAddress: ['', [Validators.required, Validators.minLength(5)]],
      destinationCountry: ['', [Validators.required, Validators.minLength(2)]],
      destinationAddress: ['', [Validators.required, Validators.minLength(5)]],
      productTypeId: [1, Validators.required],
      weight: ['', [Validators.required, Validators.min(0.1), Validators.max(1000)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  get f() {
    return this.shipmentForm.controls;
  }

  onSubmit() {
    if (this.shipmentForm.invalid) {
      this.alertService.error('Please fill all required fields correctly', 'Validation Error');
      Object.keys(this.shipmentForm.controls).forEach(key => {
        this.shipmentForm.controls[key].markAsTouched();
      });
      return;
    }

    this.alertService.loading('Creating shipment...');
    this.shipmentService.createShipment(this.shipmentForm.value).subscribe({
      next: () => {
        this.alertService.close();
        this.alertService.success('Your shipment has been created successfully!', 'Success').then(() => {
          this.router.navigate(['/customer']);
        });
      },
      error: (err) => {
        this.alertService.close();
        this.alertService.error(err.error?.message || 'Failed to create shipment', 'Error');
      }
    });
  }

  calculateEstimate() {
    const weight = this.shipmentForm.get('weight')?.value;
    const quantity = this.shipmentForm.get('quantity')?.value;
    if (weight && quantity) {
      // Base rate: 50,000 SLL per kg
      const estimate = weight * quantity * 50000;
      return estimate.toLocaleString('en-SL');
    }
    return '0';
  }
}
