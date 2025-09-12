import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { QuickStartExamples } from "@/components/QuickStartExamples";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export const HeroSection = ({ onSendMessage }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'slash' | 'final'>('slash');

  useEffect(() => {
    // Start animation when component mounts (user enters)
    const timer = setTimeout(() => {
      setAnimationPhase('final');
    }, 3000); // Show slash for 3 seconds, then final text

    return () => {
      clearTimeout(timer);
    };
  }, []);

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
        <h1 className="text-6xl md:text-8xl font-instrument font-bold text-foreground mb-8 leading-tight relative overflow-hidden">
          <AnimatePresence mode="wait">
            {animationPhase === 'slash' && (
              <motion.div
                key="slash"
                className="text-white block relative"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white">Just vibe-code!</span>
                <motion.svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 500 100"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <motion.path
                    d="M -20 45 Q 120 35 250 50 Q 380 65 520 45"
                    stroke="#ef4444"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </motion.svg>
              </motion.div>
            )}

            {animationPhase === 'final' && (
              <motion.span
                key="final"
                className="text-white block"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                AI-assisted building!
              </motion.span>
            )}
          </AnimatePresence>
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