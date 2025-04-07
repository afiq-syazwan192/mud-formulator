import { Product, BaseOil, WaterAndSalt, WeightMaterial, CalculationResult } from '../types/types';

export const calculateMudFormulation = (
    mudWeight: number,
    products: Product[],
    baseOil: BaseOil,
    waterAndSalt: WaterAndSalt[],
    weightMaterial: WeightMaterial
): CalculationResult => {
    const baseVolume = 1; // 1 barrel base volume
    let totalVolume = baseVolume;
    let totalWeight = 0;
    
    // Base oil calculations
    const baseOilVolume = (baseOil.ratio / 100) * baseVolume;
    const baseOilWeight = baseOilVolume * baseOil.specificGravity * 8.33;
    totalVolume += baseOilVolume;
    totalWeight += baseOilWeight;

    // Water and salt calculations
    const waterAndSaltResults = waterAndSalt.map(item => {
        if (item.type === 'KCl') {
            const saltWeight = item.salinity;
            const saltVolume = saltWeight / (item.saltPurity / 100 * 8.33);
            
            totalVolume += saltVolume;
            totalWeight += saltWeight;

            return {
                name: 'KCl',
                amount: Number(saltWeight.toFixed(2)),
                volume: Number(saltVolume.toFixed(4)),
                unit: 'lb/bbl'
            };
        }
        return {
            name: item.type,
            amount: 0,
            volume: 0,
            unit: 'lb/bbl'
        };
    });

    // Weight material calculations
    const targetWeight = mudWeight * 8.33; // Convert ppg to lb/bbl
    const requiredWeightMaterial = Math.max(0, targetWeight - totalWeight);
    const weightMaterialVolume = requiredWeightMaterial / (weightMaterial.specificGravity * 8.33);
    totalVolume += weightMaterialVolume;
    totalWeight += requiredWeightMaterial;

    // Product calculations
    const productResults = products.map(product => {
        let amount = 0;
        let volume = 0;
        
        if (product.additionMethod === 'lb/bbl') {
            amount = product.concentration;
            volume = amount / (product.specificGravity * 8.33);
        } else if (product.additionMethod === '% by volume') {
            volume = (product.concentration / 100) * baseVolume;
            amount = volume * product.specificGravity * 8.33;
        }

        totalVolume += volume;
        totalWeight += amount;

        return {
            name: product.name,
            amount: Number(amount.toFixed(2)),
            volume: Number(volume.toFixed(4)),
            unit: product.additionMethod
        };
    });

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