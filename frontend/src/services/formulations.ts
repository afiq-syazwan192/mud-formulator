import api from './api';
import { Product } from './products';

export interface FormulationProduct {
  product: Product;
  quantity: number;
}

export interface Formulation {
  _id: string;
  mudType: string;
  mudWeight: number;
  desiredOilPercentage: number;
  products: FormulationProduct[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormulationData {
  mudType: string;
  mudWeight: number;
  desiredOilPercentage: number;
  products: Array<{
    product: string;  // Product ID
    quantity: number;
  }>;
}

export const getFormulations = async (): Promise<Formulation[]> => {
  const response = await api.get<Formulation[]>('/api/formulations');
  return response.data;
};

export const createFormulation = async (data: CreateFormulationData): Promise<Formulation> => {
  const response = await api.post<Formulation>('/api/formulations', data);
  return response.data;
};

export const deleteFormulation = async (id: string): Promise<void> => {
  await api.delete(`/api/formulations/${id}`);
}; 