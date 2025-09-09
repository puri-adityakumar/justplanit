import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface EmailInputProps {
    onOTPSent: (userId: string, email: string) => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({ onOTPSent }) => {
    const [email, setEmail] = useState('');
    const { sendOTP, isLoading } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            const result = await sendOTP(email.trim(), true);
            onOTPSent(result.userId, email.trim());
            toast({
                title: "Code sent!",
                description: "Check your email for the 6-digit verification code.",
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Please try again.";
            toast({
                title: "Failed to send code",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 w-full max-w-md">
            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Just Plan It!</h2>
                <p className="text-foreground/70">Enter your email to get started</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-center"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !email.trim()}
                >
                    {isLoading ? 'Sending code...' : 'Send verification code'}
                </Button>
            </form>
        </Card>
    );
};
