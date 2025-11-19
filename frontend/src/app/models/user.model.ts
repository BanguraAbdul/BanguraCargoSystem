export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  password?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  status: 'PENDING' | 'APPROVED' | 'DELETED';
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  id: number;
  email: string;
  role: string;
  status: string;
}
