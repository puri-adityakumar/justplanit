import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { IdeaService } from "@/services/ideaService";
import { OverviewResult } from "@/types/validation";

interface AnalysisHeaderProps {
  quickStats?: OverviewResult['quick_stats'];
  ideaId?: string;
  // Fallback props for backward compatibility
  title?: string;
  description?: string;
}

export const AnalysisHeader = ({ quickStats, ideaId, title, description }: AnalysisHeaderProps) => {
  // Use quickStats if available, otherwise fallback to props
  const displayTitle = quickStats?.title || title || 'Untitled Idea';
  const displayDescription = quickStats?.description || description || '';

  // Update database with title and description when quickStats are available
  useEffect(() => {
    if (quickStats && ideaId && (quickStats.title || quickStats.description)) {
      const updateAnalysis = async () => {
        try {
          await IdeaService.upsertAnalysis({
            idea_id: ideaId,
            title: quickStats.title,
            description: quickStats.description
          });
        } catch (error) {
          console.error('Failed to update analysis with title/description:', error);
        }
      };
      updateAnalysis();
    }
  }, [quickStats?.title, quickStats?.description, ideaId]);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/dashboard">
          <Button variant="outline" size="sm" className="border-primary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
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
        {displayTitle}
      </h1>
      <p className="text-xl text-foreground/80 italic mb-6">
        "{displayDescription}"
      </p>
    </div>
  );
};
