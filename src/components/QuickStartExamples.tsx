import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const QuickStartExamples = () => {
  const navigate = useNavigate();

  const examples = [
    {
      text: "AI-powered fitness app",
      description: "Personal trainer that adapts to your schedule and preferences"
    },
    {
      text: "Sustainable fashion marketplace",
      description: "Platform connecting eco-conscious consumers with sustainable brands"
    },
    {
      text: "Car-sharing for neighborhoods",
      description: "Hyperlocal car sharing service for residential communities"
    },
    {
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
            className="group p-6 rounded-xl border border-border/40 bg-card/30 backdrop-blur-xl hover:bg-card/50 hover:border-border/60 transition-all duration-300 text-left shadow-lg"
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold italic text-white group-hover:text-primary transition-colors leading-tight">
                {example.text}
              </h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {example.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};