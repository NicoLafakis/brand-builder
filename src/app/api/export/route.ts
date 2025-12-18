import { NextRequest, NextResponse } from 'next/server';
import { generateBrandKitZip } from '@/lib/services/export';
import type { BrandKit } from '@/lib/types/brand';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brandKit } = body as { brandKit: BrandKit };

    if (!brandKit) {
      return NextResponse.json(
        { error: 'Brand kit data is required' },
        { status: 400 }
      );
    }

    // Generate ZIP file
    const zipBlob = await generateBrandKitZip(brandKit);

    // Convert blob to buffer
    const arrayBuffer = await zipBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${brandKit.name.toLowerCase().replace(/\s+/g, '-')}-brand-kit.zip"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Export error:', error);

    const message = error instanceof Error ? error.message : 'Failed to export brand kit';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
