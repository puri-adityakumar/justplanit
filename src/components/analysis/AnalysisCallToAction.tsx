import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";

interface AnalysisCallToActionProps {
  onDownload?: () => void;
}

export const AnalysisCallToAction = ({ onDownload }: AnalysisCallToActionProps) => {
  return (
    <div className="mt-12 text-center">
      <Card className="bg-card/20 backdrop-blur-xl border-border/30 p-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          Ready to take action on your startup idea?
        </h3>
        <p className="text-foreground/60 mb-6">
          Based on this comprehensive analysis, here are your recommended next steps.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={onDownload}>
            <Download className="h-5 w-5 mr-2" />
            Download Full Report
          </Button>
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="border-primary/20">
              Validate Another Idea
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
