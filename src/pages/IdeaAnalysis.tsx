import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisHeader } from "@/components/analysis/AnalysisHeader";
import { AnalysisQuickStats } from "@/components/analysis/AnalysisQuickStats";
import { AnalysisLoading } from "@/components/analysis/AnalysisLoading";
import { AnalysisError } from "@/components/analysis/AnalysisError";
import { IdeaLoading } from "@/components/analysis/IdeaLoading";
import { PRDSection } from "@/components/analysis/PRDSection";
import { TechStackSection } from "@/components/analysis/TechStackSection";
import { MarketAnalysisSection } from "@/components/analysis/MarketAnalysisSection";
import { AIContextSection } from "@/components/analysis/AIContextSection";
import { OverviewSection } from "@/components/analysis/OverviewSection";
import { TechStackQuestionnaire } from "../components/analysis/TechStackQuestionnaire";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Globe,
  ArrowLeft,
  AlertTriangle,
  Brain,
  Search,
  FileText,
  Layers,
  DollarSign,
  Calendar,
  Eye,
  Palette,
  Map
} from "lucide-react";
import { ValidationResult, OverviewResult } from "@/types/validation";
import { useIdeaBySlug } from "@/hooks/use-ideas";
import { useAuth } from "@/hooks/use-auth";
import type { CompleteIdea } from "@/types/database";
import { openRouterService } from "@/services/openrouter";
import { generateOverviewPrompt } from "@/lib/prompts/overview-prompt";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
  const location = useLocation();
  const idea = searchParams.get('idea');
  const { user } = useAuth();

  const { idea: ideaData, loading, error, updateAnalysis, updateSection, createIdeaWithSlug } = useIdeaBySlug(slug || '');
  const [currentStep, setCurrentStep] = useState(0);

  // Add state variables for deduplication and rate limiting
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisRequest, setLastAnalysisRequest] = useState<string | null>(null);
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // Add states and generation function
  const [prdLoading, setPrdLoading] = useState(false);
  const [prdError, setPrdError] = useState<string | null>(null);
  const [techStackLoading, setTechStackLoading] = useState(false);
  const [techStackError, setTechStackError] = useState<string | null>(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState<string | null>(null);

  // Check if we need to start analysis immediately
  const locationState = location.state as { pendingAnalysis?: boolean; ideaText?: string } | null;
  const shouldAnalyze = locationState?.pendingAnalysis && locationState?.ideaText;

  // Type guard to check if data is OverviewResult
  const isOverviewResult = (data: any): data is OverviewResult => {
    return data && typeof data === 'object' && 'quick_stats' in data && 'overview' in data;
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const analyzeIdea = useCallback(async (ideaText: string) => {
    // 🛡️ DEDUPLICATION CHECK #1: Prevent multiple simultaneous calls
    if (isAnalyzing) {
      console.log('Analysis already in progress, skipping duplicate request');
      return;
    }

    // 🛡️ DEDUPLICATION CHECK #2: Prevent same idea being analyzed again
    if (lastAnalysisRequest === ideaText) {
      console.log('Same idea already analyzed, skipping duplicate request');
      return;
    }

    // 🛡️ RATE LIMITING CHECK: Prevent requests too close together
    const now = Date.now();
    const lastRequestTime = parseInt(localStorage.getItem('lastAnalysisTime') || '0');
    if (now - lastRequestTime < 5000) { // 5 second cooldown
      console.log('Rate limit: Please wait 5 seconds before making another analysis request');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);
    setLastAnalysisRequest(ideaText);
    localStorage.setItem('lastAnalysisTime', now.toString());

    try {
      // Update status to analyzing first 
      await updateAnalysis({
        status: 'analyzing'
      });

      // Use the faster overview prompt instead of the full validation
      const overviewPrompt = generateOverviewPrompt(ideaText);

      const response = await openRouterService.analyzeIdea({
        idea: ideaText,
        prompt: overviewPrompt  // Pass custom prompt
      });

      if (response.success && response.data) {
        // Store the overview data in idea_data_sections
        await updateSection('overview', response.data as unknown as Record<string, unknown>);

        await updateAnalysis({
          status: 'completed',
          completed_at: new Date().toISOString()
        });
      } else {
        await updateAnalysis({
          status: 'failed'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Analysis failed:', errorMessage);
      await updateAnalysis({
        status: 'failed'
      });
    } finally {
      setIsAnalyzing(false); // Always reset the flag
    }
  }, [updateAnalysis, updateSection, isAnalyzing, lastAnalysisRequest]);

  const generatePRD = async () => {
    if (!ideaData?.idea.$id || prdLoading) return;

    setPrdLoading(true);
    setPrdError(null);

    try {
      const response = await openRouterService.generatePRD({ idea: ideaData.idea.description || '' });

      if (response.success && response.data) {
        await updateSection('prd', response.data as unknown as Record<string, unknown>);
      } else {
        throw new Error('PRD generation failed');
      }
    } catch (err) {
      setPrdError(err instanceof Error ? err.message : 'Failed to generate PRD');
    } finally {
      setPrdLoading(false);
    }
  };

  const generateTechStack = async (answers: { stack: string; diagram: boolean }) => {
    if (!ideaData?.idea.$id || techStackLoading) return;

    setTechStackLoading(true);
    setTechStackError(null);
    setIsQuestionnaireOpen(false); // Close modal

    try {
      const response = await openRouterService.generateTechStack({
        idea: ideaData.idea.description || '',
        userChoices: answers,
      });

      if (response.success && response.data) {
        await updateSection('tech_stack', response.data as unknown as Record<string, unknown>);
      } else {
        throw new Error('Tech Stack generation failed');
      }
    } catch (err) {
      setTechStackError(err instanceof Error ? err.message : 'Failed to generate Tech Stack');
    } finally {
      setTechStackLoading(false);
    }
  };

  const generateMarket = async () => {
    if (!ideaData?.idea.$id || marketLoading) return;

    setMarketLoading(true);
    setMarketError(null);

    try {
      const response = await openRouterService.generateMarketAnalysis({
        idea: ideaData.idea.description || ''
      });

      if (response.success && response.data) {
        await updateSection('market', response.data as unknown as Record<string, unknown>);
      } else {
        throw new Error('Market analysis generation failed');
      }
    } catch (err) {
      setMarketError(err instanceof Error ? err.message : 'Failed to generate market analysis');
    } finally {
      setMarketLoading(false);
    }
  };

  useEffect(() => {
    // 🛡️ SINGLE TRIGGER LOGIC: Only one path should execute

    // PRIORITY 1: Auto-start analysis from navigation (highest priority)
    if (shouldAnalyze && ideaData?.idea && !analysisStarted) {
      console.log('🚀 Trigger 1: Starting analysis from navigation');
      setAnalysisStarted(true);
      analyzeIdea(locationState.ideaText);
      return;
    }

    // PRIORITY 2: Resume analysis if it was already in progress
    if (ideaData && ideaData.analysis?.status === 'analyzing' && idea && !analysisStarted) {
      console.log('🚀 Trigger 2: Resuming analysis from query params');
      setAnalysisStarted(true);
      analyzeIdea(idea);
      return;
    }

    // PRIORITY 3: Create new idea and start analysis (lowest priority)
    if (!ideaData && slug && idea && user && !analysisStarted) {
      console.log('🚀 Trigger 3: Creating new idea and starting analysis');
      setAnalysisStarted(true);
      const title = idea.length > 50 ? idea.substring(0, 50) + '...' : idea;
      createIdeaWithSlug(title, idea, user.$id, user.name || user.email)
        .then(() => {
          // Once idea is created, start analysis
          analyzeIdea(idea);
        })
        .catch(err => {
          console.error('Failed to create idea:', err);
          setAnalysisStarted(false); // Reset on error
        });
      return;
    }
  }, [ideaData, slug, idea, user, analyzeIdea, createIdeaWithSlug, shouldAnalyze, locationState, analysisStarted]);

  // Reset analysis started flag when idea changes
  useEffect(() => {
    setAnalysisStarted(false);
    setLastAnalysisRequest(null);
  }, [slug]);

  useEffect(() => {
    if (ideaData?.idea.title) {
      document.title = `${ideaData.idea.title} • Just Plan It!`;
    }
  }, [ideaData]);

  // Show loading state while fetching idea data
  if (loading) {
    return <IdeaLoading />;
  }

  // Show "not found" only after loading is complete and no data exists
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

  if (loading || ideaData?.analysis?.status === 'analyzing') {
    return (
      <AnalysisLoading
        ideaDescription={ideaData?.idea.description || idea || ''}
        currentStep={currentStep}
        progress={(currentStep / analysisSteps.length) * 100}
        analysisSteps={analysisSteps}
      />
    );
  }

  if (error || ideaData?.analysis?.status === 'failed') {
    return (
      <AnalysisError
        error={error || 'Analysis failed. Please try again.'}
        onRetry={() => ideaData && analyzeIdea(ideaData.idea.description || '')}
      />
    );
  }

  // Get validation data from the overview section instead of analysis.result
  const validationData = ideaData?.sections?.overview as unknown as ValidationResult | undefined;
  if (!validationData || !ideaData) {
    return null;
  }

  // Prefer saved market section data if available
  const marketData = ideaData.sections?.market as unknown as Pick<ValidationResult, 'market_analysis' | 'competitive_analysis' | 'risk_assessment' | 'sources'> | undefined;

  return (
    <div className="min-h-screen bg-black relative">
      <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
      <Navigation />

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <AnalysisHeader
            quickStats={isOverviewResult(validationData) ? validationData.quick_stats : undefined}
            ideaId={ideaData.idea.$id}
            title={ideaData.idea.title || 'Untitled Idea'}
            description={ideaData.idea.description || ''}
          />

          <AnalysisQuickStats
            quickStats={isOverviewResult(validationData) ? validationData.quick_stats : undefined}
            ideaId={ideaData.idea.$id}
            validationData={validationData}
          />

          {/* Tabbed Interface */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-black/40 backdrop-blur-xl border-border/30">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="prd" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">PRD</span>
              </TabsTrigger>
              <TabsTrigger value="tech-stack" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Tech Stack</span>
              </TabsTrigger>
              <TabsTrigger value="costs" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Costs</span>
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Roadmap</span>
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Design</span>
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Market</span>
              </TabsTrigger>
              <TabsTrigger value="ai-context" className="flex items-center gap-2 data-[state=active]:bg-primary/20">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Context</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab - New OverviewSection Component */}
            <TabsContent value="overview" className="mt-6">
              {validationData && isOverviewResult(validationData) ? (
                <OverviewSection validationData={validationData} />
              ) : (
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-8 text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Overview Data Available</h3>
                  <p className="text-foreground/70 mb-4">
                    Overview analysis data is not available for this idea.
                  </p>
                  <Badge variant="outline">Analysis Required</Badge>
                </Card>
              )}
            </TabsContent>

            {/* PRD Tab */}
            <TabsContent value="prd" className="mt-6">
              {ideaData.sections?.prd ? (
                <PRDSection ideaData={ideaData} validationData={validationData} prdData={ideaData.sections.prd as any} />
              ) : (
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-8 text-center">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No PRD Available</h3>
                  <p className="text-foreground/70 mb-4">Generate a Product Requirements Document for this idea.</p>
                  <Button onClick={generatePRD} disabled={prdLoading}>
                    {prdLoading ? 'Generating...' : 'Generate PRD'}
                  </Button>
                  {prdError && <p className="text-red-500 mt-4">{prdError}</p>}
                </Card>
              )}
            </TabsContent>

            {/* Tech Stack Tab */}
            <TabsContent value="tech-stack" className="mt-6">
              <TechStackSection ideaData={ideaData} />
              <Button onClick={() => setIsQuestionnaireOpen(true)} disabled={techStackLoading}>
                {techStackLoading ? 'Generating...' : 'Generate Tech Stack'}
              </Button>
              <TechStackQuestionnaire
                isOpen={isQuestionnaireOpen}
                onClose={() => setIsQuestionnaireOpen(false)}
                onSubmit={generateTechStack}
                loading={techStackLoading}
              />
            </TabsContent>

            {/* Costs Tab */}
            <TabsContent value="costs" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-8 text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Cost Analysis</h3>
                <p className="text-foreground/70 mb-4">
                  Coming soon! This will include detailed cost breakdowns, pricing estimates, and financial projections.
                </p>
                <Badge variant="outline">Under Development</Badge>
              </Card>
            </TabsContent>

            {/* Roadmap Tab */}
            <TabsContent value="roadmap" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-8 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Development Roadmap</h3>
                <p className="text-foreground/70 mb-4">
                  Coming soon! This will include development timelines, milestones, and project planning.
                </p>
                <Badge variant="outline">Under Development</Badge>
              </Card>
            </TabsContent>

            {/* Design Tab - Placeholder */}
            <TabsContent value="design" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-8 text-center">
                <Palette className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Design System</h3>
                <p className="text-foreground/70 mb-4">
                  Coming soon! This will include design guidelines, component libraries, and UI/UX recommendations.
                </p>
                <Badge variant="outline">Under Development</Badge>
              </Card>
            </TabsContent>

            {/* Market Tab - Componentized */}
            <TabsContent value="market" className="mt-6">
              <MarketAnalysisSection
                ideaData={ideaData}
                marketData={marketData}
                onGenerate={generateMarket}
                loading={marketLoading}
                error={marketError}
              />
            </TabsContent>

            {/* AI Context Tab */}
            <TabsContent value="ai-context" className="mt-6">
              <AIContextSection ideaData={ideaData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IdeaAnalysis;
