'use client';

import type { BrandPersonality, BrandVoice } from '@/lib/types/brand';

interface BrandVoiceDisplayProps {
  personality: BrandPersonality;
  voice: BrandVoice;
}

function ToneSlider({ label, value, leftLabel, rightLabel }: {
  label: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{leftLabel}</span>
        <span className="font-medium text-gray-900">{label}</span>
        <span className="text-gray-500">{rightLabel}</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          style={{ width: `${value * 10}%` }}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -top-1 transform -translate-x-1/2"
          style={{ left: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function BrandVoiceDisplay({ personality, voice }: BrandVoiceDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Brand Archetype */}
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Brand Archetype</span>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {personality.archetype.primary}
              {personality.archetype.secondary && (
                <span className="text-gray-400 font-normal"> / {personality.archetype.secondary}</span>
              )}
            </h3>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{personality.archetype.description}</p>
        <div className="flex flex-wrap gap-2">
          {personality.archetype.traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 bg-white rounded-full text-sm font-medium text-indigo-700 shadow-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Tone Dimensions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tone Dimensions</h3>
        <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
          <ToneSlider
            label=""
            value={personality.tone.formalityCasual}
            leftLabel="Formal"
            rightLabel="Casual"
          />
          <ToneSlider
            label=""
            value={personality.tone.seriousFunny}
            leftLabel="Serious"
            rightLabel="Funny"
          />
          <ToneSlider
            label=""
            value={personality.tone.respectfulIrreverent}
            leftLabel="Respectful"
            rightLabel="Irreverent"
          />
          <ToneSlider
            label=""
            value={personality.tone.matterOfFactEnthusiastic}
            leftLabel="Matter-of-fact"
            rightLabel="Enthusiastic"
          />
        </div>
      </div>

      {/* Aaker Dimensions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Personality Dimensions</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(personality.dimensions).map(([dimension, value]) => (
            <div key={dimension} className="text-center">
              <div className="relative w-full aspect-square mb-2">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${value * 10} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
                  {value}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-600 capitalize">{dimension}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Principles */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Principles</h3>
        <div className="space-y-4">
          {voice.principles.map((principle, i) => (
            <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">{principle.name}</h4>
              <p className="text-gray-600 text-sm mb-3">{principle.description}</p>
              <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">How to apply</span>
                <p className="text-sm text-gray-700 mt-1">{principle.howToApply}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex-1 p-3 bg-green-50 rounded-lg">
                  <span className="text-xs font-medium text-green-600">Example</span>
                  <p className="text-green-800 mt-1 italic">{principle.example}</p>
                </div>
                <div className="flex-1 p-3 bg-red-50 rounded-lg">
                  <span className="text-xs font-medium text-red-600">Avoid</span>
                  <p className="text-red-800 mt-1">{principle.whatNotToDo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 bg-green-50 rounded-xl">
          <h4 className="font-semibold text-green-800 mb-3">Words to Use</h4>
          <div className="flex flex-wrap gap-2">
            {voice.vocabulary.wordsToUse.map((word) => (
              <span
                key={word}
                className="px-3 py-1 bg-white rounded-full text-sm text-green-700 border border-green-200"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5 bg-red-50 rounded-xl">
          <h4 className="font-semibold text-red-800 mb-3">Words to Avoid</h4>
          <div className="flex flex-wrap gap-2">
            {voice.vocabulary.wordsToAvoid.map((word) => (
              <span
                key={word}
                className="px-3 py-1 bg-white rounded-full text-sm text-red-700 border border-red-200"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tone & Cadence */}
      <div className="p-5 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-3">Tone Description</h4>
        <p className="text-gray-600">{voice.toneDescription}</p>
        <h4 className="font-semibold text-gray-900 mt-4 mb-3">Cadence</h4>
        <p className="text-gray-600">{voice.cadenceDescription}</p>
      </div>
    </div>
  );
}
