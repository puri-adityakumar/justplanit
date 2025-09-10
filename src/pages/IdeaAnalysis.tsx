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
import { RoadmapSection } from "@/components/analysis/RoadmapSection";
import { AIContextSection } from "@/components/analysis/AIContextSection";
import { TechStackQuestionnaire } from "@/components/analysis/TechStackQuestionnaire";
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

  const generatePRD = async () => {
    if (!ideaData?.idea.$id || prdLoading) return;

    setPrdLoading(true);
    setPrdError(null);

    try {
      const response = await openRouterService.generatePRD({ idea: ideaData.idea.description || '' });

      if (response.success && response.data) {
        await updateSection('prd', response.data);
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
        await updateSection('tech_stack', response.data);
      } else {
        throw new Error('Tech Stack generation failed');
      }
    } catch (err) {
      setTechStackError(err instanceof Error ? err.message : 'Failed to generate Tech Stack');
    } finally {
      setTechStackLoading(false);
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
                {/* Executive Summary */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Executive Summary</h3>
                  <div className="text-foreground/80 space-y-2">
                    <p><strong>Viability Score:</strong> {validationData?.executive_summary?.viability_score ?? 'N/A'}/10</p>
                    <p><strong>Verdict:</strong> {validationData?.executive_summary?.verdict ?? 'N/A'}</p>
                    <p><strong>Market Opportunity:</strong> {validationData?.executive_summary?.market_opportunity ?? 'N/A'}</p>
                    <p><strong>Time to Market:</strong> {validationData?.executive_summary?.time_to_market ?? 'N/A'}</p>
                  </div>
                </Card>

                {/* Key Strengths and Weaknesses */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key Strengths and Weaknesses</h3>
                  <div className="space-y-4 text-foreground/80">
                    <div>
                      <strong>Strengths:</strong>
                      <ul className="list-disc pl-5 space-y-2">
                        {validationData?.executive_summary?.key_strengths?.map((item, index) => (
                          <li key={index}>{item}</li>
                        )) ?? <li>N/A</li>}
                      </ul>
                    </div>
                    <div>
                      <strong>Weaknesses:</strong>
                      <ul className="list-disc pl-5 space-y-2">
                        {validationData?.executive_summary?.key_weaknesses?.map((item, index) => (
                          <li key={index}>{item}</li>
                        )) ?? <li>N/A</li>}
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Problems Solved / Key Success Factors */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key Success Factors</h3>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {validationData?.recommendations?.key_success_factors?.map((item, index) => (
                      <li key={index}>{item}</li>
                    )) ?? <li>N/A</li>}
                  </ul>
                </Card>

                {/* Market Analysis */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Market Analysis</h3>
                  <div className="text-foreground/80 space-y-2">
                    <p><strong>Demographics:</strong> {validationData?.market_analysis?.target_market?.demographics ?? 'N/A'}</p>
                    <p><strong>Growth Rate:</strong> {validationData?.market_analysis?.target_market?.growth_rate ?? 'N/A'}%</p>
                    <p><strong>TAM:</strong> {validationData?.market_analysis?.market_size?.tam ?? 'N/A'}</p>
                  </div>
                </Card>

                {/* Risk Assessment */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Risk Assessment</h3>
                  <div className="text-foreground/80">
                    <p><strong>Level:</strong> {validationData?.risk_assessment?.overall_risk_level ?? 'N/A'}</p>
                    <p><strong>Risk Score:</strong> {validationData?.risk_assessment?.risk_score ?? 'N/A'}</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      {validationData?.risk_assessment?.risks?.map((risk, index) => (
                        <li key={index}>{risk.category}: {risk.risk}</li>
                      )) ?? <li>N/A</li>}
                    </ul>
                  </div>
                </Card>

                {/* Estimated Cost */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="cost">
                    <AccordionTrigger>
                      <h3 className="text-xl font-bold text-white">Estimated Funding Required: ${validationData?.financial_projections?.funding_required ?? 'N/A'}</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-foreground/80">
                        {validationData?.financial_projections?.cost_structure?.map((item, index) => (
                          <li key={index}>
                            <strong>{item.category}:</strong> ${item.amount} ({item.percentage}%)
                          </li>
                        )) ?? <li>N/A</li>}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* AI Suggestions / Priority Actions */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Priority Actions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {validationData?.recommendations?.priority_actions?.map((item, index) => (
                      <li key={index}>{item}</li>
                    )) ?? <li>N/A</li>}
                  </ul>
                </Card>

                {/* Future Scope / Alternative Approaches */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="future-scope">
                    <AccordionTrigger>
                      <h3 className="text-xl font-bold text-white">Future Scope</h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                        {validationData?.recommendations?.alternative_approaches?.map((item, index) => (
                          <li key={index}>{item}</li>
                        )) ?? <li>N/A</li>}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            {/* PRD Tab */}
            <TabsContent value="prd" className="mt-6">
              {ideaData.sections?.prd ? (
                <PRDSection ideaData={ideaData} validationData={validationData} prdData={ideaData.sections.prd} />
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
                    <div className="text-foreground/80 space-y-2">
                      <p><strong>Audience:</strong> {validationData?.market_analysis?.target_market?.demographics ?? 'N/A'}</p>
                      <p><strong>Growth Rate:</strong> {validationData?.market_analysis?.target_market?.growth_rate ?? 'N/A'}%</p>
                      <p><strong>Size:</strong> {validationData?.market_analysis?.target_market?.size ?? 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Market Size</h3>
                    <div className="text-foreground/80 space-y-2">
                      <p><strong>TAM:</strong> {validationData?.market_analysis?.market_size?.tam ?? 'N/A'}</p>
                      <p><strong>SAM:</strong> {validationData?.market_analysis?.market_size?.sam ?? 'N/A'}</p>
                      <p><strong>SOM:</strong> {validationData?.market_analysis?.market_size?.som ?? 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Trends</h3>
                    <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                      {validationData?.market_analysis?.trends?.map((trend, index) => (
                        <li key={index}>{trend.trend} (Impact: {trend.impact})</li>
                      )) ?? <li>N/A</li>}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Market Readiness</h3>
                    <p className="text-foreground/80">{validationData?.market_analysis?.market_readiness ?? 'N/A'}/10</p>
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
