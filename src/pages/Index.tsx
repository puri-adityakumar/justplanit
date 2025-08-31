import { useEffect } from "react";
import { GradientBars } from "@/components/ui/bg-bars";
import { Footer } from "@/components/ui/footer";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";

const Index = () => {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleSendMessage = (message: string, files?: File[]) => {
    // TODO: Implement AI chat functionality
    console.log("Sending message:", message);
    console.log("Files:", files);
  };

  return (
    <div className="min-h-screen bg-black relative">
      <GradientBars 
        bars={25}
        colors={[
          '#ef4444',
          'transparent'
        ]}
      />
      <Navigation />
      <HeroSection onSendMessage={handleSendMessage} />
      <Footer />
    </div>
  );
};

export default Index;
