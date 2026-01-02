import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
    if (!validateApiKey(request)) {
        return NextResponse.json(
            { error: unauthorizedResponse.error },
            { status: unauthorizedResponse.status }
        );
    }

    return NextResponse.json({
        status: 'ok',
        message: 'Brand Builder API is healthy and authenticated.',
        version: 'v1',
        timestamp: new Date().toISOString()
    });
}
