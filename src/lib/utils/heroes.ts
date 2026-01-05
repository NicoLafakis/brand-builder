import type { HeroPreset, ColorPalette, Typography } from '../types/brand';

export function buildHeroPresets(colors: ColorPalette, typography: Typography): HeroPreset[] {
    return [
        {
            id: 'clean-slate',
            name: 'Clean Slate',
            mood: ['minimal', 'light', 'subtle', 'editorial'],
            concept: 'Editorial minimalism with asymmetric layout. Typography as art on white canvas.',
            specs: {
                background: 'White or off-white (#fafafa)',
                layout: 'Asymmetric, left-aligned text',
                typography: `Large ${typography.headlines.family} headline, understated body`,
                animation: 'Subtle fade-in, minimal movement',
                ctas: 'Ghost outline + text link',
            },
            bestFor: 'Content-focused brands, publishing, sophisticated B2B.',
        },
        {
            id: 'bold-edge',
            name: 'Bold Edge',
            mood: ['geometric', 'dark', 'floating', 'confident'],
            concept: 'Architectural geometry with floating shapes. Navy background, confident presence.',
            specs: {
                background: colors.primary[800].hex,
                layout: 'Centered or slight offset',
                typography: `Bold ${typography.subheadings.family}, high contrast white text`,
                animation: 'Floating geometric shapes, parallax',
                ctas: 'Primary accent + ghost outline',
            },
            bestFor: 'Consulting, finance, professional services.',
        },
        {
            id: 'gradient-flow',
            name: 'Gradient Flow',
            mood: ['organic', 'gradient', 'flowing', 'modern'],
            concept: 'Fluid 3-color gradient in motion. Glassmorphic orbs and centered glass card.',
            specs: {
                background: `Animated gradient (${colors.primary[500].hex} → ${colors.secondary[500].hex} → ${colors.accent[500].hex})`,
                layout: 'Centered glass card container',
                typography: `Clean ${typography.subheadings.family} on glass surface`,
                animation: 'Slow gradient shift, floating glass orbs',
                ctas: 'Solid buttons with backdrop blur',
            },
            bestFor: 'Creative agencies, startups, tech products.',
        },
        {
            id: 'aurora-pulse',
            name: 'Aurora Pulse',
            mood: ['ethereal', 'dark', 'aurora', 'dreamy'],
            concept: 'Aurora borealis effect with morphing gradient blobs and twinkling stars.',
            specs: {
                background: 'Dark navy/black with aurora overlay',
                layout: 'Centered text, full-width aurora',
                typography: 'Light-weight serif or elegant sans',
                animation: 'Morphing blobs, twinkling particles',
                ctas: 'Glowing accent buttons',
            },
            bestFor: 'Innovation, space/tech, wellness, creative.',
        },
        {
            id: 'kinetic-grid',
            name: 'Kinetic Grid',
            mood: ['technical', 'dark', 'grid-flow', 'data'],
            concept: 'Tech-forward animated grid system with flowing data lines and pulsing nodes.',
            specs: {
                background: 'Dark with grid overlay',
                layout: 'Terminal-style left alignment',
                typography: `Monospace accents (${typography.code.family}), clean sans body`,
                animation: 'Grid lines flowing, nodes pulsing',
                ctas: 'Tech-styled buttons with > prefix',
            },
            bestFor: 'SaaS, developer tools, infrastructure, data companies.',
        },
        {
            id: 'executive-suite',
            name: 'Executive Suite',
            mood: ['luxury', 'dark', 'elegant', 'exclusive'],
            concept: 'Ultra-premium dark luxury with peach/gold accents. Optional testimonial card.',
            specs: {
                background: '#0a0a0a or deep navy',
                layout: 'Generous whitespace, elegant spacing',
                typography: `High-end ${typography.headlines.family} headlines, refined body`,
                animation: 'Subtle particle effects, gold shimmer',
                ctas: `${colors.utility[0].hex} (Peach/Gold) accent buttons`,
            },
            bestFor: 'Executive services, luxury brands, high-end consulting.',
        },
    ];
}
