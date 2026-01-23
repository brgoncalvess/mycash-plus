import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);
        // Mock Login Delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock User Data based on email (or just generic)
        const mockUser: User = {
            id: '1',
            name: 'Ana Silva', // Matching the Figma mock name
            email: email,
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
            role: 'Admin'
        };

        setUser(mockUser);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
        // Clear potential other data if needed, but keeping finance data for demo persistence is fine
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
