import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-create-shipment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-shipment.component.html',
  styleUrls: ['./create-shipment.component.css']
})
export class CreateShipmentComponent implements OnInit {
  shipmentForm!: FormGroup;
  submitted = false;
  
  productTypes = [
    { id: 1, name: 'Electronics', description: 'Phones, laptops, gadgets' },
    { id: 2, name: 'Documents', description: 'Papers, certificates, files' },
    { id: 3, name: 'Clothing', description: 'Clothes, shoes, accessories' },
    { id: 4, name: 'Food Items', description: 'Non-perishable food items' }
  ];

  countries = [
    'Sierra Leone', 'United States', 'United Kingdom', 'Canada', 'Germany', 
    'France', 'Ghana', 'Nigeria', 'South Africa', 'China', 'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.shipmentForm = this.fb.group({
      // Sender Information
      senderName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      senderPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      senderEmail: ['', [Validators.required, Validators.email]],
      
      // Origin Information
      originCountry: ['', [Validators.required]],
      originCity: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      originAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      originPostalCode: ['', [Validators.maxLength(20)]],
      
      // Recipient Information
      recipientName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      recipientPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      recipientEmail: ['', [Validators.email]],
      
      // Destination Information
      destinationCountry: ['', [Validators.required]],
      destinationCity: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      destinationAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      destinationPostalCode: ['', [Validators.maxLength(20)]],
      
      // Package Details
      productTypeId: [1, [Validators.required]],
      weight: ['', [Validators.required, Validators.min(0.1), Validators.max(500)]],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      
      // Dimensions (optional but recommended)
      length: ['', [Validators.min(1), Validators.max(300)]],
      width: ['', [Validators.min(1), Validators.max(300)]],
      height: ['', [Validators.min(1), Validators.max(300)]],
      
      // Additional Information
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      declaredValue: ['', [Validators.min(0), Validators.max(1000000)]],
      insurance: [false],
      fragile: [false],
      specialInstructions: ['', [Validators.maxLength(300)]]
    });
  }

  get f() {
    return this.shipmentForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.shipmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.shipmentForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
    if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} characters allowed`;
    if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
    if (field.errors['max']) return `Maximum value is ${field.errors['max'].max}`;
    if (field.errors['email']) return 'Invalid email format';
    if (field.errors['pattern']) return 'Invalid format';
    
    return 'Invalid value';
  }

  onSubmit() {
    this.submitted = true;

    if (this.shipmentForm.invalid) {
      this.alertService.error('Please fill all required fields correctly', 'Validation Error');
      
      // Mark all fields as touched to show errors
      Object.keys(this.shipmentForm.controls).forEach(key => {
        this.shipmentForm.controls[key].markAsTouched();
      });
      
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    // Prepare data for backend
    const formData = {
      originCountry: this.shipmentForm.value.originCountry,
      destinationCountry: this.shipmentForm.value.destinationCountry,
      originAddress: `${this.shipmentForm.value.originAddress}, ${this.shipmentForm.value.originCity}, ${this.shipmentForm.value.originCountry}`,
      destinationAddress: `${this.shipmentForm.value.destinationAddress}, ${this.shipmentForm.value.destinationCity}, ${this.shipmentForm.value.destinationCountry}`,
      productTypeId: this.shipmentForm.value.productTypeId,
      weight: this.shipmentForm.value.weight,
      quantity: this.shipmentForm.value.quantity,
      description: this.shipmentForm.value.description
    };

    this.alertService.loading('Creating shipment...');
    this.shipmentService.createShipment(formData).subscribe({
      next: () => {
        this.alertService.close();
        this.alertService.success('Your shipment has been created successfully and is pending approval!', 'Success').then(() => {
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
    const weight = this.shipmentForm.get('weight')?.value || 0;
    const quantity = this.shipmentForm.get('quantity')?.value || 0;
    const insurance = this.shipmentForm.get('insurance')?.value;
    const declaredValue = this.shipmentForm.get('declaredValue')?.value || 0;
    
    if (weight && quantity) {
      // Base rate: 50,000 SLL per kg
      let estimate = weight * quantity * 50000;
      
      // Add insurance cost (2% of declared value)
      if (insurance && declaredValue) {
        estimate += declaredValue * 0.02;
      }
      
      return estimate.toLocaleString('en-SL');
    }
    return '0';
  }

  calculateVolume(): number {
    const length = this.shipmentForm.get('length')?.value || 0;
    const width = this.shipmentForm.get('width')?.value || 0;
    const height = this.shipmentForm.get('height')?.value || 0;
    return length * width * height;
  }

  resetForm() {
    this.submitted = false;
    this.shipmentForm.reset({
      productTypeId: 1,
      quantity: 1,
      insurance: false,
      fragile: false
    });
  }
}
