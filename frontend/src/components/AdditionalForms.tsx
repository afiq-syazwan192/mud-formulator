import React from 'react';
import {
    Paper,
    Grid,
    Typography,
    Select,
    MenuItem,
    TextField,
    Box
} from '@mui/material';
import { BaseOil, WaterAndSalt } from '../types/types';

interface AdditionalFormsProps {
    baseOil: BaseOil;
    waterAndSalt: WaterAndSalt[];
    weightMaterial: {
        type: string;
        specificGravity: number;
    };
    desiredOil: number;
    onBaseOilChange: (baseOil: BaseOil) => void;
    onWaterAndSaltChange: (waterAndSalt: WaterAndSalt[]) => void;
    onWeightMaterialChange: (weightMaterial: { type: string; specificGravity: number }) => void;
    onDesiredOilChange: (value: number) => void;
}

export const AdditionalForms: React.FC<AdditionalFormsProps> = ({
    baseOil,
    waterAndSalt,
    weightMaterial,
    desiredOil,
    onBaseOilChange,
    onWaterAndSaltChange,
    onWeightMaterialChange,
    onDesiredOilChange
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Desired % Oil</Typography>
                    <TextField
                        type="number"
                        value={desiredOil}
                        onChange={(e) => onDesiredOilChange(Number(e.target.value))}
                        inputProps={{ step: 1 }}
                        fullWidth
                    />
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Base Oil</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Select
                                value={baseOil.type}
                                onChange={(e) => onBaseOilChange({
                                    ...baseOil,
                                    type: e.target.value
                                })}
                                fullWidth
                            >
                                <MenuItem value="Canola Oil">Canola Oil</MenuItem>
                                <MenuItem value="NONE">(NONE)</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Ratio %"
                                type="number"
                                value={baseOil.ratio}
                                onChange={(e) => onBaseOilChange({
                                    ...baseOil,
                                    ratio: Number(e.target.value)
                                })}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="S.G."
                                type="number"
                                value={baseOil.specificGravity}
                                disabled
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Add Water and Salt</Typography>
                    {waterAndSalt.map((item, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={3}>
                                <Select
                                    value={item.type}
                                    onChange={(e) => {
                                        const newWaterAndSalt = [...waterAndSalt];
                                        newWaterAndSalt[index] = {
                                            ...item,
                                            type: e.target.value
                                        };
                                        onWaterAndSaltChange(newWaterAndSalt);
                                    }}
                                    fullWidth
                                >
                                    <MenuItem value="KCl">KCl</MenuItem>
                                    <MenuItem value="Water">Water</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Salinity"
                                    type="number"
                                    value={item.salinity}
                                    onChange={(e) => {
                                        const newWaterAndSalt = [...waterAndSalt];
                                        newWaterAndSalt[index] = {
                                            ...item,
                                            salinity: Number(e.target.value)
                                        };
                                        onWaterAndSaltChange(newWaterAndSalt);
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Salt Purity"
                                    type="number"
                                    value={item.saltPurity}
                                    onChange={(e) => {
                                        const newWaterAndSalt = [...waterAndSalt];
                                        newWaterAndSalt[index] = {
                                            ...item,
                                            saltPurity: Number(e.target.value)
                                        };
                                        onWaterAndSaltChange(newWaterAndSalt);
                                    }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    label="Wt% Salt"
                                    value={item.wtPercent}
                                    disabled
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    ))}
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Weight Material</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Select
                                value={weightMaterial.type}
                                onChange={(e) => onWeightMaterialChange({
                                    ...weightMaterial,
                                    type: e.target.value
                                })}
                                fullWidth
                            >
                                <MenuItem value="MIL-BAR">MIL-BAR</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                value={weightMaterial.specificGravity}
                                disabled
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}; 