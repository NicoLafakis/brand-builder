import { v4 as uuidv4 } from 'uuid';
import chroma from 'chroma-js';
import type { Color, ColorPalette, ColorScale, Gradient, GradientPalette } from '../types/brand';
import type { ExtractedGradient } from '../services/extractor';
import { parseColor } from './color';
import { isOpenAIAvailable } from '../services/openai';

// Helper to get the base color from a ColorScale
function getBaseColor(scale: ColorScale): Color {
  return scale.base || scale[500];
}

// Helper to get a lighter shade from a ColorScale
function getLighterShade(scale: ColorScale): Color {
  return scale[200] || scale[100];
}

/**
 * Extract colors from a CSS gradient string
 */
function extractColorsFromGradient(css: string): Color[] {
  const colors: Color[] = [];

  // Match color values in the gradient
  // Handles: hex, rgb, rgba, hsl, hsla, and named colors
  const colorPatterns = [
    /#[0-9a-fA-F]{3,8}\b/g, // hex
    /rgba?\([^)]+\)/g, // rgb/rgba
    /hsla?\([^)]+\)/g, // hsl/hsla
  ];

  for (const pattern of colorPatterns) {
    const matches = css.match(pattern);
    if (matches) {
      for (const match of matches) {
        const parsed = parseColor(match);
        if (parsed) {
          colors.push(parsed);
        }
      }
    }
  }

  return colors;
}

/**
 * Parse extracted gradients into full Gradient objects
 */
export function parseExtractedGradients(extracted: ExtractedGradient[]): Gradient[] {
  return extracted.map((g, index) => {
    const colors = extractColorsFromGradient(g.css);

    return {
      id: uuidv4(),
      name: `Extracted Gradient ${index + 1}`,
      type: g.type,
      css: g.css,
      colors,
      angle: g.angle,
      source: 'extracted' as const,
    };
  });
}

/**
 * Generate gradient name based on its colors
 */
function generateGradientName(colors: Color[], type: string): string {
  if (colors.length < 2) return 'Gradient';

  const colorNames: string[] = [];
  for (const color of colors.slice(0, 2)) {
    const { h, s, l } = color.hsl;

    if (s < 10) {
      if (l < 30) colorNames.push('Dark');
      else if (l > 70) colorNames.push('Light');
      else colorNames.push('Gray');
    } else {
      if (h < 30) colorNames.push('Warm');
      else if (h < 90) colorNames.push('Golden');
      else if (h < 150) colorNames.push('Fresh');
      else if (h < 210) colorNames.push('Cool');
      else if (h < 270) colorNames.push('Deep');
      else if (h < 330) colorNames.push('Rich');
      else colorNames.push('Warm');
    }
  }

  return colorNames.join(' to ');
}

/**
 * Generate fallback gradients based on the color palette using design best practices
 */
export function generateFallbackGradients(colorPalette: ColorPalette): Gradient[] {
  const gradients: Gradient[] = [];
  const primary = getBaseColor(colorPalette.primary);
  const secondary = getBaseColor(colorPalette.secondary);
  const accent = getBaseColor(colorPalette.accent);

  if (!primary) return gradients;

  // 1. Primary to lighter variant (subtle brand gradient)
  const primaryLight = chroma(primary.hex).brighten(1.5).hex();
  gradients.push({
    id: uuidv4(),
    name: 'Brand Subtle',
    type: 'linear',
    css: `linear-gradient(135deg, ${primary.hex} 0%, ${primaryLight} 100%)`,
    colors: [primary, parseColor(primaryLight)!],
    angle: 135,
    description: 'A subtle gradient using your primary brand color',
    usage: 'Hero sections, headers, cards',
    source: 'generated',
  });

  // 2. Primary to secondary (brand transition)
  if (secondary) {
    gradients.push({
      id: uuidv4(),
      name: 'Brand Transition',
      type: 'linear',
      css: `linear-gradient(90deg, ${primary.hex} 0%, ${secondary.hex} 100%)`,
      colors: [primary, secondary],
      angle: 90,
      description: 'Smooth transition between primary and secondary colors',
      usage: 'Backgrounds, dividers, progress bars',
      source: 'generated',
    });
  }

  // 3. Accent highlight gradient
  if (accent) {
    const accentDark = chroma(accent.hex).darken(0.5).hex();
    gradients.push({
      id: uuidv4(),
      name: 'Accent Highlight',
      type: 'linear',
      css: `linear-gradient(45deg, ${accentDark} 0%, ${accent.hex} 50%, ${chroma(accent.hex).brighten(0.5).hex()} 100%)`,
      colors: [parseColor(accentDark)!, accent, parseColor(chroma(accent.hex).brighten(0.5).hex())!],
      angle: 45,
      description: 'Eye-catching gradient for call-to-action elements',
      usage: 'Buttons, CTAs, badges',
      source: 'generated',
    });
  }

  // 4. Modern glass morphism gradient (using neutrals)
  const neutral100 = colorPalette.neutral[1]?.hex || '#f3f4f6';
  const neutral200 = colorPalette.neutral[2]?.hex || '#e5e7eb';
  gradients.push({
    id: uuidv4(),
    name: 'Glass Surface',
    type: 'linear',
    css: `linear-gradient(180deg, ${neutral100}80 0%, ${neutral200}60 100%)`,
    colors: [parseColor(neutral100)!, parseColor(neutral200)!],
    angle: 180,
    description: 'Semi-transparent gradient for glass morphism effects',
    usage: 'Cards, modals, overlays',
    source: 'generated',
  });

  // 5. Radial spotlight gradient
  gradients.push({
    id: uuidv4(),
    name: 'Spotlight',
    type: 'radial',
    css: `radial-gradient(circle at center, ${primary.hex}20 0%, transparent 70%)`,
    colors: [primary],
    description: 'Subtle radial gradient for spotlight effects',
    usage: 'Background accents, focus areas',
    source: 'generated',
  });

  // 6. Mesh-style multi-color gradient (modern trend)
  if (secondary && accent) {
    gradients.push({
      id: uuidv4(),
      name: 'Mesh Gradient',
      type: 'linear',
      css: `linear-gradient(135deg, ${primary.hex} 0%, ${secondary.hex} 50%, ${accent.hex} 100%)`,
      colors: [primary, secondary, accent],
      angle: 135,
      description: 'Modern multi-color gradient for bold statements',
      usage: 'Feature sections, landing pages',
      source: 'generated',
    });
  }

  return gradients;
}

/**
 * AI-powered gradient generation prompt context
 */
const GRADIENT_AI_CONTEXT = `You are an expert web designer specializing in modern gradient design.
Your task is to suggest beautiful, on-trend gradients based on a brand's color palette.

Consider these modern gradient trends for 2024-2025:
1. Subtle, sophisticated gradients with minimal contrast
2. Mesh gradients with multiple color stops
3. Aurora/Northern lights inspired gradients
4. Glassmorphism-compatible gradients (semi-transparent)
5. Vibrant accent gradients for CTAs
6. Duotone gradients for images
7. Animated gradient possibilities (CSS custom properties)

Best practices:
- Ensure color transitions are smooth (avoid muddy middle colors)
- Consider the brand personality when choosing gradient style
- Provide both bold and subtle options
- Include at least one dark mode friendly option
- Suggest appropriate use cases for each gradient`;

/**
 * Generate gradients using AI based on color palette and brand personality
 */
export async function generateGradientsWithAI(
  colorPalette: ColorPalette,
  brandName: string
): Promise<Gradient[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateFallbackGradients(colorPalette);
  }

  const primary = getBaseColor(colorPalette.primary);
  const secondary = getBaseColor(colorPalette.secondary);
  const accent = getBaseColor(colorPalette.accent);

  if (!primary) {
    return [];
  }

  const colorContext = `
Brand: ${brandName}
Primary Color: ${primary.hex} (${primary.hsl.h}° hue, ${primary.hsl.s}% saturation, ${primary.hsl.l}% lightness)
${secondary ? `Secondary Color: ${secondary.hex}` : 'No secondary color'}
${accent ? `Accent Color: ${accent.hex}` : 'No accent color'}
Neutral Colors: ${colorPalette.neutral.slice(0, 3).map(c => c.hex).join(', ')}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini-2025-04-14',
        messages: [
          { role: 'system', content: GRADIENT_AI_CONTEXT },
          {
            role: 'user',
            content: `Based on the following brand colors, generate 6 modern, beautiful CSS gradients.

${colorContext}

For each gradient, provide:
1. A creative name
2. The CSS gradient value (use linear-gradient, radial-gradient, or conic-gradient)
3. A brief description of the gradient's mood/style
4. Suggested use cases

Respond ONLY with valid JSON in this exact format:
{
  "gradients": [
    {
      "name": "Gradient Name",
      "type": "linear",
      "css": "linear-gradient(135deg, #color1 0%, #color2 100%)",
      "angle": 135,
      "description": "Brief description",
      "usage": "Suggested use cases"
    }
  ]
}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      console.warn('AI gradient generation failed, using fallback');
      return generateFallbackGradients(colorPalette);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return generateFallbackGradients(colorPalette);
    }

    const parsed = JSON.parse(content);

    return parsed.gradients.map((g: {
      name: string;
      type: 'linear' | 'radial' | 'conic';
      css: string;
      angle?: number;
      description?: string;
      usage?: string;
    }) => ({
      id: uuidv4(),
      name: g.name,
      type: g.type || 'linear',
      css: g.css,
      colors: extractColorsFromGradient(g.css),
      angle: g.angle,
      description: g.description,
      usage: g.usage,
      source: 'generated' as const,
    }));
  } catch (error) {
    console.warn('AI gradient generation error:', error);
    return generateFallbackGradients(colorPalette);
  }
}

/**
 * Build the complete gradient palette (extracted + suggested)
 */
export async function buildGradientPalette(
  extractedGradients: ExtractedGradient[],
  colorPalette: ColorPalette,
  brandName: string
): Promise<GradientPalette> {
  // Parse extracted gradients
  const extracted = parseExtractedGradients(extractedGradients);

  // Generate suggested gradients (AI or fallback)
  let suggested: Gradient[];

  if (isOpenAIAvailable()) {
    suggested = await generateGradientsWithAI(colorPalette, brandName);
  } else {
    suggested = generateFallbackGradients(colorPalette);
  }

  return {
    extracted,
    suggested,
  };
}
