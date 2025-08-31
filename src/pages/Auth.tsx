import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientBars } from "@/components/ui/bg-bars";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign in • Just Plan It!";
    // Set dark mode for consistency
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !username)) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      let error;

      if (isSignUp) {
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: username.trim(),
              display_name: username.trim()
            }
          }
        });
        error = result.error;

        if (!error) {
          toast.success("Check your email to confirm your account!");
        }
      } else {
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = result.error;

        if (!error) {
          toast.success("Successfully signed in!");
        }
      }

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <GradientBars bars={25} colors={['#ef4444', 'transparent']} />

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-lora font-bold italic text-foreground">Just Plan It!</span>
        </div>

        <Link to="/" className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </nav>

      {/* Auth Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-instrument font-bold text-foreground mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {isSignUp ? "Get Started" : "Welcome Back"}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-xl mx-auto font-body leading-relaxed">
            {isSignUp
              ? "Create your account to start organizing your perfect day"
              : "Sign in to save your plans, sync across devices, and unlock personalized day planning."
            }
          </p>
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md p-8 bg-background/10 backdrop-blur-md border-border/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>
            <p className="text-muted-foreground">
              Access your personalized planning experience
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/20 border-border/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  className="bg-background/20 border-border/30 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/20 border-border/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              onClick={handleAuth}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  {isSignUp ? <UserPlus className="h-5 w-5 mr-3" /> : <LogIn className="h-5 w-5 mr-3" />}
                  {isSignUp ? "Create Account" : "Sign In"}
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white hover:underline text-sm"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            By continuing, you agree to our{" "}
            <a href="#" className="text-white hover:underline">terms of service</a>
            {" "}and{" "}
            <a href="#" className="text-white hover:underline">privacy policy</a>.
          </p>
        </Card>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-center">
          {[{
            title: "Smart Planning",
            description: "AI-powered day optimization with routes and timing"
          }, {
            title: "Sync Everywhere",
            description: "Access your plans on any device, anytime"
          }, {
            title: "Personal Insights",
            description: "Horoscope advice and wellness breaks included"
          }].map((feature, index) => (
            <div key={index} className="rounded-lg border border-border/30 bg-background/10 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Auth;