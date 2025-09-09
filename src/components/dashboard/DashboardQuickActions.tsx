import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DashboardQuickActionsProps {
  totalIdeas: number;
}

export const DashboardQuickActions = ({ totalIdeas }: DashboardQuickActionsProps) => {
  if (totalIdeas === 0) return null;

  return (
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
  );
};
