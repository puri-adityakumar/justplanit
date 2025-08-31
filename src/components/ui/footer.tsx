import { Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative z-10 flex items-center justify-between p-6 mt-16 border-t border-border/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-lg font-lora font-bold italic text-foreground">Just Plan It!</span>
      </div>
      
      <div className="text-center">
        <p className="text-muted-foreground text-sm">Plan smarter, live better</p>
      </div>

      <div className="flex items-center gap-4">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
        <a 
          href="https://x.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Twitter className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
};