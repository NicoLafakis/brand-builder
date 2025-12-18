'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ColorPalette as ColorPaletteType, Color } from '@/lib/types/brand';

interface ColorPaletteProps {
  colors: ColorPaletteType;
}

function ColorSwatch({ color, name, size = 'default' }: { color: Color; name: string; size?: 'default' | 'small' }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if text should be light or dark based on background
  const textColor = color.hsl.l > 50 ? 'text-gray-900' : 'text-white';

  if (size === 'small') {
    return (
      <button
        onClick={copyToClipboard}
        className="group relative w-12 h-12 rounded-lg transition-transform hover:scale-110 hover:shadow-lg"
        style={{ backgroundColor: color.hex }}
        title={`${name}: ${color.hex}`}
      >
        {copied && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <Check className="w-4 h-4 text-white" />
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={copyToClipboard}
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
      style={{ backgroundColor: color.hex }}
    >
      <div className="h-24 w-full" />
      <div className={`p-3 ${textColor}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{name}</span>
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        <span className="text-xs opacity-75 font-mono">{color.hex.toUpperCase()}</span>
      </div>
    </button>
  );
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  return (
    <div className="space-y-8">
      {/* Primary Colors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {colors.primary.map((color, i) => (
            <ColorSwatch
              key={`primary-${i}`}
              color={color}
              name={color.name || `Primary ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Secondary Colors */}
      {colors.secondary.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Secondary Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {colors.secondary.map((color, i) => (
              <ColorSwatch
                key={`secondary-${i}`}
                color={color}
                name={color.name || `Secondary ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Accent Colors */}
      {colors.accent.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accent Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {colors.accent.map((color, i) => (
              <ColorSwatch
                key={`accent-${i}`}
                color={color}
                name={color.name || `Accent ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Neutral Scale */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Neutral Scale</h3>
        <div className="flex gap-2 flex-wrap">
          {colors.neutral.map((color, i) => (
            <ColorSwatch
              key={`neutral-${i}`}
              color={color}
              name={`${(10 - i) * 100}`}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ColorSwatch color={colors.semantic.success} name="Success" />
          <ColorSwatch color={colors.semantic.error} name="Error" />
          <ColorSwatch color={colors.semantic.warning} name="Warning" />
          <ColorSwatch color={colors.semantic.info} name="Info" />
        </div>
      </div>
    </div>
  );
}
