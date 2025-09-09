import { Card } from "@/components/ui/card";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Lightbulb } from "lucide-react";

interface IdeaPromptSectionProps {
  onIdeaSubmit: (idea: string) => void;
}

export const IdeaPromptSection = ({ onIdeaSubmit }: IdeaPromptSectionProps) => {
  return (
    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8 mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lightbulb className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-white">Got a New Idea?</h2>
        </div>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          Describe your startup idea and get instant AI-powered validation with market analysis, 
          competitive insights, and actionable recommendations.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <PromptInputBox 
          onSend={(message) => onIdeaSubmit(message)} 
          placeholder="Describe your startup idea in detail..." 
        />
      </div>
    </Card>
  );
};
