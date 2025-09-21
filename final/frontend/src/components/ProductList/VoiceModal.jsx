// import React, { useState, useEffect } from 'react';
// import { Mic, MicOff, X, Volume2 } from 'lucide-react';
// import { useSpeechRecognition } from '../useSpeechRecognition';
// import { useTextToSpeech } from '../useTextToSpeech';
// import '../../styles/components/Voice.css';
// const VoiceModal = ({ isOpen, onClose, onResult, language = 'en' }) => {
//   const [transcript, setTranscript] = useState('');
//   const [isComplete, setIsComplete] = useState(false);
  
//   const {
//     isListening,
//     startListening,
//     stopListening,
//     transcript: liveTranscript,
//     error
//   } = useSpeechRecognition();

//   const { speak } = useTextToSpeech();

//   // Update transcript when live transcript changes
//   useEffect(() => {
//     if (liveTranscript) {
//       setTranscript(liveTranscript);
//     }
//   }, [liveTranscript]);

//   // Voice guidance when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       const message = language === 'en' 
//         ? "Please speak your product description. Click the microphone to start recording."
//         : "कृपया अपने उत्पाद का विवरण बताएं। रिकॉर्डिंग शुरू करने के लिए माइक्रोफोन पर क्लिक करें।";
      
//       setTimeout(() => speak(message, language), 500);
//     }
//   }, [isOpen, language, speak]);

//   // Reset state when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setTranscript('');
//       setIsComplete(false);
//     }
//   }, [isOpen]);

//   const handleStartStop = () => {
//     if (isListening) {
//       stopListening();
//       setIsComplete(true);
//     } else {
//       startListening(language);
//       setIsComplete(false);
//     }
//   };

//   const handleConfirm = () => {
//     if (transcript.trim()) {
//       onResult(transcript, language);
//       onClose();
//     }
//   };

//   const handleClose = () => {
//     if (isListening) {
//       stopListening();
//     }
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-bold text-gray-800">
//             {language === 'en' ? 'Voice Input' : 'आवाज़ इनपुट'}
//           </h3>
//           <button
//             onClick={handleClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Language Indicator */}
//         <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700">
//             {language === 'en' ? 'Speaking in: English' : 'बोल रहे हैं: हिंदी'}
//           </p>
//         </div>

//         {/* Microphone Control */}
//         <div className="text-center mb-6">
//           <button
//             onClick={handleStartStop}
//             className={`
//               w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4
//               transition-all transform hover:scale-105 active:scale-95
//               ${isListening 
//                 ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
//                 : 'bg-blue-500 hover:bg-blue-600'
//               }
//               text-white shadow-lg
//             `}
//           >
//             {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
//           </button>
          
//           <p className="text-sm text-gray-600">
//             {isListening 
//               ? (language === 'en' ? 'Listening... Click to stop' : 'सुन रहा हूं... रोकने के लिए क्लिक करें')
//               : (language === 'en' ? 'Click to start recording' : 'रिकॉर्डिंग शुरू करने के लिए क्लिक करें')
//             }
//           </p>
//         </div>

//         {/* Visual Feedback */}
//         {isListening && (
//           <div className="flex justify-center mb-4">
//             <div className="flex space-x-1">
//               {[...Array(5)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="w-2 bg-blue-500 rounded animate-bounce"
//                   style={{
//                     height: `${Math.random() * 20 + 10}px`,
//                     animationDelay: `${i * 0.1}s`
//                   }}
//                 ></div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Transcript Display */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             {language === 'en' ? 'Transcript:' : 'लिखित रूप:'}
//           </label>
//           <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] max-h-[200px] overflow-y-auto">
//             {transcript ? (
//               <p className="text-gray-800 whitespace-pre-wrap">{transcript}</p>
//             ) : (
//               <p className="text-gray-400 italic">
//                 {language === 'en' 
//                   ? 'Your speech will appear here...' 
//                   : 'आपकी आवाज़ यहां दिखाई देगी...'
//                 }
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-sm text-red-600">
//               {language === 'en' ? 'Error: ' : 'त्रुटि: '}{error}
//             </p>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex space-x-3">
//           <button
//             onClick={handleClose}
//             className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             {language === 'en' ? 'Cancel' : 'रद्द करें'}
//           </button>
          
//           {transcript && (
//             <button
//               onClick={() => speak(transcript, language)}
//               className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
//             >
//               <Volume2 className="w-4 h-4" />
//               <span>{language === 'en' ? 'Play' : 'सुनें'}</span>
//             </button>
//           )}
          
//           <button
//             onClick={handleConfirm}
//             disabled={!transcript.trim()}
//             className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {language === 'en' ? 'Confirm' : 'पुष्टि करें'}
//           </button>
//         </div>

//         {/* Tips */}
//         <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-xs text-yellow-800">
//             {language === 'en' 
//               ? '💡 Tip: Speak clearly and pause between sentences for better accuracy.'
//               : '💡 सुझाव: बेहतर सटीकता के लिए स्पष्ट रूप से बोलें और वाक्यों के बीच रुकें।'
//             }
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceModal;

import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import '../../styles/components/Voice.css';

const VoiceModal = ({ isOpen, onClose, onResult, language = 'en' }) => {
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [fieldName] = useState('voiceInput'); // Virtual field name for the hook

  const { speak } = useTextToSpeech();

  // Mock handleInputChange function for the speech recognition hook
  const handleInputChange = useCallback((field, value) => {
    console.log(`Input received for ${field}:`, value);
    setTranscript(value);
    setIsComplete(true);
  }, []);

  // Mock profile data (not used in this context)
  const profileData = {};

  const {
    isListening,
    speechSupported,
    voiceEnabled,
    startListening,
    stopListening,
    setOnInputReceived,
    setOnPromptNeeded,
    currentField
  } = useSpeechRecognition(handleInputChange, profileData);

  // Convert language prop to speech recognition format
  const getSpeechLang = useCallback(() => {
    return language === 'hi' ? 'hi-IN' : 'en-US';
  }, [language]);

  // Set up callbacks for the speech recognition hook
  useEffect(() => {
    setOnInputReceived((field, transcript) => {
      console.log(`Voice input received: ${transcript}`);
      setTranscript(transcript);
      setIsComplete(true);
    });

    setOnPromptNeeded((field) => {
      console.log(`Prompt needed for field: ${field}`);
      // In modal context, we don't need to prompt again, just continue listening
    });
  }, [setOnInputReceived, setOnPromptNeeded]);

  const handleStartStop = () => {
    if (isListening) {
      stopListening();
      setIsComplete(true);
    } else {
      // Clear previous transcript when starting new recording
      setTranscript('');
      setIsComplete(false);
      startListening(fieldName);
    }
  };

  const handleConfirm = () => {
    const finalTranscript = transcript.trim();
    if (finalTranscript) {
      setShowResult(true);
      setTimeout(() => {
        if (onResult) {
          onResult(finalTranscript, language);
        }
        if (onClose) {
          onClose();
        }
        setShowResult(false);
      }, 1500);
    }
  };

  const handleClose = () => {
    if (isListening) {
      stopListening();
    }
    if (onClose) {
      onClose();
    }
  };

  const playTranscript = () => {
    const cleanTranscript = transcript.trim();
    if (cleanTranscript) {
      speak(cleanTranscript, getSpeechLang());
    }
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsComplete(false);
      setShowResult(false);
      setTranscript('');
      // Stop any ongoing listening when modal opens
      if (isListening) {
        stopListening();
      }
    }
  }, [isOpen, isListening, stopListening]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
  }, [isOpen, isListening, stopListening]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="voice-modal-container">
      <div className="modal-orbs">
        <div className="modal-orb modal-orb-1"></div>
        <div className="modal-orb modal-orb-2"></div>
        <div className="modal-orb modal-orb-3"></div>
      </div>

      <div className="modal-overlay">
        <div className="modal-card">
          <div className="modal-header">
            <h3 className="modal-title">
              {language === 'en' ? 'Voice Input' : 'आवाज़ इनपुट'}
            </h3>
            <button onClick={handleClose} className="close-button">
              <X className="close-icon" />
            </button>
          </div>

          <div className="language-indicator">
            <p className="language-text">
              {language === 'en' ? 'Speaking in: English' : 'बोल रहे हैं: हिंदी'}
            </p>
          </div>

          {!speechSupported && (
            <div className="error-section">
              <p className="error-text">
                {language === 'en' 
                  ? 'Speech recognition is not supported in this browser. Please try Chrome or Edge.' 
                  : 'इस ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।'
                }
              </p>
            </div>
          )}

          <div className="microphone-section">
            <button 
              onClick={handleStartStop} 
              className={`microphone-button ${isListening ? 'listening' : ''}`}
              disabled={!speechSupported || !voiceEnabled}
            >
              {isListening ? <MicOff className="mic-icon" /> : <Mic className="mic-icon" />}
            </button>
            
            <p className="microphone-status">
              {isListening 
                ? (language === 'en' ? 'Listening... Click to stop' : 'सुन रहा हूँ... रोकने के लिए क्लिक करें')
                : (language === 'en' ? 'Click to start recording' : 'रिकॉर्डिंग शुरू करने के लिए क्लिक करें')
              }
            </p>
          </div>

          {isListening && (
            <div className="visual-feedback">
              <div className="wave-container">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`wave-bar wave-bar-${i + 1}`} />
                ))}
              </div>
            </div>
          )}

          <div className="transcript-section">
            <label className="transcript-label">
              {language === 'en' ? 'Transcript:' : 'लिखित रूप:'}
            </label>
            <div className="transcript-container">
              {transcript ? (
                <p className="transcript-text">{transcript}</p>
              ) : (
                <p className="transcript-placeholder">
                  {language === 'en' 
                    ? 'Your speech will appear here...' 
                    : 'आपकी आवाज़ यहाँ दिखाई देगी...'
                  }
                </p>
              )}
            </div>
          </div>

          {!speechSupported && (
            <div className="error-section">
              <p className="error-text">
                {language === 'en' 
                  ? 'Speech recognition is not available'
                  : 'वॉयस रिकग्निशन उपलब्ध नहीं है'
                }
              </p>
            </div>
          )}

          <div className="action-buttons">
            <button onClick={handleClose} className="action-button cancel">
              {language === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
            
            {transcript && (
              <button onClick={playTranscript} className="action-button play">
                <Volume2 className="play-icon" />
                <span>{language === 'en' ? 'Play' : 'सुनें'}</span>
              </button>
            )}
            
            <button
              onClick={handleConfirm}
              disabled={!transcript.trim() || !speechSupported}
              className="action-button confirm"
            >
              {showResult 
                ? (language === 'en' ? 'Confirmed!' : 'पुष्टि हो गई!') 
                : (language === 'en' ? 'Confirm' : 'पुष्टि करें')
              }
            </button>
          </div>

          <div className="tips-section">
            <p className="tips-text">
              {language === 'en' 
                ? '💡 Tip: Speak clearly and pause between sentences for better accuracy.'
                : '💡 सुझाव: बेहतर सटीकता के लिए स्पष्ट रूप से बोलें और वाक्यों के बीच रुकें।'
              }
            </p>
          </div>

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <p>Debug: speechSupported={speechSupported.toString()}, voiceEnabled={voiceEnabled.toString()}</p>
              <p>Current field: {currentField || 'none'}</p>
              <p>Is listening: {isListening.toString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;