
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'student' | 'government';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  studentId?: string;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Cache for user profiles to avoid repeated fetches
  const [profileCache, setProfileCache] = useState<Map<string, User>>(new Map());

  const fetchUserProfile = async (supabaseUser: SupabaseUser, userSession: Session): Promise<User | null> => {
    try {
      // Check cache first
      const cachedProfile = profileCache.get(supabaseUser.id);
      if (cachedProfile) {
        console.log('Using cached user profile:', cachedProfile.name);
        return cachedProfile;
      }

      // Set access token immediately
      if (userSession.access_token) {
        setAccessToken(userSession.access_token);
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error || !profile) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      const userProfile: User = {
        id: supabaseUser.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as UserRole,
        studentId: profile.student_id || undefined,
        department: profile.department || undefined
      };

      // Cache the profile
      setProfileCache(prev => new Map(prev).set(supabaseUser.id, userProfile));
      console.log('User profile loaded and cached:', userProfile.name);
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    if (initialized) return;

    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get session immediately without delays
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Session error:', error);
          setIsLoading(false);
          setInitialized(true);
          return;
        }

        setSession(session);

        if (session?.user) {
          // Fetch profile in background, don't block UI
          fetchUserProfile(session.user, session).then(userProfile => {
            if (mounted && userProfile) {
              setUser(userProfile);
            }
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setInitialized(true);
        }
      }
    };

    // Set up auth state listener with optimized handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log(`Auth state changed: ${event}`);
        setSession(session);

        if (session?.user) {
          // Don't block on profile fetch
          fetchUserProfile(session.user, session).then(userProfile => {
            if (mounted && userProfile) {
              setUser(userProfile);
            }
          });
        } else {
          setUser(null);
          setAccessToken(null);
          setProfileCache(new Map()); // Clear cache on logout
        }

        // Always stop loading after auth state change
        setIsLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized, profileCache]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      if (data.user && data.session) {
        const userProfile = await fetchUserProfile(data.user, data.session);
        if (userProfile) {
          setUser(userProfile);
          console.log('Login successful for:', userProfile.name);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            role: userData.role,
            student_id: userData.studentId,
            department: userData.department
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      if (data.user) {
        console.log('User registered successfully. Please check your email for verification.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setAccessToken(null);
      setProfileCache(new Map()); // Clear cache
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
