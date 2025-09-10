import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ValidationResult } from "@/types/validation";

interface AnalysisQuickStatsProps {
  validationData: ValidationResult;
}

export const AnalysisQuickStats = ({ validationData }: AnalysisQuickStatsProps) => {
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'STRONG_GO': return 'bg-green-500 text-white';
      case 'GO': return 'bg-green-400 text-white';
      case 'CONDITIONAL': return 'bg-yellow-500 text-black';
      case 'NO_GO': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {validationData.executive_summary.viability_score}/10
          </div>
          <div className="text-sm text-foreground/60">Viability Score</div>
        </div>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <Badge className={`${getVerdictColor(validationData.executive_summary.verdict)} mb-1`}>
            {validationData.executive_summary.verdict.replace('_', ' ')}
          </Badge>
          <div className="text-sm text-foreground/60">Verdict</div>
        </div>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {validationData.executive_summary.market_opportunity}
          </div>
          <div className="text-sm text-foreground/60">Market Size</div>
        </div>
      </Card>

      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-primary mb-1">
            {validationData.executive_summary.time_to_market}
          </div>
          <div className="text-sm text-foreground/60">Time to Market</div>
        </div>
      </Card>
    </div>
  );
};
