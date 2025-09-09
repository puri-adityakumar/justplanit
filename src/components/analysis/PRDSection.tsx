import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Target, CheckCircle } from "lucide-react";
import { ValidatedIdea } from "@/data/dummyIdeas";
import { ValidationResult } from "@/types/validation";

interface PRDSectionProps {
  ideaData: ValidatedIdea;
  validationData?: ValidationResult;
}

export const PRDSection = ({ ideaData, validationData }: PRDSectionProps) => {
  // Dummy data for now
  const prdData = {
    overview: ideaData.description,
    userPersonas: [
      {
        name: "Tech-Savvy Developer",
        description: "Experienced developers looking for AI-assisted coding tools",
        needs: ["Better context understanding", "Faster development cycles", "Clear project documentation"]
      },
      {
        name: "Startup Founder",
        description: "Non-technical founders who need to understand development requirements",
        needs: ["Clear technical roadmaps", "Cost estimates", "Timeline planning"]
      }
    ],
    userStories: [
      {
        id: 1,
        epic: "Core Planning",
        story: "As a developer, I want to input my startup idea and get a comprehensive PRD so that I can start development with clear requirements",
        acceptanceCriteria: [
          "User can input idea description",
          "System generates detailed PRD",
          "PRD includes user stories and acceptance criteria"
        ],
        priority: "High"
      },
      {
        id: 2,
        epic: "Tech Stack Planning",
        story: "As a developer, I want AI-suggested tech stack recommendations so that I can choose the best technologies for my project",
        acceptanceCriteria: [
          "System analyzes project requirements",
          "Provides multiple tech stack options",
          "Includes pros/cons for each option"
        ],
        priority: "High"
      },
      {
        id: 3,
        epic: "Cost Planning",
        story: "As a founder, I want to see estimated costs for different services so that I can budget my project accordingly",
        acceptanceCriteria: [
          "Shows pricing for recommended services",
          "Provides different tier options",
          "Includes monthly/yearly cost breakdowns"
        ],
        priority: "Medium"
      }
    ],
    features: [
      {
        name: "AI-Powered Analysis",
        description: "Comprehensive idea validation using multiple AI models",
        priority: "Must Have",
        complexity: "High"
      },
      {
        name: "Interactive Tabs",
        description: "Organized sections for different aspects of planning",
        priority: "Must Have",
        complexity: "Medium"
      },
      {
        name: "Export Functionality",
        description: "Export all planning documents as PDF or JSON",
        priority: "Should Have",
        complexity: "Low"
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-white">Product Requirements Document</h2>
      </div>

      {/* Overview */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Project Overview</h3>
        <p className="text-foreground/80 leading-relaxed">{prdData.overview}</p>
      </Card>

      {/* User Personas */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-white">User Personas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prdData.userPersonas.map((persona, index) => (
            <div key={index} className="bg-background/10 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">{persona.name}</h4>
              <p className="text-foreground/70 text-sm mb-3">{persona.description}</p>
              <div>
                <h5 className="text-sm font-medium text-white mb-2">Key Needs:</h5>
                <ul className="space-y-1">
                  {persona.needs.map((need, needIndex) => (
                    <li key={needIndex} className="flex items-start gap-2 text-sm text-foreground/70">
                      <Target className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      {need}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* User Stories */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">User Stories</h3>
        <div className="space-y-4">
          {prdData.userStories.map((story) => (
            <div key={story.id} className="bg-background/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={story.priority === 'High' ? 'destructive' : 'secondary'}>
                    {story.priority}
                  </Badge>
                  <Badge variant="outline">{story.epic}</Badge>
                </div>
              </div>
              <p className="text-white font-medium mb-3">{story.story}</p>
              <div>
                <h5 className="text-sm font-medium text-white mb-2">Acceptance Criteria:</h5>
                <ul className="space-y-1">
                  {story.acceptanceCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground/70">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Features */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Core Features</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {prdData.features.map((feature, index) => (
            <div key={index} className="bg-background/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{feature.name}</h4>
                <div className="flex gap-2">
                  <Badge variant={feature.priority === 'Must Have' ? 'destructive' : 'secondary'} className="text-xs">
                    {feature.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {feature.complexity}
                  </Badge>
                </div>
              </div>
              <p className="text-foreground/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
