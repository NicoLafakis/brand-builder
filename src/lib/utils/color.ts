import chroma from 'chroma-js';
import type { Color, ColorHarmony, ColorPalette, WCAGContrast } from '../types/brand';

// Convert any color format to our Color type
export function parseColor(colorValue: string): Color | null {
  try {
    const c = chroma(colorValue);
    const [r, g, b] = c.rgb();
    const [h, s, l] = c.hsl();

    return {
      hex: c.hex(),
      rgb: { r: Math.round(r), g: Math.round(g), b: Math.round(b) },
      hsl: { h: Math.round(h || 0), s: Math.round((s || 0) * 100), l: Math.round((l || 0) * 100) },
    };
  } catch {
    return null;
  }
}

// Generate color name based on hue and lightness
export function getColorName(color: Color): string {
  const { h, s, l } = color.hsl;

  // Handle achromatic colors
  if (s < 10) {
    if (l < 15) return 'Black';
    if (l < 30) return 'Dark Gray';
    if (l < 50) return 'Gray';
    if (l < 70) return 'Light Gray';
    if (l < 90) return 'Silver';
    return 'White';
  }

  // Determine base hue name
  let hueName: string;
  if (h < 15 || h >= 345) hueName = 'Red';
  else if (h < 45) hueName = 'Orange';
  else if (h < 75) hueName = 'Yellow';
  else if (h < 150) hueName = 'Green';
  else if (h < 210) hueName = 'Cyan';
  else if (h < 270) hueName = 'Blue';
  else if (h < 330) hueName = 'Purple';
  else hueName = 'Magenta';

  // Add lightness modifier
  if (l < 25) return `Dark ${hueName}`;
  if (l > 75) return `Light ${hueName}`;

  return hueName;
}

// Calculate WCAG contrast ratio
export function getContrastRatio(color1: string, color2: string): WCAGContrast {
  const ratio = chroma.contrast(color1, color2);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5,
    passesAALarge: ratio >= 3,
    passesAAA: ratio >= 7,
  };
}

// Generate color harmonies
export function generateHarmonies(baseColor: Color): ColorHarmony[] {
  const baseHue = baseColor.hsl.h;
  const baseSat = baseColor.hsl.s / 100;
  const baseLit = baseColor.hsl.l / 100;

  const createColor = (hue: number): Color => {
    const normalizedHue = ((hue % 360) + 360) % 360;
    const c = chroma.hsl(normalizedHue, baseSat, baseLit);
    return parseColor(c.hex())!;
  };

  return [
    {
      type: 'complementary',
      colors: [baseColor, createColor(baseHue + 180)],
    },
    {
      type: 'analogous',
      colors: [createColor(baseHue - 30), baseColor, createColor(baseHue + 30)],
    },
    {
      type: 'triadic',
      colors: [baseColor, createColor(baseHue + 120), createColor(baseHue + 240)],
    },
    {
      type: 'split-complementary',
      colors: [baseColor, createColor(baseHue + 150), createColor(baseHue + 210)],
    },
    {
      type: 'square',
      colors: [
        baseColor,
        createColor(baseHue + 90),
        createColor(baseHue + 180),
        createColor(baseHue + 270),
      ],
    },
  ];
}

// Generate neutral scale from a base color
export function generateNeutralScale(baseColor: Color, steps: number = 10): Color[] {
  const hue = baseColor.hsl.h;
  const scale: Color[] = [];

  for (let i = 0; i < steps; i++) {
    const lightness = (i / (steps - 1)) * 95 + 2.5; // 2.5% to 97.5%
    const saturation = Math.max(0, 5 - (i * 0.5)); // Subtle desaturation
    const c = chroma.hsl(hue, saturation / 100, lightness / 100);
    const parsed = parseColor(c.hex());
    if (parsed) {
      parsed.name = `Neutral ${(steps - i) * 100}`;
      scale.push(parsed);
    }
  }

  return scale.reverse();
}

// Generate semantic colors ensuring good contrast
export function generateSemanticColors(): ColorPalette['semantic'] {
  return {
    success: parseColor('#22c55e')!,
    error: parseColor('#ef4444')!,
    warning: parseColor('#f59e0b')!,
    info: parseColor('#3b82f6')!,
  };
}

// Generate a full shade scale (50-950) from a base color
export function generateShadeScale(baseColor: Color): ColorScale {
  const base = chroma(baseColor.hex);

  // HSL adjustment typical values from the methodology
  const adjustments = {
    50: { l: 0.97, s: 0.7 },   // L+52%, S-30% approx
    100: { l: 0.93, s: 0.8 },
    200: { l: 0.85, s: 0.85 }, // L+40%, S-15%
    300: { l: 0.70, s: 0.9 },
    400: { l: 0.55, s: 0.95 }, // L+10%, S-5%
    500: { l: 0.45, s: 1.0 },  // Base
    600: { l: 0.35, s: 1.05 }, // L-10%, S+5%
    700: { l: 0.25, s: 1.08 },
    800: { l: 0.18, s: 1.10 }, // L-27%, S+10%
    900: { l: 0.12, s: 1.12 },
    950: { l: 0.06, s: 1.15 }, // L-39%, S+15%
  };

  const scale: any = {};
  const [h, s, l] = base.hsl();

  Object.entries(adjustments).forEach(([shade, adj]) => {
    // Progressive shift from base
    const finalS = Math.min(1, s * adj.s);
    const finalL = adj.l;
    const c = chroma.hsl(h || 0, finalS, finalL);
    scale[shade] = parseColor(c.hex())!;
  });

  return {
    ...scale,
    base: baseColor,
  } as ColorScale;
}

// Suggest primary, secondary, and accent colors from extracted colors
export function buildColorPalette(extractedColors: string[]): ColorPalette {
  const parsedColors = extractedColors
    .map(c => parseColor(c))
    .filter((c): c is Color => c !== null)
    .filter(c => c.hsl.l > 10 && c.hsl.l < 90);

  const uniqueColors = clusterColors(parsedColors);
  const sortedBySaturation = [...uniqueColors].sort((a, b) => b.hsl.s - a.hsl.s);

  // 1. Primary (Trust Foundation) - Highest saturation or most frequent
  const primaryBase = sortedBySaturation[0] || parseColor('#1e3a8a')!; // Default Navy
  primaryBase.name = 'Primary Base';
  primaryBase.usage = 'Brand foundation, trust';

  // 2. Secondary (Energy) - Next distinct color
  const secondaryBase = sortedBySaturation.find(c => chroma.deltaE(c.hex, primaryBase.hex) > 30)
    || parseColor('#028393')!; // Default Teal
  secondaryBase.name = 'Secondary Base';
  secondaryBase.usage = 'Energy, differentiation';

  // 3. Accent (Action) - High energy color
  const accentBase = sortedBySaturation.find(c =>
    chroma.deltaE(c.hex, primaryBase.hex) > 40 &&
    chroma.deltaE(c.hex, secondaryBase.hex) > 30
  ) || parseColor('#f65625')!; // Default Orange/Coral
  accentBase.name = 'Accent Base';
  accentBase.usage = 'CTAs, urgency, highlights';

  // Utility colors
  const utility = [
    parseColor('#faaa68')!, // Peach
    parseColor('#98c1d9')!, // Light Blue
    parseColor('#3d5a80')!, // Slate
  ];

  return {
    primary: generateShadeScale(primaryBase),
    secondary: generateShadeScale(secondaryBase),
    accent: generateShadeScale(accentBase),
    neutral: generateNeutralScale(primaryBase),
    utility,
    semantic: generateSemanticColors(),
  };
}

// Cluster similar colors together
function clusterColors(colors: Color[], threshold: number = 25): Color[] {
  const clusters: Color[][] = [];

  for (const color of colors) {
    let addedToCluster = false;
    for (const cluster of clusters) {
      if (chroma.deltaE(color.hex, cluster[0].hex) < threshold) {
        cluster.push(color);
        addedToCluster = true;
        break;
      }
    }
    if (!addedToCluster) clusters.push([color]);
  }

  return clusters.map(cluster =>
    cluster.reduce((best, current) => current.hsl.s > best.hsl.s ? current : best)
  );
}

// Suggest accessible text color for a background
export function getAccessibleTextColor(backgroundColor: string): string {
  const whiteContrast = chroma.contrast(backgroundColor, '#ffffff');
  const blackContrast = chroma.contrast(backgroundColor, '#000000');
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

// Generate tints and shades for a color (Legacy support if needed)
export function generateTintsAndShades(color: Color, steps: number = 5): Color[] {
  const scale = chroma.scale(['#000000', color.hex, '#ffffff']).mode('lab').colors(steps * 2 + 1);
  return scale.map(c => parseColor(c)!);
}
