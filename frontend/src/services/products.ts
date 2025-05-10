import api from './api';

export interface Product {
  _id: string;
  name: string;
  specificGravity: number;
  function: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  specificGravity: number;
  function: string;
}

export const getProducts = async (): Promise<Product[]> => {
  // const response = await api.get<Product[]>('/api/products');
  const response = await api.get<Product[]>('/api/available-products');
  return response.data;
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
  const response = await api.post<Product>('/api/products', data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/available-products/${id}`);
}; 