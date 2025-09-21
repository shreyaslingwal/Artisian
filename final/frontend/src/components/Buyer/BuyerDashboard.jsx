// import React from 'react';
// import { LogOut } from 'lucide-react';

// const BuyerDashboard = ({ user, onLogout }) => {
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

//   return (
//     <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//         <div>
//           <h1>Buyer Dashboard</h1>
//           <p>Welcome to your dashboard. Here you can browse products, view your orders, and manage your account.</p>
//         </div>
//         <button 
//           onClick={handleLogout}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             padding: '10px 16px',
//             backgroundColor: '#dc3545',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             fontWeight: '500'
//           }}
//           title="Logout"
//         >
//           <LogOut size={16} />
//           Logout
//         </button>
//       </div>
      
//       <div style={{ 
//         backgroundColor: '#f8f9fa', 
//         padding: '20px', 
//         borderRadius: '12px',
//         textAlign: 'center'
//       }}>
//         <h2>Coming Soon</h2>
//         <p>Your buyer dashboard features are being developed. You'll be able to:</p>
//         <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
//           <li>Browse and search products</li>
//           <li>View product details and seller profiles</li>
//           <li>Place orders and track them</li>
//           <li>Manage your account settings</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default BuyerDashboard;




import React, { useState } from 'react';
import { Search, Bell, User, Heart, ShoppingCart, Star, Filter, Grid, List, Menu, MapPin, ChevronDown } from 'lucide-react';
import '../../styles/components/BuyerDashboard.css';

const BuyerDashboard = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      title: "Samsung Galaxy S24 Ultra 5G",
      brand: "Samsung",
      originalPrice: 129999,
      salePrice: 89999,
      discount: 31,
      rating: 4.5,
      reviews: 12543,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      category: "Electronics",
      isLimitedDeal: true,
      freeDelivery: true,
      seller: "Samsung Official Store"
    },
    {
      id: 2,
      title: "Apple MacBook Air M3 13-inch",
      brand: "Apple",
      originalPrice: 134900,
      salePrice: 114900,
      discount: 15,
      rating: 4.8,
      reviews: 8967,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      category: "Electronics",
      isLimitedDeal: true,
      freeDelivery: true,
      seller: "Apple Authorized Reseller"
    },
    {
      id: 3,
      title: "Nike Air Max 270 React",
      brand: "Nike",
      originalPrice: 12995,
      salePrice: 7797,
      discount: 40,
      rating: 4.3,
      reviews: 3421,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      category: "Fashion",
      isLimitedDeal: true,
      freeDelivery: false,
      seller: "Nike Official"
    },
    {
      id: 4,
      title: "Sony WH-1000XM5 Headphones",
      brand: "Sony",
      originalPrice: 29990,
      salePrice: 19990,
      discount: 33,
      rating: 4.7,
      reviews: 5632,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      category: "Electronics",
      isLimitedDeal: true,
      freeDelivery: true,
      seller: "Sony India"
    },
    {
      id: 5,
      title: "Levi's Men's 501 Original Jeans",
      brand: "Levi's",
      originalPrice: 4499,
      salePrice: 2699,
      discount: 40,
      rating: 4.2,
      reviews: 2134,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      category: "Fashion",
      isLimitedDeal: false,
      freeDelivery: false,
      seller: "Levi's Store"
    },
    {
      id: 6,
      title: "Instant Pot Duo 7-in-1 Cooker",
      brand: "Instant Pot",
      originalPrice: 12995,
      salePrice: 8997,
      discount: 31,
      rating: 4.6,
      reviews: 7854,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
      category: "Home & Kitchen",
      isLimitedDeal: true,
      freeDelivery: true,
      seller: "Kitchen Essentials"
    },
    {
      id: 7,
      title: "Fitbit Charge 5 Fitness Tracker",
      brand: "Fitbit",
      originalPrice: 19999,
      salePrice: 14999,
      discount: 25,
      rating: 4.4,
      reviews: 4321,
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
      category: "Sports & Fitness",
      isLimitedDeal: true,
      freeDelivery: true,
      seller: "Fitbit Official"
    },
    {
      id: 8,
      title: "Amazon Echo Dot (5th Gen)",
      brand: "Amazon",
      originalPrice: 5499,
      salePrice: 3499,
      discount: 36,
      rating: 4.5,
      reviews: 15687,
      image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=400&h=400&fit=crop",
      category: "Electronics",
      isLimitedDeal: true,
      freeDelivery: true,
      seller: "Amazon"
    }
  ];

  const categories = ['all', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Fitness', 'Books', 'Beauty', 'Automotive'];

  const filteredProducts = selectedCategory === 'all' 
    ? mockProducts 
    : mockProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            {/* Logo and Menu */}
            <div className="logo-section">
              <button className="menu-button">
                <Menu className="icon" />
              </button>
              <h1 className="logo">MarketPlace</h1>
            </div>
            
            {/* Location */}
            <div className="location">
              <MapPin className="location-icon" />
              <span>Deliver to Dehra Dun 248001</span>
            </div>
          </div>
            
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <select className="category-select">
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
              </select>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search products, brands, and more..."
                  className="search-input"
                />
              </div>
              <button className="search-button">
                <Search className="search-icon" />
              </button>
            </div>
          </div>
            
          {/* User Actions */}
          <div className="user-actions">
            <button className="action-button">
              <User className="action-icon" />
              <span className="action-text">Account</span>
            </button>
            <button className="action-button">
              <Heart className="action-icon" />
              <span className="action-text">Wishlist</span>
            </button>
            <button className="action-button cart-button">
              <ShoppingCart className="action-icon" />
              <span className="action-text">Cart</span>
              <span className="cart-badge">3</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Categories */}
      <nav className="nav-categories">
        <div className="nav-content">
          <div className="categories-list">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Filters and Controls */}
        <div className="controls-section">
          <div className="filters">
            <button className="filter-button">
              <Filter className="filter-icon" />
              <span>Filters</span>
            </button>
            <select className="sort-select">
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          <div className="view-controls">
            <span className="view-label">View:</span>
            <div className="view-buttons">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid className="view-icon" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List className="view-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {/* Product Image */}
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
                {product.isLimitedDeal && (
                  <div className="discount-badge">
                    <span className="discount-text">
                      {product.discount}% off
                    </span>
                  </div>
                )}
                {product.isLimitedDeal && (
                  <div className="limited-deal-badge">
                    <span className="limited-deal-text">
                      Limited Deal
                    </span>
                  </div>
                )}
                <button className="wishlist-button">
                  <Heart className="wishlist-icon" />
                </button>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-brand">{product.brand}</div>
                <h3 className="product-title">{product.title}</h3>
                
                {/* Rating */}
                <div className="rating-container">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`} />
                    ))}
                  </div>
                  <span className="reviews-count">({product.reviews.toLocaleString()})</span>
                </div>

                {/* Pricing */}
                <div className="pricing">
                  <div className="price-row">
                    <span className="sale-price">₹{product.salePrice.toLocaleString()}</span>
                    {product.originalPrice !== product.salePrice && (
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  {product.originalPrice !== product.salePrice && (
                    <div className="savings">Save ₹{(product.originalPrice - product.salePrice).toLocaleString()}</div>
                  )}
                </div>

                {/* Delivery & Seller Info */}
                <div className="product-details">
                  {product.freeDelivery && (
                    <div className="free-delivery">FREE Delivery</div>
                  )}
                  <div className="seller-info">Sold by: {product.seller}</div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="add-to-cart-button">
                    Add to Cart
                  </button>
                  <button className="buy-now-button">
                    Buy Now
                   </button>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;



// import React, { useState } from 'react';
// import { Search, Bell, User, Heart, ShoppingCart, Star, Filter, Grid, List, Menu, MapPin, ChevronDown, ArrowLeft } from 'lucide-react';
// import '../../styles/components/BuyerDashboard.css';

// const BuyerDashboard = ({ onBackToRoleSelection }) => {
//   const [viewMode, setViewMode] = useState('grid');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   const handleBackClick = () => {
//     if (onBackToRoleSelection) {
//       onBackToRoleSelection();
//     } else {
//       // Fallback navigation
//       window.history.back();
//     }
//   };

//   // Mock product data
//   const mockProducts = [
//     {
//       id: 1,
//       title: "Samsung Galaxy S24 Ultra 5G",
//       brand: "Samsung",
//       originalPrice: 129999,
//       salePrice: 89999,
//       discount: 31,
//       rating: 4.5,
//       reviews: 12543,
//       image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
//       category: "Electronics",
//       isLimitedDeal: true,
//       freeDelivery: true,
//       seller: "Samsung Official Store"
//     },
//     {
//       id: 2,
//       title: "Apple MacBook Air M3 13-inch",
//       brand: "Apple",
//       originalPrice: 134900,
//       salePrice: 114900,
//       discount: 15,
//       rating: 4.8,
//       reviews: 8967,
//       image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
//       category: "Electronics",
//       isLimitedDeal: true,
//       freeDelivery: true,
//       seller: "Apple Authorized Reseller"
//     },
//     {
//       id: 3,
//       title: "Nike Air Max 270 React",
//       brand: "Nike",
//       originalPrice: 12995,
//       salePrice: 7797,
//       discount: 40,
//       rating: 4.3,
//       reviews: 3421,
//       image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
//       category: "Fashion",
//       isLimitedDeal: true,
//       freeDelivery: false,
//       seller: "Nike Official"
//     },
//     {
//       id: 4,
//       title: "Sony WH-1000XM5 Headphones",
//       brand: "Sony",
//       originalPrice: 29990,
//       salePrice: 19990,
//       discount: 33,
//       rating: 4.7,
//       reviews: 5632,
//       image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
//       category: "Electronics",
//       isLimitedDeal: true,
//       freeDelivery: true,
//       seller: "Sony India"
//     },
//     {
//       id: 5,
//       title: "Levi's Men's 501 Original Jeans",
//       brand: "Levi's",
//       originalPrice: 4499,
//       salePrice: 2699,
//       discount: 40,
//       rating: 4.2,
//       reviews: 2134,
//       image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
//       category: "Fashion",
//       isLimitedDeal: false,
//       freeDelivery: false,
//       seller: "Levi's Store"
//     },
//     {
//       id: 6,
//       title: "Instant Pot Duo 7-in-1 Cooker",
//       brand: "Instant Pot",
//       originalPrice: 12995,
//       salePrice: 8997,
//       discount: 31,
//       rating: 4.6,
//       reviews: 7854,
//       image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
//       category: "Home & Kitchen",
//       isLimitedDeal: true,
//       freeDelivery: true,
//       seller: "Kitchen Essentials"
//     },
//     {
//       id: 7,
//       title: "Fitbit Charge 5 Fitness Tracker",
//       brand: "Fitbit",
//       originalPrice: 19999,
//       salePrice: 14999,
//       discount: 25,
//       rating: 4.4,
//       reviews: 4321,
//       image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
//       category: "Sports & Fitness",
//       isLimitedDeal: true,
//       freeDelivery: true,
//       seller: "Fitbit Official"
//     },
//     {
//       id: 8,
//       title: "Amazon Echo Dot (5th Gen)",
//       brand: "Amazon",
//       originalPrice: 5499,
//       salePrice: 3499,
//       discount: 36,
//       rating: 4.5,
//       reviews: 15687,
//       image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=400&h=400&fit=crop",
//       category: "Electronics",
//       isLimitedDeal: true,
//       freeDelivery: true,
//       seller: "Amazon"
//     }
//   ];

//   const categories = ['all', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Fitness', 'Books', 'Beauty', 'Automotive'];

//   const filteredProducts = selectedCategory === 'all' 
//     ? mockProducts 
//     : mockProducts.filter(product => product.category === selectedCategory);

//   return (
//     <div className="dashboard-container">
//       {/* Back Button */}
//       <div className="back-button-container">
//         <button className="back-button" onClick={handleBackClick}>
//           <ArrowLeft className="back-icon" />
//           <span>Back to Role Selection</span>
//         </button>
//       </div>

//       {/* Header */}
//       <header className="header">
//         <div className="header-content">
//           <div className="header-left">
//             {/* Logo and Menu */}
//             <div className="logo-section">
//               <button className="menu-button">
//                 <Menu className="icon" />
//               </button>
//               <h1 className="logo">ArtisanHub</h1>
//             </div>
            
//             {/* Location */}
//             <div className="location">
//               <MapPin className="location-icon" />
//               <span>Deliver to Dehra Dun 248001</span>
//             </div>
//           </div>
            
//           {/* Search Bar */}
//           <div className="search-container">
//             <div className="search-bar">
//               <select className="category-select">
//                 <option value="all">All Categories</option>
//                 <option value="electronics">Electronics</option>
//                 <option value="fashion">Fashion</option>
//               </select>
//               <div className="search-input-container">
//                 <input
//                   type="text"
//                   placeholder="Search products, brands, and more..."
//                   className="search-input"
//                 />
//               </div>
//               <button className="search-button">
//                 <Search className="search-icon" />
//               </button>
//             </div>
//           </div>
            
//           {/* User Actions */}
//           <div className="user-actions">
//             <button className="action-button">
//               <User className="action-icon" />
//               <span className="action-text">Account</span>
//             </button>
//             <button className="action-button">
//               <Heart className="action-icon" />
//               <span className="action-text">Wishlist</span>
//             </button>
//             <button className="action-button cart-button">
//               <ShoppingCart className="action-icon" />
//               <span className="action-text">Cart</span>
//               <span className="cart-badge">3</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Navigation Categories */}
//       <nav className="nav-categories">
//         <div className="nav-content">
//           <div className="categories-list">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`category-button ${selectedCategory === category ? 'active' : ''}`}
//               >
//                 {category.charAt(0).toUpperCase() + category.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Filters and Controls */}
//         <div className="controls-section">
//           <div className="filters">
//             <button className="filter-button">
//               <Filter className="filter-icon" />
//               <span>Filters</span>
//             </button>
//             <select className="sort-select">
//               <option value="relevance">Sort: Relevance</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="rating">Customer Rating</option>
//             </select>
//           </div>

//           <div className="view-controls">
//             <span className="view-label">View:</span>
//             <div className="view-buttons">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
//               >
//                 <Grid className="view-icon" />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
//               >
//                 <List className="view-icon" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Products Grid */}
//         <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
//           {filteredProducts.map((product) => (
//             <div key={product.id} className="product-card">
//               {/* Product Image */}
//               <div className="product-image-container">
//                 <img
//                   src={product.image}
//                   alt={product.title}
//                   className="product-image"
//                 />
//                 {product.isLimitedDeal && (
//                   <div className="discount-badge">
//                     <span className="discount-text">
//                       {product.discount}% off
//                     </span>
//                   </div>
//                 )}
//                 {product.isLimitedDeal && (
//                   <div className="limited-deal-badge">
//                     <span className="limited-deal-text">
//                       Limited Deal
//                     </span>
//                   </div>
//                 )}
//                 <button className="wishlist-button">
//                   <Heart className="wishlist-icon" />
//                 </button>
//               </div>

//               {/* Product Info */}
//               <div className="product-info">
//                 <div className="product-brand">{product.brand}</div>
//                 <h3 className="product-title">{product.title}</h3>
                
//                 {/* Rating */}
//                 <div className="rating-container">
//                   <div className="stars">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`} />
//                     ))}
//                   </div>
//                   <span className="reviews-count">({product.reviews.toLocaleString()})</span>
//                 </div>

//                 {/* Pricing */}
//                 <div className="pricing">
//                   <div className="price-row">
//                     <span className="sale-price">₹{product.salePrice.toLocaleString()}</span>
//                     {product.originalPrice !== product.salePrice && (
//                       <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
//                     )}
//                   </div>
//                   {product.originalPrice !== product.salePrice && (
//                     <div className="savings">Save ₹{(product.originalPrice - product.salePrice).toLocaleString()}</div>
//                   )}
//                 </div>

//                 {/* Delivery & Seller Info */}
//                 <div className="product-details">
//                   {product.freeDelivery && (
//                     <div className="free-delivery">FREE Delivery</div>
//                   )}
//                   <div className="seller-info">Sold by: {product.seller}</div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="action-buttons">
//                   <button className="add-to-cart-button">
//                     Add to Cart
//                   </button>
//                   <button className="buy-now-button">
//                     Buy Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BuyerDashboard;