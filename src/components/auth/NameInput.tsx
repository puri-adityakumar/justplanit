import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { User, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface NameInputProps {
    onComplete: () => void;
}

export const NameInput: React.FC<NameInputProps> = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { updateUserName } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            setIsLoading(true);
            await updateUserName(name.trim());
            toast({
                title: "Welcome to Just Plan It! 🎉",
                description: `Hi ${name}! Your account is all set up.`,
            });
            onComplete();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Please try again.";
            toast({
                title: "Failed to update name",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 w-full max-w-md">
            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Almost there! 🚀</h2>
                <p className="text-foreground/70">What should we call you?</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-card/50 border-border/50 text-foreground placeholder:text-foreground/40"
                        autoFocus
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading || !name.trim()}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Setting up...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Complete Setup
                        </div>
                    )}
                </Button>
            </form>
        </Card>
    );
};
