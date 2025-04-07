// Product interface for mud formulation components
export interface Product {
    name: string;
    concentration: number;
    specificGravity: number;
    additionMethod: string;
}

// Main interface for the entire mud formulation
export interface MudFormulation {
    mudType: string;
    weighted: string;
    mudWeight: number;
    desiredOil: number;
    baseOil: BaseOil;
    waterAndSalt: WaterAndSalt[];
    weightMaterial: WeightMaterial;
    products: Product[];
}

// Interface for calculation results
export interface CalculationResult {
    totalVolume: number;
    totalWeight: number;
    finalMudWeight: number;
    productAmounts: Array<{
        name: string;
        amount: number;
        volume: number;
        unit: string;
    }>;
}

export interface BaseOil {
    type: string;
    ratio: number;
    specificGravity: number;
}

export interface WaterAndSalt {
    type: string;
    salinity: number;
    saltPurity: number;
    wtPercent: string;
}

export interface WeightMaterial {
    type: string;
    specificGravity: number;
} 