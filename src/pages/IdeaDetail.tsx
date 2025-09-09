import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIdeaDetail } from "@/hooks/use-ideas";
import {
    ArrowLeft,
    Download,
    Share2,
    Loader,
    AlertTriangle,
    TrendingUp,
    Globe,
    Users,
    Code,
    DollarSign,
    MapPin,
    Lightbulb,
    FileText
} from "lucide-react";

const IdeaDetail = () => {
    const { ideaId } = useParams<{ ideaId: string }>();
    const { idea, loading, error } = useIdeaDetail(ideaId);

    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.title = idea?.idea.title ? `${idea.idea.title} • Just Plan It!` : "Idea Analysis • Just Plan It!";
    }, [idea]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black relative">
                <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
                <Navigation />
                <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
                    <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 max-w-md text-center">
                        <Loader className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                        <h2 className="text-xl font-bold text-white mb-4">Loading Idea</h2>
                        <p className="text-foreground/70">Please wait while we load your idea...</p>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black relative">
                <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
                <Navigation />
                <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
                    <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 max-w-md text-center">
                        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-4">Error Loading Idea</h2>
                        <p className="text-foreground/70 mb-6">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <Link to="/dashboard">
                                <Button variant="outline" className="border-border/40">
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (!idea) {
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
                                Back to Dashboard
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    const getStatusBadge = () => {
        switch (idea.idea.status) {
            case 'analyzing':
                return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Analyzing</Badge>;
            case 'completed':
                return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Completed</Badge>;
            case 'failed':
                return <Badge variant="secondary" className="bg-red-500/20 text-red-400">Failed</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars bars={25} colors={['#ef4444', 'transparent']} />

            <Navigation />

            <div className="relative z-10 px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Link to="/dashboard">
                                <Button variant="outline" size="sm" className="border-primary/20">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <div className="flex gap-2 ml-auto">
                                <Button variant="outline" size="sm" className="border-primary/20">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Report
                                </Button>
                                <Button variant="outline" size="sm" className="border-primary/20">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-instrument font-bold text-white mb-4">
                            {idea.idea.title || 'Untitled Idea'}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-4">
                            {getStatusBadge()}
                            <span className="text-foreground/60">
                                Created {formatDate(idea.idea.created_at)}
                            </span>
                            {idea.idea.updated_at !== idea.idea.created_at && (
                                <span className="text-foreground/60">
                                    • Updated {formatDate(idea.idea.updated_at)}
                                </span>
                            )}
                        </div>

                        <p className="text-xl text-foreground/80 mb-6">
                            {idea.idea.description || 'No description provided'}
                        </p>
                    </div>

                    {/* Content based on status */}
                    {idea.idea.status === 'analyzing' && (
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8 text-center">
                            <Loader className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
                            <h3 className="text-2xl font-bold text-white mb-4">Analysis in Progress</h3>
                            <p className="text-foreground/70 mb-6">
                                We're currently analyzing your idea. This process typically takes a few minutes.
                            </p>
                            <Button onClick={() => window.location.reload()}>
                                Refresh Status
                            </Button>
                        </Card>
                    )}

                    {idea.idea.status === 'failed' && (
                        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8 text-center">
                            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">Analysis Failed</h3>
                            <p className="text-foreground/70 mb-6">
                                Unfortunately, we encountered an error while analyzing your idea. Please try again.
                            </p>
                            <Button className="bg-primary hover:bg-primary/90">
                                Retry Analysis
                            </Button>
                        </Card>
                    )}

                    {idea.idea.status === 'completed' && (
                        <div>
                            {/* Analysis Results */}
                            {idea.analysis && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <TrendingUp className="h-6 w-6 text-primary" />
                                            <h3 className="text-xl font-bold text-white">Viability Score</h3>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-primary mb-2">
                                                {idea.analysis.viability_score || 'N/A'}
                                                {idea.analysis.viability_score && '/10'}
                                            </div>
                                            <p className="text-foreground/60">
                                                {idea.analysis.viability_score ? 'Overall viability assessment' : 'Analysis needed'}
                                            </p>
                                        </div>
                                    </Card>

                                    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <DollarSign className="h-6 w-6 text-primary" />
                                            <h3 className="text-xl font-bold text-white">Market Size</h3>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-primary mb-2">
                                                {idea.analysis.market_size || 'N/A'}
                                            </div>
                                            <p className="text-foreground/60">
                                                {idea.analysis.market_size ? 'Total addressable market' : 'Analysis needed'}
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Data Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Overview Section */}
                                {idea.sections.overview && (
                                    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Globe className="h-6 w-6 text-primary" />
                                            <h3 className="text-xl font-bold text-white">Market Overview</h3>
                                        </div>
                                        <p className="text-foreground/70">
                                            Detailed market analysis and insights will be displayed here.
                                        </p>
                                    </Card>
                                )}

                                {/* PRD Section */}
                                {idea.sections.prd && (
                                    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FileText className="h-6 w-6 text-primary" />
                                            <h3 className="text-xl font-bold text-white">Product Requirements</h3>
                                        </div>
                                        <p className="text-foreground/70">
                                            Product requirements document and specifications will be displayed here.
                                        </p>
                                    </Card>
                                )}

                                {/* Tech Stack Section */}
                                {idea.sections.tech_stack && (
                                    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Code className="h-6 w-6 text-primary" />
                                            <h3 className="text-xl font-bold text-white">Technical Stack</h3>
                                        </div>
                                        <p className="text-foreground/70">
                                            Recommended technologies and architecture will be displayed here.
                                        </p>
                                    </Card>
                                )}

                                {/* Roadmap Section */}
                                {idea.sections.roadmap && (
                                    <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <MapPin className="h-6 w-6 text-primary" />
                                            <h3 className="text-xl font-bold text-white">Implementation Roadmap</h3>
                                        </div>
                                        <p className="text-foreground/70">
                                            Step-by-step implementation plan will be displayed here.
                                        </p>
                                    </Card>
                                )}
                            </div>

                            {/* No analysis data placeholder */}
                            {!idea.analysis && Object.keys(idea.sections).length === 0 && (
                                <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8 text-center">
                                    <Lightbulb className="h-16 w-16 text-primary mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-white mb-4">Analysis Complete</h3>
                                    <p className="text-foreground/70 mb-6">
                                        Your idea has been processed, but detailed analysis data is not yet available.
                                        This feature will be enhanced in future updates.
                                    </p>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IdeaDetail;
