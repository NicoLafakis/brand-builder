'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft, Code, Lock, Activity, Download, Globe } from 'lucide-react';

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">Brand Kit Generator</span>
                    </Link>
                    <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" />
                        Back to App
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 flex items-center gap-3">
                        <Code className="w-10 h-10 text-blue-600" />
                        Public API Documentation
                    </h1>
                    <p className="text-lg text-gray-600">
                        Integrate the Brand Kit Generator directly into your own applications and workflows with our robust, versioned REST API.
                    </p>
                </div>

                {/* Authentication Section */}
                <section className="mb-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                        <Lock className="w-6 h-6 text-purple-600" />
                        Authentication
                    </h2>
                    <p className="text-gray-600 mb-6">
                        All requests must include your API key in the <code>x-api-key</code> request header. Keep this key secure as it grants access to your brand generation features.
                    </p>
                    <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <code className="text-blue-400">x-api-key: YOUR_API_KEY</code>
                    </div>
                    <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-sm text-purple-800">
                            <strong>Note:</strong> API keys are managed via the <code>BRAND_BUILDER_API_KEY</code> environment variable on the server.
                        </p>
                    </div>
                </section>

                {/* Endpoints */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900">Endpoints</h2>

                    {/* Health Check */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-md text-sm">GET</span>
                                <code className="font-bold text-gray-800">/api/v1/health</code>
                            </div>
                            <Activity className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold mb-2">Health Check</h3>
                            <p className="text-gray-600 mb-4">Verify that the API is active and your authentication token is valid.</p>
                            <div className="bg-gray-900 rounded-xl p-4 mb-4">
                                <code className="text-sm text-gray-300">
                                    {`curl -H "x-api-key: YOUR_API_KEY" https://brand-builder.vercel.app/api/v1/health`}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Generate */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-md text-sm">POST</span>
                                <code className="font-bold text-gray-800">/api/v1/generate</code>
                            </div>
                            <Globe className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold mb-2">Generate Brand Kit</h3>
                            <p className="text-gray-600 mb-4">Traces the provided URL and generates a complete brand kit object.</p>
                            <div className="mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Request Body:</p>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <pre className="text-sm text-gray-800">
                                        {`{
  "url": "https://example.com"
}`}
                                    </pre>
                                </div>
                            </div>
                            <div className="bg-gray-900 rounded-xl p-4">
                                <code className="text-sm text-gray-300">
                                    {`curl -X POST -H "Content-Type: application/json" \\
                                    -H "x-api-key: YOUR_API_KEY" \\
                                    -d '{"url":"https://example.com"}' \\
                                    https://brand-builder.vercel.app/api/v1/generate`}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* Export */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-md text-sm">POST</span>
                                <code className="font-bold text-gray-800">/api/v1/export</code>
                            </div>
                            <Download className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold mb-2">Export Assets</h3>
                            <p className="text-gray-600 mb-4">Generates a downloadable ZIP file from a previously generated brand kit object.</p>
                            <div className="bg-gray-900 rounded-xl p-4">
                                <code className="text-sm text-gray-300">
                                    {`curl -X POST -H "Content-Type: application/json" \\
                                    -H "x-api-key: YOUR_API_KEY" \\
                                    -d @brand-kit.json \\
                                    https://brand-builder.vercel.app/api/v1/export --output kit.zip`}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-500 text-sm">
                        Powered by the Brand Builder Engine. v1.0.0
                    </p>
                </footer>
            </main>
        </div>
    );
}
