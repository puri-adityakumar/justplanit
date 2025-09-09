import React, { useEffect, useState } from 'react';
import { Models, ID } from 'appwrite';
import { account } from '@/lib/appwrite';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

interface UserPreferences extends Models.Preferences {
    profileComplete?: boolean;
}

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
            
            return currentUser;
        } finally {
            setIsVerifying(false);
        }
    };

    const updateUserName = async (name: string) => {
        // Update the user's name
        const updatedUser = await account.updateName(name);
        
        // Set profile as complete in preferences
        try {
            await account.updatePrefs({ profileComplete: true });
        } catch (error) {
            console.warn('Failed to update preferences:', error);
        }
        
        // Get the updated user with new preferences
        const finalUser = await account.get();
        setUser(finalUser);
        return finalUser;
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
        updateUserName,
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
