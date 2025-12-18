'use client';

import type { Typography } from '@/lib/types/brand';

interface TypographyDisplayProps {
  typography: Typography;
}

export default function TypographyDisplay({ typography }: TypographyDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Font Families */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Heading Font</span>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
              {typography.headingFont.category}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {typography.headingFont.family}
          </h2>
          <p className="text-gray-600 text-lg">
            The quick brown fox jumps over the lazy dog
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            {typography.headingFont.variants.map((variant) => (
              <span
                key={variant}
                className="text-xs px-2 py-1 bg-white border border-gray-200 rounded"
              >
                {variant}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Body Font</span>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
              {typography.bodyFont.category}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {typography.bodyFont.family}
          </h2>
          <p className="text-gray-600">
            The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            {typography.bodyFont.variants.map((variant) => (
              <span
                key={variant}
                className="text-xs px-2 py-1 bg-white border border-gray-200 rounded"
              >
                {variant}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Type Scale */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Type Scale</h3>
          <span className="text-sm text-gray-500">
            {typography.scale.ratioName} ({typography.scale.ratio})
          </span>
        </div>
        <div className="space-y-3">
          {typography.scale.sizes.map((size) => (
            <div
              key={size.name}
              className="flex items-baseline gap-4 py-3 border-b border-gray-100 last:border-b-0"
            >
              <span className="w-16 text-sm text-gray-400 font-mono">{size.name}</span>
              <span className="w-20 text-sm text-gray-400">{size.size}px</span>
              <span
                className="text-gray-900 truncate"
                style={{
                  fontSize: `${Math.min(size.size, 48)}px`,
                  lineHeight: size.lineHeight,
                  letterSpacing: size.letterSpacing ? `${size.letterSpacing}em` : undefined,
                }}
              >
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Guidelines */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl">
          <span className="text-sm font-medium text-blue-600">Body Line Height</span>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {typography.recommendations.lineHeight.body}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl">
          <span className="text-sm font-medium text-purple-600">Heading Line Height</span>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {typography.recommendations.lineHeight.heading}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl">
          <span className="text-sm font-medium text-green-600">Optimal Line Length</span>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {typography.recommendations.maxLineLength.min}-{typography.recommendations.maxLineLength.max}
          </p>
          <span className="text-xs text-green-600">characters</span>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl">
          <span className="text-sm font-medium text-amber-600">All-Caps Tracking</span>
          <p className="text-2xl font-bold text-amber-900 mt-1 font-mono">
            {typography.recommendations.letterSpacing.allCaps}
          </p>
        </div>
      </div>
    </div>
  );
}
