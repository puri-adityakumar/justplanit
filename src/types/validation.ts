// Core validation data structures for dashboard

export interface ExecutiveSummary {
    viability_score: number; // 0-10 scale with visual gauge
    verdict: 'STRONG_GO' | 'GO' | 'CONDITIONAL' | 'NO_GO';
    key_strengths: string[]; // Top 3 strengths
    key_weaknesses: string[]; // Top 3 weaknesses  
    market_opportunity: string; // TAM in formatted currency
    time_to_market: string; // Estimated timeline
}

export interface MarketAnalysis {
    target_market: {
        demographics: string;
        size: number;
        growth_rate: number;
    };
    market_size: {
        tam: string; // Total Addressable Market
        sam: string; // Serviceable Addressable Market  
        som: string; // Serviceable Obtainable Market
    };
    trends: Array<{
        trend: string;
        impact: 'HIGH' | 'MEDIUM' | 'LOW';
        timeline: string;
        source?: string;
    }>;
    market_readiness: number; // 0-10 scale
    recent_developments: string[];
}

export interface CompetitiveAnalysis {
    competitors: Array<{
        name: string;
        type: 'DIRECT' | 'INDIRECT';
        strength: number; // 0-10
        market_share?: string;
        recent_funding?: string;
        key_features: string[];
        weaknesses: string[];
    }>;
    competitive_advantages: string[];
    threats_level: 'LOW' | 'MEDIUM' | 'HIGH';
    market_position: string;
    funding_landscape: string;
}

export interface TechnicalFeasibility {
    complexity_rating: number; // 0-10 scale
    required_technologies: Array<{
        technology: string;
        difficulty: 'EASY' | 'MEDIUM' | 'HARD';
        availability: boolean;
        current_trends?: string;
    }>;
    resource_requirements: {
        team_size: number;
        timeline: string;
        budget_range: string;
    };
    technical_risks: string[];
}

export interface RiskAssessment {
    overall_risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    risks: Array<{
        category: 'MARKET' | 'TECHNICAL' | 'FINANCIAL' | 'OPERATIONAL' | 'REGULATORY';
        risk: string;
        probability: number; // 0-100
        impact: number; // 0-100
        mitigation: string;
        market_evidence?: string;
    }>;
    risk_score: number; // 0-100
    regulatory_considerations: string[];
}

export interface FinancialProjections {
    revenue_model: string;
    projections: {
        year1: number;
        year3: number;
        year5: number;
    };
    cost_structure: Array<{
        category: string;
        percentage: number;
        amount: number;
    }>;
    break_even_point: string;
    funding_required: number;
    roi: number; // Return on investment percentage
    funding_environment: string;
}

export interface ImplementationRoadmap {
    phases: Array<{
        phase: string;
        duration: string;
        key_milestones: string[];
        resources: string;
        budget: number;
    }>;
    critical_path: string[];
    success_metrics: string[];
    next_steps: string[];
}

export interface Recommendations {
    decision: 'STRONG_GO' | 'GO' | 'CONDITIONAL' | 'NO_GO';
    confidence: number; // 0-100 confidence based on data quality
    priority_actions: string[]; // Top 3 actions
    alternative_approaches: string[];
    success_probability: number; // 0-100
    key_success_factors: string[];
    market_timing: string;
}

export interface SourcesCitations {
    sources: Array<{
        title: string;
        url: string;
        domain: string;
        content?: string;
        relevance: 'HIGH' | 'MEDIUM' | 'LOW';
        type: 'MARKET_DATA' | 'COMPETITOR' | 'INDUSTRY_REPORT' | 'NEWS';
    }>;
    search_quality: number; // 0-10 rating of search result quality
    last_updated: string;
}

// Main validation result interface
export interface ValidationResult {
    executive_summary: ExecutiveSummary;
    market_analysis: MarketAnalysis;
    competitive_analysis: CompetitiveAnalysis;
    technical_feasibility: TechnicalFeasibility;
    risk_assessment: RiskAssessment;
    financial_projections: FinancialProjections;
    implementation_roadmap: ImplementationRoadmap;
    recommendations: Recommendations;
    sources: SourcesCitations;
}

// Dashboard section configuration
export interface DashboardSection {
    id: keyof ValidationResult;
    title: string;
    icon: string;
    description: string;
    chartType?: 'bar' | 'line' | 'pie' | 'metric' | 'gauge' | 'matrix';
}

// API request/response types
export interface ValidationRequest {
    idea: string;
    user_context?: {
        industry?: string;
        target_market?: string;
        budget_range?: string;
    };
}

export interface ValidationResponse {
    success: boolean;
    data?: ValidationResult;
    error?: string;
    processing_time?: number;
}
