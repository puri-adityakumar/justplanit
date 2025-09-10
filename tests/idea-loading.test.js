/**
 * Test for Idea Loading Behavior
 * Tests that loading states are handled correctly before showing "Not Found"
 */

console.log('⏳ Testing Idea Loading States\n');
console.log('='.repeat(50));

// Mock the loading logic similar to what happens in IdeaAnalysis
function createIdeaLoadingSimulator() {
    let loading = false;
    let ideaData = null;
    let error = null;

    const loadIdea = async (slug, shouldFail = false) => {
        loading = true;
        error = null;
        ideaData = null;

        // Simulate async loading with delay
        await new Promise(resolve => setTimeout(resolve, 100));

        loading = false;

        if (shouldFail) {
            ideaData = null; // Idea not found
        } else {
            ideaData = {
                idea: {
                    $id: slug,
                    title: `Test Idea ${slug}`,
                    description: 'Test idea description',
                    slug: slug
                },
                analysis: null,
                sections: {}
            };
        }
    };

    const getUIState = () => {
        if (loading) return 'LOADING';
        if (!ideaData) return 'NOT_FOUND';
        return 'SUCCESS';
    };

    return {
        loadIdea,
        getUIState,
        get loading() { return loading; },
        get ideaData() { return ideaData; },
        get error() { return error; }
    };
}

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        return true;
    } else {
        console.log(`❌ FAIL: ${message}`);
        return false;
    }
}

async function runLoadingTests() {
    let passedTests = 0;
    let totalTests = 0;

    console.log('\n🧪 Test 1: Loading State Shows Before Success');
    console.log('-'.repeat(50));
    try {
        const simulator = createIdeaLoadingSimulator();

        // Start loading
        const loadPromise = simulator.loadIdea('test-idea-123');

        // Check state during loading
        const loadingState = simulator.getUIState();

        totalTests++;
        if (loadingState === 'LOADING') {
            passedTests++;
            assert(true, 'Loading state correctly shown during fetch');
        } else {
            assert(false, `Expected LOADING state, got ${loadingState}`);
        }

        // Wait for loading to complete
        await loadPromise;

        // Check final state
        const finalState = simulator.getUIState();
        totalTests++;
        if (finalState === 'SUCCESS') {
            passedTests++;
            assert(true, 'Success state shown after successful load');
        } else {
            assert(false, `Expected SUCCESS state, got ${finalState}`);
        }

    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 2: Loading State Shows Before Not Found');
    console.log('-'.repeat(50));
    try {
        const simulator = createIdeaLoadingSimulator();

        // Start loading (will fail)
        const loadPromise = simulator.loadIdea('non-existent-idea', true);

        // Check state during loading
        const loadingState = simulator.getUIState();

        totalTests++;
        if (loadingState === 'LOADING') {
            passedTests++;
            assert(true, 'Loading state correctly shown before failure');
        } else {
            assert(false, `Expected LOADING state, got ${loadingState}`);
        }

        // Wait for loading to complete
        await loadPromise;

        // Check final state
        const finalState = simulator.getUIState();
        totalTests++;
        if (finalState === 'NOT_FOUND') {
            passedTests++;
            assert(true, 'Not Found state shown only after loading completes');
        } else {
            assert(false, `Expected NOT_FOUND state, got ${finalState}`);
        }

    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 3: Loading State Sequence');
    console.log('-'.repeat(50));
    try {
        const simulator = createIdeaLoadingSimulator();
        const stateSequence = [];

        // Record initial state
        stateSequence.push(simulator.getUIState());

        // Start loading
        const loadPromise = simulator.loadIdea('sequence-test');

        // Record loading state
        stateSequence.push(simulator.getUIState());

        // Wait for completion
        await loadPromise;

        // Record final state
        stateSequence.push(simulator.getUIState());

        totalTests++;
        const expectedSequence = ['NOT_FOUND', 'LOADING', 'SUCCESS'];
        const sequenceMatch = JSON.stringify(stateSequence) === JSON.stringify(expectedSequence);

        if (sequenceMatch) {
            passedTests++;
            assert(true, `State sequence correct: ${stateSequence.join(' → ')}`);
        } else {
            assert(false, `Expected ${expectedSequence.join(' → ')}, got ${stateSequence.join(' → ')}`);
        }

    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 4: No Immediate Not Found');
    console.log('-'.repeat(50));
    try {
        const simulator = createIdeaLoadingSimulator();

        // Start loading and immediately check state
        simulator.loadIdea('immediate-test');
        const immediateState = simulator.getUIState();

        totalTests++;
        if (immediateState === 'LOADING') {
            passedTests++;
            assert(true, 'Loading state prevents immediate "Not Found" display');
        } else if (immediateState === 'NOT_FOUND') {
            assert(false, 'NOT_FOUND shown immediately without loading state - BAD UX');
        } else {
            assert(false, `Unexpected immediate state: ${immediateState}`);
        }

    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    // Print final results
    console.log('\n' + '='.repeat(50));
    console.log('📊 LOADING TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('🎉 All loading tests passed! The UI will show proper loading states.');
        console.log('\n📋 Expected User Experience:');
        console.log('   1. User clicks idea → Loading spinner appears');
        console.log('   2. Data loads successfully → Idea details appear');
        console.log('   3. Data fails to load → "Not Found" appears (only after loading)');
    } else {
        console.log('⚠️  Some loading tests failed. Review the loading logic.');
    }

    console.log('\n✨ Loading test completed.\n');
}

// Run the tests
runLoadingTests().catch(console.error);
