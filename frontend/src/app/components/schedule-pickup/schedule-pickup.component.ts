import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-schedule-pickup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.css']
})
export class SchedulePickupComponent implements OnInit {
  pickupForm!: FormGroup;
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    this.minDate = today.toISOString().split('T')[0];

    this.pickupForm = this.fb.group({
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      contactName: ['', [Validators.required, Validators.minLength(2)]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\+232\d{8}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      packageCount: [1, [Validators.required, Validators.min(1)]],
      specialInstructions: ['']
    });
  }

  get f() { return this.pickupForm.controls; }

  onSubmit() {
    if (this.pickupForm.invalid) {
      this.alertService.error('Please fill all required fields correctly');
      Object.keys(this.pickupForm.controls).forEach(key => {
        this.pickupForm.controls[key].markAsTouched();
      });
      return;
    }

    this.alertService.loading('Scheduling pickup...');
    setTimeout(() => {
      this.alertService.close();
      this.alertService.success('Pickup scheduled successfully!', 'Success');
      this.pickupForm.reset();
    }, 1500);
  }
}
