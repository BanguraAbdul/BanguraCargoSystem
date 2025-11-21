import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-manage-returns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-returns.component.html',
  styleUrls: ['./manage-returns.component.css']
})
export class ManageReturnsComponent {
  returnForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.returnForm = this.fb.group({
      trackingNumber: ['', [Validators.required, Validators.minLength(8)]],
      reason: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\+232\d{8}$/)]]
    });
  }

  get f() { return this.returnForm.controls; }

  onSubmit() {
    if (this.returnForm.invalid) {
      this.alertService.error('Please fill all required fields');
      Object.keys(this.returnForm.controls).forEach(key => {
        this.returnForm.controls[key].markAsTouched();
      });
      return;
    }

    this.alertService.loading('Processing return request...');
    setTimeout(() => {
      this.alertService.close();
      this.alertService.success('Return request submitted successfully!');
      this.returnForm.reset();
    }, 1500);
  }
}
