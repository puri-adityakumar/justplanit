// OpenRouter API integration for startup validation

import { ValidationRequest, ValidationResponse, ValidationResult } from '@/types/validation';
import { generateOverviewPrompt } from '@/lib/prompts/overview-prompt';
import { generatePRDPrompt } from '@/lib/prompts/prd-prompt';

// OpenRouter API configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 'sk-or-v1-your-key-here';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://justplanit.com';

const openRouterConfig = {
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': 'Just Plan It - Startup Validation'
    }
};

export class OpenRouterService {
    private static instance: OpenRouterService;

    public static getInstance(): OpenRouterService {
        if (!OpenRouterService.instance) {
            OpenRouterService.instance = new OpenRouterService();
        }
        return OpenRouterService.instance;
    }

    // Main validation analysis function
    async analyzeIdea(request: ValidationRequest & { prompt?: string }): Promise<ValidationResponse> {
        const startTime = Date.now();

        try {
            console.log('Starting validation analysis for:', request.idea);
            console.log('Using API key:', OPENROUTER_API_KEY ? 'Present' : 'Missing');

            // Detect prompt type for appropriate validation
            const promptType = this.detectPromptType(request);
            console.log('Detected prompt type:', promptType);

            // Use custom prompt if provided, otherwise use default overview prompt
            const prompt = request.prompt || generateOverviewPrompt(request.idea);

            const requestBody = {
                model: 'deepseek/deepseek-chat-v3.1:free', // Using DeepSeek model
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert startup advisor with 20+ years of experience. Always respond with valid JSON only, following the exact structure provided in the prompt.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3, // Lower temperature for consistent analysis
                max_tokens: 8000, // Increased for comprehensive response
            };

            console.log('Making API request to OpenRouter...');
            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: openRouterConfig.headers,
                body: JSON.stringify(requestBody)
            });

            console.log('API Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('API Response data:', data);

            const assistantMessage = data.choices[0]?.message?.content;

            if (!assistantMessage) {
                throw new Error('No response from AI model');
            }

            // Parse the JSON response
            let analysisResult: any; // Changed from ValidationResult to any for flexibility
            try {
                // Clean the response to ensure it's valid JSON
                const cleanedResponse = this.cleanJsonResponse(assistantMessage);
                analysisResult = JSON.parse(cleanedResponse);

                // Only apply financial transformations for full analysis
                if (promptType === 'full_analysis' && analysisResult.financial_projections) {
                    const projections = analysisResult.financial_projections.projections;
                    if (typeof projections.year1 === 'number' && projections.year1 < 1000) {
                        // Convert millions to actual numbers
                        projections.year1 = projections.year1 * 1000000;
                        projections.year3 = projections.year3 * 1000000;
                        projections.year5 = projections.year5 * 1000000;
                    }

                    if (typeof analysisResult.financial_projections.funding_required === 'number' && analysisResult.financial_projections.funding_required < 1000) {
                        analysisResult.financial_projections.funding_required = analysisResult.financial_projections.funding_required * 1000000;
                    }
                }

                console.log('Successfully parsed analysis result:', analysisResult);
            } catch (parseError) {
                console.error('Failed to parse AI response:', parseError);
                console.error('Cleaned response that failed:', this.cleanJsonResponse(assistantMessage));
                throw new Error(`Invalid response format from AI model: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
            }

            // Add processing metadata
            const processingTime = Date.now() - startTime;

            // Validate the structure based on detected prompt type
            if (!this.validateAnalysisStructure(analysisResult, promptType)) {
                throw new Error(`Analysis result missing required fields for ${promptType} format`);
            }

            // Transform overview data to match UI expectations
            if (promptType === 'overview') {
                analysisResult = this.transformOverviewToValidationResult(analysisResult);
            }

            console.log('Validation analysis completed in', processingTime, 'ms');

            return {
                success: true,
                data: analysisResult,
                processing_time: processingTime
            };

        } catch (error) {
            console.error('Error in analyzeIdea:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                processing_time: Date.now() - startTime
            };
        }
    }

    // Alternative method using web search (for paid tiers)
    async analyzeIdeaWithWebSearch(request: ValidationRequest): Promise<ValidationResponse> {
        const startTime = Date.now();

        try {
            const prompt = generateOverviewPrompt(request.idea, request.user_context);

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: openRouterConfig.headers,
                body: JSON.stringify({
                    model: 'deepseek/deepseek-chat-v3.1:free', // Online model with web search
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 6000
                })
            });

            const data = await response.json();
            const assistantMessage = data.choices[0]?.message?.content;

            if (!assistantMessage) {
                throw new Error('No response from AI model');
            }

            const cleanedResponse = this.cleanJsonResponse(assistantMessage);
            const analysisResult = JSON.parse(cleanedResponse);

            // Since this is web search version, assume it's full analysis, but transform if needed
            return {
                success: true,
                data: analysisResult,
                processing_time: Date.now() - startTime
            };

        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                processing_time: Date.now() - startTime
            };
        }
    }

    // New method for PRD generation
    async generatePRD(request: { idea: string }): Promise<ValidationResponse> {
        const startTime = Date.now();

        try {
            const prompt = generatePRDPrompt(request.idea);

            const requestBody = {
                model: 'deepseek/deepseek-chat-v3.1:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a product manager. Respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000,
            };

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: openRouterConfig.headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('OpenRouter API error');
            }

            const data = await response.json();
            const assistantMessage = data.choices[0]?.message?.content;

            const cleanedResponse = this.cleanJsonResponse(assistantMessage);
            const prdResult = JSON.parse(cleanedResponse);

            return {
                success: true,
                data: prdResult,
                processing_time: Date.now() - startTime
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                processing_time: Date.now() - startTime
            };
        }
    }

    // Clean JSON response from AI model
    private cleanJsonResponse(response: string): string {
        console.log('Raw AI response:', response);

        // Remove any markdown code blocks
        let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').replace(/```/g, '');

        // Remove any text before the first {
        const firstBrace = cleaned.indexOf('{');
        if (firstBrace > 0) {
            cleaned = cleaned.substring(firstBrace);
        }

        // Remove any text after the last }
        const lastBrace = cleaned.lastIndexOf('}');
        if (lastBrace > 0 && lastBrace < cleaned.length - 1) {
            cleaned = cleaned.substring(0, lastBrace + 1);
        }

        // Clean up any extra whitespace and newlines
        cleaned = cleaned.trim();

        console.log('Cleaned JSON:', cleaned);
        return cleaned;
    }

    // Define validation rules for different prompt types
    private getValidationRules(promptType: string) {
        switch (promptType) {
            case 'overview':
                return {
                    requiredFields: ['overview', 'quick_stats', 'confidence'],
                    nestedValidation: {}
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

            // Future prompt types can be added here
            case 'technical_deep_dive':
                return {
                    requiredFields: ['technical_analysis', 'architecture', 'implementation'],
                    nestedValidation: {}
                };

            default:
                // Fallback to overview for unknown types
                return this.getValidationRules('overview');
        }
    }

    // Detect prompt type from the request
    private detectPromptType(request: ValidationRequest & { prompt?: string }): string {
        if (!request.prompt) {
            return 'full_analysis'; // Default when no custom prompt
        }

        // Check for overview prompt indicators
        if (request.prompt.includes('"overview"') || request.prompt.includes('quick overview validation')) {
            return 'overview';
        }

        // Check for full analysis prompt indicators  
        if (request.prompt.includes('"executive_summary"') || request.prompt.includes('comprehensive validation report')) {
            return 'full_analysis';
        }

        // Add more detection logic for future prompts
        // if (request.prompt.includes('technical deep dive')) return 'technical_deep_dive';

        return 'overview'; // Default to overview for unknown custom prompts
    }

    // Updated validation method
    private validateAnalysisStructure(result: any, promptType: string): boolean {
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

    // Transform overview response to match UI's expected ValidationResult format
    private transformOverviewToValidationResult(overviewResult: any): any {
        console.log('Transforming overview result to ValidationResult format');

        const overview = overviewResult?.overview || {};
        const quickStats = overviewResult?.quick_stats || {};
        const marketAnalysis = overview?.market_analysis || {};
        const riskLevel = overview?.risk_level || {};
        const estimatedCost = overview?.estimated_cost || {};
        const costBreakdown = Array.isArray(estimatedCost?.breakdown) ? estimatedCost.breakdown : [];
        const totalCost = Number(estimatedCost?.total) || 0;

        return {
            executive_summary: {
                viability_score: quickStats?.viability_score ?? 5,
                verdict: quickStats?.verdict ?? 'CONDITIONAL',
                key_strengths: overview?.key_features_and_pain_points || [],
                key_weaknesses: overview?.key_challenges || [],
                market_opportunity: quickStats?.market_size || 'Not specified',
                time_to_market: quickStats?.time_to_market || 'Not specified'
            },
            market_analysis: {
                target_market: {
                    demographics: marketAnalysis?.target_audience || 'Not specified',
                    size: 0,
                    growth_rate: this.extractGrowthRate(String(marketAnalysis?.growth_rate || '')) || 0
                },
                market_size: {
                    tam: quickStats?.market_size || 'Not specified',
                    sam: 'Not analyzed',
                    som: 'Not analyzed'
                },
                trends: [],
                market_readiness: quickStats?.viability_score ?? 5,
                recent_developments: []
            },
            competitive_analysis: {
                competitors: [],
                competitive_advantages: [],
                threats_level: 'MEDIUM',
                market_position: marketAnalysis?.opportunity || 'Not analyzed',
                funding_landscape: 'Not analyzed'
            },
            technical_feasibility: {
                complexity_rating: 5,
                required_technologies: [],
                resource_requirements: {
                    team_size: 0,
                    timeline: quickStats?.time_to_market || 'Not specified',
                    budget_range: totalCost ? `$${totalCost}` : 'Not specified'
                },
                technical_risks: []
            },
            risk_assessment: {
                overall_risk_level: riskLevel?.level || 'MEDIUM',
                risks: riskLevel?.explanation ? [{
                    category: "GENERAL",
                    risk: riskLevel.explanation,
                    probability: 50,
                    impact: 50,
                    mitigation: "Follow AI suggestions",
                    market_evidence: "Based on analysis"
                }] : [],
                risk_score: 50,
                regulatory_considerations: []
            },
            financial_projections: {
                revenue_model: 'Not specified in overview',
                projections: {
                    year1: 0,
                    year3: 0,
                    year5: 0
                },
                cost_structure: costBreakdown.map((item: any) => ({
                    category: item.category,
                    percentage: totalCost ? Math.round((Number(item.amount || 0) / totalCost) * 100) : 0,
                    amount: Number(item.amount || 0)
                })),
                break_even_point: 'Not analyzed',
                funding_required: totalCost,
                roi: 0,
                funding_environment: 'Not analyzed'
            },
            implementation_roadmap: {
                phases: [],
                critical_path: [],
                success_metrics: [],
                next_steps: overview?.ai_suggestions || []
            },
            recommendations: {
                decision: quickStats?.verdict || 'CONDITIONAL',
                confidence: overviewResult?.confidence ?? 5,
                priority_actions: overview?.ai_suggestions || [],
                alternative_approaches: overview?.future_scope || [],
                success_probability: (quickStats?.viability_score ?? 5) * 10,
                key_success_factors: overview?.problems_solved || [],
                market_timing: marketAnalysis?.opportunity || 'Not specified'
            },
            sources: {
                sources: [],
                search_quality: 5,
                last_updated: new Date().toISOString()
            }
        };
    }

    // Helper function to extract growth rate from market size description
    private extractGrowthRate(marketSize: string): number {
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

    // This method has been removed - we only use real API calls now
}

// Export singleton instance
export const openRouterService = OpenRouterService.getInstance();
