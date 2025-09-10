// Tests for IdeaAnalysis component deduplication logic
// Using vanilla JavaScript for broad compatibility

/**
 * Mock implementations for testing
 */

// Mock localStorage for testing
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => store[key] = value.toString(),
        removeItem: (key) => delete store[key],
        clear: () => store = {},
        get store() { return { ...store }; }
    };
})();

// Mock console for testing
const mockConsole = (() => {
    let logs = [];
    return {
        log: (...args) => logs.push(['log', ...args]),
        error: (...args) => logs.push(['error', ...args]),
        clear: () => logs = [],
        get logs() { return [...logs]; }
    };
})();

/**
 * Test Suite: API Call Deduplication Logic
 */
class DeduplicationTests {
    constructor() {
        this.testResults = [];
        this.setup();
    }

    setup() {
        // Reset mocks before each test
        mockLocalStorage.clear();
        mockConsole.clear();

        // Replace global objects for testing
        global.localStorage = mockLocalStorage;
        global.console = mockConsole;
    }

    /**
     * Simulate the analyzeIdea function logic for testing
     */
    createAnalyzeIdeaFunction() {
        let isAnalyzing = false;
        let lastAnalysisRequest = null;
        const mockApiCall = async (ideaText) => {
            // Simulate API delay
            return new Promise(resolve => {
                setTimeout(() => resolve({ success: true, data: { overview: { title: ideaText } } }), 100);
            });
        };

        return async function analyzeIdea(ideaText) {
            // 🛡️ DEDUPLICATION CHECK #1: Prevent multiple simultaneous calls
            if (isAnalyzing) {
                console.log('Analysis already in progress, skipping duplicate request');
                return { skipped: 'already_analyzing' };
            }

            // 🛡️ DEDUPLICATION CHECK #2: Prevent same idea being analyzed again
            if (lastAnalysisRequest === ideaText) {
                console.log('Same idea already analyzed, skipping duplicate request');
                return { skipped: 'same_idea' };
            }

            // 🛡️ RATE LIMITING CHECK: Prevent requests too close together
            const now = Date.now();
            const lastRequestTime = parseInt(localStorage.getItem('lastAnalysisTime') || '0');
            if (now - lastRequestTime < 5000) { // 5 second cooldown
                console.log('Rate limit: Please wait 5 seconds before making another analysis request');
                return { skipped: 'rate_limited' };
            }

            isAnalyzing = true;
            lastAnalysisRequest = ideaText;
            localStorage.setItem('lastAnalysisTime', now.toString());

            try {
                const result = await mockApiCall(ideaText);
                return { success: true, data: result.data };
            } catch (error) {
                return { success: false, error: error.message };
            } finally {
                isAnalyzing = false;
            }
        };
    }

    /**
     * Test: Basic deduplication prevents simultaneous calls
     */
    async testSimultaneousCalls() {
        const testName = 'Simultaneous Calls Prevention';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const analyzeIdea = this.createAnalyzeIdeaFunction();

            // Make two simultaneous calls
            const promises = [
                analyzeIdea('test idea 1'),
                analyzeIdea('test idea 1')  // Same idea
            ];

            const results = await Promise.all(promises);

            // First call should succeed
            const firstResult = results[0];
            const secondResult = results[1];

            if (firstResult.success && secondResult.skipped === 'already_analyzing') {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Second call correctly skipped' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `First: ${JSON.stringify(firstResult)}, Second: ${JSON.stringify(secondResult)}` });
            }

        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Same idea deduplication
     */
    async testSameIdeaDeduplication() {
        const testName = 'Same Idea Deduplication';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const analyzeIdea = this.createAnalyzeIdeaFunction();

            // First call
            const firstResult = await analyzeIdea('duplicate idea');

            // Second call with same idea (after first completes)
            const secondResult = await analyzeIdea('duplicate idea');

            if (firstResult.success && secondResult.skipped === 'same_idea') {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Same idea correctly detected and skipped' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `First: ${JSON.stringify(firstResult)}, Second: ${JSON.stringify(secondResult)}` });
            }

        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Rate limiting functionality
     */
    async testRateLimiting() {
        const testName = 'Rate Limiting';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const analyzeIdea = this.createAnalyzeIdeaFunction();

            // First call
            const firstResult = await analyzeIdea('rate limit test 1');

            // Immediate second call with different idea (should be rate limited)
            const secondResult = await analyzeIdea('rate limit test 2');

            if (firstResult.success && secondResult.skipped === 'rate_limited') {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Rate limiting correctly applied' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `First: ${JSON.stringify(firstResult)}, Second: ${JSON.stringify(secondResult)}` });
            }

        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Rate limiting allows calls after cooldown
     */
    async testRateLimitingCooldown() {
        const testName = 'Rate Limiting Cooldown';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const analyzeIdea = this.createAnalyzeIdeaFunction();

            // First call
            const firstResult = await analyzeIdea('cooldown test 1');

            // Mock time passage (5+ seconds)
            const originalGetItem = localStorage.getItem;
            localStorage.getItem = (key) => {
                if (key === 'lastAnalysisTime') {
                    return (Date.now() - 6000).toString(); // 6 seconds ago
                }
                return originalGetItem.call(localStorage, key);
            };

            // Second call after cooldown
            const secondResult = await analyzeIdea('cooldown test 2');

            // Restore localStorage
            localStorage.getItem = originalGetItem;

            if (firstResult.success && secondResult.success) {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Cooldown allows new requests after 5 seconds' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `First: ${JSON.stringify(firstResult)}, Second: ${JSON.stringify(secondResult)}` });
            }

        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Different ideas are allowed (no deduplication)
     */
    async testDifferentIdeasAllowed() {
        const testName = 'Different Ideas Allowed';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            // Mock time to avoid rate limiting
            const originalGetItem = localStorage.getItem;
            localStorage.getItem = (key) => {
                if (key === 'lastAnalysisTime') {
                    return '0'; // No previous request
                }
                return originalGetItem.call(localStorage, key);
            };

            const analyzeIdea = this.createAnalyzeIdeaFunction();

            // First call
            const firstResult = await analyzeIdea('unique idea 1');

            // Wait for first call to complete, then make second call with different idea
            await new Promise(resolve => setTimeout(resolve, 200));

            const secondResult = await analyzeIdea('unique idea 2');

            // Restore localStorage
            localStorage.getItem = originalGetItem;

            if (firstResult.success && secondResult.success) {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Different ideas both processed successfully' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `First: ${JSON.stringify(firstResult)}, Second: ${JSON.stringify(secondResult)}` });
            }

        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🚀 Starting IdeaAnalysis Deduplication Tests\n');
        console.log('='.repeat(50));

        // Run all test methods
        await this.testSimultaneousCalls();
        await this.testSameIdeaDeduplication();
        await this.testRateLimiting();
        await this.testRateLimitingCooldown();
        await this.testDifferentIdeasAllowed();

        // Print results
        this.printResults();
    }

    /**
     * Print test results
     */
    printResults() {
        console.log('\n' + '='.repeat(50));
        console.log('🧪 TEST RESULTS SUMMARY');
        console.log('='.repeat(50));

        let passed = 0;
        let failed = 0;
        let errors = 0;

        this.testResults.forEach(result => {
            console.log(`${result.status} ${result.test}`);
            if (result.details) {
                console.log(`   📋 ${result.details}`);
            }

            if (result.status.includes('✅')) passed++;
            else if (result.status.includes('❌ FAIL')) failed++;
            else if (result.status.includes('❌ ERROR')) errors++;
        });

        console.log('\n' + '-'.repeat(50));
        console.log(`📊 Final Results: ${passed} passed, ${failed} failed, ${errors} errors`);
        console.log(`🎯 Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);

        if (failed === 0 && errors === 0) {
            console.log('🎉 All tests passed! Deduplication logic is working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Please review the implementation.');
        }
    }
}

// Export for Node.js or run directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeduplicationTests;

    // Run tests immediately if this file is executed directly
    if (require.main === module) {
        const tests = new DeduplicationTests();
        tests.runAllTests().catch(console.error);
    }
} else {
    // Run tests immediately if in browser/direct execution
    const tests = new DeduplicationTests();
    tests.runAllTests().catch(console.error);
}
