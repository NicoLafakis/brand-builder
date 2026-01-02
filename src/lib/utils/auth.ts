import { NextRequest } from 'next/server';

/**
 * Validates the API key from the request headers.
 * The key should be provided in the 'x-api-key' header.
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.BRAND_BUILDER_API_KEY;

  if (!validApiKey) {
    console.warn('BRAND_BUILDER_API_KEY is not set in environment variables. API authentication is disabled.');
    return true; // If no key is set, we allow the request for survival, but warn.
  }

  return apiKey === validApiKey;
}

/**
 * Shared error response for unauthorized requests.
 */
export const unauthorizedResponse = {
  error: 'Unauthorized. Please provide a valid API key in the x-api-key header.',
  status: 401
};
