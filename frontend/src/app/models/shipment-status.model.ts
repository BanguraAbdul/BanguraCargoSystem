import { Shipment } from './shipment.model';

export interface ShipmentStatus {
  id?: number;
  shipment?: Shipment;
  status: string;
  description?: string;
  timestamp?: Date;
  location?: string;
}

export interface ShipmentStatusRequest {
  shipmentId: number;
  status: string;
  description?: string;
  location?: string;
}

export interface ShipmentStatusResponse {
  id: number;
  status: string;
  description?: string;
  timestamp: Date;
  location?: string;
}
