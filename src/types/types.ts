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
    baseOil: {
        type: string;
        ratio: number;
        specificGravity: number;
    };
    salinity: number;
    saltPurity: number;
    weightMaterial: {
        type: string;
        specificGravity: number;
    };
    products: Product[];
}

// Interface for calculation results
export interface CalculationResult {
    totalVolume: number;
    productAmounts: {
        name: string;
        amount: number;
        unit: string;
    }[];
} 