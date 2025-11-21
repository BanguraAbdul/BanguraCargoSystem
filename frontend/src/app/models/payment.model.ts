import { User } from './user.model';
import { Shipment } from './shipment.model';

export interface Payment {
  id?: number;
  user?: User;
  shipment?: Shipment;
  amount: number;
  method: string;
  status: PaymentStatus;
  paymentDate?: Date;
  reference?: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface PaymentRequest {
  userId?: number;
  shipmentId?: number;
  amount: number;
  method: string;
  reference?: string;
}

export interface PaymentResponse {
  id: number;
  amount: number;
  method: string;
  status: PaymentStatus;
  paymentDate: Date;
  reference: string;
}
