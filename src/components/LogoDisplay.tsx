'use client';

import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import type { Logo } from '@/lib/types/brand';

interface LogoDisplayProps {
  logos: Logo[];
}

export default function LogoDisplay({ logos }: LogoDisplayProps) {
  if (logos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No logos were detected on this website</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl"
          >
            <div className="flex-shrink-0 w-24 h-24 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
              {logo.url.startsWith('data:') ? (
                <div
                  className="w-full h-full p-2"
                  dangerouslySetInnerHTML={{
                    __html: decodeURIComponent(logo.url.replace('data:image/svg+xml,', '')),
                  }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.url}
                  alt={`${logo.type} logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-900 capitalize">
                  {logo.type.replace('-', ' ')}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600 uppercase">
                  {logo.format}
                </span>
              </div>
              {logo.width && logo.height && (
                <p className="text-sm text-gray-500 mb-2">
                  {logo.width} x {logo.height} pixels
                </p>
              )}
              {!logo.url.startsWith('data:') && (
                <a
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <span className="truncate max-w-xs">{logo.url}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="font-medium text-amber-800 mb-2">Logo Usage Guidelines</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>Maintain clear space around the logo equal to the height of the logomark</li>
          <li>Do not reproduce smaller than 24px height for digital or 10mm for print</li>
          <li>Ensure sufficient contrast between logo and background</li>
          <li>Never stretch, distort, or add effects to the logo</li>
        </ul>
      </div>
    </div>
  );
}
