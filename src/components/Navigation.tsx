
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const isAboutPage = location.pathname === '/about-us';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
            <Link to="/about-us" className="text-foreground/70 hover:text-foreground transition-colors font-medium">About</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors font-medium">Dashboard</Link>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-foreground/80">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.name || user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};