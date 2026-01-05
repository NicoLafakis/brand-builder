// Brand Kit Type Definitions

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
  usage?: string;
}

export interface Gradient {
  id: string;
  name: string;
  type: 'linear' | 'radial' | 'conic';
  css: string;
  colors: Color[];
  angle?: number; // For linear gradients
  description?: string;
  usage?: string;
  source: 'extracted' | 'generated';
}

export interface GradientPalette {
  extracted: Gradient[];
  suggested: Gradient[];
}

export interface ColorScale {
  50: Color;
  100: Color;
  200: Color;
  300: Color;
  400: Color;
  500: Color;
  600: Color;
  700: Color;
  800: Color;
  900: Color;
  950: Color;
  base: Color;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: Color[];
  utility: Color[];
  semantic: {
    success: Color;
    error: Color;
    warning: Color;
    info: Color;
  };
}

export interface ColorHarmony {
  type: 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'square';
  colors: Color[];
}

export interface WCAGContrast {
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
  passesAAA: boolean;
}

export interface Font {
  family: string;
  variants: string[];
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  source?: string;
  url?: string;
}

export interface TypographyScale {
  ratio: number;
  ratioName: string;
  sizes: {
    name: string;
    size: number;
    lineHeight: number;
    letterSpacing?: number;
  }[];
}

export interface TypographyHierarchy {
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  h5: TypographyStyle;
  h6: TypographyStyle;
}

export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export interface BodyVariants {
  lead: TypographyStyle;
  body: TypographyStyle;
  small: TypographyStyle;
  caption: TypographyStyle;
}

export interface Typography {
  headlines: Font;
  subheadings: Font;
  body: Font;
  code: Font;
  hierarchy: TypographyHierarchy;
  bodyVariants: BodyVariants;
  recommendations: {
    lineHeight: { body: number; heading: number };
    maxLineLength: { min: number; max: number };
    letterSpacing: { allCaps: string; large: string };
  };
}

export interface Logo {
  url: string;
  type: 'primary' | 'favicon' | 'og-image' | 'apple-touch-icon';
  format: string;
  width?: number;
  height?: number;
  dataUrl?: string;
}

export interface BrandArchetype {
  primary: string;
  secondary?: string;
  description: string;
  traits: string[];
  toneAttributes: string[];
}

export interface BrandPersonality {
  archetype: BrandArchetype;
  dimensions: {
    sincerity: number;
    excitement: number;
    competence: number;
    sophistication: number;
    ruggedness: number;
  };
  tone: {
    formalityCasual: number; // 1 = formal, 10 = casual
    seriousFunny: number; // 1 = serious, 10 = funny
    respectfulIrreverent: number; // 1 = respectful, 10 = irreverent
    matterOfFactEnthusiastic: number; // 1 = matter-of-fact, 10 = enthusiastic
  };
}

export interface BrandVoice {
  principles: {
    name: string;
    description: string;
    howToApply: string;
    example: string;
    whatNotToDo: string;
  }[];
  vocabulary: {
    description: string;
    wordsToUse: string[];
    wordsToAvoid: string[];
  };
  toneDescription: string;
  cadenceDescription: string;
}

export interface ExtractedContent {
  title: string;
  description: string;
  headings: string[];
  paragraphs: string[];
  links: { text: string; url: string }[];
  metaTags: Record<string, string>;
}

export interface ButtonStyle {
  label: string;
  background: string;
  hover: string;
  text: string;
  borderRadius: string;
  padding: string;
  fontWeight: string;
  border?: string;
}

export interface ButtonStyles {
  primary: ButtonStyle;
  secondary: ButtonStyle;
  solid: ButtonStyle;
  ghost: ButtonStyle;
}

export interface HeroPreset {
  id: string;
  name: string;
  mood: string[];
  concept: string;
  specs: {
    background: string;
    layout: string;
    typography: string;
    animation: string;
    ctas: string;
  };
  bestFor: string;
}

export interface DesignTokens {
  color: Record<string, {
    $type: 'color';
    $value: {
      colorSpace: string;
      hex: string;
    };
    $description?: string;
  }>;
  spacing: Record<string, {
    $type: 'dimension';
    $value: {
      value: number;
      unit: string;
    };
  }>;
  typography: Record<string, {
    $type: 'typography';
    $value: {
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
      letterSpacing?: string;
    };
  }>;
}

export interface BrandKit {
  id: string;
  domain: string;
  name: string;
  createdAt: string;
  colors: ColorPalette;
  gradients: GradientPalette;
  harmonies: ColorHarmony[];
  typography: Typography;
  buttons: ButtonStyles;
  heroes: HeroPreset[];
  logos: Logo[];
  personality: BrandPersonality;
  voice: BrandVoice;
  extractedContent: ExtractedContent;
  tokens: DesignTokens;
}

export interface ExtractionProgress {
  stage: 'initializing' | 'extracting-colors' | 'extracting-fonts' | 'extracting-logos' |
  'extracting-content' | 'analyzing-personality' | 'generating-palette' |
  'generating-tokens' | 'complete' | 'error';
  progress: number;
  message: string;
}
