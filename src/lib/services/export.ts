import JSZip from 'jszip';
import type { BrandKit, ColorScale, Color } from '../types/brand';
import { generateBrandGuidelinesPDF } from './pdf-generator';
import {
  generateCSSVariables,
  generateSCSSVariables,
  generateTailwindConfig,
  generateTokensJSON,
} from '../utils/tokens';

// Helper to convert ColorScale object to array of colors with shade names
function colorScaleToArray(scale: ColorScale): (Color & { shade: number })[] {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  return shades.map(shade => ({ ...scale[shade], shade }));
}

// Generate complete brand kit ZIP file
export async function generateBrandKitZip(brandKit: BrandKit): Promise<Blob> {
  const zip = new JSZip();

  // Create folder structure
  const guidelinesFolder = zip.folder('01-guidelines');
  const logosFolder = zip.folder('02-logos');
  const colorsFolder = zip.folder('03-colors');
  const tokensFolder = zip.folder('05-tokens');

  // 1. Generate and add PDF guidelines
  try {
    const pdfBuffer = await generateBrandGuidelinesPDF(brandKit);
    guidelinesFolder?.file('brand-guidelines.pdf', pdfBuffer);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    // Add a text version instead
    guidelinesFolder?.file('brand-guidelines.txt', generateTextGuidelines(brandKit));
  }

  // 2. Add logo information
  const logoReadme = generateLogoReadme(brandKit);
  logosFolder?.file('README.md', logoReadme);

  // Add logo URLs for reference
  const logoUrls = brandKit.logos.map(logo => `${logo.type}: ${logo.url}`).join('\n');
  logosFolder?.file('logo-sources.txt', logoUrls);

  // 3. Add color files
  const colorPaletteJSON = JSON.stringify({
    primary: brandKit.colors.primary,
    secondary: brandKit.colors.secondary,
    accent: brandKit.colors.accent,
    neutral: brandKit.colors.neutral,
    semantic: brandKit.colors.semantic,
  }, null, 2);
  colorsFolder?.file('palette.json', colorPaletteJSON);

  // Generate ASE-like color reference
  const colorSwatches = generateColorSwatches(brandKit);
  colorsFolder?.file('swatches.md', colorSwatches);

  // 4. Add design tokens
  tokensFolder?.file('tokens.json', generateTokensJSON(brandKit));
  tokensFolder?.file('tokens.css', generateCSSVariables(brandKit.tokens));
  tokensFolder?.file('tokens.scss', generateSCSSVariables(brandKit.tokens));
  tokensFolder?.file('tailwind.config.js', generateTailwindConfig(brandKit.tokens, brandKit.typography));

  // 5. Add typography information
  const typographyMd = generateTypographyDoc(brandKit);
  zip.file('04-typography/typography.md', typographyMd);

  // 6. Add brand voice document
  const voiceMd = generateVoiceDoc(brandKit);
  zip.file('06-voice/brand-voice.md', voiceMd);

  // 7. Add summary README
  zip.file('README.md', generateReadme(brandKit));

  // Generate ZIP blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  return blob;
}

// Generate text version of guidelines
function generateTextGuidelines(brandKit: BrandKit): string {
  const primaryColors = colorScaleToArray(brandKit.colors.primary);
  const secondaryColors = colorScaleToArray(brandKit.colors.secondary);
  const accentColors = colorScaleToArray(brandKit.colors.accent);

  return `
${brandKit.name} BRAND GUIDELINES
${'='.repeat(50)}

Generated: ${new Date().toLocaleDateString()}
Domain: ${brandKit.domain}

COLOR PALETTE
-------------

Primary Colors:
${primaryColors.map(c => `  ${c.name || `Primary ${c.shade}`}: ${c.hex}`).join('\n')}

Secondary Colors:
${secondaryColors.map(c => `  ${c.name || `Secondary ${c.shade}`}: ${c.hex}`).join('\n')}

Accent Colors:
${accentColors.map(c => `  ${c.name || `Accent ${c.shade}`}: ${c.hex}`).join('\n')}

Semantic Colors:
  Success: ${brandKit.colors.semantic.success.hex}
  Error: ${brandKit.colors.semantic.error.hex}
  Warning: ${brandKit.colors.semantic.warning.hex}
  Info: ${brandKit.colors.semantic.info.hex}


TYPOGRAPHY
----------

Heading Font: ${brandKit.typography.headlines.family}
Body Font: ${brandKit.typography.body.family}

BRAND VOICE
-----------

Archetype: ${brandKit.personality.archetype.primary}
Description: ${brandKit.personality.archetype.description}

Tone: ${brandKit.voice.toneDescription}

Voice Principles:
${brandKit.voice.principles.map(p => `
  ${p.name}
  ${p.description}
  Apply: ${p.howToApply}
  Example: ${p.example}
  Avoid: ${p.whatNotToDo}
`).join('\n')}

Words to Use: ${brandKit.voice.vocabulary.wordsToUse.join(', ')}
Words to Avoid: ${brandKit.voice.vocabulary.wordsToAvoid.join(', ')}
`.trim();
}

// Generate logo readme
function generateLogoReadme(brandKit: BrandKit): string {
  return `# Logo Assets

## Source URLs

${brandKit.logos.map(logo => `
### ${logo.type.charAt(0).toUpperCase() + logo.type.slice(1)}
- URL: ${logo.url}
- Format: ${logo.format}
${logo.width ? `- Dimensions: ${logo.width}x${logo.height}` : ''}
`).join('\n')}

## Usage Guidelines

1. **Clear Space**: Maintain minimum clear space around the logo equal to the height of the logomark.

2. **Minimum Size**: Do not reproduce the logo smaller than 24px in height for digital or 10mm for print.

3. **Background**: Ensure sufficient contrast between the logo and its background.

4. **Do Not**:
   - Stretch or distort the logo
   - Change the logo colors outside of approved variations
   - Add effects like shadows or gradients
   - Place the logo on busy backgrounds
`;
}

// Generate color swatches markdown
function generateColorSwatches(brandKit: BrandKit): string {
  const formatColor = (color: Color, name: string) => `
### ${name}
- **HEX**: ${color.hex}
- **RGB**: rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})
- **HSL**: hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)
`;

  const primaryColors = colorScaleToArray(brandKit.colors.primary);
  const secondaryColors = colorScaleToArray(brandKit.colors.secondary);
  const accentColors = colorScaleToArray(brandKit.colors.accent);

  return `# Color Swatches

## Primary Colors
${primaryColors.map(c => formatColor(c, c.name || `Primary ${c.shade}`)).join('\n')}

## Secondary Colors
${secondaryColors.map(c => formatColor(c, c.name || `Secondary ${c.shade}`)).join('\n')}

## Accent Colors
${accentColors.map(c => formatColor(c, c.name || `Accent ${c.shade}`)).join('\n')}

## Semantic Colors
${formatColor(brandKit.colors.semantic.success, 'Success')}
${formatColor(brandKit.colors.semantic.error, 'Error')}
${formatColor(brandKit.colors.semantic.warning, 'Warning')}
${formatColor(brandKit.colors.semantic.info, 'Info')}

## Neutral Scale
${brandKit.colors.neutral.map((c, i) => `- Neutral ${(10 - i) * 100}: ${c.hex}`).join('\n')}
`;
}

// Generate typography documentation
function generateTypographyDoc(brandKit: BrandKit): string {
  return `# Typography System

## Font Families

### Heading Font
- **Family**: ${brandKit.typography.headlines.family}
- **Category**: ${brandKit.typography.headlines.category}
- **Weights**: ${brandKit.typography.headlines.variants.join(', ')}

### Body Font
- **Family**: ${brandKit.typography.body.family}
- **Category**: ${brandKit.typography.body.category}
- **Weights**: ${brandKit.typography.body.variants.join(', ')}

## Guidelines

- **Body Line Height**: ${brandKit.typography.recommendations.lineHeight.body}
- **Heading Line Height**: ${brandKit.typography.recommendations.lineHeight.heading}
- **Optimal Line Length**: ${brandKit.typography.recommendations.maxLineLength.min}-${brandKit.typography.recommendations.maxLineLength.max} characters
- **All-Caps Tracking**: ${brandKit.typography.recommendations.letterSpacing.allCaps}
- **Large Display Tracking**: ${brandKit.typography.recommendations.letterSpacing.large}

## Implementation

\`\`\`css
/* Heading Styles */
h1, h2, h3 {
  font-family: "${brandKit.typography.headlines.family}", ${brandKit.typography.headlines.category};
  line-height: ${brandKit.typography.recommendations.lineHeight.heading};
}

/* Body Styles */
body, p {
  font-family: "${brandKit.typography.body.family}", ${brandKit.typography.body.category};
  line-height: ${brandKit.typography.recommendations.lineHeight.body};
}
\`\`\`
`;
}

// Generate voice documentation
function generateVoiceDoc(brandKit: BrandKit): string {
  return `# Brand Voice Guidelines

## Brand Archetype

**${brandKit.personality.archetype.primary}**${brandKit.personality.archetype.secondary ? ` / ${brandKit.personality.archetype.secondary}` : ''}

${brandKit.personality.archetype.description}

### Key Traits
${brandKit.personality.archetype.traits.map(t => `- ${t}`).join('\n')}

### Tone Attributes
${brandKit.personality.archetype.toneAttributes.map(t => `- ${t}`).join('\n')}

## Tone Description

${brandKit.voice.toneDescription}

## Voice Principles

${brandKit.voice.principles.map(p => `
### ${p.name}

${p.description}

**How to Apply**: ${p.howToApply}

> **Example**: ${p.example}

**What NOT to Do**: ${p.whatNotToDo}
`).join('\n')}

## Vocabulary

${brandKit.voice.vocabulary.description}

### Words to Use
${brandKit.voice.vocabulary.wordsToUse.map(w => `- ${w}`).join('\n')}

### Words to Avoid
${brandKit.voice.vocabulary.wordsToAvoid.map(w => `- ${w}`).join('\n')}

## Cadence

${brandKit.voice.cadenceDescription}

## Tone Dimensions

| Dimension | Score (1-10) |
|-----------|--------------|
| Formal ↔ Casual | ${brandKit.personality.tone.formalityCasual} |
| Serious ↔ Funny | ${brandKit.personality.tone.seriousFunny} |
| Respectful ↔ Irreverent | ${brandKit.personality.tone.respectfulIrreverent} |
| Matter-of-fact ↔ Enthusiastic | ${brandKit.personality.tone.matterOfFactEnthusiastic} |
`;
}

// Generate main README
function generateReadme(brandKit: BrandKit): string {
  return `# ${brandKit.name} Brand Kit

Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

## Contents

\`\`\`
brand-kit/
├── 01-guidelines/
│   └── brand-guidelines.pdf    # Complete brand guidelines document
├── 02-logos/
│   ├── README.md               # Logo usage guidelines
│   └── logo-sources.txt        # Original logo URLs
├── 03-colors/
│   ├── palette.json            # Full color palette data
│   └── swatches.md             # Color swatches documentation
├── 04-typography/
│   └── typography.md           # Typography system documentation
├── 05-tokens/
│   ├── tokens.json             # W3C DTCG format design tokens
│   ├── tokens.css              # CSS custom properties
│   ├── tokens.scss             # SCSS variables
│   └── tailwind.config.js      # Tailwind CSS extension
├── 06-voice/
│   └── brand-voice.md          # Brand voice guidelines
└── README.md                   # This file
\`\`\`

## Quick Start

### Using CSS Variables

\`\`\`html
<link rel="stylesheet" href="tokens/tokens.css">
\`\`\`

### Using with Tailwind

Copy the contents of \`tokens/tailwind.config.js\` into your Tailwind configuration.

### Using Design Tokens

Import \`tokens/tokens.json\` into your design token management system.

## Brand Overview

- **Primary Color**: ${brandKit.colors.primary.base?.hex || brandKit.colors.primary[500]?.hex || 'N/A'}
- **Heading Font**: ${brandKit.typography.headlines.family}
- **Body Font**: ${brandKit.typography.body.family}
- **Brand Archetype**: ${brandKit.personality.archetype.primary}

## Generated by Brand Kit Generator

This brand kit was automatically generated by analyzing ${brandKit.domain}.
`;
}

// Export individual files
export async function exportAsPDF(brandKit: BrandKit): Promise<Buffer> {
  return generateBrandGuidelinesPDF(brandKit);
}

export function exportAsJSON(brandKit: BrandKit): string {
  return JSON.stringify(brandKit, null, 2);
}

export function exportTokensAsCSS(brandKit: BrandKit): string {
  return generateCSSVariables(brandKit.tokens);
}

export function exportTokensAsSCSS(brandKit: BrandKit): string {
  return generateSCSSVariables(brandKit.tokens);
}
