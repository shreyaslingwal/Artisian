import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Mic, MicOff, Play, Pause, Volume2, ArrowRight, Check, Loader2, X } from 'lucide-react';
import '../../styles/components/ProductAssistantPage.css';
import PreviewPage from './PreviewPage'; // Make sure to import PreviewPage
import { enhanceDescription } from '../../services/api';
import { useSimpleSpeechRecognition } from '../../hooks/useSimpleSpeechRecognition'; // Import the actual hook

const useTextToSpeech = () => ({
  speak: (text, lang) => console.log(`Speaking: ${text} in ${lang}`),
  isSpeaking: false,
  stop: () => {}
});

// ImageUploader Component
const ImageUploader = ({ images, onImagesChange, disabled }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (id) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  return (
    <div className="image-uploader">
      <div className="upload-area">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="file-input"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-label">
          <div className="upload-icon-container">
            <Upload className="upload-icon" />
          </div>
          <span className="upload-title">Upload Product Images</span>
          <span className="upload-subtitle">Click to browse or drag and drop</span>
        </label>
      </div>

      {images.length > 0 && (
        <div className="images-grid">
          {images.map((image) => (
            <div key={image.id} className="image-preview-item">
              <img src={image.preview} alt="Upload preview" className="preview-image" />
              <button onClick={() => removeImage(image.id)} className="remove-button">
                <X className="remove-icon" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main ProductAssistantPage Component
const ProductAssistantPage = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);

  const [processedData, setProcessedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech();
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    error: speechError // Renamed to avoid conflict with general error
  } = useSimpleSpeechRecognition();

  // Update description when transcript changes
  useEffect(() => {
    if (transcript) {
      setDescription(transcript);
    }
  }, [transcript]);

  const handleImagesChange = useCallback((newImages) => {
    setImages(newImages);
  }, []);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  const handleProcessSubmit = async () => {
    if (!productName.trim() || !description.trim()) return;
    setIsProcessing(true);
    setCurrentStep('processing');
    try {
      const response = await enhanceDescription(description);
      console.log('Enhance description API response:', response);
      const enhancedDescription = response.data.enhancedDescription;

      const mockProcessedData = {
        productName,
        enhancedImages: images.map(img => ({ ...img, processed: true })),
        enhancedDescription,
        originalDescription: description,
        language: language
      };
      setProcessedData(mockProcessedData);
      setShowPreview(true); // Trigger the slide to the preview page
    } catch (error) {
      console.error('Error enhancing description:', error);
      // Handle error, e.g., show a notification to the user
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setShowPreview(false);
    setTimeout(() => {
        setCurrentStep('upload');
        setImages([]);
        setProductName('');
        setDescription('');
        setProcessedData(null);
    }, 500)
  };

  const toggleGuidanceVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const message = currentStep === 'upload' 
        ? "Please upload product images to get started."
        : "Now describe your product using text or voice input.";
      speak(message, language);
    }
  };

  return (
    <div className="product-assistant-container">
        <div className={`product-assistant-slider ${showPreview ? 'show-preview' : ''}`}>
            <React.Fragment> {/* Added React.Fragment */}
              <div className="assistant-wrapper">
                <div className="product-assistant-content">
                  {/* Floating Background Elements */}
                  <div className="orb orb-1"></div>
                  <div className="orb orb-2"></div>
                  <div className="orb orb-3"></div>
                  <div className="orb orb-4"></div>
                </div>

                {/* Header */}
                <div className="assistant-header">
                  <h1 className="assistant-title">AI Product Assistant</h1>
                  <p className="assistant-subtitle">Upload images and describe your product to get AI-enhanced results</p>
                  
                  {/* Voice Guidance Controls */}
                  <div className="voice-guidance-controls">
                    <button onClick={toggleGuidanceVoice} className={`voice-guidance-btn ${isSpeaking ? 'speaking' : ''}`}>
                      {isSpeaking ? <Pause className="voice-guidance-icon" /> : <Volume2 className="voice-guidance-icon" />}
                      <span>{isSpeaking ? 'Stop Guidance' : 'Voice Guidance'}</span>
                    </button>
                    
                    <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-selector">
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                    </select>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="progress-section">
                  <div className="progress-dots">
                    <div className={`progress-dot ${currentStep === 'upload' ? 'active' : currentStep !== 'upload' ? 'completed' : ''}`}>
                      {currentStep === 'upload' ? '1' : <Check className="progress-icon" />}
                    </div>
                    <div className={`progress-dot ${currentStep === 'description' ? 'active' : currentStep === 'processing' || currentStep === 'preview' ? 'completed' : ''}`}>
                      {currentStep === 'processing' || currentStep === 'preview' ? <Check className="progress-icon" /> : '2'}
                    </div>
                    <div className={`progress-dot ${currentStep === 'processing' || showPreview ? 'active' : ''}`}>
                      {isProcessing ? <Loader2 className="progress-icon loading" /> : '3'}
                    </div>
                  </div>
                </div>

                {/* Main Content Card */}
                <div className="main-card">
                  {/* Image Upload Section */}
                  <div className="card-section">
                    <h2 className="section-title">
                      <Upload className="section-icon" />
                      Product Images
                    </h2>
                    <ImageUploader
                      images={images}
                      onImagesChange={handleImagesChange}
                      disabled={isProcessing}
                    />
                  </div>

                  {/* Description Section */}
                  
                    <div className="card-section description-section">
                      <h2 className="section-title">
                        <Mic className="section-icon" />
                        Product Name & Description
                      </h2>
                      
                      <div className="description-content">
                        
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Enter product name..."
                          className="description-textarea"
                          disabled={isProcessing}
                        />

                        {/* Voice Recording Status */}
                        
                          <div className="voice-recording-panel">
                            <div className="voice-controls-left">
                              <button onClick={handleVoiceToggle} className={`voice-mic-btn ${isListening ? 'listening' : ''}`}>
                                {isListening ? <MicOff className="voice-mic-icon" /> : <Mic className="voice-mic-icon" />}
                              </button>
                              
                              <div className="voice-info">
                                <p className="voice-status">{isListening ? 'Listening...' : 'Voice Input'}</p>
                                <p className="voice-instruction">Click mic to start/stop</p>
                              </div>
                            </div>

                            {/* Visual Feedback for Listening */}
                            {isListening && (
                              <div className="voice-visualizer">
                                {[...Array(4)].map((_, i) => (
                                  <div key={i} className={`voice-bar voice-bar-${i + 1}`} />
                                ))}
                              </div>
                            )}

                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-selector-small">
                              <option value="en">English</option>
                              <option value="hi">Hindi</option>
                            </select>
                          </div>
                        

                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your product... (or use voice input above)"
                          className="description-textarea"
                          disabled={isProcessing}
                        />

                        <button
                          onClick={handleProcessSubmit}
                          disabled={!productName.trim() || !description.trim() || isProcessing}
                          className="enhance-button"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="enhance-button-icon loading" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Enhance Product</span>
                              <ArrowRight className="enhance-button-icon" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  

                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="processing-section">
                      <div className="processing-content">
                        <Loader2 className="processing-spinner" />
                        <h3 className="processing-title">Processing Your Product</h3>
                        <p className="processing-subtitle">AI is enhancing your images and description...</p>
                        <div className="processing-bar">
                          <div className="processing-progress" />
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              </div>
              <div className="preview-wrapper">
                  {processedData && (
                      <PreviewPage
                          data={processedData}
                          onStartOver={handleStartOver}
                          language={language}
                      />
                  )}
              </div>
            </React.Fragment>
        </div>
    </div>
  );
};

export default ProductAssistantPage;