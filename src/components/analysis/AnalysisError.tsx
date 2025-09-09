import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

interface AnalysisErrorProps {
  error: string;
  onRetry: () => void;
}

export const AnalysisError = ({ error, onRetry }: AnalysisErrorProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
      <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 max-w-md text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">Analysis Failed</h2>
        <p className="text-foreground/70 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onRetry} className="bg-primary hover:bg-primary/90">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link to="/dashboard">
            <Button variant="outline" className="border-border/40">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
