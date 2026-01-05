'use client';

import { useState } from 'react';
import { ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';
import type { Logo } from '@/lib/types/brand';

interface LogoDisplayProps {
  logos: Logo[];
}

/**
 * Validates if a logo has a usable URL
 */
function isValidLogoUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  if (url.startsWith('data:image/svg+xml,')) {
    // Check if SVG data URI has actual content
    const svgContent = url.replace('data:image/svg+xml,', '');
    return svgContent.length > 10 && svgContent.includes('<');
  }
  // Check for valid http/https URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  // Check for other data URIs
  if (url.startsWith('data:image/')) {
    return url.length > 50; // Reasonable minimum for actual image data
  }
  return false;
}

function LogoCard({ logo }: { logo: Logo }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isSvgDataUri = logo.url.startsWith('data:image/svg+xml,');
  const isExternalUrl = logo.url.startsWith('http://') || logo.url.startsWith('https://');

  // Don't render if image failed to load
  if (imageError && !isSvgDataUri) {
    return null;
  }

  return (
    <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
      <div className="flex-shrink-0 w-24 h-24 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
        {isSvgDataUri ? (
          <div
            className="w-full h-full p-2 flex items-center justify-center"
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(logo.url.replace('data:image/svg+xml,', '')),
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.url}
            alt={`${logo.type} logo`}
            className={`max-w-full max-h-full object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900 capitalize">
            {logo.type.replace(/-/g, ' ')}
          </span>
          <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600 uppercase">
            {logo.format}
          </span>
        </div>
        {logo.width && logo.height && logo.width > 0 && logo.height > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            {logo.width} x {logo.height} pixels
          </p>
        )}
        {isExternalUrl && (
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
        {isSvgDataUri && (
          <span className="text-sm text-gray-500">Inline SVG</span>
        )}
      </div>
    </div>
  );
}

export default function LogoDisplay({ logos }: LogoDisplayProps) {
  // Filter to only valid logos
  const validLogos = logos.filter(logo => isValidLogoUrl(logo.url));

  if (validLogos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
        <p className="text-gray-500">No logos were detected on this website</p>
        <p className="text-sm text-gray-400 mt-2">
          Try checking the website manually for logo files
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800">
            <strong>{validLogos.length} logo{validLogos.length !== 1 ? 's' : ''}</strong> detected from the website.
            These include favicons, apple touch icons, Open Graph images, and any logo elements found in the page.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {validLogos.map((logo, i) => (
          <LogoCard key={`${logo.type}-${i}`} logo={logo} />
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
