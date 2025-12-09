import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getFromLocalStorage, setIntoLocalStorage } from '../utils/utils';
import { LOCAL_STORAGE_KEYS } from '../constants/constants';

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    getFromLocalStorage(LOCAL_STORAGE_KEYS.User)
  );
  const [token, setToken] = useState(
    getFromLocalStorage(LOCAL_STORAGE_KEYS.Token)
  );

  const updateUserAuth = ({ user, token }) => {
    setUser(user);
    setToken(token);
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !user) {
        // User is signed in with Firebase but not in our context
        const token = await firebaseUser.getIdToken();
        const userData = {
          _id: firebaseUser.uid,
          firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerData[0]?.providerId || 'firebase'
        };
        
        updateUserAuth({ user: userData, token });
        setIntoLocalStorage(LOCAL_STORAGE_KEYS.User, userData);
        setIntoLocalStorage(LOCAL_STORAGE_KEYS.Token, token);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user) {
      setUser((prev) => ({ ...prev, cart: [], wishlist: [] }));

      setIntoLocalStorage(LOCAL_STORAGE_KEYS.User, {
        ...user,
        cart: [],
        wishlist: [],
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, updateUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
