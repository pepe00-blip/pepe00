import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  microsoftProvider, 
  yahooProvider 
} from '../../firebase/config';

// OAuth Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      user: {
        _id: result.user.uid,
        firstName: result.user.displayName?.split(' ')[0] || 'User',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email,
        photoURL: result.user.photoURL,
        provider: 'google'
      },
      token: await result.user.getIdToken()
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    return {
      user: {
        _id: result.user.uid,
        firstName: result.user.displayName?.split(' ')[0] || 'User',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email,
        photoURL: result.user.photoURL,
        provider: 'microsoft'
      },
      token: await result.user.getIdToken()
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInWithYahoo = async () => {
  try {
    const result = await signInWithPopup(auth, yahooProvider);
    return {
      user: {
        _id: result.user.uid,
        firstName: result.user.displayName?.split(' ')[0] || 'User',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email,
        photoURL: result.user.photoURL,
        provider: 'yahoo'
      },
      token: await result.user.getIdToken()
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Email/Password Authentication
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: {
        _id: result.user.uid,
        firstName: result.user.displayName?.split(' ')[0] || 'User',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email,
        photoURL: result.user.photoURL,
        provider: 'email'
      },
      token: await result.user.getIdToken()
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signUpWithEmail = async (email, password, firstName, lastName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(result.user, {
      displayName: `${firstName} ${lastName}`
    });

    return {
      user: {
        _id: result.user.uid,
        firstName,
        lastName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        provider: 'email'
      },
      token: await result.user.getIdToken()
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};