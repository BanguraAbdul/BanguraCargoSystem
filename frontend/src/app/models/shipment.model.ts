import { ProductType } from './product-type.model';

export interface Shipment {
  id?: number;
  user?: any;
  customer?: any;
  productType?: ProductType;
  
  // Sender Information
  senderName?: string;
  senderPhone?: string;
  senderEmail?: string;
  
  // Origin Information
  originCountry?: string;
  originCity?: string;
  originAddress?: string;
  originPostalCode?: string;
  origin?: string; // For backward compatibility
  
  // Recipient Information
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  
  // Destination Information
  destinationCountry?: string;
  destinationCity?: string;
  destinationAddress?: string;
  destinationPostalCode?: string;
  destination?: string; // For backward compatibility
  
  // Package Details
  description?: string;
  weight?: number;
  quantity?: number;
  
  // Dimensions
  length?: number;
  width?: number;
  height?: number;
  
  // Additional Information
  declaredValue?: number;
  insurance?: boolean;
  fragile?: boolean;
  specialInstructions?: string;
  
  // System Fields
  trackingNumber?: string;
  status?: 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  requestDate?: Date | string;
  createdAt?: Date | string;
  approvalDate?: Date | string;
}

export interface ShipmentRequest {
  origin: string;
  destination: string;
  description?: string;
  weight: number;
  productTypeId: number;
}
