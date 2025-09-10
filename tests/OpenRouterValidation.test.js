/**
 * Tests for OpenRouter validation logic
 * Tests the prompt detection and validation system
 */

/**
 * Mock OpenRouter Service for testing
 */
class MockOpenRouterService {
    constructor() {
        this.mockResponses = new Map();
    }

    // Mock the validation rules
    getValidationRules(promptType) {
        switch (promptType) {
            case 'overview':
                return {
                    requiredFields: ['overview', 'confidence', 'next_steps'],
                    nestedValidation: {
                        overview: ['title', 'viability_score', 'verdict', 'one_liner', 'target_audience', 'market_size', 'key_strengths', 'key_challenges']
                    }
                };

            case 'full_analysis':
                return {
                    requiredFields: [
                        'executive_summary',
                        'market_analysis',
                        'competitive_analysis',
                        'technical_feasibility',
                        'risk_assessment',
                        'financial_projections',
                        'implementation_roadmap',
                        'recommendations'
                    ],
                    nestedValidation: {}
                };

            default:
                return this.getValidationRules('overview');
        }
    }

    // Mock prompt type detection
    detectPromptType(request) {
        if (!request.prompt) {
            return 'full_analysis';
        }

        if (request.prompt.includes('"overview"') || request.prompt.includes('quick overview validation')) {
            return 'overview';
        }

        if (request.prompt.includes('"executive_summary"') || request.prompt.includes('comprehensive validation report')) {
            return 'full_analysis';
        }

        return 'overview';
    }

    // Mock validation method
    validateAnalysisStructure(result, promptType) {
        const rules = this.getValidationRules(promptType);

        // Check top-level required fields
        const hasRequiredFields = rules.requiredFields.every(field => {
            const hasField = result && result[field] !== undefined && result[field] !== null;
            if (!hasField) {
                console.error(`Missing required field: ${field}`);
            }
            return hasField;
        });

        if (!hasRequiredFields) {
            return false;
        }

        // Check nested required fields
        for (const [parentField, nestedFields] of Object.entries(rules.nestedValidation)) {
            if (result[parentField] && Array.isArray(nestedFields)) {
                const hasNestedFields = nestedFields.every(nestedField => {
                    const hasField = result[parentField][nestedField] !== undefined;
                    if (!hasField) {
                        console.error(`Missing nested field: ${parentField}.${nestedField}`);
                    }
                    return hasField;
                });

                if (!hasNestedFields) {
                    return false;
                }
            }
        }

        return true;
    }
}

/**
 * Test Suite: OpenRouter Validation Logic
 */
class OpenRouterValidationTests {
    constructor() {
        this.testResults = [];
        this.service = new MockOpenRouterService();
    }

    /**
     * Test: Prompt type detection for overview
     */
    testOverviewPromptDetection() {
        const testName = 'Overview Prompt Detection';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const overviewPrompt = {
                idea: 'test idea',
                prompt: 'You are a startup advisor. Analyze this business idea and provide a quick overview validation.\n\nProvide a concise analysis in the following JSON structure:\n\n{\n  "overview": {\n    "title": "[Generate a catchy 3-5 word title for this idea]"'
            };

            const detectedType = this.service.detectPromptType(overviewPrompt);

            if (detectedType === 'overview') {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Correctly detected overview prompt' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `Expected 'overview', got '${detectedType}'` });
            }
        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Prompt type detection for full analysis
     */
    testFullAnalysisPromptDetection() {
        const testName = 'Full Analysis Prompt Detection';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const fullAnalysisPrompt = {
                idea: 'test idea',
                prompt: 'You are a senior startup advisor. Provide a comprehensive validation report.\n\n{\n  "executive_summary": {\n    "viability_score": [0-10 rating]'
            };

            const detectedType = this.service.detectPromptType(fullAnalysisPrompt);

            if (detectedType === 'full_analysis') {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Correctly detected full analysis prompt' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `Expected 'full_analysis', got '${detectedType}'` });
            }
        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Default prompt type
     */
    testDefaultPromptType() {
        const testName = 'Default Prompt Type';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const noPromptRequest = { idea: 'test idea' };
            const detectedType = this.service.detectPromptType(noPromptRequest);

            if (detectedType === 'full_analysis') {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Correctly defaulted to full_analysis when no prompt provided' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: `Expected 'full_analysis', got '${detectedType}'` });
            }
        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Overview validation passes with correct structure
     */
    testOverviewValidationPass() {
        const testName = 'Overview Validation Pass';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const validOverviewResponse = {
                overview: {
                    title: 'Test Idea Validation',
                    viability_score: 3,
                    verdict: 'NO_GO',
                    one_liner: 'This business idea lacks sufficient detail.',
                    target_audience: 'Undefined due to lack of idea specifics',
                    market_size: 'Small (cannot assess without clear problem or solution)',
                    key_strengths: ['None identifiable', 'None identifiable', 'None identifiable'],
                    key_challenges: ['No clear problem solved', 'No defined value proposition', 'No target market identified']
                },
                confidence: 9,
                next_steps: ['Define the specific problem being solved', 'Identify target customer segments and their needs', 'Develop a clear value proposition and solution outline']
            };

            const isValid = this.service.validateAnalysisStructure(validOverviewResponse, 'overview');

            if (isValid) {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Valid overview structure passed validation' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: 'Valid overview structure failed validation' });
            }
        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Overview validation fails with missing fields
     */
    testOverviewValidationFail() {
        const testName = 'Overview Validation Fail';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const invalidOverviewResponse = {
                overview: {
                    title: 'Test Idea Validation',
                    // Missing required fields: viability_score, verdict, etc.
                },
                confidence: 9
                // Missing next_steps
            };

            const isValid = this.service.validateAnalysisStructure(invalidOverviewResponse, 'overview');

            if (!isValid) {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Invalid overview structure correctly failed validation' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: 'Invalid overview structure incorrectly passed validation' });
            }
        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Full analysis validation
     */
    testFullAnalysisValidation() {
        const testName = 'Full Analysis Validation';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            const validFullAnalysisResponse = {
                executive_summary: { viability_score: 8 },
                market_analysis: { target_market: {} },
                competitive_analysis: { competitors: [] },
                technical_feasibility: { complexity_rating: 5 },
                risk_assessment: { overall_risk_level: 'MEDIUM' },
                financial_projections: { revenue_model: 'subscription' },
                implementation_roadmap: { phases: [] },
                recommendations: { decision: 'GO' }
            };

            const isValid = this.service.validateAnalysisStructure(validFullAnalysisResponse, 'full_analysis');

            if (isValid) {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Valid full analysis structure passed validation' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: 'Valid full analysis structure failed validation' });
            }
        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Test: Wrong validation type fails
     */
    testWrongValidationType() {
        const testName = 'Wrong Validation Type Fails';
        console.log(`\n🧪 Running: ${testName}`);

        try {
            // Overview response validated as full_analysis (should fail)
            const overviewResponse = {
                overview: { title: 'Test' },
                confidence: 9,
                next_steps: []
            };

            const isValid = this.service.validateAnalysisStructure(overviewResponse, 'full_analysis');

            if (!isValid) {
                this.testResults.push({ test: testName, status: '✅ PASS', details: 'Overview response correctly failed full_analysis validation' });
            } else {
                this.testResults.push({ test: testName, status: '❌ FAIL', details: 'Overview response incorrectly passed full_analysis validation' });
            }
        } catch (error) {
            this.testResults.push({ test: testName, status: '❌ ERROR', details: error.message });
        }
    }

    /**
     * Run all validation tests
     */
    async runAllTests() {
        console.log('🚀 Starting OpenRouter Validation Tests\n');
        console.log('='.repeat(50));

        this.testOverviewPromptDetection();
        this.testFullAnalysisPromptDetection();
        this.testDefaultPromptType();
        this.testOverviewValidationPass();
        this.testOverviewValidationFail();
        this.testFullAnalysisValidation();
        this.testWrongValidationType();

        this.printResults();
    }

    /**
     * Print test results
     */
    printResults() {
        console.log('\n' + '='.repeat(50));
        console.log('🧪 VALIDATION TEST RESULTS');
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
        console.log(`📊 Validation Results: ${passed} passed, ${failed} failed, ${errors} errors`);
        console.log(`🎯 Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);

        if (failed === 0 && errors === 0) {
            console.log('🎉 All validation tests passed! The validation system is working correctly.');
        } else {
            console.log('⚠️  Some validation tests failed. Please review the validation logic.');
        }
    }
}

// Export for Node.js or run directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenRouterValidationTests;
} else {
    // Run tests immediately if in browser/direct execution
    const tests = new OpenRouterValidationTests();
    tests.runAllTests().catch(console.error);
}
