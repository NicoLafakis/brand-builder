---
name: brand-bible-generator
description: Generate comprehensive brand identity systems including color palettes, typography hierarchies, button styles, and component presets. Use when users request brand guidelines, design systems, brand bibles, style guides, or visual identity documentation. Triggers on requests like "create a brand bible", "design system for [company]", "brand guidelines", "color palette with typography", "style guide", or any request to establish visual identity standards for a brand.
---

# Brand Bible Generator

Create production-ready brand identity systems following the Sidekick Strategies methodology. Output comprehensive design documentation with colors, typography, buttons, and component presets.

## Core Philosophy

- **Professional yet energetic**: Balance trustworthiness with visual energy
- **Context-appropriate**: Every component serves a specific use case
- **Hierarchy-first**: Clear visual hierarchy guides user attention
- **Production-ready**: All specifications immediately usable in code

## Brand Bible Workflow

### Step 1: Discovery

Gather brand context before designing:

- Brand personality (professional, playful, luxury, technical, organic)
- Industry/sector
- Target audience
- Existing brand assets (if any)
- Competitor landscape mood

### Step 2: Color System

Generate a 3-tier color palette:

| Tier | Purpose | Example Role |
|------|---------|--------------|
| Primary | Brand foundation, trust | Navy, deep blue |
| Secondary | Energy, differentiation | Teal, green |
| Accent | CTAs, urgency, highlights | Orange, coral |

For each color, generate full shade spectrum (50-950). See `references/color-systems.md` for shade generation methodology.

Include 2-3 utility colors (peach, slate, light-blue) for flexibility.

### Step 3: Typography System

Establish 4-font hierarchy:

| Role | Font Category | Use Case |
|------|---------------|----------|
| Headlines | Serif or Display | H1-H2, hero text |
| Subheadings | Sans-serif | H3-H6, section headers |
| Body | Sans-serif (readable) | Paragraphs, content |
| Code/Labels | Monospace | Technical, metadata |

Define heading hierarchy (H1-H6) with font family, size, weight, line height.

Define body variants: Lead (20px), Body (16px), Small (14px), Caption (12px).

See `references/typography-systems.md` for font pairing strategies.

### Step 4: Button Styles

Create 4 core button variants:

| Variant | Background | Use Case |
|---------|------------|----------|
| Primary Action | Accent color | Main CTAs |
| Secondary Action | Secondary color | Secondary emphasis |
| Solid | Primary color | Professional, authoritative |
| Ghost/Outline | Transparent + border | Subtle, non-competing |

Each button: bg color, hover state, text color, border-radius, padding.

### Step 5: Hero/Component Presets

Generate 4-6 hero presets covering different moods:

| Type | Mood | Background | Use Case |
|------|------|------------|----------|
| Minimal/Clean | Light, editorial | White/light | Content-focused |
| Bold/Geometric | Dark, confident | Primary dark | Authority |
| Gradient/Flow | Organic, modern | Multi-color | Dynamic |
| Luxury/Executive | Premium | Dark + gold | High-end |
| Technical/Grid | Tech-forward | Dark + patterns | SaaS |
| Ethereal/Aurora | Dreamy | Aurora effects | Creative |

See `references/component-library.md` for detailed preset specifications.

## Output Structure

```markdown
# [Brand Name] Brand Bible

## Color Palette
[Primary, Secondary, Accent with shade spectrums 50-950]
[Additional utility colors]

## Typography
[Font specimens with pairings]
[Heading hierarchy H1-H6 with sizes]
[Body text variants]

## Button Styles
[4 variants with hover states]

## Hero/Component Presets
[4-6 presets with mood tags]
```

## Quality Checklist

- [ ] Colors provide sufficient contrast (WCAG AA)
- [ ] Typography hierarchy is clear and consistent
- [ ] Button states defined (default, hover, active)
- [ ] Hero presets cover light and dark variants
- [ ] All values in usable units (hex, rem, px)

## Quick Formulas

**Color**: Primary (trust) + Secondary (energy) + Accent (action)

**Type**: Serif headlines + Sans subheads + Readable body + Mono code

**Buttons**: Primary CTA + Secondary + Authoritative + Subtle

**Heroes**: Light minimal + Dark bold + Gradient flow + Luxury premium
---
# Color Systems Reference

Detailed methodology for generating production-ready color palettes.

## Shade Spectrum Generation (50-950)

Each brand color requires a full shade spectrum:

| Shade | Lightness | Use Case |
|-------|-----------|----------|
| 50 | ~97% | Backgrounds, subtle tints |
| 100 | ~93% | Hover states on light bg |
| 200 | ~85% | Borders, dividers |
| 300 | ~70% | Secondary text on dark |
| 400 | ~55% | Muted elements |
| 500 | ~45% | **Base color** |
| 600 | ~35% | Primary interactive |
| 700 | ~25% | Hover on base |
| 800 | ~18% | Active states |
| 900 | ~12% | Dark text, headers |
| 950 | ~6% | Darkest variant |

## Color Role Definitions

### Primary Color (Trust Foundation)

Purpose: Establish brand identity, convey professionalism and reliability.

Hue families by personality:
- **Navy/Deep Blue**: Authority, trust, stability (corporate, finance, legal)
- **Forest Green**: Growth, sustainability, health (wellness, eco, agriculture)
- **Deep Purple**: Creativity, luxury, wisdom (design, education, premium)
- **Charcoal/Slate**: Sophistication, neutrality (tech, professional services)

Usage: Headers, navigation, primary UI, dark backgrounds.

### Secondary Color (Energy & Differentiation)

Purpose: Add visual interest, create contrast, differentiate from competitors.

Hue families:
- **Teal/Cyan**: Modern, fresh, tech-forward
- **Emerald**: Vitality, balance, prosperity
- **Indigo**: Innovation, depth, creativity
- **Warm Gray**: Refined, understated elegance

Usage: Secondary buttons, accents, highlighted sections, icons.

### Accent Color (Action & Urgency)

Purpose: Draw attention to CTAs, create visual focal points.

Hue families:
- **Orange/Coral**: Energy, enthusiasm, action
- **Amber/Gold**: Premium, achievement, warmth
- **Magenta/Pink**: Bold, creative, approachable
- **Red**: Urgency, importance (use sparingly)

Usage: Primary CTAs, notifications, badges, highlights.

## Utility Colors

Include 2-3 additional colors for flexibility:

| Type | Example | Purpose |
|------|---------|---------|
| Warm neutral | Peach #faaa68 | Friendly accents, highlights |
| Cool neutral | Light Blue #98c1d9 | Info states, calm secondary |
| Dark neutral | Slate #3d5a80 | Text, subtle backgrounds |

## Contrast Requirements (WCAG AA)

| Element | Minimum Ratio |
|---------|---------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |

## Example Palette Structure

```
### Primary — Navy
50: #f0f4fa   100: #dce4f2   200: #b9c9e5
300: #8aa5d3  400: #5a7fc0  500: #3a5a9a ← Base
600: #2a4578  700: #1e3561  800: #142d63
900: #0f2250  950: #0a1633

### Secondary — Teal
50: #e6f7f9   100: #cceff3   200: #99dfe7
300: #4dc5d4  400: #1aabb9  500: #028393 ← Base
600: #026d7a  700: #025762  800: #014149
900: #012b31  950: #001518

### Accent — Orange
50: #fff5f0   100: #ffe8de   200: #ffd0bd
300: #ffab8c  400: #fa7d4d  500: #f65625 ← Base
600: #d9441a  700: #b53615  800: #912b11
900: #6d200d  950: #3a1006
```

## HSL Adjustment Method

Starting from base color (500):

**Lighter shades (50-400)**: Increase L progressively, decrease S slightly to avoid oversaturation.

**Darker shades (600-950)**: Decrease L progressively, increase S slightly for richness.

Typical adjustments from base:
- 50: L+52%, S-30%
- 200: L+40%, S-15%
- 400: L+10%, S-5%
- 600: L-10%, S+5%
- 800: L-27%, S+10%
- 950: L-39%, S+15%
---
# Component Library Reference

Detailed specifications for buttons and hero/component presets.

## Button System

### Core Button Variants

#### 01: Primary Action
**Purpose**: Main CTAs and priority actions

| Property | Value |
|----------|-------|
| Background | Accent color (e.g., #f65625) |
| Hover | Darker accent (e.g., #d9441a) |
| Text | White |
| Border Radius | 6px or 8px |
| Padding | 12px 24px |
| Font Weight | 600 |

#### 02: Secondary Action (Teal)
**Purpose**: Secondary emphasis actions

| Property | Value |
|----------|-------|
| Background | Secondary color (e.g., #028393) |
| Hover | Darker secondary (e.g., #026d7a) |
| Text | White |
| Border Radius | 6px or 8px |
| Padding | 12px 24px |

#### 03: Solid (Navy)
**Purpose**: Professional and authoritative

| Property | Value |
|----------|-------|
| Background | Primary dark (e.g., #142d63) |
| Hover | Slightly lighter (e.g., #1e3561) |
| Text | White |
| Border Radius | 6px or 8px |
| Padding | 12px 24px |

#### 04: Ghost/Outline
**Purpose**: Subtle, non-competing actions

| Property | Value |
|----------|-------|
| Background | Transparent |
| Border | 2px solid accent |
| Hover | Fill with accent, white text |
| Text | Accent color |
| Border Radius | 6px or 8px |
| Padding | 10px 22px |

### Button States

All buttons require these states:
- **Default**: Normal appearance
- **Hover**: Visual feedback on cursor
- **Active/Pressed**: Slightly darker, subtle scale
- **Disabled**: 50% opacity, no pointer events
- **Focus**: Visible focus ring for accessibility

## Hero Presets

### 01: Clean Slate (Minimal Light)

**Mood Tags**: minimal, light, subtle, editorial

**Concept**: Editorial minimalism with asymmetric layout. Typography as art on white canvas.

| Element | Specification |
|---------|--------------|
| Background | White or off-white (#fafafa) |
| Layout | Asymmetric, left-aligned text |
| Typography | Large serif headline, understated body |
| Animation | Subtle fade-in, minimal movement |
| CTAs | Ghost outline + text link |

**Best for**: Content-focused brands, publishing, sophisticated B2B.

### 02: Bold Edge (Geometric Dark)

**Mood Tags**: geometric, dark, floating, confident

**Concept**: Architectural geometry with floating shapes. Navy background, confident presence.

| Element | Specification |
|---------|--------------|
| Background | Primary dark (#142d63 or similar) |
| Layout | Centered or slight offset |
| Typography | Bold sans-serif, high contrast white text |
| Animation | Floating geometric shapes, parallax |
| CTAs | Primary accent + ghost outline |

**Best for**: Consulting, finance, professional services.

### 03: Gradient Flow (Organic Motion)

**Mood Tags**: organic, gradient, flowing, modern

**Concept**: Fluid 3-color gradient in motion. Glassmorphic orbs and centered glass card.

| Element | Specification |
|---------|--------------|
| Background | Animated gradient (primary → secondary → accent) |
| Layout | Centered glass card container |
| Typography | Clean sans-serif on glass surface |
| Animation | Slow gradient shift, floating glass orbs |
| CTAs | Solid buttons with backdrop blur |

**Best for**: Creative agencies, startups, tech products.

### 04: Aurora Pulse (Ethereal Dark)

**Mood Tags**: ethereal, dark, aurora, dreamy

**Concept**: Aurora borealis effect with morphing gradient blobs and twinkling stars.

| Element | Specification |
|---------|--------------|
| Background | Dark navy/black with aurora overlay |
| Layout | Centered text, full-width aurora |
| Typography | Light-weight serif or elegant sans |
| Animation | Morphing blobs, twinkling particles |
| CTAs | Glowing accent buttons |

**Best for**: Innovation, space/tech, wellness, creative.

### 05: Kinetic Grid (Technical Dark)

**Mood Tags**: technical, dark, grid-flow, data

**Concept**: Tech-forward animated grid system with flowing data lines and pulsing nodes.

| Element | Specification |
|---------|--------------|
| Background | Dark with grid overlay |
| Layout | Terminal-style left alignment |
| Typography | Monospace accents, clean sans body |
| Animation | Grid lines flowing, nodes pulsing |
| CTAs | Tech-styled buttons with > prefix |

**Best for**: SaaS, developer tools, infrastructure, data companies.

### 06: Executive Suite (Luxury Premium)

**Mood Tags**: luxury, dark, elegant, exclusive

**Concept**: Ultra-premium dark luxury with peach/gold accents. Optional testimonial card.

| Element | Specification |
|---------|--------------|
| Background | Near-black (#0a0a0a) or deep navy |
| Layout | Generous whitespace, elegant spacing |
| Typography | High-end serif headlines, refined body |
| Animation | Subtle particle effects, gold shimmer |
| CTAs | Gold/peach accent buttons |
| Optional | Testimonial card, trust metrics |

**Best for**: Executive services, luxury brands, high-end consulting.

## Hero Selection Guide

| If the brand is... | Recommended Preset |
|--------------------|--------------------|
| Content/editorial focused | Clean Slate |
| Professional/authoritative | Bold Edge |
| Modern/dynamic | Gradient Flow |
| Innovative/creative | Aurora Pulse |
| Technical/developer | Kinetic Grid |
| Premium/exclusive | Executive Suite |

## Hero Component Structure

Standard hero anatomy:

```
<hero>
  <background>
    [animated/static background treatment]
  </background>
  <content>
    <eyebrow>[Brand name or category]</eyebrow>
    <headline>[H1 main message]</headline>
    <description>[1-2 sentence value prop]</description>
    <cta-group>
      <primary-cta>[Main action]</primary-cta>
      <secondary-cta>[Secondary action]</secondary-cta>
    </cta-group>
  </content>
  <optional>
    [testimonial, metrics, image, animation]
  </optional>
</hero>
```

## Responsive Hero Considerations

| Viewport | Adjustments |
|----------|-------------|
| Mobile | Stack CTAs, reduce animation complexity |
| Tablet | Maintain layout, scale typography |
| Desktop | Full animation, maximum visual impact |
---
# Typography Systems Reference

Comprehensive guide for creating hierarchical type systems.

## Font Pairing Philosophy

Combine fonts with purpose:
1. **Headlines**: Establish personality and create impact
2. **Subheadings**: Bridge headlines and body with clarity
3. **Body**: Maximize readability for sustained reading
4. **Code/Labels**: Technical precision for data and metadata

## Recommended Font Pairings by Brand Personality

### Professional/Corporate
| Role | Font | Alternative |
|------|------|-------------|
| Headlines | Palatino Linotype | Playfair Display, Libre Baskerville |
| Subheadings | Montserrat | Lato, Open Sans |
| Body | PT Sans | Source Sans Pro, Roboto |
| Code | IBM Plex Mono | Fira Code, JetBrains Mono |

### Modern/Tech
| Role | Font | Alternative |
|------|------|-------------|
| Headlines | Inter | Manrope, Plus Jakarta Sans |
| Subheadings | Inter | Same as headlines |
| Body | Inter | System fonts for performance |
| Code | JetBrains Mono | SF Mono, Cascadia Code |

### Luxury/Premium
| Role | Font | Alternative |
|------|------|-------------|
| Headlines | Cormorant Garamond | Bodoni Moda, Didot |
| Subheadings | Josefin Sans | Futura, Brandon Grotesque |
| Body | Libre Baskerville | EB Garamond, Crimson Pro |
| Code | DM Mono | Courier Prime |

### Creative/Playful
| Role | Font | Alternative |
|------|------|-------------|
| Headlines | Fraunces | Recoleta, Cooper BT |
| Subheadings | Nunito | Quicksand, Comfortaa |
| Body | Nunito Sans | Mulish, DM Sans |
| Code | Space Mono | Victor Mono |

## Heading Hierarchy

Standard sizing scale with modular ratio (~1.333 or ~1.5):

| Level | Size | Weight | Use Case |
|-------|------|--------|----------|
| H1 | 4.5rem / 72px | Regular-Bold | Hero headlines, page titles |
| H2 | 3rem / 48px | Regular-Semibold | Major sections |
| H3 | 1.875rem / 30px | Semibold | Subsections |
| H4 | 1.5rem / 24px | Semibold | Card titles, features |
| H5 | 1.25rem / 20px | Medium | Minor headings |
| H6 | 1rem / 16px | Medium, Uppercase | Labels, categories |

### Heading Styles Template

```css
h1 {
  font-family: 'Palatino Linotype', serif;
  font-size: 4.5rem;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

h2 {
  font-family: 'Palatino Linotype', serif;
  font-size: 3rem;
  font-weight: 400;
  line-height: 1.2;
}

h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 1.3;
}

h4 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

h5 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
}

h6 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Body Text Variants

| Variant | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| Lead | 1.25rem / 20px | Regular | 1.6 | Intro paragraphs, hero descriptions |
| Body | 1rem / 16px | Regular | 1.7 | Standard paragraphs |
| Small | 0.875rem / 14px | Regular | 1.6 | Secondary info, metadata |
| Caption | 0.75rem / 12px | Italic | 1.5 | Image captions, footnotes |

### Body Styles Template

```css
.lead {
  font-family: 'PT Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.6;
}

.body {
  font-family: 'PT Sans', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
}

.small {
  font-family: 'PT Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
}

.caption {
  font-family: 'PT Sans', sans-serif;
  font-size: 0.75rem;
  font-style: italic;
  line-height: 1.5;
}
```

## Font Specimen Display Format

Present fonts with character sample and key attributes:

```
### [Role]
### [Font Name]
[Descriptive phrase]

Aa

[Sample text showing the font in use]
```

Example:
```
### Headlines
### Palatino Linotype
Classic serif elegance

Aa

ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789
```

## Responsive Typography

Scale typography for different viewports:

| Breakpoint | H1 | H2 | Body |
|------------|----|----|------|
| Mobile (<640px) | 2.5rem | 2rem | 1rem |
| Tablet (640-1024px) | 3.5rem | 2.5rem | 1rem |
| Desktop (>1024px) | 4.5rem | 3rem | 1rem |

## Accessibility Guidelines

- Minimum body text: 16px (1rem)
- Maximum line length: 65-75 characters
- Sufficient contrast between text and background
- Avoid light font weights (<400) for body text
- Ensure line height ≥1.5 for body text