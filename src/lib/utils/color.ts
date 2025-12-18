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

// Extract dominant colors and create a full palette
export function buildColorPalette(extractedColors: string[]): ColorPalette {
  // Parse and filter valid colors
  const parsedColors = extractedColors
    .map(c => parseColor(c))
    .filter((c): c is Color => c !== null)
    .filter(c => {
      // Filter out near-white and near-black colors for primary/secondary
      return c.hsl.l > 10 && c.hsl.l < 90;
    });

  // Remove duplicates by clustering similar colors
  const uniqueColors = clusterColors(parsedColors);

  // Sort by saturation (most saturated first for primary)
  const sortedBySaturation = [...uniqueColors].sort((a, b) => b.hsl.s - a.hsl.s);

  // Assign primary colors (top 1-3 most saturated)
  const primary = sortedBySaturation.slice(0, Math.min(3, sortedBySaturation.length));
  primary.forEach((c, i) => {
    c.name = i === 0 ? 'Primary' : `Primary ${i + 1}`;
    c.usage = i === 0 ? 'Main brand color' : 'Supporting brand color';
  });

  // Generate secondary colors from harmony
  const secondary: Color[] = [];
  if (primary[0]) {
    const complementary = generateHarmonies(primary[0]).find(h => h.type === 'analogous');
    if (complementary) {
      complementary.colors.forEach((c, i) => {
        if (c.hex !== primary[0].hex) {
          c.name = `Secondary ${i}`;
          c.usage = 'Complementary color';
          secondary.push(c);
        }
      });
    }
  }

  // Generate accent colors (high saturation variants)
  const accent: Color[] = [];
  if (primary[0]) {
    const accentColor = chroma(primary[0].hex).saturate(1).brighten(0.5);
    const parsed = parseColor(accentColor.hex());
    if (parsed) {
      parsed.name = 'Accent';
      parsed.usage = 'Highlight and call-to-action';
      accent.push(parsed);
    }
  }

  // Generate neutral scale based on primary color
  const neutral = primary[0]
    ? generateNeutralScale(primary[0])
    : generateNeutralScale(parseColor('#6b7280')!);

  return {
    primary,
    secondary: secondary.slice(0, 4),
    accent,
    neutral,
    semantic: generateSemanticColors(),
  };
}

// Cluster similar colors together
function clusterColors(colors: Color[], threshold: number = 30): Color[] {
  const clusters: Color[][] = [];

  for (const color of colors) {
    let addedToCluster = false;

    for (const cluster of clusters) {
      const representative = cluster[0];
      const distance = chroma.deltaE(color.hex, representative.hex);

      if (distance < threshold) {
        cluster.push(color);
        addedToCluster = true;
        break;
      }
    }

    if (!addedToCluster) {
      clusters.push([color]);
    }
  }

  // Return the most saturated color from each cluster
  return clusters.map(cluster =>
    cluster.reduce((best, current) =>
      current.hsl.s > best.hsl.s ? current : best
    )
  );
}

// Suggest accessible text color for a background
export function getAccessibleTextColor(backgroundColor: string): string {
  const whiteContrast = chroma.contrast(backgroundColor, '#ffffff');
  const blackContrast = chroma.contrast(backgroundColor, '#000000');

  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}

// Generate tints and shades for a color
export function generateTintsAndShades(color: Color, steps: number = 5): Color[] {
  const scale = chroma.scale(['#000000', color.hex, '#ffffff']).mode('lab').colors(steps * 2 + 1);
  return scale.map(c => parseColor(c)!);
}
