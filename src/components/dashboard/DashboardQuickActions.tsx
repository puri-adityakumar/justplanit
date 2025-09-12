import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DashboardQuickActionsProps {
  totalIdeas: number;
}

export const DashboardQuickActions = ({ totalIdeas }: DashboardQuickActionsProps) => {
  if (totalIdeas === 0) return null;

  return (
    <Card className="bg-card/30 backdrop-blur-xl border-border/30 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">Need more signals?</h3>
          <p className="text-foreground/60 text-sm">
            Explore trends or validate another idea
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border/40 text-foreground/80 hover:text-foreground">
            View trends
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Validate idea
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
