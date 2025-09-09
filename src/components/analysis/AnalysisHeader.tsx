import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Share2 } from "lucide-react";

interface AnalysisHeaderProps {
  title: string;
  description: string;
}

export const AnalysisHeader = ({ title, description }: AnalysisHeaderProps) => {
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
        {title}
      </h1>
      <p className="text-xl text-foreground/80 italic mb-6">
        "{description}"
      </p>
    </div>
  );
};
