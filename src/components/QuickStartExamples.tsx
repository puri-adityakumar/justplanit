import { Button } from "@/components/ui/button";

export const QuickStartExamples = () => {
  const examples = [
    "Plan my morning routine and work tasks",
    "Schedule 3 errands and a workout"
  ];

  return (
    <div className="mt-12 text-center">
      <p className="text-muted-foreground text-sm mb-6 font-medium">Try these examples:</p>
      <div className="flex flex-wrap justify-center gap-3">
        {examples.map((example, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white hover:bg-primary/5 text-sm px-4 py-2 rounded-full border border-border/30 hover:border-primary/30 transition-all"
          >
            "{example}"
          </Button>
        ))}
      </div>
    </div>
  );
};