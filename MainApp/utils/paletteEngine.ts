import { AppColors } from '@/constants/colors';

import { Palette } from '@/types/common';

const PALETTES: Record<string, Palette> = {
    thailand: {
        primary: '#E63946',
        secondary: '#F1FAEE',
        accent: '#FF4D00',
        gradient: ['#FF4D00', '#FF8F00'],
    },
    japan: {
        primary: '#2D5A27',
        secondary: '#F5F5DC',
        accent: '#90A955',
        gradient: ['#2D5A27', '#90A955'],
    },
    italy: {
        primary: '#B5838D',
        secondary: '#FFB703',
        accent: '#FB8500',
        gradient: ['#FB8500', '#FFB703'],
    },
    korea: {
        primary: '#9B2226',
        secondary: '#E9D8A6',
        accent: '#BB3E03',
        gradient: ['#9B2226', '#AE2012'],
    },
    china: {
        primary: '#D00000',
        secondary: '#FFBA08',
        accent: '#DC2F02',
        gradient: ['#DC2F02', '#FFBA08'],
    },
    dessert: {
        primary: '#FF85A1',
        secondary: '#FEEAFA',
        accent: '#F72585',
        gradient: ['#F72585', '#FF85A1'],
    },
    default: {
        primary: AppColors.primary,
        secondary: '#F8F9FA',
        accent: AppColors.primary,
        gradient: [AppColors.primary, '#C62828'],
    }
};

export function getPalette(category?: string, name?: string): Palette {
    const cat = category?.toLowerCase() || '';
    const n = name?.toLowerCase() || '';

    if (cat.includes('thai')) return PALETTES.thailand;
    if (cat.includes('japan')) return PALETTES.japan;
    if (cat.includes('italy') || cat.includes('pasta')) return PALETTES.italy;
    if (cat.includes('korea')) return PALETTES.korea;
    if (cat.includes('china')) return PALETTES.china;
    if (n.includes('cake') || n.includes('dessert') || n.includes('sweet')) return PALETTES.dessert;

    return PALETTES.default;
}
