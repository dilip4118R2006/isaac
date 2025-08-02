import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { firebaseService } from '../services/firebaseService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

interface RegisterData {
  name: string;
  email: string;
  rollNumber: string;
  mobile: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userData = await firebaseService.getUser(firebaseUser.uid);
        if (userData) {
          setUser(userData);
          // Create login session
          await firebaseService.createLoginSession(userData);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const authenticatedUser = await firebaseService.signIn(email, password);
    if (authenticatedUser) {
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const existingUser = await firebaseService.getUserByEmail(data.email);
      if (existingUser) {
        return false;
      }

      // Create new user with Firebase Auth and Firestore
      const newUser = await firebaseService.signUp(data.email, data.password, {
        name: data.name,
        rollNo: data.rollNumber,
        mobile: data.mobile,
        role: 'student'
      });

      if (newUser) {
        // Add welcome notification
        await firebaseService.addNotification({
          id: `notif-${Date.now()}`,
          userId: newUser.id,
          title: 'Welcome to Isaac Asimov Lab! 🎉',
          message: 'Your account has been created successfully. You can now request components for your robotics projects.',
          type: 'success',
          read: false,
          createdAt: new Date().toISOString(),
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    if (user) {
      // End login session and sign out
      firebaseService.endLoginSession(user.id);
      firebaseService.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};