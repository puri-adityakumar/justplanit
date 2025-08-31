
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about-us';

  return (
    <nav className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-2xl font-lora font-bold italic text-foreground hover:text-primary transition-colors">
          Just Plan It!
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {isAboutPage ? (
          <>
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors font-medium">How It Works</a>
            <a href="#contact" className="text-foreground/70 hover:text-foreground transition-colors font-medium">Contact</a>
          </>
        ) : (
          <>
            <Link to="/about-us#features" className="text-foreground/70 hover:text-foreground transition-colors font-medium">Features</Link>
            <Link to="/about-us#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors font-medium">How It Works</Link>
            <Link to="/about-us" className="text-foreground/70 hover:text-foreground transition-colors font-medium">About Us</Link>
          </>
        )}
      </div>
    </nav>
  );
};