'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ColorPalette as ColorPaletteType, Color, ColorScale } from '@/lib/types/brand';

interface ColorPaletteProps {
  colors: ColorPaletteType;
}

function ShadeScale({ scale, name, description }: { scale: ColorScale; name: string; description: string }) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {shades.map((shade) => (
          <div key={shade} className="space-y-1.5">
            <ColorSwatch
              color={scale[shade]}
              name={`${shade}`}
              size="small"
            />
            <span className="block text-[10px] text-center font-medium text-gray-500">{shade}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorSwatch({ color, name, size = 'default' }: { color: Color; name: string; size?: 'default' | 'small' }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textColor = color.hsl.l > 50 ? 'text-gray-900' : 'text-white';

  if (size === 'small') {
    return (
      <button
        onClick={copyToClipboard}
        className="group relative w-full aspect-square rounded-lg transition-transform hover:scale-105 hover:shadow-md"
        style={{ backgroundColor: color.hex }}
        title={`${name}: ${color.hex}`}
      >
        {copied && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            <Check className="w-3 h-3 text-white" />
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={copyToClipboard}
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 bg-white border border-gray-100"
    >
      <div className="h-20 w-full" style={{ backgroundColor: color.hex }} />
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-xs text-gray-900">{name}</span>
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        <span className="text-[10px] font-mono text-gray-500">{color.hex.toUpperCase()}</span>
      </div>
    </button>
  );
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  return (
    <div className="space-y-12">
      {/* 3-Tier Color System */}
      <ShadeScale scale={colors.primary} name="Primary" description="Brand foundation, trust (Navy/Deep)" />
      <ShadeScale scale={colors.secondary} name="Secondary" description="Energy, differentiation (Teal/Vibrant)" />
      <ShadeScale scale={colors.accent} name="Accent" description="CTAs, urgency, highlights (Orange/Coral)" />

      {/* Utility Colors */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Utility Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {colors.utility.map((color, i) => (
            <ColorSwatch
              key={`utility-${i}`}
              color={color}
              name={['Peach', 'Light Blue', 'Slate'][i] || `Utility ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Neutral Scale */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Neutral Scale</h3>
          <div className="grid grid-cols-5 gap-2">
            {colors.neutral.map((color, i) => (
              <div key={`neutral-${i}`} className="space-y-1">
                <ColorSwatch
                  color={color}
                  name={`${(10 - i) * 100}`}
                  size="small"
                />
                <span className="block text-[10px] text-center text-gray-500">{(10 - i) * 100}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semantic Colors */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Semantic Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            <ColorSwatch color={colors.semantic.success} name="Success" />
            <ColorSwatch color={colors.semantic.error} name="Error" />
            <ColorSwatch color={colors.semantic.warning} name="Warning" />
            <ColorSwatch color={colors.semantic.info} name="Info" />
          </div>
        </div>
      </div>
    </div>
  );
}
