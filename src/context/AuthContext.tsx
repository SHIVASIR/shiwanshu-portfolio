import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle as firebaseSignIn,
  signOutUser,
  onAuthStateChanged,
  serverTimestamp,
  handleFirestoreError,
  OperationType,
  FirebaseUser
} from '../lib/firebase';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: 'visitor' | 'recruiter' | 'developer' | 'collaborator' | 'admin';
  bio?: string;
  starredProjects?: string[];
  createdAt?: unknown;
  lastLoginAt?: unknown;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
  toggleStarProject: (projectId: string) => Promise<boolean>;
  updateRoleAndBio: (role: UserProfile['role'], bio?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signIn: async () => null,
  signOut: async () => {},
  toggleStarProject: async () => false,
  updateRoleAndBio: async () => {},
});

export const ADMIN_EMAIL = 'shiwanshusingh153@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userPath = `users/${currentUser.uid}`;

      try {
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          // Create initial user profile
          const initialData: UserProfile = {
            id: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Visitor',
            photoURL: currentUser.photoURL || '',
            role: currentUser.email === ADMIN_EMAIL ? 'admin' : 'visitor',
            bio: '',
            starredProjects: [],
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          };
          try {
            await setDoc(userDocRef, initialData);
          } catch (createErr) {
            handleFirestoreError(createErr, OperationType.CREATE, userPath);
          }
        } else {
          // Update last login
          try {
            await updateDoc(userDocRef, {
              lastLoginAt: serverTimestamp(),
              displayName: currentUser.displayName || userSnap.data()?.displayName || 'Visitor',
              photoURL: currentUser.photoURL || userSnap.data()?.photoURL || '',
            });
          } catch (updateErr) {
            handleFirestoreError(updateErr, OperationType.UPDATE, userPath);
          }
        }
      } catch (err) {
        console.error('Error fetching/syncing user document:', err);
      }

      // Realtime listener for user profile
      const unsubSnapshot = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
          setLoading(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, userPath);
          setLoading(false);
        }
      );

      return () => {
        unsubSnapshot();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  const signIn = async (): Promise<FirebaseUser | null> => {
    try {
      const signedInUser = await firebaseSignIn();
      return signedInUser;
    } catch (err: any) {
      if (err?.code !== 'auth/popup-blocked') {
        console.warn('Sign-in notice:', err?.message || err);
      }
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setProfile(null);
    } catch (err) {
      console.warn('Sign-out notice:', err);
    }
  };

  const toggleStarProject = async (projectId: string): Promise<boolean> => {
    if (!user) {
      try {
        const signedInUser = await signIn();
        if (!signedInUser) return false;
      } catch {
        return false;
      }
      return false;
    }

    const isStarred = profile?.starredProjects?.includes(projectId) ?? false;
    const userDocRef = doc(db, 'users', user.uid);
    const userPath = `users/${user.uid}`;

    try {
      await updateDoc(userDocRef, {
        lastLoginAt: serverTimestamp(),
        starredProjects: isStarred ? arrayRemove(projectId) : arrayUnion(projectId),
      });
      return !isStarred;
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, userPath);
      return isStarred;
    }
  };

  const updateRoleAndBio = async (role: UserProfile['role'], bio?: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const userPath = `users/${user.uid}`;
    try {
      await updateDoc(userDocRef, {
        lastLoginAt: serverTimestamp(),
        role: role || 'visitor',
        bio: bio || '',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, userPath);
    }
  };

  const isAdmin = Boolean(user && user.email === ADMIN_EMAIL);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signIn,
        signOut,
        toggleStarProject,
        updateRoleAndBio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
