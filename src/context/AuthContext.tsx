import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
    login: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Fetch profile extra data
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setIsLoading(false);
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, email: string) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setUser({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    avatarUrl: data.avatar_url,
                    role: data.role
                });
            } else {
                // Profile missing? Create it now (Self-healing)
                const newProfile = {
                    id: userId,
                    email: email,
                    name: email.split('@')[0],
                    role: 'Membro',
                    avatar_url: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
                };

                const { error: insertError } = await supabase
                    .from('profiles')
                    .upsert(newProfile, { onConflict: 'id' });

                if (insertError) {
                    console.error('Error creating missing profile:', insertError);
                }

                setUser({
                    id: newProfile.id,
                    name: newProfile.name,
                    email: newProfile.email,
                    avatarUrl: newProfile.avatar_url,
                    role: newProfile.role
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (signInError) setIsLoading(false);
        return { error: signInError };
    };

    const signUp = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    displayName: name,
                }
            }
        });

        if (!error && data.user) {
            // Create Profile
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                email: email,
                name: name,
                role: 'Membro',
                avatar_url: `https://ui-avatars.com/api/?name=${name}&background=random`
            });
            if (profileError) console.error('Profile creation error:', profileError);
        }

        if (error) setIsLoading(false);
        return { error };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            signUp,
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
