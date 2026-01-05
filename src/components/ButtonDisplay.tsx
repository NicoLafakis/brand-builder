'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { ButtonStyles, ButtonStyle as ButtonStyleType } from '@/lib/types/brand';

interface ButtonDisplayProps {
    buttons: ButtonStyles;
}

function ButtonVariant({ style, name }: { style: ButtonStyleType; name: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{name}</span>
                    <h4 className="text-sm font-semibold text-gray-900 mt-1">{style.label}</h4>
                </div>
                <button
                    onClick={() => copyToClipboard(`background: ${style.background}; color: ${style.text}; border-radius: ${style.borderRadius};`)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors group relative"
                    title="Copy CSS properties"
                >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />}
                </button>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-200/50 min-h-[140px]">
                <button
                    className="transition-all active:scale-95"
                    style={{
                        backgroundColor: style.background,
                        color: style.text,
                        borderRadius: style.borderRadius,
                        padding: style.padding,
                        fontWeight: style.fontWeight,
                        border: style.border,
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = style.hover;
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = style.background;
                    }}
                >
                    {style.label}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Background</span>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: style.background }} />
                        <span className="text-xs font-mono text-gray-600 uppercase">{style.background}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Text Color</span>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: style.text }} />
                        <span className="text-xs font-mono text-gray-600 uppercase">{style.text}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Radius</span>
                    <span className="text-xs font-mono text-gray-600 block">{style.borderRadius}</span>
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Padding</span>
                    <span className="text-xs font-mono text-gray-600 block">{style.padding}</span>
                </div>
            </div>
        </div>
    );
}

export default function ButtonDisplay({ buttons }: ButtonDisplayProps) {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Core Button Variants</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ButtonVariant style={buttons.primary} name="01 Primary" />
                    <ButtonVariant style={buttons.secondary} name="02 Secondary" />
                    <ButtonVariant style={buttons.solid} name="03 Solid" />
                    <ButtonVariant style={buttons.ghost} name="04 Ghost" />
                </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-blue-100/50">
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest mb-4">Button States & Methodology</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-900 block">Default</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Normal appearance, clearly representing the action's tier.</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-900 block">Hover</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Visual feedback on cursor, typically a 10% shift in lightness.</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-900 block">Active/Pressed</span>
                        <p className="text-xs text-gray-600 leading-relaxed">Slight scale down (0.98x) and deep color to simulate depth.</p>
                    </div>
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-gray-900 block">Disabled</span>
                        <p className="text-xs text-gray-600 leading-relaxed">50% opacity with no pointer events to prevent accidental clicks.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
