import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Eye,
  MoreHorizontal,
  Loader
} from "lucide-react";
import { CompleteIdea } from "@/types/database";
import { Link } from "react-router-dom";

interface IdeaCardProps {
  idea: CompleteIdea;
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const getStatusIcon = () => {
    switch (idea.idea.status) {
      case 'analyzing':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <Brain className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (idea.idea.status) {
      case 'analyzing':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Analyzing</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Completed</Badge>;
      case 'failed':
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400">Failed</Badge>;
    }
  };

  const getViabilityColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <Card className="bg-card/30 backdrop-blur-xl border-border/40 overflow-hidden hover:bg-card/40 hover:border-border/60 transition-all duration-300 group shadow-lg hover:shadow-xl">
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {getStatusIcon()}
            </div>
            <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">
              {idea.analysis?.title || 'Untitled Idea'}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {idea.idea.is_public && (
              <Eye className="h-4 w-4 text-foreground/40" />
            )}
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-foreground/70 text-sm line-clamp-3 leading-relaxed mb-4">
          {idea.analysis?.description || 'No description provided'}
        </p>

        <div className="flex items-center justify-between">
          {getStatusBadge()}
          <span className="text-xs text-foreground/50 font-medium">
            {formatDate(idea.idea.$createdAt)}
          </span>
        </div>
      </div>

      {/* Metrics Section - Only for completed ideas */}
      {idea.idea.status === 'completed' && (
        <div className="px-6 pb-4">
          <div className="bg-black/20 rounded-lg p-4 border border-border/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs text-foreground/60 font-medium">Viability</span>
                </div>
                <div className={`text-lg font-bold ${getViabilityColor(idea.analysis?.viability_score)}`}>
                  {idea.analysis?.viability_score ? `${idea.analysis.viability_score}/10` : 'N/A'}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-xs text-foreground/60 font-medium">Market</span>
                </div>
                <div className="text-sm font-semibold text-foreground/80 truncate">
                  {idea.analysis?.market_size ?
                    idea.analysis.market_size.split(' ')[0] || 'N/A' :
                    'N/A'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Section - For analyzing/failed states */}
      {idea.idea.status === 'analyzing' && (
        <div className="px-6 pb-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-blue-400">Analysis in Progress</div>
                <div className="text-xs text-foreground/60">This may take a few moments</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {idea.idea.status === 'failed' && (
        <div className="px-6 pb-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-sm font-medium text-red-400">Analysis Failed</div>
                <div className="text-xs text-foreground/60">Please try again</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Section */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          {idea.idea.status === 'completed' && (
            <Link to={`/dashboard/${idea.idea.slug}`} className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 font-medium">
                View Analysis
              </Button>
            </Link>
          )}

          {idea.idea.status === 'analyzing' && (
            <Link to={`/dashboard/${idea.idea.slug}`} className="flex-1">
              <Button variant="outline" className="w-full border-border/40 hover:bg-card/40 font-medium">
                View Progress
              </Button>
            </Link>
          )}

          {idea.idea.status === 'failed' && (
            <Button variant="outline" className="flex-1 border-border/40 hover:bg-card/40 font-medium">
              Retry Analysis
            </Button>
          )}

          <Button variant="ghost" size="sm" className="px-3 flex-shrink-0 hover:bg-card/40">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
