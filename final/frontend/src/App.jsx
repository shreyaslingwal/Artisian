import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RoleSelectionPage from './components/LoginPage/RoleSelectionPage';
import ProfileSetup from './components/ProfileSetup/ProfileSetup';
import BuyerDashboard from './components/Buyer/BuyerDashboard';
import SellerDashboard from './components/Seller/SellerDashboard';
import { getCurrentUser, logout, selectRole } from './services/authService';
import './styles/globals.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      // Clear any existing user data to force fresh login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
    };

    const timer = setTimeout(checkAuthStatus, 500);

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        setUser(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const handleRoleSelect = (role) => {
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleProfileComplete = (profileData) => {
    const updatedUser = { 
      ...user, 
      ...profileData, 
      isProfileComplete: true 
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading ArtisanHub...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          <Route
            path="/role-selection"
            element={user && !user.role ? <RoleSelectionPage onRoleSelect={handleRoleSelect} /> : <Navigate to="/" />}
          />
          <Route
            path="/profile-setup"
            element={user && user.role === 'seller' && !user.isProfileComplete ? <ProfileSetup user={user} onProfileComplete={handleProfileComplete} /> : <Navigate to="/" />}
          />
          <Route
            path="/buyer-dashboard"
            element={user && user.role === 'buyer' ? <BuyerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          <Route
            path="/seller-dashboard"
            element={user && user.role === 'seller' && user.isProfileComplete ? <SellerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              user ? (
                user.role ? (
                  user.role === 'buyer' ? (
                    <Navigate to="/buyer-dashboard" />
                  ) : user.role === 'seller' ? (
                    user.isProfileComplete ? (
                      <Navigate to="/seller-dashboard" />
                    ) : (
                      <Navigate to="/profile-setup" />
                    )
                  ) : (
                    <Navigate to="/role-selection" />
                  )
                ) : (
                  <Navigate to="/role-selection" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage/LoginPage';
// import RoleSelectionPage from './components/LoginPage/RoleSelectionPage';
// import ProfileSetup from './components/ProfileSetup/ProfileSetup';
// import BuyerDashboard from './components/Buyer/BuyerDashboard';
// import SellerDashboard from './components/Seller/SellerDashboard';
// import ProductAssistantPage from './components/ProductList/ProductAssistantPage'; // Add this import
// import { getCurrentUser, logout, selectRole } from './services/authService';
// import './styles/globals.css';

// const AppContent = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         const currentUser = getCurrentUser();
//         setUser(currentUser);
//       }
//       setIsLoading(false);
//     };

//     checkAuthStatus();

//     const handleStorageChange = (e) => {
//       if (e.key === 'user') {
//         setUser(JSON.parse(e.newValue));
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   useEffect(() => {
//     if (!isLoading) {
//       if (user) {
//         if (user.role === 'buyer') {
//           navigate('/buyer-dashboard');
//         } else if (user.role === 'seller') {
//           if (user.isProfileComplete) {
//             navigate('/seller-dashboard');
//           } else {
//             navigate('/profile-setup');
//           }
//         } else {
//           navigate('/role-selection');
//         }
//       } else {
//         navigate('/login');
//       }
//     }
//   }, [user, isLoading, navigate]);

//   const handleLogin = (userData) => {
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     logout();
//     setUser(null);
//     navigate('/login');
//   };

//   const handleRoleSelect = async (role) => {
//     try {
//       console.log('Before role selection:', user);
//       await selectRole(role);
//       const updatedUser = { ...user, role };
//       setUser(updatedUser);
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       console.log('After role selection:', updatedUser);
//     } catch (error) {
//       console.error('Error selecting role:', error);
//     }
//   };

//   const handleProfileComplete = (profileData) => {
//     const updatedUser = { 
//       ...user, 
//       ...profileData, 
//       isProfileComplete: true 
//     };
//     setUser(updatedUser);
//     localStorage.setItem('user', JSON.stringify(updatedUser));
//   };

//   if (isLoading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh',
//         flexDirection: 'column',
//         gap: '20px'
//       }}>
//         <div style={{
//           width: '50px',
//           height: '50px',
//           border: '4px solid #f3f3f3',
//           borderTop: '4px solid #3498db',
//           borderRadius: '50%',
//           animation: 'spin 1s linear infinite'
//         }}></div>
//         <p>Loading ArtisanHub...</p>
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   return (
//     <Routes>
//       <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
//       <Route path="/role-selection" element={<RoleSelectionPage onRoleSelect={handleRoleSelect} />} />
//       <Route path="/profile-setup" element={<ProfileSetup user={user} onProfileComplete={handleProfileComplete} />} />
//       <Route path="/buyer-dashboard" element={<BuyerDashboard user={user} onLogout={handleLogout} />} />
//       <Route path="/seller-dashboard" element={<SellerDashboard user={user} setUser={setUser} onLogout={handleLogout} />} />
//       <Route path="/create-product" element={<ProductAssistantPage />} />
//       <Route path="*" element={<Navigate to={user ? (user.role ? (user.role === 'buyer' ? '/buyer-dashboard' : (user.isProfileComplete ? '/seller-dashboard' : '/profile-setup')) : '/role-selection') : '/login'} />} />
//     </Routes>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <AppContent />
//     </Router>
//   );
// }

// export default App;