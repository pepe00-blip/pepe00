import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContextProvider';
import { signOutUser } from '../../Services/authService';
import { removeLocalStorage, toastHandler } from '../../utils/utils';
import { ToastType, LOCAL_STORAGE_KEYS } from '../../constants/constants';
import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import { useFiltersContext } from '../../contexts/FiltersContextProvider';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const {
    updateUserAuth,
    user: { firstName, lastName, email },
  } = useAuthContext();
  const {
    clearCartInContext,
    clearWishlistInContext,
    clearAddressInContext,
    timedMainPageLoader,
  } = useAllProductsContext();

  const { clearFilters } = useFiltersContext();

  const handleLogout = async () => {
    await timedMainPageLoader();
    
    // Sign out from Firebase if user is authenticated with Firebase
    try {
      await signOutUser();
    } catch (error) {
      console.log('Firebase signout error:', error);
    }
    
    updateUserAuth({ user: null, token: null });
    removeLocalStorage(LOCAL_STORAGE_KEYS.User);
    removeLocalStorage(LOCAL_STORAGE_KEYS.Token);

    clearCartInContext();
    clearWishlistInContext();
    clearFilters();
    clearAddressInContext();
    toastHandler(ToastType.Success, 'Logged out sucessfully');

    navigate('/');
  };

  return (
    <div className={styles.profile}>
      {user.photoURL && (
        <div className={styles.profileImage}>
          <img src={user.photoURL} alt="Profile" />
        </div>
      )}
      
      <p className={styles.row}>
        <span>Name:</span> {`${firstName} ${lastName}`}
      </p>

      <p className={styles.row}>
        <span>Email:</span> {email}
      </p>

      {user.provider && (
        <p className={styles.row}>
          <span>Provider:</span> {user.provider}
        </p>
      )}

      <button className='btn btn-danger' onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};

export default Profile;
