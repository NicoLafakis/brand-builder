import { NextRequest, NextResponse } from 'next/server';
import { buildBrandKit } from '@/lib/services/brand-kit-builder';
import { validateApiKey, unauthorizedResponse } from '@/lib/utils/auth';

// Force dynamic - never cache this route
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for extraction

export async function POST(request: NextRequest) {
    // Validate API Key
    if (!validateApiKey(request)) {
        return NextResponse.json(
            { error: unauthorizedResponse.error },
            { status: unauthorizedResponse.status }
        );
    }

    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate URL format
        let validUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            validUrl = `https://${url}`;
        }

        try {
            new URL(validUrl);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        console.log(`[Generate v1] Starting fresh brand kit generation for: ${validUrl}`);

        // Build the brand kit (always fresh - no caching)
        const brandKit = await buildBrandKit(validUrl);

        // Return with no-cache headers
        return NextResponse.json(
            { brandKit },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }
        );
    } catch (error) {
        console.error('v1 Brand kit generation error:', error);

        const message = error instanceof Error ? error.message : 'Failed to generate brand kit';

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
