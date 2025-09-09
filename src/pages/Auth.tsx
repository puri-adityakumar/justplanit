import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { GradientBars } from '@/components/ui/bg-bars';
import { Navigation } from '@/components/Navigation';
import { EmailInput } from '@/components/auth/EmailInput';
import { OTPInput } from '@/components/auth/OTPInput';

const Auth = () => {
    const [currentStep, setCurrentStep] = useState<'email' | 'otp'>('email');
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.title = "Sign In • Just Plan It!";
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            // Simple redirect logic - if already authenticated, redirect
            const pendingIdea = sessionStorage.getItem('pendingIdea');
            if (pendingIdea) {
                navigate('/dashboard', { state: { pendingIdea } });
            } else {
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, navigate, location.state]);

    const handleOTPSent = (newUserId: string, email: string) => {
        setUserId(newUserId);
        setUserEmail(email);
        setCurrentStep('otp');
    };

    const handleBackToEmail = () => {
        setCurrentStep('email');
        setUserId('');
        setUserEmail('');
    };

    const handleOTPVerified = () => {
        // User is authenticated - redirect to dashboard
        // The dashboard will handle name collection if needed
        const pendingIdea = sessionStorage.getItem('pendingIdea');
        if (pendingIdea) {
            navigate('/dashboard', { state: { pendingIdea } });
        } else {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars
                bars={25}
                colors={['#ef4444', 'transparent']}
            />
            <Navigation />
            
            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 min-h-[80vh]">
                {currentStep === 'email' && (
                    <EmailInput onOTPSent={handleOTPSent} />
                )}
                
                {currentStep === 'otp' && (
                    <OTPInput
                        userId={userId}
                        email={userEmail}
                        onBack={handleBackToEmail}
                        onSuccess={handleOTPVerified}
                    />
                )}
            </div>
        </div>
    );
};

export default Auth;
