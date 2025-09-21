import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectManager = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'buyer') {
        navigate('/buyer-dashboard');
      } else if (user.role === 'seller') {
        if (user.isProfileComplete) {
          navigate('/seller-dashboard');
        } else {
          navigate('/profile-setup');
        }
      } else {
        navigate('/role-selection');
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return null;
};

export default RedirectManager;