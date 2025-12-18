import { v4 as uuidv4 } from 'uuid';
import type { BrandKit, ExtractionProgress } from '../types/brand';
import { extractBrandAssets } from './extractor';
import { buildColorPalette, generateHarmonies } from '../utils/color';
import { buildTypography } from '../utils/typography';
import { buildBrandPersonality, generateBrandVoice } from '../utils/personality';
import { generateDesignTokens } from '../utils/tokens';

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

  // Generate color harmonies from primary color
  const harmonies = colorPalette.primary[0]
    ? generateHarmonies(colorPalette.primary[0])
    : [];

  // Build typography system
  progress('extracting-fonts', 60, 'Building typography system...');
  const typography = buildTypography(extractedData.fonts);

  // Analyze brand personality
  progress('analyzing-personality', 70, 'Analyzing brand personality...');
  const personality = buildBrandPersonality(extractedData.content);

  // Generate brand voice guidelines
  const voice = generateBrandVoice(personality, extractedData.content);

  // Generate design tokens
  progress('generating-tokens', 85, 'Generating design tokens...');
  const tokens = generateDesignTokens(colorPalette, typography);

  // Compile final brand kit
  progress('complete', 100, 'Brand kit generation complete!');

  const brandKit: BrandKit = {
    id: uuidv4(),
    domain: new URL(url).hostname,
    name: brandName,
    createdAt: new Date().toISOString(),
    colors: colorPalette,
    harmonies,
    typography,
    logos: extractedData.logos,
    personality,
    voice,
    extractedContent: extractedData.content,
    tokens,
  };

  return brandKit;
}
