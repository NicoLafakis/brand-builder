'use client';

import { useState } from 'react';
import { Globe, ArrowRight, Loader2 } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    // Basic URL validation
    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = `https://${validUrl}`;
    }

    try {
      new URL(validUrl);
      onSubmit(validUrl);
    } catch {
      setError('Please enter a valid URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Globe className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (e.g., stripe.com)"
          className="block w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-2 right-2 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>Generate</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 pl-4">{error}</p>
      )}
      <p className="mt-3 text-sm text-gray-500 text-center">
        We&apos;ll extract colors, fonts, logos, and brand voice from the website
      </p>
    </form>
  );
}
