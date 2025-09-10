import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface AnalysisLoadingProps {
  ideaDescription: string;
  currentStep: number;
  progress: number;
  analysisSteps: Array<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    text: string;
    duration: number;
  }>;
}

export const AnalysisLoading = ({
  ideaDescription,
  currentStep,
  progress,
  analysisSteps
}: AnalysisLoadingProps) => {
  const CurrentIcon = currentStep < analysisSteps.length ? analysisSteps[currentStep].icon : analysisSteps[0].icon;
  const currentText = currentStep < analysisSteps.length ? analysisSteps[currentStep].text : "Analysis complete!";

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 min-h-[80vh]">
      <div className="text-center max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="border-primary/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl font-instrument font-bold text-foreground mb-8 leading-tight">
          <span className="text-white">Analyzing Your Idea</span>
        </h1>

        <div className="bg-black/40 backdrop-blur-xl border border-border/30 rounded-lg p-6 mb-8">
          <p className="text-lg text-foreground/80 mb-6 italic text-center">
            "{ideaDescription}"
          </p>

          {/* Current Analysis Step */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <CurrentIcon className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xl font-medium text-foreground text-center">
              {currentText}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-background/20 rounded-full h-2 mb-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="text-sm text-foreground/60">
            Step {currentStep + 1} of {analysisSteps.length}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-foreground/60">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-sm">This may take a few moments...</span>
        </div>
      </div>
    </div>
  );
};
