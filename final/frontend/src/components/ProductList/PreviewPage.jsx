// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, Download, Share2, Edit3, Volume2, Copy, Check, Sparkles, Image, FileText, Save } from 'lucide-react';
// import { useTextToSpeech } from '../../hooks/useTextToSpeech';
// import { saveProduct, uploadImages } from '../../services/api';
// import '../../styles/components/ProductPreview.css';

// const PreviewPage = ({ data, onStartOver, language = 'en' }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [copiedText, setCopiedText] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
//   const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech();

//   // Welcome message when preview loads
//   useEffect(() => {
//     const welcomeMessage = language === 'en' 
//       ? "Your product has been enhanced! Here's your preview with improved images and description."
//       : "आपका उत्पाद बेहतर बनाया गया है! यहाँ बेहतर तस्वीरों और विवरण के साथ आपका पूर्वावलोकन है।";
    
//     setTimeout(() => speak(welcomeMessage, language), 1000);
//   }, [language, speak]);

//   const handleCopyText = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedText(text);
//       setTimeout(() => setCopiedText(''), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = text;
//       document.body.appendChild(textArea);
//       textArea.select();
//       try {
//         document.execCommand('copy');
//         setCopiedText(text);
//         setTimeout(() => setCopiedText(''), 2000);
//       } catch (fallbackErr) {
//         console.error('Fallback copy failed: ', fallbackErr);
//       }
//       document.body.removeChild(textArea);
//     }
//   };

//   const handlePlayDescription = () => {
//     if (isSpeaking) {
//       stopSpeaking();
//     } else {
//       const textToSpeak = data?.enhancedDescription || data?.originalDescription || '';
//       if (textToSpeak) {
//         speak(textToSpeak, language);
//       }
//     }
//   };

//   const handleSaveProduct = async () => {
//     if (isSaving) return; // Prevent double-clicking
    
//     setIsSaving(true);
//     try {
//       // 1. First create the product to get productId
//       const productData = {
//         name: data?.productName || 'Enhanced Product',
//         description: data?.enhancedDescription || data?.originalDescription || '',
//         category: data?.category || 'General',
//         price: data?.price || 0,
//         tags: data?.tags || []
//       };

//       console.log('Creating product with data:', productData);
//       const { data: savedProduct } = await saveProduct(productData);
//       const productId = savedProduct.product._id;

//       console.log('Product created with ID:', productId);

//       // 2. Then upload images if we have any
//       if (data?.enhancedImages && data.enhancedImages.length > 0) {
//         const formData = new FormData();
//         let hasFiles = false;
        
//         data.enhancedImages.forEach((image, index) => {
//           if (image.file) {
//             formData.append('media', image.file);
//             hasFiles = true;
//             console.log(`Added file ${index + 1}:`, image.file.name);
//           }
//         });

//         // Check if we have files to upload
//         if (hasFiles) {
//           console.log('Uploading images for product:', productId);
//           const uploadResponse = await uploadImages(productId, formData);
//           console.log('Upload response:', uploadResponse);
//         }
//       }

//       const message = language === 'en'
//         ? "Product saved successfully!"
//         : "उत्पाद सफलतापूर्वक सहेजा गया!";
//       speak(message, language);
      
//     } catch (error) {
//       console.error('Error saving product:', error);
      
//       // Better error handling
//       let errorMessage = 'Unknown error occurred';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data) {
//         errorMessage = error.response.data;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       console.error('Detailed error:', errorMessage);
      
//       const message = language === 'en'
//         ? `Error saving product: ${errorMessage}. Please try again.`
//         : `उत्पाद सहेजने में त्रुटि: ${errorMessage}। कृपया पुनः प्रयास करें।`;
//       speak(message, language);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDownload = () => {
//     // Create a downloadable report
//     const reportData = {
//       productName: data?.productName || 'Enhanced Product',
//       originalDescription: data?.originalDescription || '',
//       enhancedDescription: data?.enhancedDescription || '',
//       imageCount: data?.enhancedImages?.length || 0,
//       generatedAt: new Date().toISOString()
//     };
    
//     const dataStr = JSON.stringify(reportData, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
//     const exportFileDefaultName = `product-report-${Date.now()}.json`;
    
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: data?.productName || 'Enhanced Product',
//           text: data?.enhancedDescription || 'Check out this enhanced product!',
//           url: window.location.href
//         });
//       } catch (err) {
//         if (err.name !== 'AbortError') {
//           console.error('Error sharing:', err);
//           handleCopyText(window.location.href);
//         }
//       }
//     } else {
//       // Fallback to copying URL
//       handleCopyText(window.location.href);
//     }
//   };

//   // Ensure we have data to display
//   if (!data) {
//     return (
//       <div className="preview-page-container">
//         <div className="preview-main-content">
//           <div className="tab-content">
//             <div className="section-title">
//               {language === 'en' ? 'No data available' : 'कोई डेटा उपलब्ध नहीं'}
//             </div>
//             <button onClick={onStartOver} className="footer-btn-primary">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               {language === 'en' ? 'Go Back' : 'वापस जाएं'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="preview-page-container">
//       {/* Header */}
//       <header className="preview-header">
//         <button
//           onClick={onStartOver}
//           className="start-over-btn"
//           aria-label={language === 'en' ? 'Start Over' : 'फिर से शुरू करें'}
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>{language === 'en' ? 'Start Over' : 'फिर से शुरू करें'}</span>
//         </button>
        
//         <h1 className="preview-title">
//           {language === 'en' ? 'Enhanced Product Preview' : 'बेहतर उत्पाद पूर्वावलोकन'}
//         </h1>

//         <div className="header-actions">
//           <button 
//             className="action-btn" 
//             onClick={handleDownload}
//             title={language === 'en' ? 'Download Report' : 'रिपोर्ट डाउनलोड करें'}
//             aria-label={language === 'en' ? 'Download Report' : 'रिपोर्ट डाउनलोड करें'}
//           >
//             <Download className="w-5 h-5" />
//           </button>
//           <button 
//             className="action-btn" 
//             onClick={handleShare}
//             title={language === 'en' ? 'Share' : 'साझा करें'}
//             aria-label={language === 'en' ? 'Share' : 'साझा करें'}
//           >
//             <Share2 className="w-5 h-5" />
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="preview-main-content">
//         {/* Success Badge */}
//         <div className="flex justify-center mb-8">
//           <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-full border border-green-200">
//             <Sparkles className="w-5 h-5" />
//             <span className="font-medium">
//               {language === 'en' ? 'AI Enhancement Complete!' : 'AI सुधार पूरा!'}
//             </span>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="preview-tabs" role="tablist">
//           <button
//             onClick={() => setActiveTab('overview')}
//             className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
//             role="tab"
//             aria-selected={activeTab === 'overview'}
//             aria-controls="overview-panel"
//           >
//             {language === 'en' ? 'Overview' : 'अवलोकन'}
//           </button>
//           <button
//             onClick={() => setActiveTab('images')}
//             className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
//             role="tab"
//             aria-selected={activeTab === 'images'}
//             aria-controls="images-panel"
//           >
//             {language === 'en' ? 'Images' : 'तस्वीरें'}
//           </button>
//           <button
//             onClick={() => setActiveTab('description')}
//             className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
//             role="tab"
//             aria-selected={activeTab === 'description'}
//             aria-controls="description-panel"
//           >
//             {language === 'en' ? 'Description' : 'विवरण'}
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content" role="tabpanel">
//           {/* Overview Tab */}
//           {activeTab === 'overview' && (
//             <div id="overview-panel" className="overview-tab">
//               {/* Enhanced Images */}
//               {data.enhancedImages && data.enhancedImages.length > 0 && (
//                 <div className="image-gallery-preview">
//                   <div className="section-header">
//                     <h2 className="section-title flex items-center">
//                       <Image className="w-5 h-5 mr-2" />
//                       {language === 'en' ? 'Enhanced Images' : 'बेहतर तस्वीरें'}
//                     </h2>
//                   </div>
//                   <div className="gallery-grid-small">
//                     {data.enhancedImages.slice(0, 4).map((image, index) => (
//                       <div key={image.id || index} className="gallery-item-small">
//                         <img
//                           src={image.preview || image.url}
//                           alt={`Enhanced ${index + 1}`}
//                           className="w-full h-full object-cover"
//                           loading="lazy"
//                         />
//                         <div className="ai-badge" title="AI Enhanced">
//                           <Sparkles className="w-3 h-3" />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {data.enhancedImages.length > 4 && (
//                     <p className="more-items-text">
//                       +{data.enhancedImages.length - 4} {language === 'en' ? 'more images' : 'और तस्वीरें'}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Enhanced Description */}
//               <div className="description-preview">
//                 <div className="section-header">
//                   <h2 className="section-title flex items-center">
//                     <FileText className="w-5 h-5 mr-2" />
//                     {language === 'en' ? 'Enhanced Description' : 'बेहतर विवरण'}
//                   </h2>
//                   <div className="header-actions">
//                     <button
//                       onClick={handlePlayDescription}
//                       className={`action-btn ${isSpeaking ? 'bg-red-100 text-red-600' : ''}`}
//                       title={language === 'en' ? 'Play description' : 'विवरण सुनें'}
//                       aria-label={language === 'en' ? 'Play description' : 'विवरण सुनें'}
//                     >
//                       <Volume2 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleCopyText(data.enhancedDescription || data.originalDescription)}
//                       className="action-btn"
//                       title={language === 'en' ? 'Copy description' : 'विवरण कॉपी करें'}
//                       aria-label={language === 'en' ? 'Copy description' : 'विवरण कॉपी करें'}
//                     >
//                       {copiedText === (data.enhancedDescription || data.originalDescription) ? 
//                         <Check className="w-4 h-4 text-green-600" /> : 
//                         <Copy className="w-4 h-4" />
//                       }
//                     </button>
//                   </div>
//                 </div>
//                 <div className="description-text-container enhanced">
//                   <p>{data.enhancedDescription || data.originalDescription || 
//                     (language === 'en' ? 'No description available' : 'कोई विवरण उपलब्ध नहीं')}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Images Tab */}
//           {activeTab === 'images' && (
//             <div id="images-panel" className="images-tab">
//               <h2 className="section-title">
//                 {language === 'en' ? 'All Enhanced Images' : 'सभी बेहतर तस्वीरें'}
//               </h2>
//               {data.enhancedImages && data.enhancedImages.length > 0 ? (
//                 <div className="gallery-grid-large">
//                   {data.enhancedImages.map((image, index) => (
//                     <div key={image.id || index} className="gallery-item-large">
//                       <img
//                         src={image.preview || image.url}
//                         alt={`Enhanced ${index + 1}`}
//                         className="w-full h-full object-cover"
//                         loading="lazy"
//                       />
//                       <div className="ai-badge-large">
//                         <Sparkles className="w-3 h-3" />
//                         {language === 'en' ? 'Enhanced' : 'बेहतर'}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="description-text-container">
//                   <p>{language === 'en' ? 'No images available' : 'कोई तस्वीरें उपलब्ध नहीं'}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Description Tab */}
//           {activeTab === 'description' && (
//             <div id="description-panel" className="description-tab">
//               <div className="description-comparison">
//                 {/* Enhanced Description */}
//                 <div className="description-card">
//                   <div className="section-header">
//                     <h3 className="section-title flex items-center">
//                       <Sparkles className="w-5 h-5 mr-2 text-green-500" />
//                       {language === 'en' ? 'AI Enhanced Description' : 'AI बेहतर विवरण'}
//                     </h3>
//                     <div className="header-actions">
//                       <button
//                         onClick={handlePlayDescription}
//                         className={`action-btn ${isSpeaking ? 'bg-red-100 text-red-600' : ''}`}
//                         title={language === 'en' ? 'Play description' : 'विवरण सुनें'}
//                       >
//                         <Volume2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleCopyText(data.enhancedDescription || '')}
//                         className="action-btn"
//                         title={language === 'en' ? 'Copy enhanced description' : 'बेहतर विवरण कॉपी करें'}
//                       >
//                         {copiedText === data.enhancedDescription ? 
//                           <Check className="w-4 h-4 text-green-600" /> : 
//                           <Copy className="w-4 h-4" />
//                         }
//                       </button>
//                     </div>
//                   </div>
//                   <div className="description-text-container enhanced">
//                     <p>{data.enhancedDescription || 
//                       (language === 'en' ? 'No enhanced description available' : 'कोई बेहतर विवरण उपलब्ध नहीं')}</p>
//                   </div>
//                 </div>

//                 {/* Original Description
//                 {data.originalDescription && (
//                   <div className="description-card original">
//                     <div className="section-header">
//                       <h3 className="section-title flex items-center">
//                         <Edit3 className="w-5 h-5 mr-2 text-gray-500" />
//                         {language === 'en' ? 'Original Description' : 'मूल विवरण'}
//                       </h3>
//                       <button
//                         onClick={() => handleCopyText(data.originalDescription || '')}
//                         className="action-btn"
//                         title={language === 'en' ? 'Copy original description' : 'मूल विवरण कॉपी करें'}
//                       >
//                         {copiedText === data.originalDescription ? 
//                           <Check className="w-4 h-4 text-green-600" /> : 
//                           <Copy className="w-4 h-4" />
//                         }
//                       </button>
//                     </div>
//                     <div className="description-text-container">
//                       <p>{data.originalDescription}</p>
//                     </div>
//                   </div>
//                 )} */}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="preview-footer">
//         <h3 className="footer-title">
//           {language === 'en' ? 'What would you like to do next?' : 'आप आगे क्या करना चाहते हैं?'}
//         </h3>
//         <div className="footer-actions">
//           <button
//             onClick={onStartOver}
//             className="footer-btn-secondary"
//             aria-label={language === 'en' ? 'Create New Product' : 'नया उत्पाद बनाएं'}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             {language === 'en' ? 'Create New Product' : 'नया उत्पाद बनाएं'}
//           </button>
//           <button
//             onClick={handleSaveProduct}
//             disabled={isSaving}
//             className="footer-btn-primary"
//             aria-label={language === 'en' ? 'Save Product' : 'उत्पाद सहेजें'}
//           >
//             <Save className="w-4 h-4 mr-2" />
//             {isSaving 
//               ? (language === 'en' ? 'Saving...' : 'सहेजा जा रहा है...')
//               : (language === 'en' ? 'Save Product' : 'उत्पाद सहेजें')
//             }
//           </button>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default PreviewPage;




import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, Sparkles, Image, FileText } from 'lucide-react';
import { saveProduct, uploadImages } from '../../services/api';
import '../../styles/components/ProductPreview.css';

const PreviewPage = ({ data, onStartOver, language = 'en' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProduct = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const productData = {
        name: data?.productName || 'Enhanced Product',
        description: data?.enhancedDescription || data?.originalDescription || '',
        category: data?.category || 'General',
        price: data?.price || 0,
        tags: data?.tags || []
      };
      const { data: savedProduct } = await saveProduct(productData);
      const productId = savedProduct.product._id;

      if (data?.enhancedImages && data.enhancedImages.length > 0) {
        const formData = new FormData();
        let hasFiles = false;

        data.enhancedImages.forEach((image, index) => {
          if (image.file) {
            formData.append('media', image.file);
            hasFiles = true;
          }
        });

        if (hasFiles) {
          await uploadImages(productId, formData);
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const reportData = {
      productName: data?.productName || 'Enhanced Product',
      originalDescription: data?.originalDescription || '',
      enhancedDescription: data?.enhancedDescription || '',
      imageCount: data?.enhancedImages?.length || 0,
      generatedAt: new Date().toISOString()
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `product-report-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.productName || 'Enhanced Product',
          text: data?.enhancedDescription || 'Check out this enhanced product!',
          url: window.location.href
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  if (!data) {
    return (
      <div className="preview-page-container">
        <div className="preview-main-content">
          <div className="tab-content">
            <div className="section-title">
              {language === 'en' ? 'No data available' : 'कोई डेटा उपलब्ध नहीं'}
            </div>
            <button onClick={onStartOver} className="footer-btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Go Back' : 'वापस जाएं'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-page-container">
      {/* Header */}
      <header className="preview-header">
        <button
          onClick={onStartOver}
          className="start-over-btn"
          aria-label={language === 'en' ? 'Start Over' : 'फिर से शुरू करें'}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'en' ? 'Start Over' : 'फिर से शुरू करें'}</span>
        </button>

        <h1 className="preview-title">
          {language === 'en' ? 'Enhanced Product Preview' : 'बेहतर उत्पाद पूर्वावलोकन'}
        </h1>

        <div className="header-actions">
          <button
            className="action-btn"
            onClick={handleDownload}
            title={language === 'en' ? 'Download Report' : 'रिपोर्ट डाउनलोड करें'}
            aria-label={language === 'en' ? 'Download Report' : 'रिपोर्ट डाउनलोड करें'}
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            className="action-btn"
            onClick={handleShare}
            title={language === 'en' ? 'Share' : 'साझा करें'}
            aria-label={language === 'en' ? 'Share' : 'साझा करें'}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="preview-main-content">
        {/* Success Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-full border border-green-200">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">
              {language === 'en' ? 'AI Enhancement Complete!' : 'AI सुधार पूरा!'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="preview-tabs" role="tablist">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="overview-panel"
          >
            {language === 'en' ? 'Overview' : 'अवलोकन'}
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'images'}
            aria-controls="images-panel"
          >
            {language === 'en' ? 'Images' : 'तस्वीरें'}
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === 'description'}
            aria-controls="description-panel"
          >
            {language === 'en' ? 'Description' : 'विवरण'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content" role="tabpanel">
          {/* Overview Tab (unchanged) */}
          {activeTab === 'overview' && (
            <div id="overview-panel" className="overview-tab">
              {/* Enhanced Images */}
              {data.enhancedImages && data.enhancedImages.length > 0 && (
                <div className="image-gallery-preview">
                  <div className="section-header">
                    <h2 className="section-title flex items-center">
                      <Image className="w-5 h-5 mr-2" />
                      {language === 'en' ? 'Enhanced Images' : 'बेहतर तस्वीरें'}
                    </h2>
                  </div>
                  <div className="gallery-grid-small">
                    {data.enhancedImages.slice(0, 4).map((image, index) => (
                      <div key={image.id || index} className="gallery-item-small">
                        <img
                          src={image.preview || image.url}
                          alt={`Enhanced ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="ai-badge" title="AI Enhanced">
                          <Sparkles className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Description */}
              <div className="description-preview">
                <div className="description-text-container enhanced">
                  <p>
                    {data.enhancedDescription ||
                      data.originalDescription ||
                      (language === 'en'
                        ? 'No description available'
                        : 'कोई विवरण उपलब्ध नहीं')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Images Tab (unchanged) */}
          {activeTab === 'images' && (
            <div id="images-panel" className="images-tab">
              <h2 className="section-title">
                {language === 'en' ? 'All Enhanced Images' : 'सभी बेहतर तस्वीरें'}
              </h2>
              {data.enhancedImages && data.enhancedImages.length > 0 ? (
                <div className="gallery-grid-large">
                  {data.enhancedImages.map((image, index) => (
                    <div key={image.id || index} className="gallery-item-large">
                      <img
                        src={image.preview || image.url}
                        alt={`Enhanced ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="ai-badge-large">
                        <Sparkles className="w-3 h-3" />
                        {language === 'en' ? 'Enhanced' : 'बेहतर'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="description-text-container">
                  <p>{language === 'en' ? 'No images available' : 'कोई तस्वीरें उपलब्ध नहीं'}</p>
                </div>
              )}
            </div>
          )}

          {/* Description Tab (CLEANED) */}
          {activeTab === 'description' && (
            <div id="description-panel" className="description-tab">
              <div className="description-text-container enhanced">
                <p>
                  {data?.enhancedDescription ||
                    data?.originalDescription ||
                    (language === 'en'
                      ? 'No description available'
                      : 'कोई विवरण उपलब्ध नहीं')}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PreviewPage;
