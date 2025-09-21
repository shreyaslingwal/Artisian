// // src/components/ProfileSetup/PhotoUpload.jsx
// import React from 'react';
// import { Camera, X, Upload } from 'lucide-react';
// import '../../styles/components/PhotoUpload.css';

// const PhotoUpload = ({ photoPreview, handlePhotoUpload, removePhoto, photoAnalysis }) => {
//   return (
//     <div className="photo-upload-area">
//       <div className="photo-container">
//         <div className={`photo-circle ${photoPreview ? 'has-photo' : ''}`}>
//           {photoPreview ? (
//             <img src={photoPreview} alt="Profile preview" />
//           ) : (
//             <div className="photo-placeholder">
//               <Camera size={32} />
//               <span style={{ marginTop: '8px', fontSize: '14px' }}>Upload Photo</span>
//             </div>
//           )}
//         </div>
//         {photoPreview && (
//           <button onClick={removePhoto} className="remove-photo">
//             <X size={12} />
//           </button>
//         )}
        
//         <label className="upload-btn-container">
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handlePhotoUpload} 
//             style={{ display: 'none' }} 
//           />
//           <div className="upload-btn">
//             <Upload size={16} />
//             {photoPreview ? 'Change Photo' : 'Upload Photo'}
//           </div>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default PhotoUpload;

// // src/components/ProfileSetup/PhotoUpload.jsx
// import React from 'react';
// import { Camera, X, Upload } from 'lucide-react';
// import '../../styles/components/PhotoUpload.css';

// const PhotoUpload = ({ photoPreview, handlePhotoUpload, removePhoto }) => {
//   return (
//     <div className="photo-upload-area">
//       <div className="photo-container">
//         <div className={`photo-circle ${photoPreview ? 'has-photo' : ''}`}>
//           {photoPreview ? (
//             <img 
//               src={photoPreview} 
//               alt="Profile preview" 
//               onError={(e) => {
//                 console.error('Failed to load profile image:', e);
//                 // Optionally handle broken images
//                 e.target.style.display = 'none';
//               }}
//             />
//           ) : (
//             <div className="photo-placeholder">
//               <Camera size={32} />
//               <span style={{ marginTop: '8px', fontSize: '14px' }}>Upload Photo</span>
//             </div>
//           )}
//         </div>
//         {photoPreview && (
//           <button onClick={removePhoto} className="remove-photo">
//             <X size={12} />
//           </button>
//         )}
        
//         <label className="upload-btn-container">
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handlePhotoUpload} 
//             style={{ display: 'none' }} 
//           />
//           <div className="upload-btn">
//             <Upload size={16} />
//             {photoPreview ? 'Change Photo' : 'Upload Photo'}
//           </div>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default PhotoUpload;




// // src/components/ProfileSetup/PhotoUpload.jsx
// import React, { useRef } from 'react';
// import { Camera, X, Upload } from 'lucide-react';
// import '../../styles/components/PhotoUpload.css';

// const PhotoUpload = ({ photoPreview, handlePhotoUpload, removePhoto }) => {
//   const fileInputRef = useRef(null);

//   const handleUploadClick = () => {
//     if (fileInputRef.current) {
//       // Clear the input value to allow re-uploading the same file
//       fileInputRef.current.value = '';
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (e) => {
//     // Call the parent's handler
//     handlePhotoUpload(e);
//     // The input value is already cleared in the parent component
//   };

//   return (
//     <div className="photo-upload-area">
//       <div className="photo-container">
//         <div className={`photo-circle ${photoPreview ? 'has-photo' : ''}`}>
//           {photoPreview ? (
//             <img 
//               src={photoPreview} 
//               alt="Profile preview" 
//               onError={(e) => {
//                 console.error('Failed to load profile image:', e);
//                 // Optionally handle broken images
//                 e.target.style.display = 'none';
//               }}
//             />
//           ) : (
//             <div className="photo-placeholder">
//               <Camera size={32} />
//               <span style={{ marginTop: '8px', fontSize: '14px' }}>Upload Photo</span>
//             </div>
//           )}
//         </div>
        
//         {photoPreview && (
//           <button 
//             onClick={removePhoto} 
//             className="remove-photo"
//             type="button"
//             title="Remove photo"
//           >
//             <X size={12} />
//           </button>
//         )}
        
//         {/* Hidden file input */}
//         <input 
//           ref={fileInputRef}
//           type="file" 
//           accept="image/*" 
//           onChange={handleFileChange}
//           style={{ display: 'none' }} 
//         />
        
//         {/* Upload button */}
//         <button
//           type="button"
//           onClick={handleUploadClick}
//           className="upload-btn-container"
//         >
//           <div className="upload-btn">
//             <Upload size={16} />
//             {photoPreview ? 'Change Photo' : 'Upload Photo'}
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PhotoUpload;




// src/components/ProfileSetup/PhotoUpload.jsx
import React, { useRef, useState } from 'react';
import { Camera, X, Upload, Image, AlertCircle } from 'lucide-react';
import '../../styles/components/PhotoUpload.css';

const PhotoUpload = ({ 
  photoPreview, 
  handlePhotoUpload, 
  removePhoto, 
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateFile = (file) => {
    if (!file) return false;

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`Please upload a valid image file (${acceptedFormats.map(f => f.split('/')[1]).join(', ')})`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return false;
    }

    setError('');
    return true;
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      console.log('No file selected.');
      return;
    }

    if (!validateFile(file)) {
      console.log('File validation failed.');
      e.target.value = '';
      return;
    }

    console.log('File validated successfully, initiating upload...');
    setLoading(true);
    setError('');

    try {
      await handlePhotoUpload(e);
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      console.error('Photo upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (!imageFile) {
      setError('Please drop an image file');
      return;
    }

    if (!validateFile(imageFile)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a mock event object for the handler
      const mockEvent = {
        target: {
          files: [imageFile]
        }
      };
      await handlePhotoUpload(mockEvent);
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      console.error('Photo upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    setError('');
    removePhoto();
  };

  return (
    <div className="photo-upload-area">
      <div className="photo-container">
        {/* Main photo circle with drag & drop */}
        <div 
          className={`photo-circle ${photoPreview ? 'has-photo' : ''} ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!photoPreview ? handleUploadClick : undefined}
        >
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Uploading...</span>
            </div>
          ) : photoPreview ? (
            <img 
              src={photoPreview} 
              alt="Profile preview" 
              onError={(e) => {
                console.error('Failed to load profile image:', e);
                setError('Failed to load image preview');
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="photo-placeholder">
              <Camera size={32} />
              <span className="upload-text">Drop photo here</span>
              <span className="upload-subtext">or click to browse</span>
            </div>
          )}
          
          {dragOver && (
            <div className="drag-overlay">
              <Image size={40} />
              <span>Drop your photo here</span>
            </div>
          )}
        </div>
        
        {/* Remove photo button */}
        {photoPreview && (
          <button 
            onClick={handleRemovePhoto} 
            className="remove-photo"
            type="button"
            title="Remove photo"
            disabled={loading}
          >
            <X size={12} />
          </button>
        )}
        
        {/* Hidden file input */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept={acceptedFormats.join(',')}
          onChange={handleFileChange}
          style={{ display: 'none' }} 
          disabled={loading}
        />
        
        {/* Upload/Change button */}
        <button
          type="button"
          onClick={handleUploadClick}
          className={`upload-btn-container ${loading ? 'disabled' : ''}`}
          disabled={loading}
        >
          <div className="upload-btn">
            <Upload size={16} />
            {loading ? 'Uploading...' : (photoPreview ? 'Change Photo' : 'Upload Photo')}
          </div>
        </button>

        {/* Error message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Help text */}
        <div className="upload-help-text">
          <span>Supported formats: JPG, PNG, WebP</span>
          <span>Max size: {Math.round(maxSize / (1024 * 1024))}MB</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;