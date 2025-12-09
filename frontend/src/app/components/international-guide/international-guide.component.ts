import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-international-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './international-guide.component.html',
  styleUrls: ['./international-guide.component.css']
})
export class InternationalGuideComponent {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/']);
  }
  countries = [
    { name: 'United States', deliveryDays: '6-8', customsRequired: true },
    { name: 'United Kingdom', deliveryDays: '5-7', customsRequired: true },
    { name: 'Ghana', deliveryDays: '3-5', customsRequired: true },
    { name: 'Nigeria', deliveryDays: '3-5', customsRequired: true },
    { name: 'South Africa', deliveryDays: '7-10', customsRequired: true },
    { name: 'China', deliveryDays: '8-12', customsRequired: true }
  ];

  prohibitedItems = [
    'Weapons and ammunition',
    'Illegal drugs and narcotics',
    'Hazardous materials',
    'Counterfeit goods',
    'Perishable food items (without proper packaging)',
    'Live animals'
  ];

  requiredDocuments = [
    'Commercial Invoice',
    'Packing List',
    'Certificate of Origin',
    'Export License (if applicable)',
    'Insurance Certificate (recommended)'
  ];
}
