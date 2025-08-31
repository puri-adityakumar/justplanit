import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const AuthActions = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? (
    <Button
      variant="outline"
      size="sm"
      className="border-primary/20 text-white hover:bg-primary/5"
      onClick={async () => {
        await supabase.auth.signOut();
      }}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  ) : (
    <Button asChild variant="outline" size="sm" className="border-primary/20 text-white hover:bg-primary/5">
      <Link to="/auth">
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Link>
    </Button>
  );
};