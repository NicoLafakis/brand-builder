import { v4 as uuidv4 } from 'uuid';
import type { BrandKit, ExtractionProgress } from '../types/brand';
import { extractBrandAssets } from './extractor';
import { buildColorPalette, generateHarmonies } from '../utils/color';
import { buildGradientPalette } from '../utils/gradient';
import { buildTypography } from '../utils/typography';
import { buildBrandPersonalityEnhanced, generateBrandVoiceEnhanced } from '../utils/personality';
import { generateDesignTokens } from '../utils/tokens';
import { buildButtonStyles } from '../utils/buttons';
import { buildHeroPresets } from '../utils/heroes';
import { isOpenAIAvailable } from './openai';

export type ProgressCallback = (progress: ExtractionProgress) => void;

// Extract domain name from URL for brand name
function extractBrandName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. and get the domain name without TLD
    const parts = hostname.replace(/^www\./, '').split('.');
    const name = parts[0];
    // Capitalize first letter
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'Brand';
  }
}

// Main function to build a complete brand kit from a URL
export async function buildBrandKit(
  url: string,
  onProgress?: ProgressCallback
): Promise<BrandKit> {
  const progress = (
    stage: ExtractionProgress['stage'],
    progressPercent: number,
    message: string
  ) => {
    onProgress?.({ stage, progress: progressPercent, message });
  };

  // Initialize
  progress('initializing', 0, 'Starting brand extraction...');

  // Ensure URL has protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const brandName = extractBrandName(url);

  // Extract brand assets from the website
  progress('extracting-colors', 10, 'Extracting colors from website...');

  let extractedData;
  try {
    extractedData = await extractBrandAssets(url);
  } catch (error) {
    progress('error', 0, `Failed to extract from website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }

  progress('extracting-fonts', 30, 'Analyzing typography...');

  // Build color palette
  progress('generating-palette', 50, 'Generating color palette and harmonies...');
  const colorPalette = buildColorPalette(extractedData.colors);

  // Generate color harmonies from primary base color (500)
  const harmonies = colorPalette.primary[500]
    ? generateHarmonies(colorPalette.primary[500])
    : [];

  // Build gradient palette (extracted + AI-generated)
  progress('generating-palette', 55, 'Generating gradient swatches...');
  const gradients = await buildGradientPalette(
    extractedData.gradients,
    colorPalette,
    brandName
  );

  // Build typography system
  progress('extracting-fonts', 60, 'Building typography system...');
  const typography = buildTypography(extractedData.fonts);

  // Analyze brand personality (uses AI when available for intelligent analysis)
  progress('analyzing-personality', 70, 'Analyzing brand personality...');
  const personality = await buildBrandPersonalityEnhanced(extractedData.content);

  // Generate brand voice guidelines (uses AI when available)
  progress('analyzing-personality', 80, 'Generating brand voice guidelines...');
  const voice = await generateBrandVoiceEnhanced(personality, extractedData.content);

  // Generate button styles
  progress('generating-tokens', 82, 'Creating button styles...');
  const buttons = buildButtonStyles(colorPalette);

  // Generate hero presets
  progress('generating-tokens', 85, 'Creating hero/component presets...');
  const heroes = buildHeroPresets(colorPalette, typography);

  // Generate design tokens
  progress('generating-tokens', 88, 'Generating design tokens...');
  const tokens = generateDesignTokens(colorPalette, typography);

  // Compile final brand kit
  progress('complete', 100, 'Brand kit generation complete!');

  const brandKit: BrandKit = {
    id: uuidv4(),
    domain: new URL(url).hostname,
    name: brandName,
    createdAt: new Date().toISOString(),
    colors: colorPalette,
    gradients,
    harmonies,
    typography,
    buttons,
    heroes,
    logos: extractedData.logos,
    personality,
    voice,
    extractedContent: extractedData.content,
    tokens,
  };

  return brandKit;
}
