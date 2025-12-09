import React, { useState } from 'react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiYahoo } from 'react-icons/si';
import styles from './OAuthButtons.module.css';
import { 
  signInWithGoogle, 
  signInWithMicrosoft, 
  signInWithYahoo 
} from '../../Services/authService';
import { useAuthContext } from '../../contexts/AuthContextProvider';
import { toastHandler } from '../../utils/utils';
import { ToastType, LOCAL_STORAGE_KEYS } from '../../constants/constants';
import { setIntoLocalStorage } from '../../utils/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState('');
  const { updateUserAuth } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOAuthSignIn = async (provider, signInFunction) => {
    setLoadingProvider(provider);
    
    try {
      const { user, token } = await signInFunction();
      
      // Update AuthContext with data
      updateUserAuth({ user, token });
      
      // Store this data in localStorage
      setIntoLocalStorage(LOCAL_STORAGE_KEYS.User, user);
      setIntoLocalStorage(LOCAL_STORAGE_KEYS.Token, token);
      
      // Show success toast
      toastHandler(
        ToastType.Success,
        `¡Bienvenido ${user.firstName}! 😎`
      );
      
      // Navigate to intended page or home
      navigate(location?.state?.from ?? '/');
    } catch (error) {
      console.error('OAuth Error:', error);
      toastHandler(ToastType.Error, 'Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoadingProvider('');
    }
  };

  return (
    <div className={styles.oauthContainer}>
      <div className={styles.divider}>
        <span>O continúa con</span>
      </div>
      
      <div className={styles.oauthButtons}>
        <button
          type="button"
          className={`${styles.oauthBtn} ${styles.googleBtn}`}
          onClick={() => handleOAuthSignIn('google', signInWithGoogle)}
          disabled={!!loadingProvider}
        >
          {loadingProvider === 'google' ? (
            <span className="loader-2"></span>
          ) : (
            <>
              <FaGoogle />
              <span>Google</span>
            </>
          )}
        </button>

        <button
          type="button"
          className={`${styles.oauthBtn} ${styles.microsoftBtn}`}
          onClick={() => handleOAuthSignIn('microsoft', signInWithMicrosoft)}
          disabled={!!loadingProvider}
        >
          {loadingProvider === 'microsoft' ? (
            <span className="loader-2"></span>
          ) : (
            <>
              <FaMicrosoft />
              <span>Microsoft</span>
            </>
          )}
        </button>

        <button
          type="button"
          className={`${styles.oauthBtn} ${styles.yahooBtn}`}
          onClick={() => handleOAuthSignIn('yahoo', signInWithYahoo)}
          disabled={!!loadingProvider}
        >
          {loadingProvider === 'yahoo' ? (
            <span className="loader-2"></span>
          ) : (
            <>
              <SiYahoo />
              <span>Yahoo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;