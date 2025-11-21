import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RateCalculation {
  weight: number;
  destination: string;
  service: string;
  cost: number;
  deliveryDays: string;
}

@Component({
  selector: 'app-shipping-rates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipping-rates.component.html',
  styleUrls: ['./shipping-rates.component.css']
})
export class ShippingRatesComponent {
  weight: number = 1;
  destination: string = 'domestic';
  calculatedRates: RateCalculation[] = [];

  destinations = [
    { value: 'domestic', label: 'Domestic (Within Sierra Leone)' },
    { value: 'west-africa', label: 'West Africa' },
    { value: 'africa', label: 'Other African Countries' },
    { value: 'europe', label: 'Europe' },
    { value: 'north-america', label: 'North America' },
    { value: 'asia', label: 'Asia' },
    { value: 'other', label: 'Other International' }
  ];

  calculateRates() {
    this.calculatedRates = [];
    const baseRates = this.getBaseRates(this.destination);
    
    baseRates.forEach((rate: any) => {
      this.calculatedRates.push({
        weight: this.weight,
        destination: this.getDestinationLabel(this.destination),
        service: rate.service,
        cost: rate.baseRate * this.weight,
        deliveryDays: rate.deliveryDays
      });
    });
  }

  getBaseRates(destination: string) {
    const rates: any = {
      'domestic': [
        { service: 'Standard', baseRate: 25000, deliveryDays: '2-3 days' },
        { service: 'Express', baseRate: 50000, deliveryDays: '1 day' }
      ],
      'west-africa': [
        { service: 'Standard', baseRate: 75000, deliveryDays: '5-7 days' },
        { service: 'Express', baseRate: 150000, deliveryDays: '3-4 days' }
      ],
      'africa': [
        { service: 'Standard', baseRate: 100000, deliveryDays: '7-10 days' },
        { service: 'Express', baseRate: 200000, deliveryDays: '4-6 days' }
      ],
      'europe': [
        { service: 'Standard', baseRate: 150000, deliveryDays: '10-14 days' },
        { service: 'Express', baseRate: 300000, deliveryDays: '5-7 days' }
      ],
      'north-america': [
        { service: 'Standard', baseRate: 175000, deliveryDays: '12-16 days' },
        { service: 'Express', baseRate: 350000, deliveryDays: '6-8 days' }
      ],
      'asia': [
        { service: 'Standard', baseRate: 160000, deliveryDays: '10-15 days' },
        { service: 'Express', baseRate: 320000, deliveryDays: '5-8 days' }
      ],
      'other': [
        { service: 'Standard', baseRate: 180000, deliveryDays: '14-21 days' },
        { service: 'Express', baseRate: 360000, deliveryDays: '7-10 days' }
      ]
    };
    return rates[destination] || rates['other'];
  }

  getDestinationLabel(value: string): string {
    const dest = this.destinations.find(d => d.value === value);
    return dest ? dest.label : value;
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-SL');
  }
}
