import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "./IdeaCard";
import { IdeaDocument } from "@/types/database";
import {
  Search,
  Filter,
  Lightbulb,
  Plus
} from "lucide-react";

interface IdeasGridProps {
  ideas: IdeaDocument[];
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
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = (idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (idea.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesFilter = filterStatus === 'all' || idea.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
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
            <IdeaCard key={idea.$id} idea={idea} />
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
  );
};
