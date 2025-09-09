import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Copy, Download, Code } from "lucide-react";
import { ValidatedIdea } from "@/data/dummyIdeas";

interface AIContextSectionProps {
  ideaData: ValidatedIdea;
}

export const AIContextSection = ({ ideaData }: AIContextSectionProps) => {
  // Dummy AI context data
  const aiContextData = {
    projectOverview: {
      name: "Just Plan It - AI Development Assistant",
      description: ideaData.description,
      techStack: "React, TypeScript, Supabase, Vercel, OpenAI API",
      architecture: "JAMstack with serverless functions"
    },
    codingPrompts: [
      {
        title: "Initial Setup Prompt",
        category: "Setup",
        prompt: `I'm building a React + TypeScript application called "Just Plan It" that helps developers plan startup projects with AI assistance.

Tech Stack:
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS + shadcn/ui
- Backend: Supabase (database + auth)
- AI: OpenAI API
- Hosting: Vercel

Key Features:
1. Idea validation and analysis
2. PRD generation
3. Tech stack recommendations
4. Cost analysis
5. Development roadmaps
6. AI context generation for coding assistants

Please help me create components that are:
- Type-safe with proper TypeScript interfaces
- Responsive and accessible
- Follow React best practices
- Use Tailwind for styling
- Include proper error handling`
      },
      {
        title: "Component Development Prompt",
        category: "Development",
        prompt: `I'm working on the "${ideaData.title}" feature for Just Plan It.

Context: This is an AI-assisted development planning platform that generates comprehensive project documentation.

Current component requirements:
- Uses shadcn/ui components (Card, Button, Badge, etc.)
- Dark theme with glass morphism effects
- Responsive design (mobile-first)
- TypeScript with proper interfaces
- Error boundaries and loading states

Component should follow our design system:
- Background: bg-card/20 backdrop-blur-md border-border/30
- Text colors: text-white for headings, text-foreground/70 for body
- Primary color: Custom red/pink gradient
- Spacing: Consistent gap-4 and p-6 patterns

Please help implement this component with proper TypeScript types and error handling.`
      },
      {
        title: "Database Schema Prompt",
        category: "Database",
        prompt: `I'm designing the database schema for Just Plan It using Supabase PostgreSQL.

Core entities:
1. Users (Supabase Auth)
2. Ideas (user-submitted project ideas)
3. Analyses (AI-generated analysis results)
4. Plans (comprehensive project plans)

Key relationships:
- Users have many Ideas
- Ideas have one Analysis
- Ideas have one Plan
- Plans contain multiple sections (PRD, tech stack, costs, etc.)

Please help me create:
- Proper PostgreSQL tables with foreign keys
- Row Level Security (RLS) policies
- Indexes for performance
- Type-safe TypeScript interfaces
- Supabase client queries

Consider scalability and data consistency.`
      },
      {
        title: "API Integration Prompt",
        category: "Integration",
        prompt: `I'm integrating OpenAI API for idea analysis in Just Plan It.

Requirements:
- Analyze startup ideas and generate comprehensive reports
- Use GPT-4 for high-quality analysis
- Stream responses for better UX
- Handle rate limits and errors gracefully
- Cache results to reduce API costs

Response format should include:
- Executive summary with viability score
- Market analysis
- Technical feasibility
- Risk assessment
- Recommendations

Please help implement:
- OpenAI client with proper error handling
- Streaming response processing
- Result caching strategy
- Cost optimization techniques
- TypeScript interfaces for responses`
      }
    ],
    codeSnippets: [
      {
        title: "Project Structure",
        language: "text",
        code: `src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── analysis/        # Analysis result components
│   ├── auth/           # Authentication components
│   └── dashboard/      # Dashboard components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Route components
├── services/           # API services
└── types/              # TypeScript interfaces`
      },
      {
        title: "TypeScript Interfaces",
        language: "typescript",
        code: `interface ValidatedIdea {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'analyzing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  viabilityScore?: number;
  marketSize?: string;
  validationData?: ValidationResult;
  isPublic: boolean;
}

interface ValidationResult {
  executive_summary: {
    viability_score: number;
    market_opportunity: string;
    key_strengths: string[];
    key_weaknesses: string[];
  };
  market_analysis: {
    target_market: {
      demographics: string;
      growth_rate: number;
    };
    market_size: {
      tam: string;
    };
    market_readiness: number;
  };
}`
      }
    ],
    bestPractices: [
      "Use TypeScript strict mode for better type safety",
      "Implement proper error boundaries for AI API calls",
      "Cache API responses to reduce costs and improve performance",
      "Use React Query for server state management",
      "Implement progressive loading for better UX",
      "Follow React composition patterns over inheritance",
      "Use proper semantic HTML for accessibility",
      "Implement proper loading and error states",
      "Use environment variables for API keys and configuration",
      "Follow the principle of least privilege for database access"
    ]
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-white">AI Coding Assistant Context</h2>
      </div>

      {/* Project Overview */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Project Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Project Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-foreground/60">Name: </span>
                <span className="text-white">{aiContextData.projectOverview.name}</span>
              </div>
              <div>
                <span className="text-foreground/60">Tech Stack: </span>
                <span className="text-white">{aiContextData.projectOverview.techStack}</span>
              </div>
              <div>
                <span className="text-foreground/60">Architecture: </span>
                <span className="text-white">{aiContextData.projectOverview.architecture}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Description</h4>
            <p className="text-foreground/70 text-sm">
              {aiContextData.projectOverview.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Coding Prompts */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">AI Assistant Prompts</h3>
        <div className="space-y-4">
          {aiContextData.codingPrompts.map((prompt, index) => (
            <div key={index} className="bg-background/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{prompt.title}</h4>
                  <Badge variant="outline" className="mt-1">{prompt.category}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(prompt.prompt)}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-background/20 rounded p-3 font-mono text-sm text-foreground/80 whitespace-pre-wrap">
                {prompt.prompt}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Code Snippets */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-white">Code Snippets</h3>
        </div>
        <div className="space-y-4">
          {aiContextData.codeSnippets.map((snippet, index) => (
            <div key={index} className="bg-background/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{snippet.title}</h4>
                  <Badge variant="outline" className="mt-1">{snippet.language}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(snippet.code)}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-background/20 rounded p-3 font-mono text-sm text-foreground/80 overflow-x-auto">
                <pre>{snippet.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Development Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiContextData.bestPractices.map((practice, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-background/10 rounded-lg">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-foreground/80 text-sm">{practice}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Actions */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Export Context</h3>
        <div className="flex gap-4">
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Download as JSON
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy All Context
          </Button>
        </div>
        <p className="text-foreground/60 text-sm mt-3">
          Export all project context for use with GitHub Copilot, Cursor, or other AI coding assistants.
        </p>
      </Card>
    </div>
  );
};
