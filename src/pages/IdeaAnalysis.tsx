import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
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
import { CostAnalysisSection } from "@/components/analysis/CostAnalysisSection";
import { RoadmapSection } from "@/components/analysis/RoadmapSection";
import { AIContextSection } from "@/components/analysis/AIContextSection";
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

  // Check if we need to start analysis immediately
  const locationState = location.state as { pendingAnalysis?: boolean; ideaText?: string } | null;
  const shouldAnalyze = locationState?.pendingAnalysis && locationState?.ideaText;

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
  const validationData = ideaData?.sections?.overview as unknown as OverviewResult | undefined;
  if (!validationData || !ideaData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
      <Navigation />

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <AnalysisHeader
            title={ideaData.idea.title || 'Untitled Idea'}
            description={ideaData.idea.description || ''}
          />

          <AnalysisQuickStats validationData={validationData} />

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

            {/* Overview Tab - Current Market Analysis */}
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-8">
                {/* Idea Summary */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Idea Summary</h3>
                  <p className="text-foreground/80">{validationData.overview.idea_summary}</p>
                </Card>

                {/* Key Features & Pain Points */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key Features & Pain Points</h3>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {validationData.overview.key_features_and_pain_points.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Card>

                {/* Problems Solved */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Problems Solved</h3>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {validationData.overview.problems_solved.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Card>

                {/* Market Analysis */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Market Analysis</h3>
                  <div className="space-y-4 text-foreground/80">
                    <div>
                      <strong>Target Audience:</strong> {validationData.overview.market_analysis.target_audience}
                    </div>
                    <div>
                      <strong>Growth Rate:</strong> {validationData.overview.market_analysis.growth_rate}
                    </div>
                    <div>
                      <strong>Opportunity:</strong> {validationData.overview.market_analysis.opportunity}
                    </div>
                  </div>
                </Card>

                {/* Risk Level */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Risk Level Assessment</h3>
                  <div className="text-foreground/80">
                    <strong>Level:</strong> {validationData.overview.risk_level.level}<br />
                    <strong>Explanation:</strong> {validationData.overview.risk_level.explanation}
                  </div>
                </Card>

                {/* Estimated Cost - With Dropdown */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="cost">
                    <AccordionTrigger>
                      <h3 className="text-xl font-bold text-white">Estimated Cost: ${validationData.overview.estimated_cost.total}</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-foreground/80">
                        {validationData.overview.estimated_cost.breakdown.map((item, index) => (
                          <li key={index}>
                            <strong>{item.category}:</strong> ${item.amount} - {item.description}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* AI Suggestions */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">AI Suggestions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {validationData.overview.ai_suggestions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Card>

                {/* Future Scope - With Dropdown */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="future-scope">
                    <AccordionTrigger>
                      <h3 className="text-xl font-bold text-white">Future Scope</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                        {validationData.overview.future_scope.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            {/* PRD Tab */}
            <TabsContent value="prd" className="mt-6">
              <PRDSection ideaData={ideaData} validationData={undefined} />
            </TabsContent>

            {/* Tech Stack Tab */}
            <TabsContent value="tech-stack" className="mt-6">
              <TechStackSection ideaData={ideaData} />
            </TabsContent>

            {/* Costs Tab */}
            <TabsContent value="costs" className="mt-6">
              <CostAnalysisSection ideaData={ideaData} />
            </TabsContent>

            {/* Roadmap Tab */}
            <TabsContent value="roadmap" className="mt-6">
              <RoadmapSection ideaData={ideaData} />
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

            {/* Market Tab - Overview Market Analysis */}
            <TabsContent value="market" className="mt-6">
              <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-white">Market Analysis Overview</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Target Market</h3>
                    <div className="text-foreground/80">
                      <p><strong>Audience:</strong> {validationData.overview.market_analysis.target_audience}</p>
                      <p><strong>Growth Rate:</strong> {validationData.overview.market_analysis.growth_rate}</p>
                      <p><strong>Opportunity:</strong> {validationData.overview.market_analysis.opportunity}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Market Size</h3>
                    <div className="text-foreground/80">
                      <p><strong>Size Category:</strong> {validationData.quick_stats.market_size}</p>
                      <p><strong>Time to Market:</strong> {validationData.quick_stats.time_to_market}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* AI Context Tab */}
            <TabsContent value="ai-context" className="mt-6">
              <AIContextSection ideaData={ideaData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default IdeaAnalysis;
