import type { Font, Typography, TypographyScale } from '../types/brand';

// Modular scale ratios with names
export const SCALE_RATIOS = {
  'minor-second': { ratio: 1.067, name: 'Minor Second', description: 'Subtle, for dense UIs' },
  'major-second': { ratio: 1.125, name: 'Major Second', description: 'Gentle progression' },
  'minor-third': { ratio: 1.2, name: 'Minor Third', description: 'Subtle differences' },
  'major-third': { ratio: 1.25, name: 'Major Third', description: 'Versatile, general purpose' },
  'perfect-fourth': { ratio: 1.333, name: 'Perfect Fourth', description: 'Clear sectioning' },
  'augmented-fourth': { ratio: 1.414, name: 'Augmented Fourth', description: 'Balanced' },
  'perfect-fifth': { ratio: 1.5, name: 'Perfect Fifth', description: 'Strong hierarchy' },
  'golden-ratio': { ratio: 1.618, name: 'Golden Ratio', description: 'High-impact marketing' },
} as const;

// Common font pairings with rationale
export const FONT_PAIRINGS: Array<{
  heading: string;
  body: string;
  style: string;
  description: string;
}> = [
    {
      heading: 'Inter',
      body: 'Inter',
      style: 'Modern Tech',
      description: 'Clean, professional, excellent readability',
    },
    {
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
      style: 'Elegant Editorial',
      description: 'Sophisticated serif headlines with clean body text',
    },
    {
      heading: 'Montserrat',
      body: 'Open Sans',
      style: 'Contemporary',
      description: 'Bold geometric headers with friendly body text',
    },
    {
      heading: 'Roboto',
      body: 'Roboto',
      style: 'Material Design',
      description: 'Google\'s system font, highly readable',
    },
    {
      heading: 'Poppins',
      body: 'Lato',
      style: 'Friendly Modern',
      description: 'Geometric headings with humanist body',
    },
    {
      heading: 'DM Sans',
      body: 'Nunito',
      style: 'Friendly Approachable',
      description: 'Soft, welcoming appearance',
    },
    {
      heading: 'Manrope',
      body: 'Inter',
      style: 'Tech Modern',
      description: 'Contemporary tech aesthetic',
    },
    {
      heading: 'Merriweather',
      body: 'Source Sans Pro',
      style: 'Classic Editorial',
      description: 'Traditional yet modern combination',
    },
  ];

// Generate a type scale based on base size and ratio
export function generateTypeScale(
  baseSize: number = 16,
  ratioKey: keyof typeof SCALE_RATIOS = 'major-third'
): TypographyScale {
  const { ratio, name } = SCALE_RATIOS[ratioKey];

  const sizes = [
    { name: 'xs', steps: -2 },
    { name: 'sm', steps: -1 },
    { name: 'base', steps: 0 },
    { name: 'lg', steps: 1 },
    { name: 'xl', steps: 2 },
    { name: '2xl', steps: 3 },
    { name: '3xl', steps: 4 },
    { name: '4xl', steps: 5 },
    { name: '5xl', steps: 6 },
  ];

  return {
    ratio,
    ratioName: name,
    sizes: sizes.map(({ name: sizeName, steps }) => {
      const size = Math.round(baseSize * Math.pow(ratio, steps) * 100) / 100;
      // Body text (base and smaller) gets higher line-height
      const isBodySize = steps <= 0;
      const lineHeight = isBodySize ? 1.6 : Math.max(1.1, 1.5 - steps * 0.1);

      return {
        name: sizeName,
        size,
        lineHeight: Math.round(lineHeight * 100) / 100,
        letterSpacing: steps >= 3 ? -0.02 : undefined,
      };
    }),
  };
}

// Categorize font by its characteristics
export function categorizeFont(fontFamily: string): Font['category'] {
  const family = fontFamily.toLowerCase();

  // Common sans-serif fonts
  const sansSerif = [
    'inter', 'roboto', 'open sans', 'lato', 'montserrat', 'poppins', 'nunito',
    'source sans', 'arial', 'helvetica', 'verdana', 'tahoma', 'dm sans',
    'manrope', 'work sans', 'rubik', 'karla', 'raleway', 'ubuntu',
  ];

  // Common serif fonts
  const serif = [
    'times', 'georgia', 'playfair', 'merriweather', 'lora', 'noto serif',
    'libre baskerville', 'crimson', 'source serif', 'pt serif', 'eb garamond',
    'cormorant', 'spectral', 'bitter', 'vollkorn',
  ];

  // Display fonts
  const display = [
    'lobster', 'pacifico', 'alfa slab', 'bebas', 'oswald', 'abril fatface',
    'righteous', 'russo', 'fredoka',
  ];

  // Handwriting fonts
  const handwriting = [
    'dancing script', 'great vibes', 'satisfy', 'caveat', 'indie flower',
    'sacramento', 'alex brush', 'allura',
  ];

  // Monospace fonts
  const monospace = [
    'mono', 'courier', 'consolas', 'menlo', 'fira code', 'jetbrains',
    'source code', 'ibm plex mono', 'roboto mono', 'sf mono',
  ];

  if (monospace.some(f => family.includes(f))) return 'monospace';
  if (handwriting.some(f => family.includes(f))) return 'handwriting';
  if (display.some(f => family.includes(f))) return 'display';
  if (serif.some(f => family.includes(f))) return 'serif';
  if (sansSerif.some(f => family.includes(f))) return 'sans-serif';

  // Default to sans-serif
  return 'sans-serif';
}

// Suggest font pairing based on detected fonts
export function suggestFontPairing(detectedFonts: Font[]): {
  recommended: typeof FONT_PAIRINGS[0];
  reason: string;
} {
  // Check if any detected fonts match known pairings
  for (const font of detectedFonts) {
    const family = font.family.toLowerCase();

    for (const pairing of FONT_PAIRINGS) {
      if (
        pairing.heading.toLowerCase().includes(family) ||
        pairing.body.toLowerCase().includes(family)
      ) {
        return {
          recommended: pairing,
          reason: `Based on your use of ${font.family}`,
        };
      }
    }
  }

  // Default recommendation based on detected font category
  const primaryFont = detectedFonts[0];
  if (primaryFont) {
    const category = primaryFont.category;

    if (category === 'serif') {
      return {
        recommended: FONT_PAIRINGS.find(p => p.heading === 'Playfair Display')!,
        reason: 'Complementary serif + sans-serif pairing',
      };
    }

    if (category === 'sans-serif') {
      return {
        recommended: FONT_PAIRINGS.find(p => p.heading === 'Inter')!,
        reason: 'Clean, modern sans-serif system',
      };
    }
  }

  // Default to Inter
  return {
    recommended: FONT_PAIRINGS[0],
    reason: 'Versatile modern pairing suitable for most brands',
  };
}

// Build complete typography system following the 4-font hierarchy
export function buildTypography(detectedFonts: Font[]): Typography {
  const headlines = detectedFonts.find(f => f.category === 'serif' || f.category === 'display') || {
    family: 'Palatino Linotype',
    variants: ['400', '700'],
    category: 'serif' as const,
  };

  const subheadings = detectedFonts.find(f => f.category === 'sans-serif' && f.family !== headlines.family) || {
    family: 'Montserrat',
    variants: ['500', '600'],
    category: 'sans-serif' as const,
  };

  const body = detectedFonts.find(f => f.category === 'sans-serif' && f.family !== subheadings.family) || {
    family: 'PT Sans',
    variants: ['400', '700'],
    category: 'sans-serif' as const,
  };

  const code = detectedFonts.find(f => f.category === 'monospace') || {
    family: 'IBM Plex Mono',
    variants: ['400'],
    category: 'monospace' as const,
  };

  // Define Heading Hierarchy (H1-H6)
  const hierarchy: any = {
    h1: { fontFamily: headlines.family, fontSize: '4.5rem', fontWeight: '400', lineHeight: '1.1', letterSpacing: '-0.02em' },
    h2: { fontFamily: headlines.family, fontSize: '3rem', fontWeight: '400', lineHeight: '1.2' },
    h3: { fontFamily: subheadings.family, fontSize: '1.875rem', fontWeight: '600', lineHeight: '1.3' },
    h4: { fontFamily: subheadings.family, fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
    h5: { fontFamily: subheadings.family, fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.4' },
    h6: { fontFamily: subheadings.family, fontSize: '1rem', fontWeight: '500', lineHeight: '1.5', textTransform: 'uppercase', letterSpacing: '0.05em' },
  };

  // Define Body Variants
  const bodyVariants: any = {
    lead: { fontFamily: body.family, fontSize: '1.25rem', fontWeight: '400', lineHeight: '1.6' },
    body: { fontFamily: body.family, fontSize: '1rem', fontWeight: '400', lineHeight: '1.7' },
    small: { fontFamily: body.family, fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.6' },
    caption: { fontFamily: body.family, fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.5' },
  };

  return {
    headlines,
    subheadings,
    body,
    code,
    hierarchy,
    bodyVariants,
    recommendations: {
      lineHeight: { body: 1.6, heading: 1.1 },
      maxLineLength: { min: 50, max: 75 },
      letterSpacing: { allCaps: '0.05em', large: '-0.02em' },
    },
  };
}

// Parse CSS font-family value to clean font name
export function parseFontFamily(fontFamilyValue: string): string {
  // Remove quotes and get first font in stack
  const fonts = fontFamilyValue
    .split(',')
    .map(f => f.trim().replace(/['"]/g, ''));

  // Return first non-generic font
  const genericFonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];
  const customFont = fonts.find(f => !genericFonts.includes(f.toLowerCase()));

  return customFont || fonts[0] || 'sans-serif';
}
