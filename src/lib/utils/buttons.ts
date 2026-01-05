import type { ButtonStyles, ColorPalette } from '../types/brand';

export function buildButtonStyles(colors: ColorPalette): ButtonStyles {
    return {
        primary: {
            label: 'Primary Action',
            background: colors.accent[500].hex,
            hover: colors.accent[600].hex,
            text: '#ffffff',
            borderRadius: '8px',
            padding: '12px 24px',
            fontWeight: '600',
        },
        secondary: {
            label: 'Secondary Action',
            background: colors.secondary[500].hex,
            hover: colors.secondary[600].hex,
            text: '#ffffff',
            borderRadius: '8px',
            padding: '12px 24px',
            fontWeight: '600',
        },
        solid: {
            label: 'Solid',
            background: colors.primary[800].hex,
            hover: colors.primary[700].hex,
            text: '#ffffff',
            borderRadius: '8px',
            padding: '12px 24px',
            fontWeight: '600',
        },
        ghost: {
            label: 'Ghost/Outline',
            background: 'transparent',
            hover: colors.accent[500].hex,
            text: colors.accent[500].hex,
            borderRadius: '8px',
            padding: '10px 22px',
            fontWeight: '600',
            border: `2px solid ${colors.accent[500].hex}`,
        },
    };
}
