import React, { useRef, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import '../../styles/components/ImageUploader.css';
const ImageUploader = ({ images = [], onImagesChange, disabled = false }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name,
          size: file.size
        };
        
        onImagesChange(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImagesChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const event = { target: { files } };
    handleFileSelect(event);
  }, [handleFileSelect, disabled]);

  const removeImage = useCallback((imageId) => {
    onImagesChange(prev => prev.filter(img => img.id !== imageId));
  }, [onImagesChange]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer
          transition-all hover:border-blue-400 hover:bg-blue-50
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Upload className="w-8 h-8 text-blue-500" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports: JPEG, PNG, WebP (max 10MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Uploaded Images ({images.length})
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end">
                  <div className="w-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate font-medium">{image.name}</p>
                    <p className="text-xs opacity-80">{formatFileSize(image.size)}</p>
                  </div>
                </div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  disabled={disabled}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Processing indicator */}
                {image.processed && (
                  <div className="absolute top-2 left-2 p-1 bg-green-500 text-white rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Stats */}
      {images.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            {images.length} image{images.length !== 1 ? 's' : ''} selected
          </span>
          <span className="text-sm text-gray-600">
            Total: {formatFileSize(images.reduce((total, img) => total + img.size, 0))}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;