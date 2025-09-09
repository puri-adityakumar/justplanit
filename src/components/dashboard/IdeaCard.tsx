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
import { IdeaDocument } from "@/types/database";
import { Link } from "react-router-dom";

interface IdeaCardProps {
  idea: IdeaDocument;
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const getStatusIcon = () => {
    switch (idea.status) {
      case 'analyzing':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <Brain className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (idea.status) {
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
    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 hover:bg-card/30 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="text-lg font-semibold text-white truncate">{idea.title || 'Untitled Idea'}</h3>
        </div>
        <div className="flex items-center gap-2">
          {idea.is_public && (
            <Eye className="h-4 w-4 text-foreground/40" />
          )}
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-foreground/70 text-sm mb-4 line-clamp-2 leading-relaxed">
        {idea.description || 'No description provided'}
      </p>

      <div className="flex items-center justify-between mb-4">
        {getStatusBadge()}
        <span className="text-xs text-foreground/50">
          {formatDate(idea.created_at)}
        </span>
      </div>

      {idea.status === 'completed' && (
        <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-t border-border/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs text-foreground/60">Viability</div>
              <div className="text-sm font-semibold text-foreground/60">
                Analysis needed
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <div>
              <div className="text-xs text-foreground/60">Market Size</div>
              <div className="text-sm font-semibold text-foreground/60">
                Analysis needed
              </div>
            </div>
          </div>
        </div>
      )}

      {idea.status === 'analyzing' && (
        <div className="py-3 border-t border-border/20 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-foreground/70">Analysis in progress...</span>
          </div>
        </div>
      )}

      {idea.status === 'failed' && (
        <div className="py-3 border-t border-border/20 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-foreground/70">Analysis failed</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {idea.status === 'completed' && (
          <Link to={`/dashboard/${idea.slug}`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90">
              View Analysis
            </Button>
          </Link>
        )}
        
        {idea.status === 'analyzing' && (
          <Link to={`/dashboard/${idea.slug}`} className="flex-1">
            <Button variant="outline" className="w-full border-border/40">
              View Progress
            </Button>
          </Link>
        )}
        
        {idea.status === 'failed' && (
          <Button variant="outline" className="flex-1 border-border/40">
            Retry Analysis
          </Button>
        )}

        <Button variant="ghost" size="sm" className="px-3">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
