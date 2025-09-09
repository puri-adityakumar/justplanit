import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3
} from "lucide-react";

interface DashboardStatsProps {
  completed: number;
  analyzing: number;
  avgViability: number;
  publicIdeas: number;
}

export const DashboardStats = ({ completed, analyzing, avgViability, publicIdeas }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <BarChart3 className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{completed}</div>
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
            <div className="text-2xl font-bold text-white">{analyzing}</div>
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
              {avgViability ? avgViability.toFixed(1) : 'N/A'}
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
            <div className="text-2xl font-bold text-white">{publicIdeas}</div>
            <div className="text-sm text-foreground/60">Public Ideas</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
