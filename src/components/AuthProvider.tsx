import React, { useEffect, useState } from 'react';
import { Models, ID } from 'appwrite';
import { account } from '@/lib/appwrite';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [securityPhrase, setSecurityPhrase] = useState<string | undefined>(undefined);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const sendOTP = async (email: string, phrase: boolean = true) => {
        try {
            setIsLoading(true);
            const sessionToken = await account.createEmailToken(
                ID.unique(),
                email,
                phrase
            );
            
            setIsOTPSent(true);
            setSecurityPhrase(sessionToken.phrase);
            
            return {
                userId: sessionToken.userId,
                phrase: sessionToken.phrase
            };
        } catch (error) {
            setIsOTPSent(false);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const verifyOTP = async (userId: string, secret: string) => {
        try {
            setIsVerifying(true);
            await account.createSession(userId, secret);
            const currentUser = await account.get();
            setUser(currentUser);
            setIsOTPSent(false);
            setSecurityPhrase(undefined);
        } finally {
            setIsVerifying(false);
        }
    };

    const logout = async () => {
        await account.deleteSession('current');
        setUser(null);
        setIsOTPSent(false);
        setSecurityPhrase(undefined);
    };

    const value: AuthContextType = {
        user,
        sendOTP,
        verifyOTP,
        logout,
        isLoading,
        isAuthenticated: !!user,
        isOTPSent,
        isVerifying,
        securityPhrase
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
