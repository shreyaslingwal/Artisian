// // src/components/Seller/SellerDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { User, Phone, FileText, Plus, Edit3, Camera, MapPin, Calendar, Sparkles, Loader, ArrowLeft, LogOut } from 'lucide-react';
// import '../../styles/components/SellerDashboard.css';
// import { getProfile } from '../../services/userServices';

// const SellerDashboard = ({ user, setUser, onLogout }) => {
//   const [sellerProfile, setSellerProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isHovered, setIsHovered] = useState(false);

//   // Mock stats - you can fetch these from your database too
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     rating: 0
//   });

//   // Fetch seller data from your backend or use passed data
//   useEffect(() => {
//     const fetchSellerData = async () => {
//       try {
//         setLoading(true);
        
//         if (user) {
//           const profile = await getProfile();
//           setSellerProfile(profile);
//         } else {
//           // If no user, try to get from localStorage
//           const currentUser = JSON.parse(localStorage.getItem('user'));
//           if (currentUser) {
//             if (typeof setUser === 'function') {
//               setUser(currentUser);
//             }
//             const profile = await getProfile();
//             setSellerProfile(profile);
//           } else {
//             throw new Error('User not found. Please login again.');
//           }
//         }

//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching seller data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSellerData();
//   }, [user, setUser]);

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Get full image URL
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     // If the path is already a full URL or blob URL, return as is
//     if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;
//     // Otherwise, construct the full URL with your backend base URL
//     return `http://localhost:5000${imagePath}`;
//   };

//   const handleListProduct = () => {
//     // Navigate to product creation page when you create it
//     alert('List Product functionality - Navigate to product creation page');
//     // window.location.href = '/create-product';
//   };

//   const handleEditProfile = () => {
//     // Refresh the page to go back to profile setup
//     window.location.reload();
//   };

//   const handleManageProducts = () => {
//     // Navigate to products management page
//     alert('Manage Products - View and edit existing products');
//     // window.location.href = '/manage-products';
//   };

//   const handleViewOrders = () => {
//     // Navigate to orders page
//     alert('View Orders - Check recent orders and requests');
//     // window.location.href = '/orders';
//   };

//   const handleGoBack = () => {
//     window.history.back();
//   };

//   const handleLogout = () => {
//     if (onLogout) {
//       onLogout();
//     } else {
//       // Fallback logout
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.reload();
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-content">
//           <Loader size={48} className="loading-spinner" />
//           <p>Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="error-container">
//         <div className="error-content">
//           <h2>Error Loading Dashboard</h2>
//           <p>{error}</p>
//           <button onClick={() => window.location.reload()} className="retry-button">
//             Retry
//           </button>
//           <button 
//             onClick={handleGoBack} 
//             className="retry-button"
//             style={{ marginLeft: '10px' }}
//           >
//             Back to Setup
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // If no seller profile data
//   if (!sellerProfile) {
//     return (
//       <div className="no-data-container">
//         <div className="error-content">
//           <h2>No Profile Found</h2>
//           <p>No seller profile found. Please set up your profile first.</p>
//           <button onClick={handleGoBack} className="retry-button">
//             Set Up Profile
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const profileImageUrl = getImageUrl(sellerProfile.profilePicture || sellerProfile.photoPreview);
  
//   const statsArray = [
//     { label: "Total Products", value: stats.totalProducts || 0, icon: FileText },
//     { label: "Total Orders", value: stats.totalOrders || 0, icon: Calendar },
//     { label: "Rating", value: stats.rating ? `${stats.rating}/5` : 'N/A', icon: User },
//   ];

//   return (
//     <div className="dashboard-container">
//       {/* Background Elements */}
//       <div className="background-elements">
//         <div className="floating-circle circle-1"></div>
//         <div className="floating-circle circle-2"></div>
//         <div className="floating-circle circle-3"></div>
//       </div>

//       <div className="dashboard-content">
//         {/* Header */}
//         <div className="header-section">
//           <div className="header-card">
//             <div className="header-top">
//               <div className="header-content">
//                 <h1 className="header-title">
//                   <Sparkles className="sparkle-icon" />
//                   Seller Dashboard
//                 </h1>
//                 <p className="header-subtitle">
//                   Welcome back, {sellerProfile.name || 'Seller'}! Manage your products and profile.
//                 </p>
//               </div>
//               <button className="logout-btn" onClick={handleLogout} title="Logout">
//                 <LogOut size={20} />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="main-content">
//           {/* Profile Card */}
//           <div className="profile-card">
//             <div className="profile-header">
//               <div className="profile-image-container">
//                 <div 
//                   className="profile-image"
//                   style={{
//                     backgroundImage: profileImageUrl ? `url(${profileImageUrl})` : 'none'
//                   }}
//                 >
//                   {!profileImageUrl && <User size={48} />}
//                 </div>
//                 {sellerProfile.isProfileComplete && (
//                   <div className="profile-badge">
//                     <Sparkles size={12} />
//                     Complete
//                   </div>
//                 )}
//               </div>
              
//               <div className="profile-info">
//                 <h2 className="profile-name">
//                   {sellerProfile.name || 'N/A'}
//                 </h2>
//                 <div className="profile-details">
//                   <div className="detail-item">
//                     <Phone size={16} />
//                     <span>{sellerProfile.phone || 'N/A'}</span>
//                     {sellerProfile.isPhoneVerified && (
//                       <span className="verified-badge">
//                         Verified
//                       </span>
//                     )}
//                   </div>
//                   <div className="detail-item">
//                     <Calendar size={16} />
//                     <span>Joined {formatDate(sellerProfile.createdAt)}</span>
//                   </div>
//                 </div>
//               </div>

//               <button className="edit-profile-btn" onClick={handleEditProfile}>
//                 <Edit3 size={16} />
//                 Edit Profile
//               </button>
//             </div>

//             <div className="profile-about">
//               <h3>About</h3>
//               <p>{sellerProfile.description || sellerProfile.enhancedDescription || 'No description provided'}</p>
//               <div className="profile-tags">
                
//                 {sellerProfile.detectedLanguage && (
//                   <div className="tag tag-info">
//                     Language: {sellerProfile.detectedLanguage}
//                   </div>
//                 )}
//                 {sellerProfile.aiProcessed && (
//                   <div className="tag tag-success">
//                     AI Enhanced
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="stats-grid">
//             {statsArray.map((stat, index) => (
//               <div key={index} className="stat-card">
//                 <div className="stat-icon">
//                   <stat.icon size={24} />
//                 </div>
//                 <div className="stat-content">
//                   <div className="stat-value">{stat.value}</div>
//                   <div className="stat-label">{stat.label}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Action Grid */}
//           <div className="action-grid">
//             {/* List Product Card */}
//             <div 
//               className={`action-card primary ${isHovered ? 'hovered' : ''}`}
//               onClick={handleListProduct}
//               onMouseEnter={() => setIsHovered(true)}
//               onMouseLeave={() => setIsHovered(false)}
//             >
//               <div className="action-content">
//                 <div className="action-icon">
//                   <Plus size={32} />
//                 </div>
//                 <h3>List a Product</h3>
//                 <p>Add new products to your store and start selling to customers</p>
//               </div>
//               <div className="action-arrow">→</div>
//             </div>

//             {/* Manage Products Card */}
//             <div className="action-card secondary" onClick={handleManageProducts}>
//               <div className="action-content">
//                 <div className="action-icon">
//                   <FileText size={32} />
//                 </div>
//                 <h3>Manage Products</h3>
//                 <p>View, edit, and manage your existing product listings</p>
//               </div>
//               <div className="action-arrow">→</div>
//             </div>

//             {/* View Orders Card */}
//             <div className="action-card secondary" onClick={handleViewOrders}>
//               <div className="action-content">
//                 <div className="action-icon">
//                   <Calendar size={32} />
//                 </div>
//                 <h3>View Orders</h3>
//                 <p>Check your recent orders and customer requests</p>
//               </div>
//               <div className="action-arrow">→</div>
//             </div>
//           </div>

          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerDashboard;





// src/components/Seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, FileText, Plus, Edit3, Camera, MapPin, Calendar, Sparkles, Loader, ArrowLeft, LogOut } from 'lucide-react';
import '../../styles/components/SellerDashboard.css';
import { getProfile } from '../../services/userServices';

// Import your ProductAssistantPage component
import ProductAssistantPage from '../ProductList/ProductAssistantPage';

const SellerDashboard = ({ user, setUser, onLogout }) => {
  const [sellerProfile, setSellerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showProductAssistant, setShowProductAssistant] = useState(false); // Add this state

  // Mock stats - you can fetch these from your database too
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    rating: 0
  });

  // Fetch seller data from your backend or use passed data
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        
        if (user) {
          const profile = await getProfile();
          setSellerProfile(profile);
        } else {
          // If no user, try to get from localStorage
          const currentUser = JSON.parse(localStorage.getItem('user'));
          if (currentUser) {
            if (typeof setUser === 'function') {
              setUser(currentUser);
            }
            const profile = await getProfile();
            setSellerProfile(profile);
          } else {
            throw new Error('User not found. Please login again.');
          }
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching seller data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user, setUser]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If the path is already a full URL or blob URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;
    // Otherwise, construct the full URL with your backend base URL
    return `http://localhost:5000${imagePath}`;
  };

  const handleListProduct = () => {
    // Show the ProductAssistantPage component
    setShowProductAssistant(true);
  };

  const handleBackToDashboard = () => {
    // Hide ProductAssistantPage and show dashboard
    setShowProductAssistant(false);
  };

  const handleEditProfile = () => {
    // Refresh the page to go back to profile setup
    window.location.reload();
  };

  const handleManageProducts = () => {
    // Navigate to products management page
    alert('Manage Products - View and edit existing products');
    // window.location.href = '/manage-products';
  };

  const handleViewOrders = () => {
    // Navigate to orders page
    alert('View Orders - Check recent orders and requests');
    // window.location.href = '/orders';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
  };

  // If showing ProductAssistantPage, render it instead of dashboard
  if (showProductAssistant) {
    return (
      <div>
        {/* Back button */}
        <button
          onClick={handleBackToDashboard}
          className="fixed top-4 left-4 z-50 flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg shadow-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <ProductAssistantPage />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader size={48} className="loading-spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
          <button 
            onClick={handleGoBack} 
            className="retry-button"
            style={{ marginLeft: '10px' }}
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  // If no seller profile data
  if (!sellerProfile) {
    return (
      <div className="no-data-container">
        <div className="error-content">
          <h2>No Profile Found</h2>
          <p>No seller profile found. Please set up your profile first.</p>
          <button onClick={handleGoBack} className="retry-button">
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  const profileImageUrl = getImageUrl(sellerProfile.profilePicture || sellerProfile.photoPreview);
  
  const statsArray = [
    { label: "Total Products", value: stats.totalProducts || 0, icon: FileText },
    { label: "Total Orders", value: stats.totalOrders || 0, icon: Calendar },
    { label: "Rating", value: stats.rating ? `${stats.rating}/5` : 'N/A', icon: User },
  ];

  return (
    <div className="dashboard-container">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      <div className="dashboard-content">
        {/* Header */}
        <div className="header-section">
          <div className="header-card">
            <div className="header-top">
              <div className="header-content">
                <h1 className="header-title">
                  <Sparkles className="sparkle-icon" />
                  Seller Dashboard
                </h1>
                <p className="header-subtitle">
                  Welcome back, {sellerProfile.name || 'Seller'}! Manage your products and profile.
                </p>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-image-container">
                <div 
                  className="profile-image"
                  style={{
                    backgroundImage: profileImageUrl ? `url(${profileImageUrl})` : 'none'
                  }}
                >
                  {!profileImageUrl && <User size={48} />}
                </div>
                {sellerProfile.isProfileComplete && (
                  <div className="profile-badge">
                    <Sparkles size={12} />
                    Complete
                  </div>
                )}
              </div>
              
              <div className="profile-info">
                <h2 className="profile-name">
                  {sellerProfile.name || 'N/A'}
                </h2>
                <div className="profile-details">
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{sellerProfile.phone || 'N/A'}</span>
                    {sellerProfile.isPhoneVerified && (
                      <span className="verified-badge">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Joined {formatDate(sellerProfile.createdAt)}</span>
                  </div>
                </div>
              </div>

              <button className="edit-profile-btn" onClick={handleEditProfile}>
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>

            <div className="profile-about">
              <h3>About</h3>
              <p>{sellerProfile.description || sellerProfile.enhancedDescription || 'No description provided'}</p>
              <div className="profile-tags">
                
                {sellerProfile.detectedLanguage && (
                  <div className="tag tag-info">
                    Language: {sellerProfile.detectedLanguage}
                  </div>
                )}
                {sellerProfile.aiProcessed && (
                  <div className="tag tag-success">
                    AI Enhanced
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {statsArray.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Grid */}
          <div className="action-grid">
            {/* List Product Card */}
            <div 
              className={`action-card primary ${isHovered ? 'hovered' : ''}`}
              onClick={handleListProduct}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="action-content">
                <div className="action-icon">
                  <Plus size={32} />
                </div>
                <h3>List a Product</h3>
                <p>Add new products to your store and start selling to customers</p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            {/* Manage Products Card */}
            <div className="action-card secondary" onClick={handleManageProducts}>
              <div className="action-content">
                <div className="action-icon">
                  <FileText size={32} />
                </div>
                <h3>Manage Products</h3>
                <p>View, edit, and manage your existing product listings</p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            {/* View Orders Card */}
            <div className="action-card secondary" onClick={handleViewOrders}>
              <div className="action-content">
                <div className="action-icon">
                  <Calendar size={32} />
                </div>
                <h3>View Orders</h3>
                <p>Check your recent orders and customer requests</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;