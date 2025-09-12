import { Card } from "@/components/ui/card";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Lightbulb } from "lucide-react";

interface IdeaPromptSectionProps {
  onIdeaSubmit: (idea: string) => void;
}

export const IdeaPromptSection = ({ onIdeaSubmit }: IdeaPromptSectionProps) => {
  return (
    <Card className="bg-card/30 backdrop-blur-xl border-border/30 p-8 mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h2 className="text-2xl font-semibold text-white">What in your mind?</h2>
        </div>
        <p className="text-foreground/70 text-base max-w-2xl mx-auto">
          Describe your concept with audience, constraints, and success metrics for a stronger analysis.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <PromptInputBox
          onSend={(message) => onIdeaSubmit(message)}
          placeholder="What are you building? Who is it for? Any constraints or success metrics?"
        />
      </div>
    </Card>
  );
};
