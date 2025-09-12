import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { QuickStartExamples } from "@/components/QuickStartExamples";

interface HeroSectionProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export const HeroSection = ({ onSendMessage }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (message: string, files?: File[]) => {
    if (!message.trim()) return;

    if (!isAuthenticated) {
      // Store the idea in sessionStorage to use after login
      sessionStorage.setItem('pendingIdea', message.trim());
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    // Navigate to dashboard and let it handle the idea creation
    navigate('/dashboard', { state: { pendingIdea: message.trim() } });
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-16 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-instrument font-bold text-foreground mb-8 leading-tight">
          <span className="text-white">
            <span className="line-through text-gray-500 opacity-60">Vibe coding</span>{" "}
            <br className="md:hidden" />
            AI-assisted building
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto font-body leading-relaxed">
          AI moves fast when it has context. Turn rough ideas into structured context packs—requirements, user stories, risks, and research—so your LLMs, devs, and stakeholders stay perfectly aligned.
        </p>
      </div>

      {/* AI Chat Interface */}
      <div className="w-full max-w-4xl">
        <PromptInputBox
          onSend={handleSendMessage}
          isLoading={isLoading}
          placeholder="What are you building? Who is it for? Any constraints or success metrics?"
        />
      </div>

      <QuickStartExamples />
    </div>
  );
};