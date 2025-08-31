import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { QuickStartExamples } from "@/components/QuickStartExamples";

interface HeroSectionProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export const HeroSection = ({ onSendMessage }: HeroSectionProps) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-16 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-instrument font-bold text-foreground mb-8 leading-tight">
          <span className="text-white">
            Talk, Plan, Thrive!
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto font-body leading-relaxed">
          With JustPlanIt, chat or use voice to build a day plan that's uniquely yours—complete with routes, horoscopes, and good vibes.
        </p>
      </div>

      {/* AI Chat Interface */}
      <div className="w-full max-w-4xl">
        <PromptInputBox
          onSend={onSendMessage}
          placeholder="Tell me what you need to plan today... (e.g., '5 tasks at home and grocery shopping')"
        />
      </div>

      <QuickStartExamples />
    </div>
  );
};