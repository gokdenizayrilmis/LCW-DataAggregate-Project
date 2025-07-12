export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface UpdateStoreRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
} 