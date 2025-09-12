import { Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative z-10 flex items-center justify-between p-6 mt-16 border-t border-border/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-lg font-lora font-bold italic text-white">Just Plan It!</span>
      </div>

      <div className="text-center">
        <p className="text-white text-sm">Plan smarter, ship faster</p>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://github.com/puri-adityakumar/justplanit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="https://x.com/adityawaslost"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white transition-colors"
        >
          <Twitter className="h-5 w-5" />
        </a>
      </div>
    </footer>
  );
};