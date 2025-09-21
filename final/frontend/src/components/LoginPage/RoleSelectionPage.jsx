
// import React from 'react';
// import { Briefcase, ShoppingCart } from 'lucide-react';
// import '../../styles/components/RoleSelectionPage.css';

// const RoleSelectionPage = ({ onSelectRole }) => {
//   const handleRoleSelect = (role) => {
//     onSelectRole(role);
//   };

//   return (
//     <div className="role-selection-container">
//       <div className="role-selection-card">
//         <h1 className="role-selection-title">Choose Your Role</h1>
//         <p className="role-selection-subtitle">
//           Select whether you want to buy or sell on ArtisanHub.
//         </p>
//         <div className="role-options">
//           <div className="role-option" onClick={() => handleRoleSelect('buyer')}>
//             <ShoppingCart size={48} />
//             <h2>Buyer</h2>
//             <p>Browse and purchase unique handmade products.</p>
//           </div>
//           <div className="role-option" onClick={() => handleRoleSelect('seller')}>
//             <Briefcase size={48} />
//             <h2>Seller</h2>
//             <p>Sell your handmade products to a wider audience.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleSelectionPage;




import React from 'react';
import { Briefcase, ShoppingCart } from 'lucide-react';
import '../../styles/components/RoleSelectionPage.css';

const RoleSelectionPage = ({ onRoleSelect }) => {
  const handleRoleSelect = async (role) => {
    console.log('Role selected:', role);
    await onRoleSelect(role);
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-card">
        <h1 className="role-selection-title">Choose Your Role</h1>
        <p className="role-selection-subtitle">
          Select whether you want to buy or sell on ArtisanHub.
        </p>
        <div className="role-options">
          <div className="role-option" onClick={() => handleRoleSelect('buyer')}>
            <ShoppingCart size={48} />
            <h2>Buyer</h2>
            <p>Browse and purchase unique handmade products.</p>
          </div>
          <div className="role-option" onClick={() => handleRoleSelect('seller')}>
            <Briefcase size={48} />
            <h2>Seller</h2>
            <p>Sell your handmade products to a wider audience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;