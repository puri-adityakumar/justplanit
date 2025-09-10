import { Card } from "@/components/ui/card";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Search, Database, FileText, Sparkles } from "lucide-react";

const loadingSteps = [
    { icon: Search, text: "Searching for your idea..." },
    { icon: Database, text: "Loading idea details..." },
    { icon: FileText, text: "Preparing analysis data..." },
    { icon: Sparkles, text: "Almost ready..." }
];

export const IdeaLoading = () => {
    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
            <Navigation />

            <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
                <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 max-w-lg text-center">
                    {/* Main Loading Spinner */}
                    <div className="relative mb-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Loading Title */}
                    <h2 className="text-2xl font-bold text-white mb-4">Loading Your Idea</h2>
                    <p className="text-foreground/70 mb-8">
                        Please wait while we fetch your startup idea details...
                    </p>

                    {/* Loading Steps Animation */}
                    <div className="space-y-4">
                        {loadingSteps.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-background/10 border border-border/30"
                                style={{
                                    animationDelay: `${index * 0.5}s`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <step.icon className="h-5 w-5 text-primary animate-pulse" />
                                <span className="text-foreground/80 text-sm">{step.text}</span>
                                <div className="ml-auto">
                                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-8">
                        <div className="w-full bg-background/20 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse"
                                style={{ width: '45%' }}
                            ></div>
                        </div>
                        <p className="text-xs text-foreground/50 mt-2">Fetching idea data...</p>
                    </div>
                </Card>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
};
