import { Product, BaseOil, WaterAndSalt, WeightMaterial, CalculationResult } from '../types/types';

export const calculateMudFormulation = (
  mudWeight: number,
  products: Product[],
  baseOil: BaseOil,
  waterAndSalt: WaterAndSalt[],
  weightMaterial: WeightMaterial,
  mudType: string = 'Water-Based Mud', // Add mudType for future extensibility
  desiredOil: number = 0 // For oil-based muds
): CalculationResult => {
  const baseVolume = 1; // 1 bbl
  let totalVolume = 0;
  let totalWeight = 0;

  // --- Base Oil and Water Phase ---
  let baseOilVolume = 0;
  let waterVolume = 0;

  if (mudType === 'Oil-Based Mud' && desiredOil > 0) {
    // Oil-based mud: use desired oil % (by volume)
    baseOilVolume = (desiredOil / 100) * baseVolume;
    waterVolume = baseVolume - baseOilVolume;
  } else {
    // Water-based mud: all base is oil or water as per ratio
    baseOilVolume = (baseOil.ratio / 100) * baseVolume;
    waterVolume = baseVolume - baseOilVolume;
  }

  const baseOilWeight = baseOilVolume * baseOil.specificGravity * 8.33;
  const waterWeight = waterVolume * 8.33; // Assume SG of water = 1

  totalVolume += baseOilVolume + waterVolume;
  totalWeight += baseOilWeight + waterWeight;

  // --- Water and Salt Additives ---
  const waterAndSaltResults = waterAndSalt.map(item => {
    if (item.type !== 'Water') {
      // Salt addition
      const saltWeight = item.salinity;
      const saltVolume = saltWeight / (item.saltPurity / 100 * 8.33);
      totalWeight += saltWeight;
      // Salt volume is not always additive, but include for simplicity
      totalVolume += saltVolume;
      return {
        name: item.type,
        amount: Number(saltWeight.toFixed(2)),
        volume: Number(saltVolume.toFixed(4)),
        unit: 'lb/bbl'
      };
    }
    return {
      name: 'Water',
      amount: Number(waterWeight.toFixed(2)),
      volume: Number(waterVolume.toFixed(4)),
      unit: 'lb/bbl'
    };
  });

  // --- Weight Material ---
  const targetWeight = mudWeight * 8.33;
  const requiredWeightMaterial = Math.max(0, targetWeight - totalWeight);
  const weightMaterialVolume = requiredWeightMaterial / (weightMaterial.specificGravity * 8.33);
  totalWeight += requiredWeightMaterial;
  totalVolume += weightMaterialVolume;

  // --- Products ---
  const sortedProducts = [...products].sort((a, b) => a.mixingOrder - b.mixingOrder);
  const productResults = sortedProducts.map(product => {
    let amount = 0;
    let volume = 0;
    if (product.additionMethod === 'lb/bbl') {
      amount = product.concentration;
      volume = amount / (product.specificGravity * 8.33);
    } else if (product.additionMethod === '% by volume') {
      volume = (product.concentration / 100) * baseVolume;
      amount = volume * product.specificGravity * 8.33;
    }
    totalWeight += amount;
    totalVolume += volume;
    return {
      name: product.name,
      amount: Number(amount.toFixed(2)),
      volume: Number(volume.toFixed(4)),
      unit: product.additionMethod
    };
  });

  // --- Final Calculation ---
  return {
    totalVolume: Number(totalVolume.toFixed(2)),
    totalWeight: Number(totalWeight.toFixed(2)),
    finalMudWeight: Number((totalWeight / (totalVolume * 8.33)).toFixed(2)),
    productAmounts: [
      {
        name: 'Base Oil',
        amount: Number(baseOilWeight.toFixed(2)),
        volume: Number(baseOilVolume.toFixed(4)),
        unit: 'lb/bbl'
      },
      ...waterAndSaltResults,
      {
        name: weightMaterial.type,
        amount: Number(requiredWeightMaterial.toFixed(2)),
        volume: Number(weightMaterialVolume.toFixed(4)),
        unit: 'lb/bbl'
      },
      ...productResults
    ]
  };
};