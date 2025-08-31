import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { QuickStartExamples } from "@/components/QuickStartExamples";

interface HeroSectionProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export const HeroSection = ({ onSendMessage }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (message: string, files?: File[]) => {
    if (!message.trim()) return;

    setIsLoading(true);
    // Navigate directly to dashboard with the idea
    navigate(`/dashboard?idea=${encodeURIComponent(message.trim())}`);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-16 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-instrument font-bold text-foreground mb-8 leading-tight">
          <span className="text-white">
            Validate Your Idea!
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto font-body leading-relaxed">
          Got a startup idea? Let's validate it! Get expert insights, market analysis, and actionable feedback powered by web research and AI.
        </p>
      </div>

      {/* AI Chat Interface */}
      <div className="w-full max-w-4xl">
        <PromptInputBox
          onSend={handleSendMessage}
          isLoading={isLoading}
          placeholder="Describe your startup idea... (e.g., 'A mobile app that helps people find local food trucks in real-time')"
        />
      </div>

      <QuickStartExamples />
    </div>
  );
};