import { chromium, type Page, type Browser } from 'playwright';
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

// Extract all brand assets from a URL
export async function extractBrandAssets(url: string): Promise<ExtractionResult> {
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Wait a bit for dynamic content
    await page.waitForTimeout(2000);

    // Extract all assets in parallel
    const [colors, gradients, fonts, logos, content] = await Promise.all([
      extractColors(page),
      extractGradients(page),
      extractFonts(page),
      extractLogos(page, url),
      extractContent(page),
    ]);

    return { colors, gradients, fonts, logos, content };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Extract colors from computed styles
async function extractColors(page: Page): Promise<string[]> {
  const colors = await page.evaluate(() => {
    const colorSet = new Set<string>();
    const elements = document.querySelectorAll('*');

    elements.forEach(el => {
      const style = getComputedStyle(el);

      // Get various color properties
      const colorProps = [
        'color',
        'backgroundColor',
        'borderColor',
        'borderTopColor',
        'borderRightColor',
        'borderBottomColor',
        'borderLeftColor',
        'outlineColor',
      ];

      colorProps.forEach(prop => {
        const value = style.getPropertyValue(prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`));
        if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') {
          colorSet.add(value);
        }
      });
    });

    // Also extract from CSS custom properties
    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const cssVars = Array.from(document.styleSheets)
      .flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules);
        } catch {
          return [];
        }
      })
      .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
      .filter(rule => rule.selectorText === ':root')
      .flatMap(rule => {
        const vars: string[] = [];
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (prop.startsWith('--') && prop.toLowerCase().includes('color')) {
            const value = rootStyle.getPropertyValue(prop).trim();
            if (value) vars.push(value);
          }
        }
        return vars;
      });

    cssVars.forEach(v => colorSet.add(v));

    return Array.from(colorSet);
  });

  // Filter and normalize colors
  const validColors = colors
    .map(c => parseColor(c))
    .filter((c): c is Color => c !== null)
    .map(c => c.hex);

  // Remove duplicates and sort by frequency (implied by order)
  return [...new Set(validColors)];
}

// Extract CSS gradients from the page
async function extractGradients(page: Page): Promise<ExtractedGradient[]> {
  const gradients = await page.evaluate(() => {
    const gradientSet = new Set<string>();
    const elements = document.querySelectorAll('*');

    // Regex patterns for different gradient types
    const linearGradientRegex = /linear-gradient\([^)]+\)/gi;
    const radialGradientRegex = /radial-gradient\([^)]+\)/gi;
    const conicGradientRegex = /conic-gradient\([^)]+\)/gi;
    const repeatingLinearRegex = /repeating-linear-gradient\([^)]+\)/gi;
    const repeatingRadialRegex = /repeating-radial-gradient\([^)]+\)/gi;

    elements.forEach(el => {
      const style = getComputedStyle(el);
      const bgImage = style.backgroundImage;
      const bg = style.background;

      // Check both background and background-image
      [bgImage, bg].forEach(value => {
        if (value && value !== 'none') {
          // Extract all gradient patterns
          const allPatterns = [
            linearGradientRegex,
            radialGradientRegex,
            conicGradientRegex,
            repeatingLinearRegex,
            repeatingRadialRegex,
          ];

          allPatterns.forEach(pattern => {
            const matches = value.match(pattern);
            if (matches) {
              matches.forEach(match => gradientSet.add(match));
            }
          });
        }
      });
    });

    // Also check CSS custom properties and stylesheets
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules).forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const bgImage = rule.style.backgroundImage;
            const bg = rule.style.background;

            [bgImage, bg].forEach(value => {
              if (value) {
                const patterns = [
                  linearGradientRegex,
                  radialGradientRegex,
                  conicGradientRegex,
                ];
                patterns.forEach(pattern => {
                  const matches = value.match(pattern);
                  if (matches) {
                    matches.forEach(match => gradientSet.add(match));
                  }
                });
              }
            });
          }
        });
      } catch {
        // Cross-origin stylesheet, skip
      }
    });

    return Array.from(gradientSet);
  });

  // Parse and categorize gradients
  return gradients.map(css => {
    let type: 'linear' | 'radial' | 'conic' = 'linear';
    let angle: number | undefined;

    if (css.includes('radial-gradient')) {
      type = 'radial';
    } else if (css.includes('conic-gradient')) {
      type = 'conic';
    } else {
      // Extract angle from linear gradient
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
      } else if (css.includes('to bottom right') || css.includes('to right bottom')) {
        angle = 135;
      } else if (css.includes('to top right') || css.includes('to right top')) {
        angle = 45;
      } else if (css.includes('to bottom left') || css.includes('to left bottom')) {
        angle = 225;
      } else if (css.includes('to top left') || css.includes('to left top')) {
        angle = 315;
      }
    }

    return { css, type, angle };
  }).filter((g, index, self) =>
    // Remove duplicates
    index === self.findIndex(t => t.css === g.css)
  );
}

// Extract fonts from computed styles and stylesheets
async function extractFonts(page: Page): Promise<Font[]> {
  const fontData = await page.evaluate(() => {
    const fontSet = new Map<string, { variants: Set<string>; source?: string }>();

    // Extract from computed styles
    const elements = document.querySelectorAll('body, h1, h2, h3, h4, h5, h6, p, a, span, div, button, input, li');
    elements.forEach(el => {
      const style = getComputedStyle(el);
      const fontFamily = style.fontFamily;
      const fontWeight = style.fontWeight;

      if (fontFamily) {
        const family = fontFamily.split(',')[0].trim().replace(/['"]/g, '');
        if (!fontSet.has(family)) {
          fontSet.set(family, { variants: new Set() });
        }
        fontSet.get(family)!.variants.add(fontWeight);
      }
    });

    // Extract from @font-face rules
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules).forEach(rule => {
          if (rule instanceof CSSFontFaceRule) {
            const family = rule.style.getPropertyValue('font-family').replace(/['"]/g, '').trim();
            const weight = rule.style.getPropertyValue('font-weight') || '400';
            const src = rule.style.getPropertyValue('src');

            if (!fontSet.has(family)) {
              fontSet.set(family, { variants: new Set(), source: src });
            }
            fontSet.get(family)!.variants.add(weight);
          }
        });
      } catch {
        // Cross-origin stylesheet, skip
      }
    });

    return Array.from(fontSet.entries()).map(([family, data]) => ({
      family,
      variants: Array.from(data.variants),
      source: data.source,
    }));
  });

  // Filter out system fonts and map to Font type
  const systemFonts = [
    'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
    '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'Helvetica',
    'Times New Roman', 'Times', 'Courier New', 'Courier',
  ];

  return fontData
    .filter(f => !systemFonts.some(sf => f.family.toLowerCase() === sf.toLowerCase()))
    .slice(0, 10) // Limit to top 10 fonts
    .map(f => ({
      family: parseFontFamily(f.family),
      variants: f.variants,
      category: categorizeFont(f.family),
      source: f.source,
    }));
}

// Extract logos from various sources
async function extractLogos(page: Page, baseUrl: string): Promise<Logo[]> {
  const logos: Logo[] = [];
  const origin = new URL(baseUrl).origin;

  const logoData = await page.evaluate(() => {
    const results: Array<{
      url: string;
      type: string;
      width?: number;
      height?: number;
    }> = [];

    // Get favicon
    const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (favicon) {
      results.push({
        url: (favicon as HTMLLinkElement).href,
        type: 'favicon',
      });
    }

    // Get apple touch icon
    const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleIcon) {
      results.push({
        url: (appleIcon as HTMLLinkElement).href,
        type: 'apple-touch-icon',
      });
    }

    // Get Open Graph image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      results.push({
        url: (ogImage as HTMLMetaElement).content,
        type: 'og-image',
      });
    }

    // Look for logo in common locations
    const logoSelectors = [
      'img[class*="logo"]',
      'img[id*="logo"]',
      'img[alt*="logo"]',
      'img[src*="logo"]',
      'a[class*="logo"] img',
      'header img:first-of-type',
      '[class*="brand"] img',
      '[class*="header"] img:first-of-type',
    ];

    for (const selector of logoSelectors) {
      const img = document.querySelector(selector) as HTMLImageElement;
      if (img && img.src) {
        results.push({
          url: img.src,
          type: 'primary',
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
        break;
      }
    }

    // Look for SVG logos
    const svgLogo = document.querySelector('svg[class*="logo"], header svg, [class*="brand"] svg');
    if (svgLogo) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgLogo);
      results.push({
        url: `data:image/svg+xml,${encodeURIComponent(svgString)}`,
        type: 'primary',
      });
    }

    return results;
  });

  for (const data of logoData) {
    let url = data.url;

    // Make relative URLs absolute
    if (url && !url.startsWith('data:') && !url.startsWith('http')) {
      url = new URL(url, origin).href;
    }

    if (url) {
      const format = url.startsWith('data:image/svg')
        ? 'svg'
        : url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)(\?|$)/i)?.[1]?.toLowerCase() || 'unknown';

      logos.push({
        url,
        type: data.type as Logo['type'],
        format,
        width: data.width,
        height: data.height,
      });
    }
  }

  // Remove duplicates
  const uniqueLogos = logos.filter((logo, index, self) =>
    index === self.findIndex(l => l.url === logo.url)
  );

  return uniqueLogos;
}

// Extract text content from the page
async function extractContent(page: Page): Promise<ExtractedContent> {
  const content = await page.evaluate(() => {
    // Get title
    const title = document.title || '';

    // Get meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const description = metaDesc ? (metaDesc as HTMLMetaElement).content : '';

    // Get headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(h => h.textContent?.trim())
      .filter((h): h is string => !!h)
      .slice(0, 20);

    // Get paragraphs
    const paragraphs = Array.from(document.querySelectorAll('p'))
      .map(p => p.textContent?.trim())
      .filter((p): p is string => !!p && p.length > 20)
      .slice(0, 30);

    // Get links with text
    const links = Array.from(document.querySelectorAll('a'))
      .filter(a => a.textContent?.trim() && a.href)
      .map(a => ({
        text: a.textContent?.trim() || '',
        url: a.href,
      }))
      .slice(0, 50);

    // Get meta tags
    const metaTags: Record<string, string> = {};
    document.querySelectorAll('meta').forEach(meta => {
      const name = meta.name || meta.getAttribute('property');
      const content = meta.content;
      if (name && content) {
        metaTags[name] = content;
      }
    });

    return { title, description, headings, paragraphs, links, metaTags };
  });

  return content;
}
