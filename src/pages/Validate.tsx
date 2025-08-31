import { useEffect } from "react";
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
    Share2
} from "lucide-react";

const Validate = () => {
    const [searchParams] = useSearchParams();
    const idea = searchParams.get('idea') || 'Your startup idea';

    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    // Mock validation data - in real implementation, this would come from your analysis
    const validationData = {
        overallScore: 78,
        marketSize: "$2.4B",
        competitionLevel: "Medium",
        feasibilityScore: 85,
        riskLevel: "Low-Medium",
        timeToMarket: "6-12 months",
        strengths: [
            "Growing market demand",
            "Clear value proposition",
            "Low initial investment required",
            "Scalable business model"
        ],
        challenges: [
            "Established competitors",
            "User acquisition costs",
            "Technical complexity",
            "Regulatory considerations"
        ],
        targetAudience: [
            "Tech-savvy millennials (25-40)",
            "Small business owners",
            "Freelancers and consultants"
        ],
        recommendations: [
            "Start with MVP to validate core assumptions",
            "Focus on niche market initially",
            "Build strategic partnerships",
            "Invest in user experience design"
        ]
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return "bg-green-500/20";
        if (score >= 60) return "bg-yellow-500/20";
        return "bg-red-500/20";
    };

    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars
                bars={25}
                colors={['#ef4444', 'transparent']}
            />

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
                            Validation Results
                        </h1>
                        <p className="text-xl text-foreground/80 italic mb-6">
                            "{idea}"
                        </p>

                        {/* Overall Score */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Overall Validation Score</h2>
                                    <p className="text-foreground/60">Based on market analysis and feasibility assessment</p>
                                </div>
                                <div className={`text-6xl font-bold ${getScoreColor(validationData.overallScore)}`}>
                                    {validationData.overallScore}/100
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="w-full bg-background/20 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-1000 ${validationData.overallScore >= 80 ? 'bg-green-500' :
                                                validationData.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${validationData.overallScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Globe className="h-6 w-6 text-primary" />
                                <h3 className="font-semibold text-white">Market Size</h3>
                            </div>
                            <p className="text-2xl font-bold text-primary">{validationData.marketSize}</p>
                            <p className="text-sm text-foreground/60 mt-1">Total addressable market</p>
                        </Card>

                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <BarChart3 className="h-6 w-6 text-primary" />
                                <h3 className="font-semibold text-white">Competition</h3>
                            </div>
                            <p className="text-2xl font-bold text-yellow-500">{validationData.competitionLevel}</p>
                            <p className="text-sm text-foreground/60 mt-1">Competitive landscape</p>
                        </Card>

                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <CheckCircle className="h-6 w-6 text-primary" />
                                <h3 className="font-semibold text-white">Feasibility</h3>
                            </div>
                            <p className="text-2xl font-bold text-green-500">{validationData.feasibilityScore}/100</p>
                            <p className="text-sm text-foreground/60 mt-1">Technical & business feasibility</p>
                        </Card>

                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertTriangle className="h-6 w-6 text-primary" />
                                <h3 className="font-semibold text-white">Risk Level</h3>
                            </div>
                            <p className="text-2xl font-bold text-yellow-500">{validationData.riskLevel}</p>
                            <p className="text-sm text-foreground/60 mt-1">Overall risk assessment</p>
                        </Card>
                    </div>

                    {/* Detailed Analysis Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Strengths */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                                <h3 className="text-xl font-bold text-white">Key Strengths</h3>
                            </div>
                            <div className="space-y-3">
                                {validationData.strengths.map((strength, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-foreground/80">{strength}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Challenges */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                                <h3 className="text-xl font-bold text-white">Key Challenges</h3>
                            </div>
                            <div className="space-y-3">
                                {validationData.challenges.map((challenge, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-foreground/80">{challenge}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Target Audience & Recommendations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Target Audience */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Users className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Target Audience</h3>
                            </div>
                            <div className="space-y-3">
                                {validationData.targetAudience.map((audience, index) => (
                                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                                        {audience}
                                    </Badge>
                                ))}
                            </div>
                        </Card>

                        {/* Recommendations */}
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Lightbulb className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold text-white">Next Steps</h3>
                            </div>
                            <div className="space-y-3">
                                {validationData.recommendations.map((rec, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <p className="text-foreground/80">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-12 text-center">
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8">
                            <h3 className="text-2xl font-bold text-white mb-4">Ready to Move Forward?</h3>
                            <p className="text-foreground/60 mb-6">
                                Based on this analysis, your idea shows {validationData.overallScore >= 70 ? 'strong' : 'moderate'} potential.
                                Consider the recommendations above to maximize your chances of success.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button size="lg" className="bg-primary hover:bg-primary/90">
                                    <Target className="h-5 w-5 mr-2" />
                                    Create Action Plan
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

export default Validate;
