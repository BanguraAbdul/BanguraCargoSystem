export interface ProductType {
  id?: number;
  name: string;
  description?: string;
  shipments?: any[];
}

export interface ProductTypeRequest {
  name: string;
  description?: string;
}
