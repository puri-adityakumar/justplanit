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
      <Card className="bg-card/30 backdrop-blur-xl border-border/30 p-5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-green-500/10">
            <BarChart3 className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{completed}</div>
            <div className="text-xs text-foreground/60">Completed</div>
          </div>
        </div>
      </Card>

      <Card className="bg-card/30 backdrop-blur-xl border-border/30 p-5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-blue-500/10">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{analyzing}</div>
            <div className="text-xs text-foreground/60">Analyzing</div>
          </div>
        </div>
      </Card>

      <Card className="bg-card/30 backdrop-blur-xl border-border/30 p-5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {avgViability ? avgViability.toFixed(1) : 'N/A'}
            </div>
            <div className="text-xs text-foreground/60">Avg. Viability</div>
          </div>
        </div>
      </Card>

      <Card className="bg-card/30 backdrop-blur-xl border-border/30 p-5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-purple-500/10">
            <Users className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{publicIdeas}</div>
            <div className="text-xs text-foreground/60">Public Ideas</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
