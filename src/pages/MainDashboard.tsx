import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { IdeaPromptSection } from "@/components/dashboard/IdeaPromptSection";
import { IdeasGrid } from "@/components/dashboard/IdeasGrid";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { AnalysisLoading } from "@/components/analysis/AnalysisLoading";
import { useAuth } from "@/hooks/use-auth";
import { useIdeas } from "@/hooks/use-ideas";
import { IdeaDocument } from "@/types/database";
import { openRouterService } from "@/services/openrouter";
import { generateOverviewPrompt } from "@/lib/prompts/overview-prompt";

const MainDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { ideas, loading, error, createIdea, updateIdea } = useIdeas();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'analyzing' | 'failed'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleIdeaSubmit = useCallback(async (idea: string) => {
    if (!user) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      // Create idea in database and redirect immediately - much faster UX
      const newIdea = await createIdea({
        title: idea.substring(0, 100), 
        description: idea
      });

      // Redirect immediately to analysis page - user sees progress instead of waiting
      navigate(`/dashboard/${newIdea.slug}`, { 
        state: { 
          pendingAnalysis: true,
          ideaText: idea 
        } 
      });

    } catch (err) {
      console.error('Error creating idea:', err);
      setAnalysisError(err instanceof Error ? err.message : 'Failed to create idea');
      setIsAnalyzing(false);
    }
  }, [user, createIdea, navigate]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    document.title = "Dashboard • Just Plan It!";

    // Check for pending idea from navigation state or sessionStorage
    const pendingIdea = (location.state as { pendingIdea?: string })?.pendingIdea || sessionStorage.getItem('pendingIdea');
    if (pendingIdea) {
      sessionStorage.removeItem('pendingIdea');
      // Use setTimeout to avoid calling handleIdeaSubmit during render
      setTimeout(() => handleIdeaSubmit(pendingIdea), 0);
    }
  }, [location.state, handleIdeaSubmit]);

  const getStatsData = () => {
    const completed = ideas.filter(i => i.status === 'completed').length;
    const analyzing = ideas.filter(i => i.status === 'analyzing').length;
    const failed = ideas.filter(i => i.status === 'failed').length;
    const avgViability = 0; // Will need to calculate from analysis data
    const publicIdeas = ideas.filter(i => i.is_public).length;

    return { completed, analyzing, failed, avgViability, publicIdeas };
  };

  const stats = getStatsData();

  // Show loading screen when analyzing
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black relative">
        <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
        <Navigation />
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Idea...</h2>
              <p className="text-foreground/70">This may take a few moments. Please wait.</p>
              {analysisError && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400">{analysisError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <GradientBars bars={25} colors={['#ef4444', 'transparent']} />

      <Navigation />

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-instrument font-bold text-white mb-4">
                  Your Ideas Dashboard
                </h1>
                <p className="text-xl text-foreground/80">
                  Welcome back, {user?.name || 'Explorer'}! Ready to validate your next big idea?
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <Badge variant="secondary" className="bg-primary/20 text-primary text-sm px-3 py-1">
                  {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'} analyzed
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <DashboardStats 
              completed={stats.completed}
              analyzing={stats.analyzing}
              avgViability={stats.avgViability}
              publicIdeas={stats.publicIdeas}
            />
          </div>

          {/* AI Prompt Section */}
          <IdeaPromptSection onIdeaSubmit={handleIdeaSubmit} />

          {/* Ideas Section */}
          <IdeasGrid 
            ideas={ideas}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Quick Actions */}
          <DashboardQuickActions totalIdeas={ideas.length} />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
