import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { IdeaPromptSection } from "@/components/dashboard/IdeaPromptSection";
import { IdeasGrid } from "@/components/dashboard/IdeasGrid";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { useAuth } from "@/hooks/use-auth";
import { dummyValidatedIdeas, generateSlug, type ValidatedIdea } from "@/data/dummyIdeas";

const MainDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<ValidatedIdea[]>(dummyValidatedIdeas);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'analyzing' | 'failed'>('all');

  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    document.title = "Dashboard • Just Plan It!";
  }, []);

  const handleIdeaSubmit = (idea: string) => {
    // Generate slug and navigate to idea analysis page
    const slug = generateSlug(idea);
    
    // In real implementation, this would create a database entry
    // For now, we'll just navigate to the slug page
    navigate(`/dashboard/${slug}?idea=${encodeURIComponent(idea)}`);
  };

  const getStatsData = () => {
    const completed = ideas.filter(i => i.status === 'completed').length;
    const analyzing = ideas.filter(i => i.status === 'analyzing').length;
    const avgViability = ideas
      .filter(i => i.viabilityScore)
      .reduce((sum, i) => sum + (i.viabilityScore || 0), 0) / 
      ideas.filter(i => i.viabilityScore).length || 0;
    const publicIdeas = ideas.filter(i => i.isPublic).length;

    return { completed, analyzing, avgViability, publicIdeas };
  };

  const stats = getStatsData();

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
