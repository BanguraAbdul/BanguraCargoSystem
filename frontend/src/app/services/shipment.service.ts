import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../models/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  getAllShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${this.apiUrl}/admin/shipments`);
  }

  getCustomerShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${this.apiUrl}/customer/shipments`);
  }

  createShipment(shipment: any): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.apiUrl}/customer/shipments`, shipment);
  }

  updateShipmentStatus(shipmentId: number, status: string): Observable<Shipment> {
    return this.http.put<Shipment>(`${this.apiUrl}/admin/shipments/${shipmentId}/status?status=${status}`, {});
  }

  approveShipment(shipmentId: number): Observable<Shipment> {
    return this.http.post<Shipment>(`${this.apiUrl}/admin/shipments/${shipmentId}/approve`, {});
  }

  deleteShipment(shipmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/shipments/${shipmentId}`, { responseType: 'text' as 'json' });
  }

  // Customer methods
  updateShipment(shipmentId: number, shipment: any): Observable<Shipment> {
    return this.http.put<Shipment>(`${this.apiUrl}/customer/shipments/${shipmentId}`, shipment);
  }

  deleteCustomerShipment(shipmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/customer/shipments/${shipmentId}`, { responseType: 'text' as 'json' });
  }

  getShipmentById(shipmentId: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/customer/shipments/${shipmentId}`);
  }

  // Public tracking method (no authentication required)
  trackShipment(trackingNumber: string): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/auth/track/${trackingNumber}`);
  }
}
