// OpenRouter API integration for startup validation

import { ValidationRequest, ValidationResponse, ValidationResult } from '@/types/validation';
import { generateValidationPrompt } from '@/lib/prompts';

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
    async analyzeIdea(request: ValidationRequest): Promise<ValidationResponse> {
        const startTime = Date.now();

        try {
            console.log('Starting validation analysis for:', request.idea);
            console.log('Using API key:', OPENROUTER_API_KEY ? 'Present' : 'Missing');

            const prompt = generateValidationPrompt(request.idea, request.user_context);

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
            let analysisResult: ValidationResult;
            try {
                // Clean the response to ensure it's valid JSON
                const cleanedResponse = this.cleanJsonResponse(assistantMessage);
                analysisResult = JSON.parse(cleanedResponse);

                // Transform financial projections to numbers if they're in millions
                if (analysisResult.financial_projections) {
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

            // Validate the structure
            if (!this.validateAnalysisStructure(analysisResult)) {
                throw new Error('Analysis result missing required fields');
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
            const prompt = generateValidationPrompt(request.idea, request.user_context);

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
            const analysisResult = JSON.parse(data.choices[0].message.content);

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

    // Validate that the analysis result has all required fields
    private validateAnalysisStructure(result: any): boolean {
        const requiredFields = [
            'executive_summary',
            'market_analysis',
            'competitive_analysis',
            'technical_feasibility',
            'risk_assessment',
            'financial_projections',
            'implementation_roadmap',
            'recommendations'
        ];

        return requiredFields.every(field => result && result[field]);
    }

    // This method has been removed - we only use real API calls now
}

// Export singleton instance
export const openRouterService = OpenRouterService.getInstance();
