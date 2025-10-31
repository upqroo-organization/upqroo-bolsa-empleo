#!/usr/bin/env node

/**
 * Simple script to test if the API documentation is working correctly
 */

const http = require('http');

const testEndpoint = (path, expectedStatus = 200) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === expectedStatus) {
          console.log(`✅ ${path} - Status: ${res.statusCode}`);
          resolve({ status: res.statusCode, data });
        } else {
          console.log(`❌ ${path} - Expected: ${expectedStatus}, Got: ${res.statusCode}`);
          reject(new Error(`Unexpected status code: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ ${path} - Error: ${err.message}`);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log(`❌ ${path} - Timeout`);
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
};

async function testApiDocumentation() {
  console.log('🚀 Testing API Documentation Endpoints...\n');

  const tests = [
    { path: '/api/docs', description: 'OpenAPI Specification' },
    { path: '/api/health', description: 'Health Check' },
    { path: '/api/states', description: 'States Endpoint' },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.description}:`);
      await testEndpoint(test.path);
    } catch (error) {
      console.log(`Failed to test ${test.description}: ${error.message}`);
    }
    console.log('');
  }

  console.log('📖 API Documentation should be available at:');
  console.log('   http://localhost:3000/api-docs');
  console.log('');
  console.log('📋 OpenAPI Specification available at:');
  console.log('   http://localhost:3000/api/docs');
}

// Run the tests
testApiDocumentation().catch(console.error);