import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Loader2, Search, Brain, TrendingUp, Users, Globe } from "lucide-react";

const Analyze = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idea = searchParams.get('idea') || 'Your startup idea';

    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const analysisSteps = [
        { icon: Search, text: "Analyzing market trends...", duration: 2000 },
        { icon: Globe, text: "Conducting web research...", duration: 2500 },
        { icon: Users, text: "Evaluating target audience...", duration: 2000 },
        { icon: TrendingUp, text: "Assessing competition...", duration: 2200 },
        { icon: Brain, text: "Generating expert insights...", duration: 1800 },
    ];

    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    useEffect(() => {
        const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);
        let elapsed = 0;

        const timer = setInterval(() => {
            if (currentStep < analysisSteps.length) {
                const stepDuration = analysisSteps[currentStep].duration;
                const stepProgress = Math.min(100, (elapsed / stepDuration) * 100);

                if (elapsed >= stepDuration) {
                    setCurrentStep(prev => prev + 1);
                    elapsed = 0;
                } else {
                    elapsed += 100;
                }

                // Calculate overall progress
                const completedSteps = currentStep;
                const currentStepProgress = stepProgress / 100;
                const overallProgress = ((completedSteps + currentStepProgress) / analysisSteps.length) * 100;
                setProgress(overallProgress);
            } else {
                clearInterval(timer);
                // Navigate to dashboard after analysis is complete
                setTimeout(() => {
                    navigate(`/dashboard?idea=${encodeURIComponent(idea)}`);
                }, 1000);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [currentStep, navigate, idea]);

    const CurrentIcon = currentStep < analysisSteps.length ? analysisSteps[currentStep].icon : Brain;
    const currentText = currentStep < analysisSteps.length ? analysisSteps[currentStep].text : "Analysis complete!";

    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars
                bars={25}
                colors={['#ef4444', 'transparent']}
            />

            <Navigation />

            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 min-h-[80vh]">
                <div className="text-center max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-instrument font-bold text-foreground mb-8 leading-tight">
                        <span className="text-white">Analyzing Your Idea</span>
                    </h1>

                    <div className="bg-card/20 backdrop-blur-md border border-border/30 rounded-lg p-8 mb-8">
                        <p className="text-lg text-foreground/80 mb-6 italic">
                            "{idea}"
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full bg-background/20 rounded-full h-2 mb-6">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        {/* Current Analysis Step */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <CurrentIcon className="h-8 w-8 text-primary animate-spin" />
                            <span className="text-xl font-medium text-foreground">
                                {currentText}
                            </span>
                        </div>

                        {/* Analysis Steps Preview */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                            {analysisSteps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isCompleted = index < currentStep;
                                const isCurrent = index === currentStep;

                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${isCompleted
                                            ? 'bg-primary/20 text-primary'
                                            : isCurrent
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-background/10 text-foreground/40'
                                            }`}
                                    >
                                        <StepIcon className={`h-6 w-6 mb-2 ${isCurrent ? 'animate-pulse' : ''}`} />
                                        <span className="text-xs text-center">
                                            {step.text.replace('...', '')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-foreground/60">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">This may take a few moments...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analyze;
