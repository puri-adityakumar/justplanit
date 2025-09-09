import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { IdeaCard } from "@/components/ui/idea-card";
import { useAuth } from "@/hooks/use-auth";
import {
  TrendingUp,
  Users,
  DollarSign,
  Lightbulb,
  BarChart3,
  Plus,
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
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

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || idea.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatsData = () => {
    const completed = ideas.filter(i => i.status === 'completed').length;
    const analyzing = ideas.filter(i => i.status === 'analyzing').length;
    const avgViability = ideas
      .filter(i => i.viabilityScore)
      .reduce((sum, i) => sum + (i.viabilityScore || 0), 0) / 
      ideas.filter(i => i.viabilityScore).length || 0;

    return { completed, analyzing, avgViability };
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <BarChart3 className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.completed}</div>
                    <div className="text-sm text-foreground/60">Completed</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.analyzing}</div>
                    <div className="text-sm text-foreground/60">Analyzing</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {stats.avgViability ? stats.avgViability.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-sm text-foreground/60">Avg. Viability</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {ideas.filter(i => i.isPublic).length}
                    </div>
                    <div className="text-sm text-foreground/60">Public Ideas</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* AI Prompt Section */}
          <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8 mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-white">Got a New Idea?</h2>
              </div>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
                Describe your startup idea and get instant AI-powered validation with market analysis, 
                competitive insights, and actionable recommendations.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <PromptInputBox onSend={(message) => handleIdeaSubmit(message)} placeholder="Describe your startup idea in detail..." />
            </div>
          </Card>

          {/* Ideas Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Validated Ideas</h2>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-background/20 border border-border/30 rounded-lg text-white placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-foreground/60" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="bg-background/20 border border-border/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="analyzing">Analyzing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ideas Grid */}
            {filteredIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8 text-center">
                {searchQuery || filterStatus !== 'all' ? (
                  <div>
                    <Search className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No ideas found</h3>
                    <p className="text-foreground/60">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                ) : (
                  <div>
                    <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No ideas yet</h3>
                    <p className="text-foreground/60 mb-4">
                      Start by describing your first startup idea above
                    </p>
                    <Button onClick={() => document.querySelector('textarea')?.focus()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Idea
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          {ideas.length > 0 && (
            <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Ready for more insights?</h3>
                  <p className="text-foreground/60">
                    Explore successful startup patterns or validate another idea
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-border/40">
                    View Trends
                  </Button>
                  <Button>
                    Validate New Idea
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
