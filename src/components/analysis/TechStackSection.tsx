import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Database, Globe, Smartphone, Cloud, Code } from "lucide-react";
import { ValidatedIdea } from "@/data/dummyIdeas";

interface TechStackSectionProps {
  ideaData: ValidatedIdea;
}

export const TechStackSection = ({ ideaData }: TechStackSectionProps) => {
  // Dummy tech stack recommendations
  const techStackData = {
    recommended: {
      frontend: {
        icon: <Globe className="h-5 w-5" />,
        title: "Frontend",
        primary: "React + TypeScript",
        alternatives: ["Vue.js", "Next.js", "Svelte"],
        reasoning: "React provides excellent ecosystem, TypeScript ensures type safety, and has great AI tooling support."
      },
      backend: {
        icon: <Code className="h-5 w-5" />,
        title: "Backend",
        primary: "Node.js + Express",
        alternatives: ["Python + FastAPI", "Go + Gin", "Rust + Axum"],
        reasoning: "Node.js allows full-stack JavaScript, Express is battle-tested, and has excellent AI integration libraries."
      },
      database: {
        icon: <Database className="h-5 w-5" />,
        title: "Database",
        primary: "PostgreSQL + Supabase",
        alternatives: ["MongoDB", "Firebase", "PlanetScale"],
        reasoning: "PostgreSQL is robust and scalable, Supabase provides real-time features and easy setup."
      },
      mobile: {
        icon: <Smartphone className="h-5 w-5" />,
        title: "Mobile",
        primary: "React Native",
        alternatives: ["Flutter", "Native iOS/Android", "Capacitor"],
        reasoning: "Code reuse with web frontend, large community, and excellent developer experience."
      },
      hosting: {
        icon: <Cloud className="h-5 w-5" />,
        title: "Hosting",
        primary: "Vercel + Railway",
        alternatives: ["Netlify + Heroku", "AWS", "Google Cloud"],
        reasoning: "Vercel excels at frontend deployment, Railway simplifies backend hosting with great developer experience."
      }
    },
    architecture: {
      pattern: "Microservices with API Gateway",
      description: "Scalable architecture that allows independent scaling of different services",
      benefits: [
        "Independent scaling of services",
        "Technology diversity per service",
        "Fault isolation",
        "Team independence"
      ]
    },
    devTools: [
      { name: "GitHub Copilot", category: "AI Assistant", description: "AI-powered code completion" },
      { name: "Cursor", category: "IDE", description: "AI-first code editor" },
      { name: "Vercel AI SDK", category: "AI Integration", description: "Streamlined AI integration" },
      { name: "Prisma", category: "Database", description: "Type-safe database client" },
      { name: "tRPC", category: "API", description: "End-to-end typesafe APIs" },
      { name: "Zod", category: "Validation", description: "TypeScript-first schema validation" }
    ]
  };

  const getPriorityColor = (category: string) => {
    switch (category) {
      case "AI Assistant": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "IDE": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "AI Integration": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Database": return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "API": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Validation": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Layers className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-white">Technology Stack & Architecture</h2>
      </div>

      {/* Recommended Tech Stack */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Recommended Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(techStackData.recommended).map(([key, tech]) => (
            <div key={key} className="bg-background/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-primary">{tech.icon}</div>
                <h4 className="font-semibold text-white">{tech.title}</h4>
              </div>
              
              <div className="mb-3">
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                  {tech.primary}
                </Badge>
              </div>

              <div className="mb-3">
                <h5 className="text-sm font-medium text-white mb-2">Alternatives:</h5>
                <div className="flex flex-wrap gap-1">
                  {tech.alternatives.map((alt, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-foreground/70 text-sm">{tech.reasoning}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Architecture Pattern */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Architecture Pattern</h3>
        <div className="bg-background/10 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">{techStackData.architecture.pattern}</h4>
          <p className="text-foreground/70 mb-4">{techStackData.architecture.description}</p>
          
          <h5 className="text-sm font-medium text-white mb-2">Key Benefits:</h5>
          <ul className="space-y-1">
            {techStackData.architecture.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground/70">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Development Tools */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recommended Development Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techStackData.devTools.map((tool, index) => (
            <div key={index} className="bg-background/10 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{tool.name}</h4>
                <Badge className={`text-xs ${getPriorityColor(tool.category)}`}>
                  {tool.category}
                </Badge>
              </div>
              <p className="text-foreground/70 text-sm">{tool.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Integration Notes */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">AI Integration Notes</h3>
        <div className="bg-background/10 rounded-lg p-4">
          <p className="text-foreground/80 mb-4">
            This tech stack is optimized for AI-assisted development with the following considerations:
          </p>
          <ul className="space-y-2 text-foreground/70">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <strong className="text-white">Type Safety:</strong> TypeScript throughout the stack ensures better AI code completion
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <strong className="text-white">API Standards:</strong> RESTful APIs with OpenAPI specs for better AI understanding
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <strong className="text-white">Documentation:</strong> Auto-generated docs and inline comments for AI context
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <strong className="text-white">Modularity:</strong> Clear separation of concerns for focused AI assistance
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
