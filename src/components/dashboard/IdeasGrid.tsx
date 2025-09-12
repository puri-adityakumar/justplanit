import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "./IdeaCard";
import { CompleteIdea } from "@/types/database";
import {
  Search,
  Filter,
  LayoutList,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  DollarSign
} from "lucide-react";
import React from "react";

interface IdeasGridProps {
  ideas: CompleteIdea[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: 'all' | 'completed' | 'analyzing' | 'failed';
  setFilterStatus: (status: 'all' | 'completed' | 'analyzing' | 'failed') => void;
}

export const IdeasGrid = ({
  ideas,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus
}: IdeasGridProps) => {
  const [view, setView] = React.useState<'list' | 'grid'>("list");
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = (idea.analysis?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (idea.analysis?.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesFilter = filterStatus === 'all' || idea.idea.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleRowExpansion = (ideaId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(ideaId)) {
      newExpanded.delete(ideaId);
    } else {
      newExpanded.add(ideaId);
    }
    setExpandedRows(newExpanded);
  };

  const getViabilityColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-instrument text-white">Your ideas</h2>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Search ideas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card/30 border border-border/30 rounded-lg text-white placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="bg-card/30 border border-border/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="analyzing">Analyzing</option>
            <option value="failed">Failed</option>
          </select>

          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border border-border/30">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2 text-sm ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card/30 text-foreground/80 hover:text-foreground'}`}
              aria-label="List view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2 text-sm ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card/30 text-foreground/80 hover:text-foreground'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ideas */}
      {filteredIdeas.length > 0 ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.idea.$id} idea={idea} />
            ))}
          </div>
        ) : (
          <Card className="bg-card/50 backdrop-blur-xl border-border/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black border-b border-border/40">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-white">Title</th>
                    <th className="text-left p-4 text-sm font-semibold text-white/90 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Viability
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-white/90 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Market Size
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-white/90">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-white/90 hidden md:table-cell">Date</th>
                    <th className="text-right p-4 text-sm font-semibold text-white/90">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIdeas.map((idea) => {
                    const getStatusBadge = () => {
                      switch (idea.idea.status) {
                        case 'analyzing':
                          return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-400">Analyzing</span>;
                        case 'completed':
                          return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-500/20 text-green-400">Completed</span>;
                        case 'failed':
                          return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-red-500/20 text-red-400">Failed</span>;
                        default:
                          return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-500/20 text-gray-400">Unknown</span>;
                      }
                    };

                    const isExpanded = expandedRows.has(idea.idea.$id);

                    return (
                      <React.Fragment key={idea.idea.$id}>
                        <tr className="border-b border-border/30 hover:bg-card/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleRowExpansion(idea.idea.$id)}
                                className="text-foreground/60 hover:text-foreground transition-colors"
                              >
                                {isExpanded ?
                                  <ChevronDown className="h-4 w-4" /> :
                                  <ChevronRight className="h-4 w-4" />
                                }
                              </button>
                              <div className="font-medium text-white truncate max-w-[250px]">
                                {idea.analysis?.title || 'Untitled Idea'}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <div className={`text-sm font-semibold ${getViabilityColor(idea.analysis?.viability_score)}`}>
                              {idea.analysis?.viability_score ? `${idea.analysis.viability_score}/10` : 'N/A'}
                            </div>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <div className="text-sm text-foreground/70 max-w-[200px] truncate">
                              {idea.analysis?.market_size || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge()}
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <div className="text-sm text-foreground/60">
                              {new Date(idea.idea.$createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border/40"
                              onClick={() => window.location.href = `/dashboard/${idea.idea.slug}`}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="border-b border-border/30 bg-card/20">
                            <td colSpan={6} className="p-4">
                              <div className="ml-6 text-sm text-foreground/70 leading-relaxed">
                                <strong className="text-foreground/90">Description:</strong>
                                <p className="mt-1">{idea.analysis?.description || 'No description provided'}</p>

                                {/* Show mobile-only data */}
                                <div className="lg:hidden mt-3 flex gap-4">
                                  <div>
                                    <strong className="text-foreground/90">Viability:</strong>
                                    <span className={`ml-2 font-semibold ${getViabilityColor(idea.analysis?.viability_score)}`}>
                                      {idea.analysis?.viability_score ? `${idea.analysis.viability_score}/10` : 'N/A'}
                                    </span>
                                  </div>
                                  <div>
                                    <strong className="text-foreground/90">Market:</strong>
                                    <span className="ml-2 text-foreground/70">
                                      {idea.analysis?.market_size || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      ) : (
        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-8 text-center">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">No ideas found</h3>
            <p className="text-foreground/60">Try adjusting your search terms or filters</p>
          </div>
        </Card>
      )}
    </div>
  );
};
