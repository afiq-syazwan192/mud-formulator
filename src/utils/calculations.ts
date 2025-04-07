import { Product } from '../types/types';

export interface CalculationResult {
  totalVolume: number;
  productAmounts: {
    name: string;
    amount: number;
    unit: string;
  }[];
}

export const calculateMudFormulation = (
  mudWeight: number,
  products: Product[]
): CalculationResult => {
  const baseVolume = 1; // 1 barrel base volume
  let totalVolume = baseVolume;
  
  const productAmounts = products.map(product => {
    let amount = 0;
    
    if (product.additionMethod === 'lb/bbl') {
      // Convert concentration from lb/bbl to volume
      amount = product.concentration;
      const volumeOccupied = (product.concentration / (product.specificGravity * 8.33));
      totalVolume += volumeOccupied;
    } else if (product.additionMethod === '% by volume') {
      // Calculate volume based on percentage
      amount = (product.concentration / 100) * baseVolume;
      totalVolume += amount;
    }

    return {
      name: product.name,
      amount: Number(amount.toFixed(2)),
      unit: product.additionMethod
    };
  });

  return {
    totalVolume: Number(totalVolume.toFixed(2)),
    productAmounts
  };
}; 