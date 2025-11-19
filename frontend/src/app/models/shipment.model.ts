import { ProductType } from './product-type.model';

export interface Shipment {
  id?: number;
  user?: any;
  customer?: any;
  productType?: ProductType;
  origin?: string;
  destination?: string;
  originCountry?: string;
  destinationCountry?: string;
  originAddress?: string;
  destinationAddress?: string;
  description?: string;
  weight?: number;
  quantity?: number;
  trackingNumber?: string;
  status?: 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  requestDate?: Date;
  createdAt?: Date;
  approvalDate?: Date;
}

export interface ShipmentRequest {
  origin: string;
  destination: string;
  description?: string;
  weight: number;
  productTypeId: number;
}
