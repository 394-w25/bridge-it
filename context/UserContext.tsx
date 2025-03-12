import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth } from '../backend/firebaseInit';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface UserContextType {
  uid: string | null;
  displayName: string | null;
  photoURL: string | null;
  setUid: (uid: string | null) => void;
  setDisplayName: (displayName: string | null) => void;
  setPhotoURL: (photoURL: string | null) => void;
  isLoading: boolean;
  signOutUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setDisplayName(user.displayName);
        setPhotoURL(user.photoURL);
      } else {
        setUid(null);
        setDisplayName(null);
        setPhotoURL(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle updating the state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      uid, 
      displayName, 
      photoURL, 
      setUid, 
      setDisplayName, 
      setPhotoURL, 
      isLoading,
      signOutUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};