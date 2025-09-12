
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

      {/* Desktop auth controls */}
      <div className="hidden md:flex items-center gap-4">
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
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
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

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button aria-label="Open menu" className="p-2 rounded-md border border-border/40 text-foreground/80 hover:text-foreground hover:border-border">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gradient-to-b from-red-900/20 via-black/90 to-black/95 backdrop-blur-xl border-l border-border/40 w-80">
            <div className="flex flex-col h-full">
              {/* Header with username */}
              {isAuthenticated && (
                <div className="pt-6 pb-8 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user?.name || user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <div className="flex-1 py-6">
                <div className="space-y-2">
                  <Link
                    to="/about-us"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                  >
                    About
                  </Link>

                  {isAuthenticated && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                  )}

                  {!isAuthenticated && (
                    <Link
                      to="/auth"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>

              {/* Footer with logout */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-border/30">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-destructive/10 transition-all duration-200 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};