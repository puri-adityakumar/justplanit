import { createContext } from 'react';
import { Models } from 'appwrite';

export interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    sendOTP: (email: string, phrase?: boolean) => Promise<{ userId: string; phrase?: string }>;
    verifyOTP: (userId: string, secret: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
    isOTPSent: boolean;
    isVerifying: boolean;
    securityPhrase?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
