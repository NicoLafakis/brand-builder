'use client';

import type { Typography, TypographyStyle } from '@/lib/types/brand';

interface TypographyDisplayProps {
  typography: Typography;
}

export default function TypographyDisplay({ typography }: TypographyDisplayProps) {
  const roles = [
    { label: 'Headlines', font: typography.headlines, description: 'Establish personality and create impact' },
    { label: 'Subheadings', font: typography.subheadings, description: 'Bridge headlines and body with clarity' },
    { label: 'Body', font: typography.body, description: 'Maximize readability for sustained reading' },
    { label: 'Code & Labels', font: typography.code, description: 'Technical precision for data and metadata' },
  ];

  return (
    <div className="space-y-12">
      {/* Font Roles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div key={role.label} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{role.label}</span>
            <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1 truncate" title={role.font.family}>
              {role.font.family}
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{role.description}</p>
            <div className="flex gap-1.5 flex-wrap">
              {role.font.variants.map((v) => (
                <span key={v} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600 font-medium">
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Heading Hierarchy */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">H1</span>
            Heading Hierarchy
          </h3>
          <div className="space-y-8">
            {(Object.entries(typography.hierarchy) as [string, TypographyStyle][]).map(([tag, style]) => (
              <div key={tag} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{tag}</span>
                  <div className="h-px flex-1 bg-gray-100 group-hover:bg-blue-100 transition-colors" />
                  <span className="text-[10px] font-mono text-gray-400">{style.fontSize}</span>
                </div>
                <div
                  className="text-gray-900 leading-tight"
                  style={{
                    fontFamily: style.fontFamily,
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    lineHeight: style.lineHeight,
                    letterSpacing: style.letterSpacing,
                    textTransform: style.textTransform
                  }}
                >
                  The quick brown fox
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body Variants */}
        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">Aa</span>
              Body Text Variants
            </h3>
            <div className="space-y-8">
              {(Object.entries(typography.bodyVariants) as [string, TypographyStyle][]).map(([name, style]) => (
                <div key={name}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{name}</span>
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[10px] font-mono text-gray-400">{style.fontSize}</span>
                  </div>
                  <p
                    className="text-gray-700"
                    style={{
                      fontFamily: style.fontFamily,
                      fontSize: style.fontSize,
                      fontWeight: style.fontWeight,
                      lineHeight: style.lineHeight
                    }}
                  >
                    Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Typography Guidelines</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <span className="text-[10px] text-gray-400 block mb-1">Body Line Height</span>
                <span className="text-xl font-bold">{typography.recommendations.lineHeight.body}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block mb-1">Heading Line Height</span>
                <span className="text-xl font-bold">{typography.recommendations.lineHeight.heading}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block mb-1">Max Line Length</span>
                <span className="text-xl font-bold">{typography.recommendations.maxLineLength.min}-{typography.recommendations.maxLineLength.max}</span>
                <span className="text-[10px] ml-1 text-gray-500">chars</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block mb-1">All-Caps Tracking</span>
                <span className="text-xl font-bold font-mono">{typography.recommendations.letterSpacing.allCaps}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
