import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const QuickStartExamples = () => {
  const navigate = useNavigate();

  const examples = [
    {
      icon: "💡",
      text: "AI-powered fitness app",
      description: "Personal trainer that adapts to your schedule and preferences"
    },
    {
      icon: "🌱",
      text: "Sustainable fashion marketplace",
      description: "Platform connecting eco-conscious consumers with sustainable brands"
    },
    {
      icon: "🚗",
      text: "Car-sharing for neighborhoods",
      description: "Hyperlocal car sharing service for residential communities"
    },
    {
      icon: "📚",
      text: "Language learning through VR",
      description: "Immersive virtual reality language education platform"
    }
  ];

  const handleExampleClick = (text: string) => {
    navigate(`/analyze?idea=${encodeURIComponent(text)}`);
  };

  return (
    <div className="mt-12 text-center">
      <p className="text-muted-foreground text-sm mb-6 font-medium">Try these startup ideas:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => handleExampleClick(example.text)}
            className="group p-4 rounded-xl border border-border/30 bg-card/20 backdrop-blur-md hover:bg-card/30 hover:border-border/50 transition-all duration-300 text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{example.icon}</span>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {example.text}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {example.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};