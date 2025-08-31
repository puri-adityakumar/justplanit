import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    Users,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Target,
    Lightbulb,
    BarChart3,
    Globe,
    ArrowLeft,
    Download,
    Share2,
    Brain,
    Code,
    MapPin,
    FileText,
    Search
} from "lucide-react";
import { ValidationResult, DashboardSection } from "@/types/validation";
import { openRouterService } from "@/services/openrouter";

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const idea = searchParams.get('idea') || 'Your startup idea';

    const [validationData, setValidationData] = useState<ValidationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    // Dashboard sections configuration
    const dashboardSections: DashboardSection[] = [
        {
            id: 'executive_summary',
            title: 'Executive Summary',
            icon: 'TrendingUp',
            description: 'Overall viability and key insights',
            chartType: 'gauge'
        },
        {
            id: 'market_analysis',
            title: 'Market Analysis',
            icon: 'Globe',
            description: 'Market size, trends, and opportunities',
            chartType: 'bar'
        },
        {
            id: 'competitive_analysis',
            title: 'Competitive Analysis',
            icon: 'Users',
            description: 'Competitor landscape and positioning',
            chartType: 'matrix'
        },
        {
            id: 'technical_feasibility',
            title: 'Technical Feasibility',
            icon: 'Code',
            description: 'Technical requirements and complexity',
            chartType: 'metric'
        },
        {
            id: 'risk_assessment',
            title: 'Risk Assessment',
            icon: 'AlertTriangle',
            description: 'Risk analysis and mitigation strategies',
            chartType: 'matrix'
        },
        {
            id: 'financial_projections',
            title: 'Financial Projections',
            icon: 'DollarSign',
            description: 'Revenue forecasts and funding needs',
            chartType: 'line'
        },
        {
            id: 'implementation_roadmap',
            title: 'Implementation Roadmap',
            icon: 'MapPin',
            description: 'Timeline and milestones',
            chartType: 'bar'
        },
        {
            id: 'recommendations',
            title: 'Recommendations',
            icon: 'Lightbulb',
            description: 'Final verdict and next steps',
            chartType: 'metric'
        },
        {
            id: 'sources',
            title: 'Sources & Citations',
            icon: 'FileText',
            description: 'Research sources and data quality',
            chartType: 'metric'
        }
    ];

    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.title = "Validation Dashboard • Just Plan It!";
    }, []);

    useEffect(() => {
        if (idea) {
            analyzeIdea();
        }
    }, [idea]);

    // Analysis steps for the loading animation
    const analysisSteps = [
        { icon: Search, text: "Analyzing market trends...", duration: 2000 },
        { icon: Globe, text: "Conducting web research...", duration: 2500 },
        { icon: Users, text: "Evaluating target audience...", duration: 2000 },
        { icon: TrendingUp, text: "Assessing competition...", duration: 2200 },
        { icon: Brain, text: "Generating expert insights...", duration: 1800 },
    ];

    const analyzeIdea = async () => {
        setLoading(true);
        setError(null);
        setCurrentStep(0);
        setProgress(0);

        // Start the progress animation
        const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);
        let elapsed = 0;
        let stepIndex = 0;

        const progressTimer = setInterval(() => {
            if (stepIndex < analysisSteps.length) {
                const stepDuration = analysisSteps[stepIndex].duration;
                const stepProgress = Math.min(100, (elapsed / stepDuration) * 100);

                if (elapsed >= stepDuration) {
                    setCurrentStep(prev => prev + 1);
                    stepIndex++;
                    elapsed = 0;
                } else {
                    elapsed += 100;
                }

                // Calculate overall progress
                const completedSteps = stepIndex;
                const currentStepProgress = stepProgress / 100;
                const overallProgress = ((completedSteps + currentStepProgress) / analysisSteps.length) * 100;
                setProgress(overallProgress);
            } else {
                clearInterval(progressTimer);
            }
        }, 100);

        try {
            console.log('Making API call to analyze idea:', idea);

            const response = await openRouterService.analyzeIdea({ idea });

            // Clear the progress timer
            clearInterval(progressTimer);

            if (response.success && response.data) {
                console.log('API call successful, received data');
                setValidationData(response.data);
                setProgress(100);
            } else {
                console.error('API call failed:', response.error);
                setError(response.error || 'Failed to analyze idea');
            }
        } catch (err) {
            clearInterval(progressTimer);
            console.error('Error in analyzeIdea:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'STRONG_GO': return 'bg-green-500 text-white';
            case 'GO': return 'bg-green-400 text-white';
            case 'CONDITIONAL': return 'bg-yellow-500 text-black';
            case 'NO_GO': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'text-green-500';
            case 'MEDIUM': return 'text-yellow-500';
            case 'HIGH': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}K`;
        }
        return `$${amount}`;
    };

    if (loading) {
        const CurrentIcon = currentStep < analysisSteps.length ? analysisSteps[currentStep].icon : Brain;
        const currentText = currentStep < analysisSteps.length ? analysisSteps[currentStep].text : "Analysis complete!";

        return (
            <div className="min-h-screen bg-black relative">
                <GradientBars bars={25} colors={['#ef4444', 'transparent']} />

                <Navigation />

                <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 min-h-[80vh]">
                    <div className="text-center max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-instrument font-bold text-foreground mb-8 leading-tight">
                            <span className="text-white">Analyzing Your Idea</span>
                        </h1>

                        <div className="bg-card/20 backdrop-blur-md border border-border/30 rounded-lg p-6 mb-8">
                            <p className="text-lg text-foreground/80 mb-6 italic text-center">
                                "{idea}"
                            </p>

                            {/* Current Analysis Step */}
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <CurrentIcon className="h-8 w-8 text-primary animate-spin" />
                                <span className="text-xl font-medium text-foreground text-center">
                                    {currentText}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-foreground/60">
                            <Globe className="h-5 w-5 animate-spin" />
                            <span className="text-sm">This may take a few moments...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black relative">
                <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
                <Navigation />
                <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
                    <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 max-w-md text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-4">Analysis Failed</h2>
                        <p className="text-foreground/70 mb-6">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={analyzeIdea} className="bg-primary hover:bg-primary/90">
                                Try Again
                            </Button>
                            <Link to="/">
                                <Button variant="outline" className="border-border/40">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (!validationData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars bars={25} colors={['#ef4444', 'transparent']} />

            <Navigation />

            <div className="relative z-10 px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link to="/">
                                <Button variant="outline" size="sm" className="border-primary/20">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <div className="flex gap-2 ml-auto">
                                <Button variant="outline" size="sm" className="border-primary/20">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Report
                                </Button>
                                <Button variant="outline" size="sm" className="border-primary/20">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-instrument font-bold text-white mb-4">
                            Validation Dashboard
                        </h1>
                        <p className="text-xl text-foreground/80 italic mb-6">
                            "{idea}"
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <Card className="bg-card/20 backdrop-blur-md border-border/30 p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary mb-1">
                                        {validationData.executive_summary.viability_score}/10
                                    </div>
                                    <div className="text-sm text-foreground/60">Viability Score</div>
                                </div>
                            </Card>

                            <Card className="bg-card/20 backdrop-blur-md border-border/30 p-4">
                                <div className="text-center">
                                    <Badge className={`${getVerdictColor(validationData.executive_summary.verdict)} mb-1`}>
                                        {validationData.executive_summary.verdict.replace('_', ' ')}
                                    </Badge>
                                    <div className="text-sm text-foreground/60">Verdict</div>
                                </div>
                            </Card>

                            <Card className="bg-card/20 backdrop-blur-md border-border/30 p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary mb-1">
                                        {validationData.executive_summary.market_opportunity}
                                    </div>
                                    <div className="text-sm text-foreground/60">Market Size</div>
                                </div>
                            </Card>

                            <Card className="bg-card/20 backdrop-blur-md border-border/30 p-4">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-primary mb-1">
                                        {validationData.executive_summary.time_to_market}
                                    </div>
                                    <div className="text-sm text-foreground/60">Time to Market</div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Executive Summary */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 xl:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Executive Summary</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Key Strengths</h4>
                                    <div className="space-y-2">
                                        {validationData.executive_summary.key_strengths.map((strength, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-foreground/80">{strength}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Key Challenges</h4>
                                    <div className="space-y-2">
                                        {validationData.executive_summary.key_weaknesses.map((weakness, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-foreground/80">{weakness}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Market Analysis */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Market Analysis</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-foreground/60 mb-1">Target Market</div>
                                    <div className="text-foreground/80">{validationData.market_analysis.target_market.demographics}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-1">Market Size</div>
                                    <div className="text-2xl font-bold text-primary">{validationData.market_analysis.market_size.tam}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-1">Growth Rate</div>
                                    <div className="text-lg font-semibold text-green-500">
                                        +{validationData.market_analysis.target_market.growth_rate}%
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Market Readiness</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-background/20 rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${validationData.market_analysis.market_readiness * 10}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-primary font-semibold">{validationData.market_analysis.market_readiness}/10</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Competitive Analysis */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Competitive Analysis</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Threat Level</div>
                                    <Badge className={getRiskColor(validationData.competitive_analysis.threats_level)}>
                                        {validationData.competitive_analysis.threats_level}
                                    </Badge>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Key Competitors</div>
                                    <div className="space-y-2">
                                        {validationData.competitive_analysis.competitors.slice(0, 3).map((competitor, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-foreground/80">{competitor.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {competitor.type}
                                                    </Badge>
                                                    <span className="text-sm text-primary">{competitor.strength}/10</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Competitive Advantages</div>
                                    <div className="space-y-1">
                                        {validationData.competitive_analysis.competitive_advantages.slice(0, 3).map((advantage, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-sm text-foreground/80">{advantage}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Technical Feasibility */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Code className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Technical Feasibility</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Complexity Rating</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-background/20 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-1000 ${validationData.technical_feasibility.complexity_rating <= 3 ? 'bg-green-500' :
                                                    validationData.technical_feasibility.complexity_rating <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${validationData.technical_feasibility.complexity_rating * 10}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-primary font-semibold">{validationData.technical_feasibility.complexity_rating}/10</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Resource Requirements</div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-foreground/60">Team Size</div>
                                            <div className="font-semibold text-white">{validationData.technical_feasibility.resource_requirements.team_size} people</div>
                                        </div>
                                        <div>
                                            <div className="text-foreground/60">Timeline</div>
                                            <div className="font-semibold text-white">{validationData.technical_feasibility.resource_requirements.timeline}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Budget Range</div>
                                    <div className="text-lg font-semibold text-primary">
                                        {validationData.technical_feasibility.resource_requirements.budget_range}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Risk Assessment */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Risk Assessment</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Overall Risk Level</div>
                                    <Badge className={getRiskColor(validationData.risk_assessment.overall_risk_level)}>
                                        {validationData.risk_assessment.overall_risk_level}
                                    </Badge>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Risk Score</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-background/20 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-1000 ${validationData.risk_assessment.risk_score <= 30 ? 'bg-green-500' :
                                                    validationData.risk_assessment.risk_score <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${validationData.risk_assessment.risk_score}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-primary font-semibold">{validationData.risk_assessment.risk_score}/100</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Top Risks</div>
                                    <div className="space-y-2">
                                        {validationData.risk_assessment.risks.slice(0, 3).map((risk, index) => (
                                            <div key={index} className="text-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="secondary" className="text-xs">{risk.category}</Badge>
                                                    <span className="text-xs text-foreground/60">
                                                        {risk.probability}% probability
                                                    </span>
                                                </div>
                                                <div className="text-foreground/80">{risk.risk}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Financial Projections */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 xl:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <DollarSign className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Financial Projections</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Revenue Model</div>
                                    <div className="text-foreground/80 mb-4">{validationData.financial_projections.revenue_model}</div>

                                    <div className="text-sm text-foreground/60 mb-2">Funding Required</div>
                                    <div className="text-2xl font-bold text-primary">
                                        {formatCurrency(validationData.financial_projections.funding_required)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Revenue Projections</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Year 1:</span>
                                            <span className="font-semibold text-white">
                                                {formatCurrency(validationData.financial_projections.projections.year1)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Year 3:</span>
                                            <span className="font-semibold text-white">
                                                {formatCurrency(validationData.financial_projections.projections.year3)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-foreground/60">Year 5:</span>
                                            <span className="font-semibold text-white">
                                                {formatCurrency(validationData.financial_projections.projections.year5)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Key Metrics</div>
                                    <div className="space-y-2">
                                        <div>
                                            <div className="text-foreground/60 text-sm">Break-even Point</div>
                                            <div className="font-semibold text-white">{validationData.financial_projections.break_even_point}</div>
                                        </div>
                                        <div>
                                            <div className="text-foreground/60 text-sm">Expected ROI</div>
                                            <div className="font-semibold text-green-500">{validationData.financial_projections.roi}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Implementation Roadmap */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 xl:col-span-3">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Implementation Roadmap</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {validationData.implementation_roadmap.phases.map((phase, index) => (
                                    <Card key={index} className="bg-background/10 border-border/20 p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-sm font-bold text-primary">{index + 1}</span>
                                            </div>
                                            <h4 className="font-semibold text-white">{phase.phase}</h4>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="text-foreground/60">Duration: </span>
                                                <span className="text-white">{phase.duration}</span>
                                            </div>
                                            <div>
                                                <span className="text-foreground/60">Budget: </span>
                                                <span className="text-primary font-semibold">{formatCurrency(phase.budget)}</span>
                                            </div>
                                            <div>
                                                <div className="text-foreground/60 mb-1">Key Milestones:</div>
                                                <div className="space-y-1">
                                                    {phase.key_milestones.map((milestone, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-foreground/80">{milestone}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Card>

                        {/* Recommendations */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 xl:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <Lightbulb className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Recommendations</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <div className="text-sm text-foreground/60 mb-2">Final Decision</div>
                                        <Badge className={`${getVerdictColor(validationData.recommendations.decision)} text-lg px-4 py-2`}>
                                            {validationData.recommendations.decision.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-sm text-foreground/60 mb-2">Success Probability</div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-background/20 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${validationData.recommendations.success_probability}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-primary font-semibold">{validationData.recommendations.success_probability}%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-foreground/60 mb-2">Confidence Level</div>
                                        <div className="text-2xl font-bold text-primary">{validationData.recommendations.confidence}%</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-4">
                                        <div className="text-sm text-foreground/60 mb-2">Priority Actions</div>
                                        <div className="space-y-2">
                                            {validationData.recommendations.priority_actions.map((action, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <div className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-foreground/80">{action}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-foreground/60 mb-2">Market Timing</div>
                                        <div className="text-foreground/80">{validationData.recommendations.market_timing}</div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Sources */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Sources & Citations</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Search Quality</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-background/20 rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${validationData.sources.search_quality * 10}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-primary font-semibold">{validationData.sources.search_quality}/10</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-2">Sources ({validationData.sources.sources.length})</div>
                                    <div className="space-y-2">
                                        {validationData.sources.sources.slice(0, 3).map((source, index) => (
                                            <div key={index} className="text-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="secondary" className="text-xs">{source.type}</Badge>
                                                    <Badge className={`text-xs ${source.relevance === 'HIGH' ? 'bg-green-500/20 text-green-400' :
                                                        source.relevance === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {source.relevance}
                                                    </Badge>
                                                </div>
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    {source.title}
                                                </a>
                                                <div className="text-xs text-foreground/60">{source.domain}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-foreground/60 mb-1">Last Updated</div>
                                    <div className="text-xs text-foreground/80">
                                        {new Date(validationData.sources.last_updated).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-12 text-center">
                        <Card className="bg-card/20 backdrop-blur-xl border-border/30 p-8">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Ready to take action on your startup idea?
                            </h3>
                            <p className="text-foreground/60 mb-6">
                                Based on this comprehensive analysis, here are your recommended next steps.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    <Download className="h-5 w-5 mr-2" />
                                    Download Full Report
                                </Button>
                                <Link to="/">
                                    <Button variant="outline" size="lg" className="border-primary/20">
                                        Validate Another Idea
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
