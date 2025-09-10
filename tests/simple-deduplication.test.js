/**
 * Simple Node.js test for deduplication logic
 * Focused test that definitely works in Node.js environment
 */

console.log('🚀 Starting Simple Deduplication Tests\n');
console.log('='.repeat(50));

// Mock localStorage
const localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    clear() {
        this.store = {};
    }
};

// Test helper function
function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        return true;
    } else {
        console.log(`❌ FAIL: ${message}`);
        return false;
    }
}

// Simulate the deduplication logic
function createDeduplicationLogic() {
    let isAnalyzing = false;
    let lastAnalysisRequest = null;

    return async function analyzeIdea(ideaText) {
        // Deduplication Check 1: Prevent simultaneous calls
        if (isAnalyzing) {
            console.log('   🛡️  Analysis already in progress, skipping duplicate request');
            return { skipped: 'already_analyzing' };
        }

        // Deduplication Check 2: Prevent same idea
        if (lastAnalysisRequest === ideaText) {
            console.log('   🛡️  Same idea already analyzed, skipping duplicate request');
            return { skipped: 'same_idea' };
        }

        // Rate Limiting Check
        const now = Date.now();
        const lastRequestTime = parseInt(localStorage.getItem('lastAnalysisTime') || '0');
        if (now - lastRequestTime < 5000) {
            console.log('   🛡️  Rate limit: Please wait 5 seconds before making another request');
            return { skipped: 'rate_limited' };
        }

        // Set flags and timestamps
        isAnalyzing = true;
        lastAnalysisRequest = ideaText;
        localStorage.setItem('lastAnalysisTime', now.toString());

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 100));
            return { success: true, data: { title: ideaText } };
        } finally {
            isAnalyzing = false;
        }
    };
}

async function runTests() {
    let passedTests = 0;
    let totalTests = 0;

    console.log('\n🧪 Test 1: Simultaneous Call Prevention');
    console.log('-'.repeat(40));
    try {
        const analyzeIdea = createDeduplicationLogic();
        localStorage.clear();

        // Make two simultaneous calls
        const promise1 = analyzeIdea('test idea 1');
        const promise2 = analyzeIdea('test idea 1'); // Same idea, simultaneous

        const [result1, result2] = await Promise.all([promise1, promise2]);

        totalTests++;
        if (result1.success && result2.skipped === 'already_analyzing') {
            passedTests++;
            assert(true, 'Simultaneous calls correctly prevented');
        } else {
            assert(false, `Expected success + skip, got: ${JSON.stringify([result1, result2])}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 2: Same Idea Prevention');
    console.log('-'.repeat(40));
    try {
        const analyzeIdea = createDeduplicationLogic();
        localStorage.clear();

        // First call
        const result1 = await analyzeIdea('duplicate idea');
        // Second call with same idea (after first completes)
        const result2 = await analyzeIdea('duplicate idea');

        totalTests++;
        if (result1.success && result2.skipped === 'same_idea') {
            passedTests++;
            assert(true, 'Same idea correctly detected and prevented');
        } else {
            assert(false, `Expected success + same_idea skip, got: ${JSON.stringify([result1, result2])}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 3: Rate Limiting');
    console.log('-'.repeat(40));
    try {
        const analyzeIdea = createDeduplicationLogic();
        localStorage.clear();

        // First call
        const result1 = await analyzeIdea('rate test 1');
        // Immediate second call with different idea
        const result2 = await analyzeIdea('rate test 2');

        totalTests++;
        if (result1.success && result2.skipped === 'rate_limited') {
            passedTests++;
            assert(true, 'Rate limiting correctly applied');
        } else {
            assert(false, `Expected success + rate_limited skip, got: ${JSON.stringify([result1, result2])}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 4: Different Ideas Allowed (No Rate Limit)');
    console.log('-'.repeat(40));
    try {
        const analyzeIdea = createDeduplicationLogic();
        localStorage.clear();

        // Mock old timestamp to avoid rate limiting
        localStorage.setItem('lastAnalysisTime', '0');

        // First call
        const result1 = await analyzeIdea('unique idea 1');

        // Wait a bit and reset timestamp
        await new Promise(resolve => setTimeout(resolve, 100));
        localStorage.setItem('lastAnalysisTime', '0');

        // Second call with different idea
        const result2 = await analyzeIdea('unique idea 2');

        totalTests++;
        if (result1.success && result2.success) {
            passedTests++;
            assert(true, 'Different ideas both processed successfully');
        } else {
            assert(false, `Expected both success, got: ${JSON.stringify([result1, result2])}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    // Print final results
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Deduplication logic is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Review the implementation.');
    }

    console.log('\n✨ Test execution completed.\n');
}

// Run the tests
runTests().catch(console.error);
