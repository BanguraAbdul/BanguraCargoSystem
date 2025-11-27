import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ShipmentService } from '../../services/shipment.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-edit-shipment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-shipment.component.html',
  styleUrls: ['./edit-shipment.component.css']
})
export class EditShipmentComponent implements OnInit {
  shipmentForm!: FormGroup;
  submitted = false;
  shipmentId!: number;
  loading = true;
  
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.shipmentId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.shipmentForm = this.fb.group({
      senderName: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      senderPhone: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      senderEmail: ['', [Validators.email]],
      originCountry: ['', [Validators.required]],
      originCity: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      originAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      originPostalCode: ['', [Validators.maxLength(20)]],
      recipientName: ['', [Validators.minLength(3), Validators.maxLength(100)]],
      recipientPhone: ['', [Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      recipientEmail: ['', [Validators.email]],
      destinationCountry: ['', [Validators.required]],
      destinationCity: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      destinationAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      destinationPostalCode: ['', [Validators.maxLength(20)]],
      productTypeId: [1, [Validators.required]],
      weight: ['', [Validators.required, Validators.min(0.1), Validators.max(500)]],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      length: ['', [Validators.min(1), Validators.max(300)]],
      width: ['', [Validators.min(1), Validators.max(300)]],
      height: ['', [Validators.min(1), Validators.max(300)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      declaredValue: ['', [Validators.min(0), Validators.max(1000000)]],
      insurance: [false],
      fragile: [false],
      specialInstructions: ['', [Validators.maxLength(300)]]
    });

    this.loadShipment();
  }

  loadShipment() {
    this.shipmentService.getShipmentById(this.shipmentId).subscribe({
      next: (shipment) => {
        // Check if shipment can be edited
        if (shipment.status !== 'REQUESTED') {
          this.alertService.error('This shipment cannot be edited as it has already been processed', 'Cannot Edit').then(() => {
            this.router.navigate(['/customer']);
          });
          return;
        }

        // Populate form with ALL shipment data from backend
        this.shipmentForm.patchValue({
          // Sender Information
          senderName: shipment.senderName || '',
          senderPhone: shipment.senderPhone || '',
          senderEmail: shipment.senderEmail || '',
          
          // Origin Information
          originCountry: shipment.originCountry || '',
          originCity: shipment.originCity || '',
          originAddress: shipment.originAddress || '',
          originPostalCode: shipment.originPostalCode || '',
          
          // Recipient Information
          recipientName: shipment.recipientName || '',
          recipientPhone: shipment.recipientPhone || '',
          recipientEmail: shipment.recipientEmail || '',
          
          // Destination Information
          destinationCountry: shipment.destinationCountry || '',
          destinationCity: shipment.destinationCity || '',
          destinationAddress: shipment.destinationAddress || '',
          destinationPostalCode: shipment.destinationPostalCode || '',
          
          // Package Details
          productTypeId: shipment.productType?.id || 1,
          weight: shipment.weight || 0,
          quantity: shipment.quantity || 1,
          description: shipment.description || '',
          
          // Dimensions
          length: shipment.length || '',
          width: shipment.width || '',
          height: shipment.height || '',
          
          // Additional Information
          declaredValue: shipment.declaredValue || '',
          insurance: shipment.insurance || false,
          fragile: shipment.fragile || false,
          specialInstructions: shipment.specialInstructions || ''
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.alertService.error(err.error?.message || 'Failed to load shipment').then(() => {
          this.router.navigate(['/customer']);
        });
      }
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
      Object.keys(this.shipmentForm.controls).forEach(key => {
        this.shipmentForm.controls[key].markAsTouched();
      });
      setTimeout(() => {
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    const formData = {
      // Sender Information
      senderName: this.shipmentForm.value.senderName,
      senderPhone: this.shipmentForm.value.senderPhone,
      senderEmail: this.shipmentForm.value.senderEmail,
      
      // Origin Information
      originCountry: this.shipmentForm.value.originCountry,
      originCity: this.shipmentForm.value.originCity,
      originAddress: this.shipmentForm.value.originAddress,
      originPostalCode: this.shipmentForm.value.originPostalCode,
      
      // Recipient Information
      recipientName: this.shipmentForm.value.recipientName,
      recipientPhone: this.shipmentForm.value.recipientPhone,
      recipientEmail: this.shipmentForm.value.recipientEmail,
      
      // Destination Information
      destinationCountry: this.shipmentForm.value.destinationCountry,
      destinationCity: this.shipmentForm.value.destinationCity,
      destinationAddress: this.shipmentForm.value.destinationAddress,
      destinationPostalCode: this.shipmentForm.value.destinationPostalCode,
      
      // Package Details
      productTypeId: this.shipmentForm.value.productTypeId,
      weight: this.shipmentForm.value.weight,
      quantity: this.shipmentForm.value.quantity,
      description: this.shipmentForm.value.description,
      
      // Dimensions
      length: this.shipmentForm.value.length,
      width: this.shipmentForm.value.width,
      height: this.shipmentForm.value.height,
      
      // Additional Information
      declaredValue: this.shipmentForm.value.declaredValue,
      insurance: this.shipmentForm.value.insurance,
      fragile: this.shipmentForm.value.fragile,
      specialInstructions: this.shipmentForm.value.specialInstructions
    };

    this.alertService.loading('Updating shipment...');
    this.shipmentService.updateShipment(this.shipmentId, formData).subscribe({
      next: () => {
        this.alertService.close();
        this.alertService.success('Your shipment has been updated successfully!', 'Success').then(() => {
          // Send message to parent window if in iframe
          if (window.parent !== window) {
            window.parent.postMessage('shipment-updated', '*');
          } else {
            this.router.navigate(['/customer']);
          }
        });
      },
      error: (err) => {
        this.alertService.close();
        this.alertService.error(err.error?.message || 'Failed to update shipment', 'Error');
      }
    });
  }

  calculateEstimate() {
    const weight = this.shipmentForm.get('weight')?.value || 0;
    const quantity = this.shipmentForm.get('quantity')?.value || 0;
    const insurance = this.shipmentForm.get('insurance')?.value;
    const declaredValue = this.shipmentForm.get('declaredValue')?.value || 0;
    
    if (weight && quantity) {
      let estimate = weight * quantity * 50000;
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
}
