import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ValidatedIdea } from "@/data/dummyIdeas";
import type { ValidationResult } from "@/types/validation";

interface MarketAnalysisSectionProps {
    ideaData: ValidatedIdea;
    marketData?: Pick<ValidationResult, 'market_analysis' | 'competitive_analysis' | 'risk_assessment' | 'sources'>;
    onGenerate: () => void;
    loading?: boolean;
    error?: string | null;
}

export const MarketAnalysisSection = ({ ideaData, marketData, onGenerate, loading, error }: MarketAnalysisSectionProps) => {
    const market = marketData?.market_analysis;
    const comp = marketData?.competitive_analysis;
    const risk = marketData?.risk_assessment;
    const sources = marketData?.sources;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Market Analysis</h2>
            </div>

            {!marketData ? (
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-8 text-center">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Market Analysis Available</h3>
                    <p className="text-foreground/70 mb-4">Generate a detailed market analysis for this idea.</p>
                    <Button onClick={onGenerate} disabled={!!loading}>
                        {loading ? 'Generating...' : 'Generate Market Analysis'}
                    </Button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </Card>
            ) : (
                <div className="space-y-8">
                    {/* Target Market & Market Size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Target Market</h3>
                            <div className="text-foreground/80 space-y-2">
                                <p><strong>Audience:</strong> {market?.target_market?.demographics ?? 'N/A'}</p>
                                <p><strong>Growth Rate:</strong> {market?.target_market?.growth_rate ?? 'N/A'}%</p>
                                <p><strong>Size:</strong> {market?.target_market?.size ?? 'N/A'}</p>
                            </div>
                        </Card>
                        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Market Size</h3>
                            <div className="text-foreground/80 space-y-2">
                                <p><strong>TAM:</strong> {market?.market_size?.tam ?? 'N/A'}</p>
                                <p><strong>SAM:</strong> {market?.market_size?.sam ?? 'N/A'}</p>
                                <p><strong>SOM:</strong> {market?.market_size?.som ?? 'N/A'}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Trends */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Trends</h3>
                        <ul className="list-disc pl-5 space-y-3 text-foreground/80">
                            {market?.trends?.length ? (
                                market.trends.map((trend, index) => (
                                    <li key={index}>
                                        <strong>{trend.trend}</strong>
                                        <span className="text-foreground/70"> — Impact: {trend.impact}</span>
                                        {trend.timeline ? (
                                            <span className="text-foreground/60"> • Timeline: {trend.timeline}</span>
                                        ) : null}
                                        {trend.source ? (
                                            <span className="text-foreground/60"> • Source: {trend.source}</span>
                                        ) : null}
                                    </li>
                                ))
                            ) : (
                                <li>N/A</li>
                            )}
                        </ul>
                    </div>

                    {/* Recent Developments & Market Readiness */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Recent Developments</h3>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                                {market?.recent_developments?.length ? (
                                    market.recent_developments.map((dev, index) => (
                                        <li key={index}>{dev}</li>
                                    ))
                                ) : (
                                    <li>N/A</li>
                                )}
                            </ul>
                        </Card>
                        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Market Readiness</h3>
                            <p className="text-foreground/80">{market?.market_readiness ?? 'N/A'}/10</p>
                        </Card>
                    </div>

                    {/* Competitive Landscape */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Competitive Landscape</h3>
                        {comp?.competitors?.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {comp.competitors.map((c, index) => (
                                    <Card key={index} className="bg-black/30 backdrop-blur-xl border-border/30 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-white font-semibold">{c.name}</div>
                                            <Badge variant="outline">{c.type}</Badge>
                                        </div>
                                        <div className="text-foreground/70 text-sm mt-2">
                                            <span>Strength: {c.strength}/10</span>
                                            {c.market_share ? <span> • Share: {c.market_share}</span> : null}
                                        </div>
                                        {c.recent_funding ? (
                                            <div className="text-foreground/70 text-sm">Funding: {c.recent_funding}</div>
                                        ) : null}
                                        {c.key_features?.length ? (
                                            <div className="mt-3">
                                                <div className="text-foreground/60 text-xs mb-1">Key features</div>
                                                <ul className="list-disc pl-5 text-foreground/80 space-y-1">
                                                    {c.key_features.slice(0, 5).map((f, i) => (
                                                        <li key={i}>{f}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                        {c.weaknesses?.length ? (
                                            <div className="mt-3">
                                                <div className="text-foreground/60 text-xs mb-1">Weaknesses</div>
                                                <ul className="list-disc pl-5 text-foreground/80 space-y-1">
                                                    {c.weaknesses.slice(0, 5).map((w, i) => (
                                                        <li key={i}>{w}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-foreground/60">No competitors found.</p>
                        )}

                        <div className="mt-4 text-foreground/80 space-y-2">
                            <p><strong>Competitive Advantages:</strong> {comp?.competitive_advantages?.length ? comp.competitive_advantages.join(', ') : 'N/A'}</p>
                            <p>
                                <strong>Threat Level:</strong> {comp?.threats_level ?? 'N/A'}
                                <span className="ml-2"><strong>Position:</strong> {comp?.market_position ?? 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Funding Landscape & Regulatory Considerations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Funding Landscape</h3>
                            <p className="text-foreground/80">{comp?.funding_landscape ?? 'N/A'}</p>
                        </Card>
                        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
                            <h3 className="text-lg font-semibold text-white mb-3">Regulatory Considerations</h3>
                            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                                {risk?.regulatory_considerations?.length ? (
                                    risk.regulatory_considerations.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))
                                ) : (
                                    <li>N/A</li>
                                )}
                            </ul>
                        </Card>
                    </div>

                    {/* Sources & Citations */}
                    <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
                        <h3 className="text-lg font-semibold text-white mb-3">Sources & Citations</h3>
                        {sources?.sources?.length ? (
                            <ul className="space-y-2 text-foreground/80">
                                {sources.sources.map((src, index) => (
                                    <li key={index} className="text-sm">
                                        <span className="font-medium text-white">{src.title}</span>
                                        <span className="text-foreground/60"> — {src.domain} • {src.type}</span>
                                        {src.url ? (
                                            <div className="text-foreground/60 truncate">{src.url}</div>
                                        ) : null}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-foreground/60">No sources available.</p>
                        )}
                        <div className="text-foreground/60 text-xs mt-3">
                            <span>Search quality: {sources?.search_quality ?? 'N/A'}/10</span>
                            <span className="ml-3">Last updated: {sources?.last_updated ? new Date(sources.last_updated).toLocaleString() : 'N/A'}</span>
                        </div>
                    </Card>

                    {/* Regenerate Button */}
                    <div className="flex justify-end">
                        <Button onClick={onGenerate} variant="secondary" disabled={!!loading}>
                            {loading ? 'Regenerating...' : 'Regenerate Analysis'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};


