'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import type { GradientPalette, Gradient } from '@/lib/types/brand';

interface GradientDisplayProps {
  gradients: GradientPalette;
}

function GradientCard({ gradient }: { gradient: Gradient }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(gradient.css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Gradient Preview */}
      <div
        className="h-32 w-full relative"
        style={{ background: gradient.css }}
      >
        {/* AI Badge */}
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            <Sparkles className="w-3 h-3" />
            AI Generated
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full capitalize">
            {gradient.type}
            {gradient.angle !== undefined && ` ${gradient.angle}°`}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{gradient.name}</h4>
            {gradient.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{gradient.description}</p>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Copy CSS"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Usage suggestion */}
        {gradient.usage && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Best for</p>
            <p className="text-sm text-gray-600 mt-1">{gradient.usage}</p>
          </div>
        )}

        {/* Color Stops */}
        {gradient.colors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Color Stops</p>
            <div className="flex gap-1">
              {gradient.colors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.hex}
                />
              ))}
              {gradient.colors.length > 5 && (
                <span className="text-xs text-gray-400 self-center ml-1">
                  +{gradient.colors.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* CSS Code (expandable) */}
        <details className="mt-3">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 font-medium uppercase tracking-wide">
            View CSS
          </summary>
          <pre className="mt-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-700 overflow-x-auto">
            <code>{`background: ${gradient.css};`}</code>
          </pre>
        </details>
      </div>
    </div>
  );
}

export default function GradientDisplay({ gradients }: GradientDisplayProps) {
  const hasSuggested = gradients.suggested.length > 0;

  if (!hasSuggested) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No gradients generated for this brand.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Suggested Gradients */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Generated Gradients</h3>
          <span className="text-sm text-gray-500">({gradients.suggested.length})</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Modern gradient suggestions based on your color palette and current web design trends.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gradients.suggested.map((gradient) => (
            <GradientCard key={gradient.id} gradient={gradient} />
          ))}
        </div>
      </section>

      {/* Usage Tips */}
      <section className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-3">Gradient Best Practices</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Use subtle gradients for backgrounds to add depth without distraction
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Bold gradients work great for CTAs and hero sections
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Consider using CSS custom properties for animated gradient effects
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">•</span>
            Test gradients on both light and dark backgrounds for accessibility
          </li>
        </ul>
      </section>
    </div>
  );
}
