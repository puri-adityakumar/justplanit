import { useState, useEffect } from 'react';
import { Models } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface OTPInputProps {
    userId: string;
    email: string;
    onBack: () => void;
    onSuccess: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ userId, email, onBack, onSuccess }) => {
    const [code, setCode] = useState('');
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const { verifyOTP, sendOTP, isVerifying, securityPhrase } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleVerify = async () => {
        if (code.length !== 6) return;

        try {
            await verifyOTP(userId, code);
            
            // Always redirect to dashboard - name collection will be handled there
            onSuccess();
            toast({
                title: "Welcome! 🎉",
                description: "You've successfully signed in.",
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Invalid code. Please try again.";
            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive",
            });
            setCode('');
        }
    };

    const handleResend = async () => {
        try {
            await sendOTP(email, true);
            setCanResend(false);
            setCountdown(60);
            toast({
                title: "Code resent!",
                description: "A new verification code has been sent to your email.",
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to resend code.";
            toast({
                title: "Failed to resend",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    // Auto-submit when 6 digits are entered
    useEffect(() => {
        if (code.length === 6) {
            const verifyCode = async () => {
                try {
                    await verifyOTP(userId, code);
                    
                    // Always redirect to dashboard - name collection will be handled there
                    onSuccess();
                    toast({
                        title: "Welcome! 🎉",
                        description: "You've successfully signed in.",
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Invalid code. Please try again.";
                    toast({
                        title: "Verification failed",
                        description: errorMessage,
                        variant: "destructive",
                    });
                    setCode('');
                }
            };
            verifyCode();
        }
    }, [code, userId, verifyOTP, onSuccess, toast]);

    return (
        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 w-full max-w-md">
            <div className="text-center mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="absolute left-4 top-4 text-foreground/60 hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Enter verification code</h2>
                <p className="text-foreground/70 mb-4">
                    We sent a 6-digit code to<br />
                    <span className="text-primary font-medium">{email}</span>
                </p>
                
                {securityPhrase && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                        <p className="text-xs text-foreground/60 mb-1">Security Phrase:</p>
                        <p className="text-primary font-medium text-sm">{securityPhrase}</p>
                        <p className="text-xs text-foreground/60 mt-1">
                            This phrase should match the one in your email
                        </p>
                    </div>
                )}
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-center">
                    <InputOTP
                        value={code}
                        onChange={(value) => setCode(value)}
                        maxLength={6}
                        disabled={isVerifying}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                
                <Button
                    onClick={handleVerify}
                    className="w-full"
                    disabled={code.length !== 6 || isVerifying}
                >
                    {isVerifying ? 'Verifying...' : 'Verify code'}
                </Button>
                
                <div className="text-center">
                    <p className="text-foreground/60 text-sm mb-2">
                        Didn't receive the code?
                    </p>
                    {canResend ? (
                        <Button
                            variant="link"
                            onClick={handleResend}
                            className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                        >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Resend code
                        </Button>
                    ) : (
                        <p className="text-foreground/40 text-sm">
                            Resend available in {countdown}s
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
};
