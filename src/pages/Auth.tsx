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
            // Check if there's a pending idea in sessionStorage
            const pendingIdea = sessionStorage.getItem('pendingIdea');
            if (pendingIdea) {
                sessionStorage.removeItem('pendingIdea');
                navigate(`/dashboard?idea=${encodeURIComponent(pendingIdea)}`);
            } else {
                // Redirect to the intended page or dashboard
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            }
        }
    }, [isAuthenticated, navigate, location]);

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

    const handleVerificationSuccess = () => {
        // The useEffect above will handle the redirect
    };

    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars
                bars={25}
                colors={['#ef4444', 'transparent']}
            />
            <Navigation />
            
            <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 min-h-[80vh]">
                {currentStep === 'email' ? (
                    <EmailInput onOTPSent={handleOTPSent} />
                ) : (
                    <OTPInput
                        userId={userId}
                        email={userEmail}
                        onBack={handleBackToEmail}
                        onSuccess={handleVerificationSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default Auth;
