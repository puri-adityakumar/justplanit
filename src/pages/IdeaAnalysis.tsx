import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalysisHeader } from "@/components/analysis/AnalysisHeader";
import { AnalysisQuickStats } from "@/components/analysis/AnalysisQuickStats";
import { AnalysisLoading } from "@/components/analysis/AnalysisLoading";
import { AnalysisError } from "@/components/analysis/AnalysisError";
import { AnalysisCallToAction } from "@/components/analysis/AnalysisCallToAction";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Globe,
  ArrowLeft,
  AlertTriangle,
  Brain,
  Search
} from "lucide-react";
import { getIdeaBySlug, type ValidatedIdea } from "@/data/dummyIdeas";
import { ValidationResult } from "@/types/validation";
import { openRouterService } from "@/services/openrouter";

// Analysis steps for the loading animation
const analysisSteps = [
  { icon: Search, text: "Analyzing market trends...", duration: 2000 },
  { icon: Globe, text: "Conducting web research...", duration: 2500 },
  { icon: Users, text: "Evaluating target audience...", duration: 2000 },
  { icon: TrendingUp, text: "Assessing competition...", duration: 2200 },
  { icon: Brain, text: "Generating expert insights...", duration: 1800 },
];

const IdeaAnalysis = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idea = searchParams.get('idea');

  const [ideaData, setIdeaData] = useState<ValidatedIdea | null>(null);
  const [validationData, setValidationData] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const analyzeIdea = useCallback(async (ideaText: string) => {
    setLoading(true);
    setError(null);
    setCurrentStep(0);

    try {
      const response = await openRouterService.analyzeIdea({ idea: ideaText });

      if (response.success && response.data) {
        setValidationData(response.data);
        
        if (ideaData) {
          setIdeaData({
            ...ideaData,
            status: 'completed',
            validationData: response.data,
            viabilityScore: response.data.executive_summary.viability_score,
            marketSize: response.data.executive_summary.market_opportunity,
            updatedAt: new Date()
          });
        }
      } else {
        setError(response.error || 'Failed to analyze idea');
        
        if (ideaData) {
          setIdeaData({
            ...ideaData,
            status: 'failed',
            updatedAt: new Date()
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      if (ideaData) {
        setIdeaData({
          ...ideaData,
          status: 'failed',
          updatedAt: new Date()
        });
      }
    } finally {
      setLoading(false);
    }
  }, [ideaData]);

  useEffect(() => {
    if (slug) {
      const existingIdea = getIdeaBySlug(slug);
      
      if (existingIdea) {
        setIdeaData(existingIdea);
        if (existingIdea.status === 'completed' && existingIdea.validationData) {
          setValidationData(existingIdea.validationData);
          setLoading(false);
        } else if (existingIdea.status === 'analyzing' || existingIdea.status === 'failed') {
          if (idea) {
            analyzeIdea(idea);
          } else {
            setLoading(false);
          }
        }
      } else {
        if (idea) {
          const newIdea: ValidatedIdea = {
            id: Date.now().toString(),
            slug: slug,
            title: idea.length > 50 ? idea.substring(0, 50) + '...' : idea,
            description: idea,
            status: 'analyzing',
            createdAt: new Date(),
            updatedAt: new Date(),
            isPublic: false
          };
          setIdeaData(newIdea);
          analyzeIdea(idea);
        } else {
          navigate('/dashboard');
        }
      }
    }
  }, [slug, idea, navigate, analyzeIdea]);

  useEffect(() => {
    if (ideaData) {
      document.title = `${ideaData.title} • Just Plan It!`;
    }
  }, [ideaData]);

  if (!ideaData) {
    return (
      <div className="min-h-screen bg-black relative">
        <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
        <Navigation />
        <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
          <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 max-w-md text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-4">Idea Not Found</h2>
            <p className="text-foreground/70 mb-6">The idea you're looking for doesn't exist.</p>
            <Link to="/dashboard">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (loading || ideaData.status === 'analyzing') {
    return (
      <AnalysisLoading 
        ideaDescription={ideaData.description}
        currentStep={currentStep}
        progress={(currentStep / analysisSteps.length) * 100}
        analysisSteps={analysisSteps}
      />
    );
  }

  if (error || ideaData.status === 'failed') {
    return (
      <AnalysisError 
        error={error}
        onRetry={() => analyzeIdea(ideaData.description)}
      />
    );
  }

  if (!validationData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
      <Navigation />

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <AnalysisHeader 
            title={ideaData.title}
            description={ideaData.description}
          />

          <AnalysisQuickStats validationData={validationData} />

          {/* Executive Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 xl:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-white">Executive Summary</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Key Strengths</h4>
                  <div className="space-y-2">
                    {validationData.executive_summary.key_strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Key Challenges</h4>
                  <div className="space-y-2">
                    {validationData.executive_summary.key_weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Market Analysis */}
            <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-white">Market Analysis</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Target Market</div>
                  <div className="text-foreground/80">{validationData.market_analysis.target_market.demographics}</div>
                </div>

                <div>
                  <div className="text-sm text-foreground/60 mb-1">Market Size</div>
                  <div className="text-2xl font-bold text-primary">{validationData.market_analysis.market_size.tam}</div>
                </div>

                <div>
                  <div className="text-sm text-foreground/60 mb-1">Growth Rate</div>
                  <div className="text-lg font-semibold text-green-500">
                    +{validationData.market_analysis.target_market.growth_rate}%
                  </div>
                </div>

                <div>
                  <div className="text-sm text-foreground/60 mb-2">Market Readiness</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-background/20 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${validationData.market_analysis.market_readiness * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-primary font-semibold">{validationData.market_analysis.market_readiness}/10</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <AnalysisCallToAction />
        </div>
      </div>
    </div>
  );
};

export default IdeaAnalysis;
