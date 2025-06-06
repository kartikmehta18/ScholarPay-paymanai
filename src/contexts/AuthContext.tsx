
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client';
// import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// export type UserRole = 'student' | 'government';

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: UserRole;
//   studentId?: string;
//   department?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string, role: UserRole) => Promise<boolean>;
//   register: (userData: RegisterData) => Promise<boolean>;
//   logout: () => void;
//   isLoading: boolean;
//   accessToken: string | null;
// }

// interface RegisterData {
//   email: string;
//   password: string;
//   name: string;
//   role: UserRole;
//   studentId?: string;
//   department?: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [initialized, setInitialized] = useState(false);

//   // Optimized user profile fetching with token verification
//   const fetchUserProfile = async (supabaseUser: SupabaseUser, userSession: Session): Promise<User | null> => {
//     try {
//       // Store and verify access token from session
//       if (userSession.access_token) {
//         setAccessToken(userSession.access_token);
//         console.log('Access token verified from Supabase session:', {
//           token: userSession.access_token.substring(0, 20) + '...',
//           expires_at: userSession.expires_at,
//           user_id: supabaseUser.id,
//           email: supabaseUser.email
//         });
//       }
      
//       const { data: profile, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', supabaseUser.id)
//         .single();

//       if (error || !profile) {
//         console.error('Error fetching user profile:', error);
//         return null;
//       }

//       const userProfile: User = {
//         id: supabaseUser.id,
//         email: profile.email,
//         name: profile.name,
//         role: profile.role as UserRole,
//         studentId: profile.student_id || undefined,
//         department: profile.department || undefined
//       };

//       console.log('User profile loaded successfully:', userProfile.name);
//       return userProfile;
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     if (initialized) return;

//     const initializeAuth = async () => {
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) {
//           console.error('Session error:', error);
//           setIsLoading(false);
//           setInitialized(true);
//           return;
//         }

//         setSession(session);
        
//         if (session?.user) {
//           const userProfile = await fetchUserProfile(session.user, session);
//           setUser(userProfile);
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//       } finally {
//         setIsLoading(false);
//         setInitialized(true);
//       }
//     };

//     // Set up auth state listener with optimized logging
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         console.log(`Auth state changed: ${event}`);
//         setSession(session);
        
//         if (session?.user) {
//           const userProfile = await fetchUserProfile(session.user, session);
//           setUser(userProfile);
//         } else {
//           setUser(null);
//           setAccessToken(null);
//         }
        
//         if (initialized) {
//           setIsLoading(false);
//         }
//       }
//     );

//     initializeAuth();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [initialized]);

//   const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
//     setIsLoading(true);
//     try {
//       console.log('Attempting login for:', email);
      
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         console.error('Login error:', error);
//         return false;
//       }

//       if (data.user && data.session) {
//         const userProfile = await fetchUserProfile(data.user, data.session);
//         if (userProfile) {
//           setUser(userProfile);
//           console.log('Login successful for:', userProfile.name);
//           return true;
//         }
//       }

//       return false;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (userData: RegisterData): Promise<boolean> => {
//     setIsLoading(true);
//     try {
//       console.log('Attempting registration for:', userData.email);
      
//       const { data, error } = await supabase.auth.signUp({
//         email: userData.email,
//         password: userData.password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/`,
//           data: {
//             name: userData.name,
//             role: userData.role,
//             student_id: userData.studentId,
//             department: userData.department
//           }
//         }
//       });

//       if (error) {
//         console.error('Registration error:', error);
//         return false;
//       }

//       if (data.user) {
//         console.log('User registered successfully. Please check your email for verification.');
//         return true;
//       }

//       return false;
//     } catch (error) {
//       console.error('Registration failed:', error);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       setSession(null);
//       console.log('Logout successful');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, isLoading, accessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
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
  const [isLoading, setIsLoading] = useState(true);  // Initially set to true, loader will appear until initialization is complete
  const [initialized, setInitialized] = useState(false);  // Ensures we only initialize once

  const fetchUserProfile = async (supabaseUser: SupabaseUser, userSession: Session): Promise<User | null> => {
    try {
      if (userSession.access_token) {
        setAccessToken(userSession.access_token);
        console.log('Access token verified from Supabase session:', {
          token: userSession.access_token.substring(0, 20) + '...'
        });
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

      console.log('User profile loaded successfully:', userProfile.name);
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Clear session and token from local storage on page reload
        localStorage.removeItem('supabase.auth.token');
        setUser(null);
        setAccessToken(null);

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setIsLoading(false);
          setInitialized(true);
          return;
        }

        setSession(session);

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user, session);
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);  // Stop loading after session is checked
        setInitialized(true); // Mark as initialized
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth state changed: ${event}`);
        setSession(session);

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user, session);
          setUser(userProfile);
        } else {
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem('supabase.auth.token'); // Clear token from localStorage
        }

        setIsLoading(false);  // Stop loading after state change is processed
      }
    );

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);  // Stop loading after login attempt
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);  // Stop loading after registration attempt
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setAccessToken(null);
      localStorage.removeItem('supabase.auth.token'); // Remove the token from localStorage
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);  // Stop loading after logout
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
