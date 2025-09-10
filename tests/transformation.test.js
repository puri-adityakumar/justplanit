/**
 * Test the overview-to-validation transformation
 * This tests the data transformation layer that converts overview responses to UI format
 */

console.log('🔄 Testing Overview Data Transformation\n');
console.log('='.repeat(50));

// Mock the transformation logic
function transformOverviewToValidationResult(overviewResult) {
    console.log('Transforming overview result to ValidationResult format');

    const overview = overviewResult.overview;

    return {
        executive_summary: {
            viability_score: overview.viability_score || 5,
            verdict: overview.verdict || 'CONDITIONAL',
            key_strengths: overview.key_strengths || [],
            key_weaknesses: overview.key_challenges || [], // Map key_challenges to key_weaknesses
            market_opportunity: overview.market_size || 'Not specified',
            time_to_market: overview.time_to_market || 'Not specified'
        },
        market_analysis: {
            target_market: {
                demographics: overview.target_audience || 'Not specified',
                size: 0, // Not provided in overview
                growth_rate: extractGrowthRate(overview.market_size) || 0
            },
            market_size: {
                tam: overview.market_size || 'Not specified',
                sam: 'Not analyzed in overview',
                som: 'Not analyzed in overview'
            },
            trends: [],
            market_readiness: overview.viability_score || 5,
            recent_developments: []
        },
        competitive_analysis: {
            competitors: [],
            competitive_advantages: [],
            threats_level: 'MEDIUM',
            market_position: overview.competitive_landscape || 'Not analyzed',
            funding_landscape: 'Not analyzed in overview'
        },
        technical_feasibility: {
            complexity_rating: 5,
            required_technologies: [],
            resource_requirements: {
                team_size: 0,
                timeline: overview.time_to_market || 'Not specified',
                budget_range: 'Not analyzed in overview'
            },
            technical_risks: []
        },
        risk_assessment: {
            overall_risk_level: 'MEDIUM',
            risks: [],
            risk_score: 50,
            regulatory_considerations: []
        },
        financial_projections: {
            revenue_model: overview.monetization_potential || 'Not specified',
            projections: {
                year1: 0,
                year3: 0,
                year5: 0
            },
            cost_structure: [],
            break_even_point: 'Not analyzed in overview',
            funding_required: 0,
            roi: 0,
            funding_environment: 'Not analyzed in overview'
        },
        implementation_roadmap: {
            phases: [],
            critical_path: [],
            success_metrics: [],
            next_steps: overviewResult.next_steps || []
        },
        recommendations: {
            decision: overview.verdict || 'CONDITIONAL',
            confidence: overviewResult.confidence || 5,
            priority_actions: overviewResult.next_steps?.slice(0, 3) || [],
            alternative_approaches: [],
            success_probability: overview.viability_score * 10 || 50,
            key_success_factors: overview.key_strengths || [],
            market_timing: overview.quick_recommendation || 'Not specified'
        },
        sources: {
            sources: [],
            search_quality: 5,
            last_updated: new Date().toISOString()
        }
    };
}

function extractGrowthRate(marketSize) {
    if (!marketSize) return 0;

    // Try to extract percentage from text like "Growing at 15% annually"
    const growthMatch = marketSize.match(/(\d+)%/);
    if (growthMatch) {
        return parseInt(growthMatch[1]);
    }

    // Default growth rates based on market size description
    if (marketSize.toLowerCase().includes('large')) return 8;
    if (marketSize.toLowerCase().includes('medium')) return 5;
    if (marketSize.toLowerCase().includes('small')) return 3;

    return 0;
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

// Test data - typical overview response from OpenRouter
const sampleOverviewResponse = {
    "overview": {
        "title": "Test Idea Validation",
        "viability_score": 3,
        "verdict": "NO_GO",
        "one_liner": "This business idea lacks sufficient detail to define its purpose, target market, or value proposition.",
        "target_audience": "Undefined due to lack of idea specifics",
        "market_size": "Small (cannot assess without clear problem or solution)",
        "key_strengths": ["None identifiable", "None identifiable", "None identifiable"],
        "key_challenges": ["No clear problem solved", "No defined value proposition", "No target market identified"],
        "competitive_landscape": "Unknown (cannot assess without idea details)",
        "monetization_potential": "Cannot determine without understanding what is being offered",
        "time_to_market": "Cannot estimate (idea requires development)",
        "quick_recommendation": "This idea requires significant refinement before validation can occur."
    },
    "confidence": 9,
    "next_steps": [
        "Define the specific problem being solved",
        "Identify target customer segments and their needs",
        "Develop a clear value proposition and solution outline"
    ]
};

function runTransformationTests() {
    let passedTests = 0;
    let totalTests = 0;

    console.log('\n🧪 Test 1: Basic Transformation');
    console.log('-'.repeat(40));
    try {
        const transformed = transformOverviewToValidationResult(sampleOverviewResponse);

        totalTests++;
        if (transformed && transformed.executive_summary && transformed.market_analysis) {
            passedTests++;
            assert(true, 'Transformation produces required top-level structure');
        } else {
            assert(false, 'Transformation missing required top-level fields');
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 2: Key Strengths Mapping');
    console.log('-'.repeat(40));
    try {
        const transformed = transformOverviewToValidationResult(sampleOverviewResponse);

        totalTests++;
        if (transformed.executive_summary.key_strengths.length === 3) {
            passedTests++;
            assert(true, `Key strengths mapped correctly: ${transformed.executive_summary.key_strengths.length} items`);
        } else {
            assert(false, `Expected 3 key strengths, got ${transformed.executive_summary.key_strengths.length}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 3: Key Challenges → Key Weaknesses Mapping');
    console.log('-'.repeat(40));
    try {
        const transformed = transformOverviewToValidationResult(sampleOverviewResponse);

        totalTests++;
        if (transformed.executive_summary.key_weaknesses.length === 3) {
            passedTests++;
            assert(true, `Key challenges mapped to key_weaknesses: ${transformed.executive_summary.key_weaknesses.length} items`);
        } else {
            assert(false, `Expected 3 key weaknesses, got ${transformed.executive_summary.key_weaknesses.length}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 4: Market Analysis Fields');
    console.log('-'.repeat(40));
    try {
        const transformed = transformOverviewToValidationResult(sampleOverviewResponse);
        const marketAnalysis = transformed.market_analysis;

        totalTests++;
        if (marketAnalysis.target_market.demographics &&
            marketAnalysis.market_size.tam &&
            marketAnalysis.market_readiness !== undefined) {
            passedTests++;
            assert(true, 'Market analysis fields populated correctly');
            console.log(`   📋 Demographics: ${marketAnalysis.target_market.demographics}`);
            console.log(`   📋 Market Size: ${marketAnalysis.market_size.tam}`);
            console.log(`   📋 Readiness: ${marketAnalysis.market_readiness}/10`);
        } else {
            assert(false, 'Market analysis fields missing or undefined');
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 5: Next Steps Mapping');
    console.log('-'.repeat(40));
    try {
        const transformed = transformOverviewToValidationResult(sampleOverviewResponse);

        totalTests++;
        if (transformed.implementation_roadmap.next_steps.length === 3) {
            passedTests++;
            assert(true, `Next steps mapped correctly: ${transformed.implementation_roadmap.next_steps.length} items`);
            transformed.implementation_roadmap.next_steps.forEach((step, index) => {
                console.log(`   ${index + 1}. ${step}`);
            });
        } else {
            assert(false, `Expected 3 next steps, got ${transformed.implementation_roadmap.next_steps.length}`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    console.log('\n🧪 Test 6: UI Field Access Test');
    console.log('-'.repeat(40));
    try {
        const transformed = transformOverviewToValidationResult(sampleOverviewResponse);

        // Test the specific fields that the UI tries to access
        const uiTests = [
            { field: 'executive_summary.key_strengths', value: transformed.executive_summary?.key_strengths },
            { field: 'executive_summary.key_weaknesses', value: transformed.executive_summary?.key_weaknesses },
            { field: 'market_analysis.target_market.demographics', value: transformed.market_analysis?.target_market?.demographics },
            { field: 'market_analysis.market_size.tam', value: transformed.market_analysis?.market_size?.tam },
            { field: 'market_analysis.market_readiness', value: transformed.market_analysis?.market_readiness }
        ];

        let uiFieldsWorking = 0;
        uiTests.forEach(test => {
            if (test.value !== undefined && test.value !== null) {
                uiFieldsWorking++;
                console.log(`   ✅ ${test.field}: ${Array.isArray(test.value) ? `[${test.value.length} items]` : test.value}`);
            } else {
                console.log(`   ❌ ${test.field}: undefined/null`);
            }
        });

        totalTests++;
        if (uiFieldsWorking === uiTests.length) {
            passedTests++;
            assert(true, 'All UI-accessed fields are available and populated');
        } else {
            assert(false, `${uiFieldsWorking}/${uiTests.length} UI fields available`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }

    // Print final results
    console.log('\n' + '='.repeat(50));
    console.log('📊 TRANSFORMATION TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (passedTests === totalTests) {
        console.log('🎉 All transformation tests passed! The UI should now work with overview data.');
    } else {
        console.log('⚠️  Some transformation tests failed. Review the mapping logic.');
    }

    console.log('\n✨ Transformation test completed.\n');
}

// Run the tests
runTransformationTests();
