'use client';

import { useState } from 'react';
import {
  Palette,
  Type,
  MessageSquare,
  Image,
  Code,
  Download,
  Blend,
} from 'lucide-react';
import type { BrandKit } from '@/lib/types/brand';
import ColorPalette from './ColorPalette';
import GradientDisplay from './GradientDisplay';
import TypographyDisplay from './TypographyDisplay';
import BrandVoiceDisplay from './BrandVoiceDisplay';
import LogoDisplay from './LogoDisplay';
import ButtonDisplay from './ButtonDisplay';
import HeroDisplay from './HeroDisplay';
import { generateCSSVariables, generateTokensJSON } from '@/lib/utils/tokens';

interface BrandKitDisplayProps {
  brandKit: BrandKit;
}

type TabId = 'colors' | 'gradients' | 'typography' | 'buttons' | 'heroes' | 'voice' | 'logos' | 'tokens';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'colors', label: 'Colors', icon: <Palette className="w-4 h-4" /> },
  { id: 'gradients', label: 'Gradients', icon: <Blend className="w-4 h-4" /> },
  { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
  { id: 'buttons', label: 'Buttons', icon: <Blend className="w-4 h-4" /> },
  // eslint-disable-next-line @next/next/no-img-element
  { id: 'heroes', label: 'Hero Presets', icon: <Image className="w-4 h-4" /> },
  { id: 'voice', label: 'Brand Voice', icon: <MessageSquare className="w-4 h-4" /> },
  // eslint-disable-next-line @next/next/no-img-element
  { id: 'logos', label: 'Logos', icon: <Image className="w-4 h-4" /> },
  { id: 'tokens', label: 'Design Tokens', icon: <Code className="w-4 h-4" /> },
];

export default function BrandKitDisplay({ brandKit }: BrandKitDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabId>('colors');
  const [isExporting, setIsExporting] = useState(false);
  const [tokenView, setTokenView] = useState<'json' | 'css'>('json');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandKit }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${brandKit.name.toLowerCase().replace(/\s+/g, '-')}-brand-kit.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export brand kit. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{brandKit.name} Brand Kit</h2>
            <p className="text-gray-400 mt-1">Generated from {brandKit.domain}</p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Kit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'colors' && <ColorPalette colors={brandKit.colors} />}
        {activeTab === 'gradients' && <GradientDisplay gradients={brandKit.gradients} />}
        {activeTab === 'typography' && <TypographyDisplay typography={brandKit.typography} />}
        {activeTab === 'buttons' && <ButtonDisplay buttons={brandKit.buttons} />}
        {activeTab === 'heroes' && <HeroDisplay heroes={brandKit.heroes} />}
        {activeTab === 'voice' && (
          <BrandVoiceDisplay
            personality={brandKit.personality}
            voice={brandKit.voice}
          />
        )}
        {activeTab === 'logos' && <LogoDisplay logos={brandKit.logos} />}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            {/* Explanation Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What are Design Tokens?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Design tokens are the atomic building blocks of your design system. They store visual design
                    attributes like colors, typography, and spacing as reusable variables, ensuring consistency
                    across all your products and platforms.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1">Why use them?</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Maintain brand consistency across projects</li>
                        <li>• Enable easy theme switching and dark mode</li>
                        <li>• Streamline handoff between design and development</li>
                        <li>• Scale design decisions across teams</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 text-sm mb-1">How to use them?</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• <strong>JSON:</strong> Import into Figma, Style Dictionary, or design tools</li>
                        <li>• <strong>CSS:</strong> Drop into your stylesheet and reference with var()</li>
                        <li>• <strong>Export Kit:</strong> Get SCSS and Tailwind config included</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Token View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setTokenView('json')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tokenView === 'json'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <FileJson className="w-4 h-4" />
                JSON Tokens
              </button>
              <button
                onClick={() => setTokenView('css')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tokenView === 'css'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <FileCode className="w-4 h-4" />
                CSS Variables
              </button>
            </div>

            {/* Code Display */}
            <div className="relative">
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl overflow-x-auto text-sm max-h-[500px] overflow-y-auto">
                <code>
                  {tokenView === 'json'
                    ? generateTokensJSON(brandKit)
                    : generateCSSVariables(brandKit.tokens)}
                </code>
              </pre>
              <button
                onClick={() => {
                  const content = tokenView === 'json'
                    ? generateTokensJSON(brandKit)
                    : generateCSSVariables(brandKit.tokens);
                  navigator.clipboard.writeText(content);
                }}
                className="absolute top-3 right-3 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
