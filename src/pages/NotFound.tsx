import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black relative">
      <GradientBars bars={25} colors={['#ef4444', 'transparent']} />
      <Navigation />
      
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 max-w-md text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-foreground/70 mb-6">Oops! Page not found</p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              Return to Home
            </Button>
          </Link>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
