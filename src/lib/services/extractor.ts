import * as cheerio from 'cheerio';
import * as csstree from 'css-tree';
import type { Color, ExtractedContent, Font, Logo } from '../types/brand';
import { parseColor } from '../utils/color';
import { categorizeFont, parseFontFamily } from '../utils/typography';

export interface ExtractedGradient {
  css: string;
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
}

export interface ExtractionResult {
  colors: string[];
  gradients: ExtractedGradient[];
  fonts: Font[];
  logos: Logo[];
  content: ExtractedContent;
}

interface RawCSSData {
  colors: Set<string>;
  gradients: Set<string>;
  fonts: Map<string, { weights: Set<string>; source?: string }>;
  cssVariables: Map<string, string>;
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const FIRECRAWL_API = 'https://api.firecrawl.dev/v1/scrape';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Capture a screenshot of a URL using Firecrawl API
async function captureScreenshot(url: string): Promise<string | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    console.log('FIRECRAWL_API_KEY not set, skipping vision extraction');
    return null;
  }

  try {
    const response = await fetch(FIRECRAWL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: url,
        formats: ['screenshot'],
        waitFor: 2000, // Wait for page to load
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Screenshot capture failed:', response.status, error);
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.data?.screenshot) {
      console.error('Screenshot not available in response:', data.error || 'No screenshot returned');
      return null;
    }

    // Firecrawl returns a URL to the screenshot, fetch and convert to base64
    const screenshotUrl = data.data.screenshot;

    // If it's already a data URL, return it directly
    if (screenshotUrl.startsWith('data:')) {
      return screenshotUrl;
    }

    // Otherwise fetch the screenshot and convert to base64
    const imageResponse = await fetch(screenshotUrl);
    if (!imageResponse.ok) {
      console.error('Failed to fetch screenshot image:', imageResponse.status);
      return null;
    }

    const buffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Screenshot capture error:', error);
    return null;
  }
}

// Vision-based brand extraction using GPT-4o-mini
interface VisionExtractionResult {
  colors: string[];
  gradients: ExtractedGradient[];
  fonts: Font[];
  description: string;
}

async function extractBrandAssetsWithVision(screenshotBase64: string, websiteUrl: string): Promise<VisionExtractionResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const prompt = `Analyze this website screenshot and extract the brand's visual identity.

Website URL: ${websiteUrl}

Please identify:

1. **Brand Colors** (provide exact hex codes):
   - Primary color (the main brand color, usually in logo/buttons/headers)
   - Secondary color(s) (supporting colors)
   - Accent color(s) (used for CTAs, highlights)
   - Background colors (if notable, not just white/black)

2. **Typography** (identify the font families you see):
   - Heading font (used for titles, usually bolder/larger)
   - Body font (used for paragraphs, usually more readable)
   - Note the style: serif, sans-serif, display, monospace

3. **Gradients** (if any are visible):
   - Describe any gradient backgrounds or elements
   - Provide the CSS gradient if you can determine the colors

4. **Overall Brand Aesthetic**:
   - Brief description of the visual style (modern, classic, playful, corporate, etc.)

Respond ONLY with valid JSON in this exact format:
{
  "colors": [
    {"hex": "#XXXXXX", "role": "primary"},
    {"hex": "#XXXXXX", "role": "secondary"},
    {"hex": "#XXXXXX", "role": "accent"}
  ],
  "fonts": [
    {"family": "Font Name", "category": "sans-serif", "usage": "heading"},
    {"family": "Font Name", "category": "sans-serif", "usage": "body"}
  ],
  "gradients": [
    {"css": "linear-gradient(90deg, #XXX, #XXX)", "type": "linear", "angle": 90}
  ],
  "aesthetic": "Brief description of the brand's visual style"
}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: screenshotBase64,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Vision API error:', response.status, error);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // Parse the JSON response (handle markdown code blocks if present)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    const parsed = JSON.parse(jsonStr.trim());

    // Transform to our format
    const colors = (parsed.colors || [])
      .map((c: { hex: string }) => c.hex)
      .filter((hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex));

    const fonts: Font[] = (parsed.fonts || []).map((f: { family: string; category?: string; usage?: string }) => ({
      family: parseFontFamily(f.family),
      variants: ['400', '700'],
      category: f.category || categorizeFont(f.family),
      source: 'vision-detected',
    }));

    const gradients: ExtractedGradient[] = (parsed.gradients || []).map((g: { css: string; type?: string; angle?: number }) => ({
      css: g.css,
      type: (g.type as 'linear' | 'radial' | 'conic') || 'linear',
      angle: g.angle,
    }));

    return {
      colors,
      gradients,
      fonts,
      description: parsed.aesthetic || '',
    };
  } catch (error) {
    console.error('Vision extraction failed:', error);
    return null;
  }
}

// Extract all brand assets from a URL
// Priority: Vision (screenshot) > CSS parsing > LLM interpretation
export async function extractBrandAssets(url: string): Promise<ExtractionResult> {
  // Start screenshot capture in parallel with HTML fetch
  const [screenshotPromise, htmlResponse] = await Promise.all([
    captureScreenshot(url),
    fetch(url, { headers: { 'User-Agent': USER_AGENT } }),
  ]);

  if (!htmlResponse.ok) {
    throw new Error(`Failed to fetch ${url}: ${htmlResponse.status}`);
  }

  const html = await htmlResponse.text();
  const $ = cheerio.load(html);
  const origin = new URL(url).origin;

  // Extract content and logos from HTML (always needed)
  const [content, logos] = await Promise.all([
    extractContent($),
    extractLogos($, origin),
  ]);

  // Try vision-based extraction first (most accurate)
  const screenshot = await screenshotPromise;
  let colors: string[] = [];
  let gradients: ExtractedGradient[] = [];
  let fonts: Font[] = [];

  if (screenshot) {
    console.log('Using vision-based extraction...');
    const visionResult = await extractBrandAssetsWithVision(screenshot, url);

    if (visionResult) {
      colors = visionResult.colors;
      gradients = visionResult.gradients;
      fonts = visionResult.fonts;
      console.log(`Vision extracted: ${colors.length} colors, ${fonts.length} fonts`);
    }
  }

  // Fallback to CSS parsing if vision didn't work or returned limited results
  if (colors.length < 3 || fonts.length < 1) {
    console.log('Falling back to CSS parsing...');
    const cssData = await collectCSSData($, origin);

    const cssColors = parseColorsFromCSS(cssData);
    const cssGradients = parseGradientsFromCSS(cssData);
    const cssFonts = parseFontsFromCSS(cssData);

    // Merge with vision results (vision takes priority)
    if (colors.length < 3) {
      colors.push(...cssColors.filter(c => !colors.includes(c)));
    }
    if (gradients.length === 0) {
      gradients = cssGradients;
    }
    if (fonts.length < 1) {
      fonts.push(...cssFonts.filter(f => !fonts.some(existing => existing.family === f.family)));
    }

    // If still limited, try LLM interpretation of CSS
    if ((colors.length < 3 || fonts.length < 1) && process.env.OPENAI_API_KEY) {
      console.log('Using LLM CSS interpretation...');
      const llmResults = await interpretBrandAssetsWithLLM(cssData, content);

      if (llmResults.suggestedColors.length > 0 && colors.length < 3) {
        const validLLMColors = llmResults.suggestedColors
          .map(c => parseColor(c))
          .filter((c): c is Color => c !== null)
          .map(c => c.hex);
        colors.push(...validLLMColors.filter(c => !colors.includes(c)));
      }

      if (llmResults.suggestedFonts.length > 0 && fonts.length < 1) {
        fonts.push(...llmResults.suggestedFonts.filter(f =>
          !fonts.some(existing => existing.family === f.family)
        ));
      }
    }
  }

  return { colors, gradients, fonts, logos, content };
}

// Collect all CSS data from the page
async function collectCSSData($: cheerio.CheerioAPI, origin: string): Promise<RawCSSData> {
  const cssData: RawCSSData = {
    colors: new Set(),
    gradients: new Set(),
    fonts: new Map(),
    cssVariables: new Map(),
  };

  // 1. Extract from inline styles
  $('[style]').each((_, el) => {
    const style = $(el).attr('style');
    if (style) {
      parseInlineStyle(style, cssData);
    }
  });

  // 2. Extract from <style> tags
  $('style').each((_, el) => {
    const cssText = $(el).html();
    if (cssText) {
      parseCSS(cssText, cssData);
    }
  });

  // 3. Fetch and parse external stylesheets
  const stylesheetUrls: string[] = [];
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      const absoluteUrl = href.startsWith('http') ? href : new URL(href, origin).href;
      stylesheetUrls.push(absoluteUrl);
    }
  });

  // Fetch external stylesheets in parallel (limit to 5 to avoid overwhelming)
  const stylesheetPromises = stylesheetUrls.slice(0, 5).map(async (cssUrl) => {
    try {
      const res = await fetch(cssUrl, {
        headers: { 'User-Agent': USER_AGENT },
      });
      if (res.ok) {
        return await res.text();
      }
    } catch {
      // Ignore fetch errors for external CSS
    }
    return null;
  });

  const stylesheets = await Promise.all(stylesheetPromises);
  stylesheets.forEach(css => {
    if (css) {
      parseCSS(css, cssData);
    }
  });

  // 4. Look for Google Fonts links
  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      extractGoogleFonts(href, cssData);
    }
  });

  return cssData;
}

// Parse inline style attribute
function parseInlineStyle(style: string, cssData: RawCSSData): void {
  // Extract colors
  const colorPatterns = [
    /#[0-9a-fA-F]{3,8}\b/g,
    /rgba?\([^)]+\)/gi,
    /hsla?\([^)]+\)/gi,
  ];

  colorPatterns.forEach(pattern => {
    const matches = style.match(pattern);
    if (matches) {
      matches.forEach(m => cssData.colors.add(m));
    }
  });

  // Extract gradients
  const gradientPatterns = [
    /linear-gradient\([^)]+\)/gi,
    /radial-gradient\([^)]+\)/gi,
    /conic-gradient\([^)]+\)/gi,
  ];

  gradientPatterns.forEach(pattern => {
    const matches = style.match(pattern);
    if (matches) {
      matches.forEach(m => cssData.gradients.add(m));
    }
  });

  // Extract font-family
  const fontMatch = style.match(/font-family:\s*([^;]+)/i);
  if (fontMatch) {
    const family = fontMatch[1].split(',')[0].trim().replace(/['"]/g, '');
    if (!cssData.fonts.has(family)) {
      cssData.fonts.set(family, { weights: new Set(['400']) });
    }
  }
}

// Parse CSS text using css-tree
function parseCSS(cssText: string, cssData: RawCSSData): void {
  try {
    const ast = csstree.parse(cssText, {
      parseCustomProperty: true,
      parseValue: true,
    });

    csstree.walk(ast, {
      visit: 'Declaration',
      enter(node) {
        const property = node.property.toLowerCase();
        const value = csstree.generate(node.value);

        // Extract CSS variables
        if (property.startsWith('--')) {
          cssData.cssVariables.set(property, value);

          // If it looks like a color variable, try to extract the color
          if (property.includes('color') || property.includes('bg') || property.includes('background')) {
            extractColorsFromValue(value, cssData);
          }
        }

        // Color properties
        if (['color', 'background-color', 'border-color', 'fill', 'stroke', 'background'].includes(property)) {
          extractColorsFromValue(value, cssData);
        }

        // Gradient properties
        if (['background', 'background-image'].includes(property)) {
          extractGradientsFromValue(value, cssData);
        }

        // Font properties
        if (property === 'font-family') {
          const family = value.split(',')[0].trim().replace(/['"]/g, '');
          if (family && !family.startsWith('var(')) {
            if (!cssData.fonts.has(family)) {
              cssData.fonts.set(family, { weights: new Set() });
            }
          }
        }

        if (property === 'font-weight') {
          // We'd need context of which font this applies to, so we'll handle this later
        }
      },
    });

    // Also look for @font-face rules
    csstree.walk(ast, {
      visit: 'Atrule',
      enter(node) {
        if (node.name === 'font-face' && node.block) {
          let family = '';
          let weight = '400';
          let src = '';

          csstree.walk(node.block, {
            visit: 'Declaration',
            enter(decl) {
              const prop = decl.property.toLowerCase();
              const val = csstree.generate(decl.value);

              if (prop === 'font-family') {
                family = val.replace(/['"]/g, '').trim();
              } else if (prop === 'font-weight') {
                weight = val;
              } else if (prop === 'src') {
                src = val;
              }
            },
          });

          if (family) {
            if (!cssData.fonts.has(family)) {
              cssData.fonts.set(family, { weights: new Set(), source: src });
            }
            cssData.fonts.get(family)!.weights.add(weight);
          }
        }
      },
    });
  } catch {
    // CSS parsing failed, try regex fallback
    extractWithRegex(cssText, cssData);
  }
}

// Regex fallback for CSS parsing
function extractWithRegex(cssText: string, cssData: RawCSSData): void {
  // Colors
  const colorPatterns = [
    /#[0-9a-fA-F]{3,8}\b/g,
    /rgba?\([^)]+\)/gi,
    /hsla?\([^)]+\)/gi,
  ];

  colorPatterns.forEach(pattern => {
    const matches = cssText.match(pattern);
    if (matches) {
      matches.forEach(m => cssData.colors.add(m));
    }
  });

  // Gradients
  const gradientPattern = /(linear|radial|conic)-gradient\([^)]+\)/gi;
  const gradientMatches = cssText.match(gradientPattern);
  if (gradientMatches) {
    gradientMatches.forEach(m => cssData.gradients.add(m));
  }

  // Fonts from @font-face
  const fontFacePattern = /@font-face\s*\{[^}]+\}/gi;
  const fontFaceMatches = cssText.match(fontFacePattern);
  if (fontFaceMatches) {
    fontFaceMatches.forEach(block => {
      const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)/i);
      const weightMatch = block.match(/font-weight:\s*(\d+|normal|bold)/i);
      if (familyMatch) {
        const family = familyMatch[1].trim();
        if (!cssData.fonts.has(family)) {
          cssData.fonts.set(family, { weights: new Set() });
        }
        cssData.fonts.get(family)!.weights.add(weightMatch?.[1] || '400');
      }
    });
  }
}

// Extract colors from a CSS value
function extractColorsFromValue(value: string, cssData: RawCSSData): void {
  const patterns = [
    /#[0-9a-fA-F]{3,8}\b/g,
    /rgba?\([^)]+\)/gi,
    /hsla?\([^)]+\)/gi,
  ];

  patterns.forEach(pattern => {
    const matches = value.match(pattern);
    if (matches) {
      matches.forEach(m => cssData.colors.add(m));
    }
  });
}

// Extract gradients from a CSS value
function extractGradientsFromValue(value: string, cssData: RawCSSData): void {
  const pattern = /(linear|radial|conic)-gradient\([^)]+\)/gi;
  const matches = value.match(pattern);
  if (matches) {
    matches.forEach(m => cssData.gradients.add(m));
  }
}

// Extract font names from Google Fonts URL
function extractGoogleFonts(url: string, cssData: RawCSSData): void {
  try {
    const urlObj = new URL(url);
    const family = urlObj.searchParams.get('family');
    if (family) {
      // Google Fonts format: "Family+Name:wght@400;700" or "Family+Name"
      const families = family.split('|');
      families.forEach(f => {
        const [name, weights] = f.split(':');
        const fontName = name.replace(/\+/g, ' ');

        if (!cssData.fonts.has(fontName)) {
          cssData.fonts.set(fontName, { weights: new Set(), source: 'Google Fonts' });
        }

        if (weights) {
          const weightMatch = weights.match(/\d{3}/g);
          if (weightMatch) {
            weightMatch.forEach(w => cssData.fonts.get(fontName)!.weights.add(w));
          }
        }
      });
    }
  } catch {
    // Invalid URL, ignore
  }
}

// Convert collected CSS data to color array
function parseColorsFromCSS(cssData: RawCSSData): string[] {
  const validColors = Array.from(cssData.colors)
    .map(c => parseColor(c))
    .filter((c): c is Color => c !== null)
    .map(c => c.hex);

  // Also check CSS variables for colors
  cssData.cssVariables.forEach((value) => {
    const parsed = parseColor(value);
    if (parsed) {
      validColors.push(parsed.hex);
    }
  });

  // Remove duplicates, filter out common non-brand colors
  const nonBrandColors = ['#000000', '#ffffff', '#000', '#fff', '#333333', '#666666', '#999999', '#cccccc'];
  const uniqueColors = [...new Set(validColors)]
    .filter(c => !nonBrandColors.includes(c.toLowerCase()));

  return uniqueColors.slice(0, 20);
}

// Convert collected CSS data to gradients array
function parseGradientsFromCSS(cssData: RawCSSData): ExtractedGradient[] {
  return Array.from(cssData.gradients).map(css => {
    let type: 'linear' | 'radial' | 'conic' = 'linear';
    let angle: number | undefined;

    if (css.includes('radial-gradient')) {
      type = 'radial';
    } else if (css.includes('conic-gradient')) {
      type = 'conic';
    } else {
      const angleMatch = css.match(/linear-gradient\(\s*(\d+)deg/);
      if (angleMatch) {
        angle = parseInt(angleMatch[1], 10);
      } else if (css.includes('to right')) {
        angle = 90;
      } else if (css.includes('to left')) {
        angle = 270;
      } else if (css.includes('to bottom')) {
        angle = 180;
      } else if (css.includes('to top')) {
        angle = 0;
      }
    }

    return { css, type, angle };
  }).filter((g, index, self) =>
    index === self.findIndex(t => t.css === g.css)
  );
}

// Convert collected CSS data to fonts array
function parseFontsFromCSS(cssData: RawCSSData): Font[] {
  const systemFonts = [
    'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
    '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'arial', 'helvetica',
    'times new roman', 'times', 'courier new', 'courier', 'inherit', 'initial',
  ];

  const fonts: Font[] = [];

  cssData.fonts.forEach((data, family) => {
    if (!systemFonts.includes(family.toLowerCase())) {
      fonts.push({
        family: parseFontFamily(family),
        variants: Array.from(data.weights).length > 0 ? Array.from(data.weights) : ['400'],
        category: categorizeFont(family),
        source: data.source,
      });
    }
  });

  return fonts.slice(0, 10);
}

// Extract logos from HTML
async function extractLogos($: cheerio.CheerioAPI, origin: string): Promise<Logo[]> {
  const logos: Logo[] = [];

  // Favicon
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').first().attr('href');
  if (favicon) {
    logos.push({
      url: makeAbsoluteUrl(favicon, origin),
      type: 'favicon',
      format: getImageFormat(favicon),
    });
  }

  // Apple touch icon
  const appleIcon = $('link[rel="apple-touch-icon"]').first().attr('href');
  if (appleIcon) {
    logos.push({
      url: makeAbsoluteUrl(appleIcon, origin),
      type: 'apple-touch-icon',
      format: getImageFormat(appleIcon),
    });
  }

  // Open Graph image
  const ogImage = $('meta[property="og:image"]').first().attr('content');
  if (ogImage) {
    logos.push({
      url: makeAbsoluteUrl(ogImage, origin),
      type: 'og-image',
      format: getImageFormat(ogImage),
    });
  }

  // Logo selectors
  const logoSelectors = [
    'img[class*="logo"]',
    'img[id*="logo"]',
    'img[alt*="logo"]',
    'img[src*="logo"]',
    'a[class*="logo"] img',
    'header img:first-of-type',
    '[class*="brand"] img',
  ];

  for (const selector of logoSelectors) {
    const img = $(selector).first();
    const src = img.attr('src');
    if (src) {
      logos.push({
        url: makeAbsoluteUrl(src, origin),
        type: 'primary',
        format: getImageFormat(src),
        width: parseInt(img.attr('width') || '0') || undefined,
        height: parseInt(img.attr('height') || '0') || undefined,
      });
      break;
    }
  }

  // SVG logos (serialize the SVG markup)
  const svgLogo = $('svg[class*="logo"], header svg, [class*="brand"] svg').first();
  if (svgLogo.length) {
    const svgHtml = $.html(svgLogo);
    logos.push({
      url: `data:image/svg+xml,${encodeURIComponent(svgHtml)}`,
      type: 'primary',
      format: 'svg',
    });
  }

  // Remove duplicates
  return logos.filter((logo, index, self) =>
    index === self.findIndex(l => l.url === logo.url)
  );
}

// Extract text content from HTML
async function extractContent($: cheerio.CheerioAPI): Promise<ExtractedContent> {
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';

  const headings = $('h1, h2, h3')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(h => h.length > 0)
    .slice(0, 20);

  const paragraphs = $('p')
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(p => p.length > 20)
    .slice(0, 30);

  const links = $('a')
    .map((_, el) => ({
      text: $(el).text().trim(),
      url: $(el).attr('href') || '',
    }))
    .get()
    .filter(l => l.text && l.url)
    .slice(0, 50);

  const metaTags: Record<string, string> = {};
  $('meta').each((_, el) => {
    const name = $(el).attr('name') || $(el).attr('property');
    const content = $(el).attr('content');
    if (name && content) {
      metaTags[name] = content;
    }
  });

  return { title, description, headings, paragraphs, links, metaTags };
}

// Helper: make URL absolute
function makeAbsoluteUrl(url: string, origin: string): string {
  if (url.startsWith('data:') || url.startsWith('http')) {
    return url;
  }
  return new URL(url, origin).href;
}

// Helper: get image format from URL
function getImageFormat(url: string): string {
  if (url.startsWith('data:image/svg')) return 'svg';
  const match = url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)(\?|$)/i);
  return match?.[1]?.toLowerCase() || 'unknown';
}

// LLM-based brand asset interpretation
interface LLMBrandInterpretation {
  suggestedColors: string[];
  suggestedFonts: Font[];
  reasoning: string;
}

async function interpretBrandAssetsWithLLM(
  cssData: RawCSSData,
  content: ExtractedContent
): Promise<LLMBrandInterpretation> {
  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  const MODEL = 'gpt-4.1-mini-2025-04-14';

  // Prepare CSS summary for LLM
  const cssVariablesSummary = Array.from(cssData.cssVariables.entries())
    .filter(([name]) =>
      name.includes('color') ||
      name.includes('primary') ||
      name.includes('secondary') ||
      name.includes('brand') ||
      name.includes('accent')
    )
    .map(([name, value]) => `${name}: ${value}`)
    .slice(0, 30)
    .join('\n');

  const colorsSummary = Array.from(cssData.colors).slice(0, 30).join(', ');
  const fontsSummary = Array.from(cssData.fonts.keys()).slice(0, 10).join(', ');

  const prompt = `Analyze this website's CSS data to identify the likely BRAND colors and fonts.

Website: ${content.title}
Description: ${content.description}

CSS Variables (likely brand-related):
${cssVariablesSummary || 'None found'}

Colors found in CSS:
${colorsSummary || 'None found'}

Fonts found:
${fontsSummary || 'None found'}

Based on naming patterns (like --primary, --brand, --accent) and common brand design practices:
1. Identify the 3-5 most likely BRAND colors (primary, secondary, accent)
2. Identify the 1-2 main brand fonts (heading and body)

Respond ONLY with valid JSON:
{
  "suggestedColors": ["#hex1", "#hex2", "#hex3"],
  "suggestedFonts": [
    {"family": "Font Name", "category": "sans-serif|serif|display|monospace", "usage": "heading|body"}
  ],
  "reasoning": "Brief explanation"
}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a brand design expert analyzing CSS to identify brand colors and typography.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0]?.message?.content || '{}');

    return {
      suggestedColors: parsed.suggestedColors || [],
      suggestedFonts: (parsed.suggestedFonts || []).map((f: { family: string; category?: string }) => ({
        family: parseFontFamily(f.family),
        variants: ['400', '700'],
        category: f.category || categorizeFont(f.family),
        source: 'AI-suggested',
      })),
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    console.error('LLM brand interpretation failed:', error);
    return {
      suggestedColors: [],
      suggestedFonts: [],
      reasoning: '',
    };
  }
}
