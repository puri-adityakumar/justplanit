import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OverviewResult } from "@/types/validation";
import { Globe, AlertTriangle, DollarSign, Lightbulb, TrendingUp, Target, Banknote } from "lucide-react";

interface OverviewSectionProps {
    validationData: OverviewResult;
}

export const OverviewSection = ({ validationData }: OverviewSectionProps) => {
    const getRiskBadgeColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'bg-green-500 text-white';
            case 'MEDIUM': return 'bg-yellow-500 text-black';
            case 'HIGH': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
            <div className="flex items-center gap-3 mb-6">
                <Globe className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Overview Analysis</h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="summary">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Idea Summary
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80">
                        {validationData.overview.idea_summary}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Key Features & Pain Points
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                            {validationData.overview.key_features_and_pain_points.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="problems">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Problems Solved
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                            {validationData.overview.problems_solved.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="market">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Market Analysis
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-foreground/80">
                            <div>
                                <p className="font-semibold text-white">Target Audience</p>
                                <p>{validationData.overview.market_analysis.target_audience}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Growth Rate</p>
                                <p>{validationData.overview.market_analysis.growth_rate}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Opportunity</p>
                                <p>{validationData.overview.market_analysis.opportunity}</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="risks">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Risk Assessment
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Badge className={getRiskBadgeColor(validationData.overview.risk_level.level)}>
                                {validationData.overview.risk_level.level} RISK
                            </Badge>
                        </div>
                        <p className="text-foreground/80">{validationData.overview.risk_level.explanation}</p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="costs">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Estimated Costs
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <div className="text-2xl font-bold text-primary">
                            Total: ${validationData.overview.estimated_cost.total}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {validationData.overview.estimated_cost.breakdown.map((item, i) => (
                                <div key={i} className="bg-background/10 rounded-lg p-4">
                                    <div className="font-semibold text-white">{item.category}</div>
                                    <div className="text-lg font-bold text-primary">${item.amount}</div>
                                    <div className="text-sm text-foreground/70">{item.description}</div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="funding">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" />
                            Funding Requirements
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-background/10 rounded-lg p-4">
                                <div className="font-semibold text-white">Initial Funding</div>
                                <div className="text-xl font-bold text-primary">${validationData.overview.funding_requirements.initial_funding}</div>
                            </div>
                            <div className="bg-background/10 rounded-lg p-4">
                                <div className="font-semibold text-white">Runway</div>
                                <div className="text-xl font-bold text-primary">{validationData.overview.funding_requirements.runway_months} months</div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="suggestions">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            AI Suggestions
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                            {validationData.overview.ai_suggestions.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="scope">
                    <AccordionTrigger className="text-white hover:text-primary">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Future Scope
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                            {validationData.overview.future_scope.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
};
