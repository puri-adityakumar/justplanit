import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ValidationResult, OverviewResult } from "@/types/validation";
import { IdeaService } from "@/services/ideaService";

interface AnalysisQuickStatsProps {
  quickStats?: OverviewResult['quick_stats'];
  ideaId?: string;
  // Fallback for backward compatibility
  validationData?: ValidationResult | OverviewResult;
}

export const AnalysisQuickStats = ({ quickStats, ideaId, validationData }: AnalysisQuickStatsProps) => {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'STRONG_GO': return 'bg-green-500 text-white';
      case 'GO': return 'bg-green-400 text-white';
      case 'CONDITIONAL': return 'bg-yellow-500 text-black';
      case 'NO_GO': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Type guard to check if data has overview structure  
  const hasOverviewStructure = (data: any): data is OverviewResult => {
    return data && 'overview' in data && 'quick_stats' in data;
  };

  // Use quickStats if available, otherwise fallback to validationData
  const stats = quickStats ||
    (hasOverviewStructure(validationData)
      ? validationData.quick_stats
      : (validationData as ValidationResult)?.executive_summary);

  // Update database with viability score and market size when quickStats are available
  useEffect(() => {
    if (quickStats && ideaId && (quickStats.viability_score || quickStats.market_size)) {
      const updateAnalysis = async () => {
        try {
          await IdeaService.upsertAnalysis({
            idea_id: ideaId,
            viability_score: quickStats.viability_score,
            market_size: quickStats.market_size
          });
        } catch (error) {
          console.error('Failed to update analysis with viability/market data:', error);
        }
      };
      updateAnalysis();
    }
  }, [quickStats?.viability_score, quickStats?.market_size, ideaId]);

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {stats.viability_score}/10
          </div>
          <div className="text-sm text-foreground/60">Viability Score</div>
        </div>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <Badge className={`${getVerdictColor(stats.verdict)} mb-1`}>
            {stats.verdict.replace('_', ' ')}
          </Badge>
          <div className="text-sm text-foreground/60">Verdict</div>
        </div>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {quickStats
              ? quickStats.market_size.split(' ')[0] + ' Market'
              : hasOverviewStructure(validationData)
                ? validationData.quick_stats.market_size.split(' ')[0] + ' Market'
                : (validationData as ValidationResult).market_analysis?.market_size?.tam || 'N/A'}
          </div>
          <div className="text-sm text-foreground/60">Market Size</div>
        </div>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-primary mb-1">
            {quickStats
              ? quickStats.time_to_market
              : hasOverviewStructure(validationData)
                ? validationData.quick_stats.time_to_market
                : (validationData as ValidationResult).executive_summary?.time_to_market || 'N/A'}
          </div>
          <div className="text-sm text-foreground/60">Time to Market</div>
        </div>
      </Card>
    </div>
  );
};
