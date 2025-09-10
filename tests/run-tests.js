#!/usr/bin/env node

/**
 * Simple test runner for IdeaAnalysis deduplication tests
 * Can be run with: node tests/run-tests.js
 */

// Import the test suite
const path = require('path');
const fs = require('fs');

// Simple require function for ES modules in Node
async function runTests() {
    try {
        // Import test file dynamically
        const testFilePath = path.join(__dirname, 'IdeaAnalysis.test.js');

        console.log('🧪 Just Plan It - API Deduplication Tests');
        console.log('='.repeat(50));
        console.log(`📁 Test file: ${testFilePath}`);
        console.log('⏰ Started at:', new Date().toISOString());
        console.log('');

        // Read and execute the test file
        const testCode = fs.readFileSync(testFilePath, 'utf8');

        // Create a context with globals
        const context = {
            console: console,
            setTimeout: setTimeout,
            Promise: Promise,
            Date: Date,
            parseInt: parseInt,
            JSON: JSON,
            require: require,
            module: { exports: {} },
            global: {},
            localStorage: mockLocalStorage() // Mock localStorage for Node
        };

        // Execute the test code in context
        const Function = global.Function;
        const testFunction = new Function(
            'console', 'setTimeout', 'Promise', 'Date', 'parseInt', 'JSON', 'require', 'module', 'global', 'localStorage',
            testCode
        );

        testFunction(
            context.console,
            context.setTimeout,
            context.Promise,
            context.Date,
            context.parseInt,
            context.JSON,
            context.require,
            context.module,
            context.global,
            context.localStorage
        );

    } catch (error) {
        console.error('❌ Error running tests:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Mock localStorage for Node.js environment
function mockLocalStorage() {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => store[key] = value.toString(),
        removeItem: (key) => delete store[key],
        clear: () => store = {},
        get store() { return { ...store }; }
    };
}

// Run if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
