'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch('/api/docs');
        if (!response.ok) {
          throw new Error('Failed to fetch API specification');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error Loading Documentation</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UPQROO Bolsa de Trabajo API Documentation
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Complete API documentation for the UPQROO University Job Board Platform.
            This documentation covers all available endpoints, request/response formats,
            and authentication requirements.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Authentication:</strong> Most endpoints require authentication via NextAuth.js session cookies.
                  Make sure you&apos;re logged in to test protected endpoints.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
              <code className="text-sm text-blue-600 bg-white px-2 py-1 rounded">
                {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
              </code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Version</h3>
              <code className="text-sm text-green-600 bg-white px-2 py-1 rounded">v1.0.0</code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
              <code className="text-sm text-purple-600 bg-white px-2 py-1 rounded">JSON</code>
            </div>
          </div>
        </div>

        <div className="swagger-container">
          {spec && (
            <SwaggerUI
              spec={spec}
              docExpansion="list"
              defaultModelsExpandDepth={2}
              defaultModelExpandDepth={2}
              displayRequestDuration={true}
              tryItOutEnabled={true}
              filter={true}
              showExtensions={true}
              showCommonExtensions={true}
              requestInterceptor={(request) => {
                // Add any custom headers or modifications here
                return request;
              }}
              responseInterceptor={(response) => {
                // Handle responses here if needed
                return response;
              }}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        .swagger-ui {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .swagger-ui .topbar {
          display: none;
        }
        
        .swagger-ui .info {
          margin: 0 0 20px 0;
        }
        
        .swagger-ui .scheme-container {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .swagger-ui .opblock.opblock-get {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }
        
        .swagger-ui .opblock.opblock-post {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }
        
        .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        
        .swagger-ui .opblock-summary-method {
          border-radius: 6px;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          padding: 4px 8px;
        }
        
        .swagger-ui .btn.try-out__btn {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-weight: 500;
        }
        
        .swagger-ui .btn.try-out__btn:hover {
          background: #2563eb;
        }
        
        .swagger-ui .btn.execute {
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-weight: 500;
        }
        
        .swagger-ui .btn.execute:hover {
          background: #059669;
        }
        
        .swagger-ui .response-col_status {
          font-weight: 600;
        }
        
        .swagger-ui .response-col_links {
          display: none;
        }
        
        .swagger-ui .model-box {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
        }
        
        .swagger-ui .model-title {
          color: #374151;
          font-weight: 600;
        }
        
        .swagger-ui .parameter__name {
          font-weight: 600;
          color: #374151;
        }
        
        .swagger-ui .parameter__type {
          color: #6b7280;
          font-size: 12px;
        }
        
        .swagger-ui .opblock-tag {
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .swagger-ui .opblock-tag small {
          color: #6b7280;
          font-weight: normal;
        }
      `}</style>
    </div>
  );
}