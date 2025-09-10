import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { ValidatedIdea } from "@/data/dummyIdeas";

interface RoadmapSectionProps {
  ideaData: ValidatedIdea;
}

export const RoadmapSection = ({ ideaData }: RoadmapSectionProps) => {
  // Dummy roadmap data
  const roadmapData = {
    phases: [
      {
        id: 1,
        name: "Foundation & Setup",
        duration: "Week 1-2",
        status: "pending" as "pending" | "in-progress" | "completed",
        description: "Set up development environment and basic project structure",
        tasks: [
          { id: 1, title: "Initialize project with chosen tech stack", priority: "High", estimatedHours: 4, aiContext: "Create React + TypeScript project with Vite, set up ESLint, Prettier, and basic folder structure" },
          { id: 2, title: "Set up development environment", priority: "High", estimatedHours: 2, aiContext: "Configure VS Code with recommended extensions, set up Git, and create development scripts" },
          { id: 3, title: "Configure database with Supabase", priority: "High", estimatedHours: 3, aiContext: "Create Supabase project, set up authentication, and design initial database schema" },
          { id: 4, title: "Implement basic authentication", priority: "Medium", estimatedHours: 6, aiContext: "Integrate Supabase Auth with React, create login/signup forms, and protected routes" }
        ]
      },
      {
        id: 2,
        name: "Core Features - MVP",
        duration: "Week 3-6",
        status: "pending" as "pending" | "in-progress" | "completed",
        description: "Build the minimum viable product with essential features",
        tasks: [
          { id: 5, title: "Create idea input interface", priority: "High", estimatedHours: 8, aiContext: "Build form for idea submission with validation, rich text editor, and auto-save functionality" },
          { id: 6, title: "Implement AI analysis engine", priority: "High", estimatedHours: 12, aiContext: "Integrate OpenAI API for idea analysis, create prompt templates, and handle streaming responses" },
          { id: 7, title: "Build results dashboard", priority: "High", estimatedHours: 10, aiContext: "Create tabbed interface for analysis results with responsive design and data visualization" },
          { id: 8, title: "Add data persistence", priority: "Medium", estimatedHours: 6, aiContext: "Save analysis results to database, implement CRUD operations, and user data management" }
        ]
      },
      {
        id: 3,
        name: "Enhanced Planning Features",
        duration: "Week 7-10",
        status: "pending" as "pending" | "in-progress" | "completed",
        description: "Add comprehensive planning tools and documentation generation",
        tasks: [
          { id: 9, title: "Implement PRD generation", priority: "High", estimatedHours: 15, aiContext: "Create AI-powered PRD generator with user stories, acceptance criteria, and feature specifications" },
          { id: 10, title: "Build tech stack recommendation engine", priority: "High", estimatedHours: 12, aiContext: "Develop algorithm for tech stack suggestions based on project requirements and constraints" },
          { id: 11, title: "Add cost analysis calculator", priority: "High", estimatedHours: 10, aiContext: "Create dynamic cost calculator for different services with real-time pricing data" },
          { id: 12, title: "Implement workflow diagram generator", priority: "Medium", estimatedHours: 8, aiContext: "Generate visual workflow diagrams using libraries like React Flow or Mermaid" }
        ]
      },
      {
        id: 4,
        name: "AI Context & Export",
        duration: "Week 11-12",
        status: "pending" as "pending" | "in-progress" | "completed",
        description: "Build AI context generation and export functionality",
        tasks: [
          { id: 13, title: "Create AI context generator", priority: "High", estimatedHours: 8, aiContext: "Generate optimized prompts and context summaries for AI coding assistants" },
          { id: 14, title: "Implement export functionality", priority: "Medium", estimatedHours: 6, aiContext: "Add PDF/JSON export for all planning documents with professional formatting" },
          { id: 15, title: "Build sharing features", priority: "Medium", estimatedHours: 4, aiContext: "Create shareable links for project plans with privacy controls" }
        ]
      },
      {
        id: 5,
        name: "Polish & Launch",
        duration: "Week 13-14",
        status: "pending" as "pending" | "in-progress" | "completed",
        description: "Final touches, testing, and deployment preparation",
        tasks: [
          { id: 16, title: "Comprehensive testing", priority: "High", estimatedHours: 12, aiContext: "Write unit tests, integration tests, and end-to-end tests using Jest and Playwright" },
          { id: 17, title: "Performance optimization", priority: "Medium", estimatedHours: 6, aiContext: "Optimize bundle size, implement lazy loading, and improve Core Web Vitals" },
          { id: 18, title: "Deploy to production", priority: "High", estimatedHours: 4, aiContext: "Set up CI/CD pipeline, configure environment variables, and deploy to Vercel" },
          { id: 19, title: "Documentation and onboarding", priority: "Medium", estimatedHours: 8, aiContext: "Create user guides, API documentation, and onboarding flow for new users" }
        ]
      }
    ],
    milestones: [
      { week: 2, title: "Development Environment Ready", description: "All tools configured and first commit made" },
      { week: 6, title: "MVP Complete", description: "Core idea analysis functionality working" },
      { week: 10, title: "Planning Tools Ready", description: "All planning features implemented" },
      { week: 12, title: "Export & AI Context", description: "Full AI assistant integration ready" },
      { week: 14, title: "Production Launch", description: "Platform live and ready for users" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "in-progress": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "pending": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Low": return "bg-green-500/20 text-green-300 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const totalHours = roadmapData.phases.reduce((total, phase) =>
    total + phase.tasks.reduce((phaseTotal, task) => phaseTotal + task.estimatedHours, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-white">Development Roadmap</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{roadmapData.phases.length}</div>
          <div className="text-sm text-foreground/60">Phases</div>
        </Card>
        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {roadmapData.phases.reduce((total, phase) => total + phase.tasks.length, 0)}
          </div>
          <div className="text-sm text-foreground/60">Tasks</div>
        </Card>
        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{totalHours}h</div>
          <div className="text-sm text-foreground/60">Est. Hours</div>
        </Card>
        <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">14</div>
          <div className="text-sm text-foreground/60">Weeks</div>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Project Timeline</h3>
        <div className="space-y-2">
          {roadmapData.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-background/10 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">{milestone.week}</span>
                </div>
                <div>
                  <div className="font-medium text-white">{milestone.title}</div>
                  <div className="text-sm text-foreground/60">{milestone.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Phases */}
      <div className="space-y-6">
        {roadmapData.phases.map((phase) => (
          <Card key={phase.id} className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{phase.name}</h3>
                <p className="text-foreground/70">{phase.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={getStatusColor(phase.status)}>
                  {phase.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                  {phase.status === "in-progress" && <AlertCircle className="h-3 w-3 mr-1" />}
                  {phase.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {phase.status.charAt(0).toUpperCase() + phase.status.slice(1).replace("-", " ")}
                </Badge>
                <Badge variant="outline">{phase.duration}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              {phase.tasks.map((task) => (
                <div key={task.id} className="bg-background/10 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(task.priority)} variant="outline">
                        {task.priority}
                      </Badge>
                      <Badge variant="secondary">
                        {task.estimatedHours}h
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-white mb-1">AI Context:</h5>
                    <p className="text-sm text-foreground/70 bg-background/10 rounded p-2 font-mono">
                      {task.aiContext}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex justify-between items-center text-sm">
                <span className="text-foreground/60">
                  {phase.tasks.length} tasks • {phase.tasks.reduce((total, task) => total + task.estimatedHours, 0)} hours estimated
                </span>
                <span className="text-primary font-medium">
                  Week {phase.id * 2 - 1} - {phase.id * 2}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Development Notes */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Development Notes</h3>
        <div className="space-y-4">
          <div className="bg-background/10 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">AI-Optimized Tasks</h4>
            <p className="text-foreground/70 text-sm mb-2">
              Each task includes specific AI context to help coding assistants understand the requirements better:
            </p>
            <ul className="space-y-1 text-sm text-foreground/60">
              <li>• Detailed technical specifications for implementation</li>
              <li>• Suggested libraries and frameworks to use</li>
              <li>• Code patterns and architectural decisions</li>
              <li>• Testing and deployment considerations</li>
            </ul>
          </div>

          <div className="bg-background/10 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Flexibility & Iteration</h4>
            <p className="text-foreground/70 text-sm">
              This roadmap is designed to be flexible. Tasks can be reordered based on priorities,
              and new features can be added based on user feedback during development.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
