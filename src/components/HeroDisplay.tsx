'use client';

import { Sparkles, Layout, Palette, Zap, Star, ShieldCheck, Cpu, Diamond } from 'lucide-react';
import type { HeroPreset } from '@/lib/types/brand';

interface HeroDisplayProps {
    heroes: HeroPreset[];
}

const moodIcons: Record<string, any> = {
    minimal: <Layout className="w-4 h-4" />,
    dark: <ShieldCheck className="w-4 h-4" />,
    gradient: <Palette className="w-4 h-4" />,
    organic: <Sparkles className="w-4 h-4" />,
    technical: <Cpu className="w-4 h-4" />,
    luxury: <Diamond className="w-4 h-4" />,
    modern: <Zap className="w-4 h-4" />,
    ethereal: <Star className="w-4 h-4" />,
};

function HeroCard({ hero }: { hero: HeroPreset }) {
    const primaryMood = hero.mood[0] || 'minimal';
    const Icon = moodIcons[primaryMood] || <Layout className="w-4 h-4" />;

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            {/* Mock Preview Area */}
            <div className="h-48 bg-gray-900 relative p-4 flex flex-col justify-end overflow-hidden">
                {/* Abstract Preview Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    {hero.id === 'clean-slate' && <div className="absolute inset-0 bg-white" />}
                    {hero.id === 'bold-edge' && <div className="absolute inset-0 bg-navy-800" style={{ backgroundColor: '#142d63' }} />}
                    {hero.id === 'gradient-flow' && <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 animate-gradient-xy" />}
                    {hero.id === 'aurora-pulse' && <div className="absolute inset-0 bg-black"><div className="absolute inset-0 bg-gradient-to-t from-green-500/20 via-blue-500/20 blur-3xl opacity-50" /></div>}
                    {hero.id === 'kinetic-grid' && <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px]" />}
                    {hero.id === 'executive-suite' && <div className="absolute inset-0 bg-[#0a0a0a]" />}
                </div>

                <div className="relative z-10 space-y-1">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">{hero.name} Preview</span>
                    <div className="h-1.5 w-24 bg-white/20 rounded-full" />
                    <div className="h-1.5 w-16 bg-white/10 rounded-full" />
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            {Icon}
                        </div>
                        <h4 className="font-bold text-gray-900">{hero.name}</h4>
                    </div>
                    <div className="flex gap-1">
                        {hero.mood.slice(0, 2).map((m) => (
                            <span key={m} className="px-2 py-0.5 bg-gray-100 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                {m}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-gray-600 mb-6 leading-relaxed italic">{hero.concept}</p>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Background</span>
                            <p className="text-[11px] text-gray-700 font-medium leading-tight">{hero.specs.background}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Layout</span>
                            <p className="text-[11px] text-gray-700 font-medium leading-tight">{hero.specs.layout}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Typography</span>
                            <p className="text-[11px] text-gray-700 font-medium leading-tight">{hero.specs.typography}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Animation</span>
                            <p className="text-[11px] text-gray-700 font-medium leading-tight">{hero.specs.animation}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Recommended for</span>
                            <p className="text-[11px] text-blue-600 font-semibold leading-tight">{hero.bestFor}</p>
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Layout className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HeroDisplay({ heroes }: HeroDisplayProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Hero/Component Presets</h3>
                    <p className="text-sm text-gray-500">Curated layout and atmospheric presets for core sections</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {heroes.map((hero) => (
                    <HeroCard key={hero.id} hero={hero} />
                ))}
            </div>
        </div>
    );
}
