'use client';

import { useState } from 'react';
import { Sparkles, Palette, Type, MessageSquare, FileDown, Zap } from 'lucide-react';
import URLInput from '@/components/URLInput';
import BrandKitDisplay from '@/components/BrandKitDisplay';
import type { BrandKit } from '@/lib/types/brand';

export default function Home() {
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setBrandKit(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate brand kit');
      }

      setBrandKit(data.brandKit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Brand Kit Generator</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        {!brandKit && (
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Generate Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Brand Kit
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Enter any website URL and we&apos;ll extract colors, fonts, logos, and brand voice
              to create a comprehensive brand kit in seconds.
            </p>
          </div>
        )}

        {/* URL Input */}
        <div className={brandKit ? 'mb-8' : 'mb-16'}>
          <URLInput onSubmit={handleGenerate} isLoading={isLoading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-blue-600 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Website</h3>
                <p className="text-gray-500 text-center">
                  Extracting brand assets and generating your brand kit...
                </p>
                <div className="mt-6 space-y-3 w-full">
                  {[
                    { label: 'Extracting colors from CSS...', delay: '0ms' },
                    { label: 'Detecting typography...', delay: '200ms' },
                    { label: 'Finding logos...', delay: '400ms' },
                    { label: 'Analyzing brand voice...', delay: '600ms' },
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse"
                      style={{ animationDelay: step.delay }}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-600">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Brand Kit Display */}
        {brandKit && <BrandKitDisplay brandKit={brandKit} />}

        {/* Features Section (shown when no brand kit) */}
        {!brandKit && !isLoading && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              What You&apos;ll Get
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Palette className="w-6 h-6" />,
                  title: 'Color Palette',
                  description: 'Primary, secondary, accent, and semantic colors with WCAG compliance',
                },
                {
                  icon: <Type className="w-6 h-6" />,
                  title: 'Typography System',
                  description: 'Font families, type scale, and typography guidelines',
                },
                {
                  icon: <MessageSquare className="w-6 h-6" />,
                  title: 'Brand Voice',
                  description: 'Archetype analysis, tone dimensions, and vocabulary',
                },
                {
                  icon: <FileDown className="w-6 h-6" />,
                  title: 'Export Bundle',
                  description: 'PDF guidelines, design tokens, CSS variables, and more',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    step: '1',
                    title: 'Enter URL',
                    description: 'Paste any website URL to analyze its brand assets',
                  },
                  {
                    step: '2',
                    title: 'AI Analysis',
                    description: 'We extract colors, fonts, logos, and analyze brand voice',
                  },
                  {
                    step: '3',
                    title: 'Download Kit',
                    description: 'Get your complete brand kit with guidelines and assets',
                  },
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold text-blue-600 mx-auto mb-4 shadow-md">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Powered by Playwright, chroma.js, and W3C Design Tokens
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            Brand Kit Generator - Extract and generate comprehensive brand assets from any website
          </p>
        </div>
      </footer>
    </div>
  );
}
