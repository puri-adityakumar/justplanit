import { AuthActions } from "@/components/AuthActions";

export const Navigation = () => {
  return (
    <nav className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-lora font-bold italic text-foreground">Just Plan It!</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors font-medium">Features</a>
        <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors font-medium">How It Works</a>
        <button 
          onClick={() => {
            const chatId = crypto.randomUUID();
            window.location.href = `/chat/${chatId}`;
          }}
          className="text-foreground/70 hover:text-foreground transition-colors font-medium"
        >
          Start Chat
        </button>
        <AuthActions />
      </div>
    </nav>
  );
};