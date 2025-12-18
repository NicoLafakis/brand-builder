// Brand Kit Type Definitions

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
  usage?: string;
}

export interface ColorPalette {
  primary: Color[];
  secondary: Color[];
  accent: Color[];
  neutral: Color[];
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

export interface Typography {
  headingFont: Font;
  bodyFont: Font;
  scale: TypographyScale;
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
  harmonies: ColorHarmony[];
  typography: Typography;
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
