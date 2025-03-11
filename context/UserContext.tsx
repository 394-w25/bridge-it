import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../backend/firebaseInit';

interface UserContextType {
  uid: string | null;
  displayName: string | null;
  photoURL: string | null;
  setUid: (uid: string | null) => void;
  setDisplayName: (displayName: string | null) => void;
  setPhotoURL: (photoURL: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setDisplayName(user.displayName ?? 'Anonymous');
        setPhotoURL(user.photoURL ?? null);
      } else {
        setUid(null);
        setDisplayName(null);
        setPhotoURL(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
  return (
    <UserContext.Provider value={{ uid, displayName, photoURL, setUid, setDisplayName, setPhotoURL }}>
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
}