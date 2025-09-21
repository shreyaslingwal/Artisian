// src/hooks/useSpeechRecognition.js
import { useState, useEffect, useRef } from 'react';
import { detectLanguage, enhanceWithGemini } from '../services/aiServices';

export const useSpeechRecognition = (handleInputChange, profileData) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Voice is now always enabled when speech is supported
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [language, setLanguage] = useState('en-US');
  
  // Refs for managing timeouts and current field
  const timeoutRef = useRef(null);
  const currentFieldRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const onInputReceived = useRef(null);
  const onPromptNeeded = useRef(null); // New callback for when prompt is needed

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
      setVoiceEnabled(true); // Automatically enable voice when supported
    }
  }, []);

  // Clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(restartTimeoutRef.current);
    };
  }, []);

  const scheduleRestart = (field) => {
    // Clear any existing restart timeout
    clearTimeout(restartTimeoutRef.current);
    
    // Only schedule restart for actual input fields, not for photo/review steps
    if (field && voiceEnabled) {
      console.log(`Scheduling restart for field: ${field} in 5 seconds... (shortened for testing)`);
      restartTimeoutRef.current = setTimeout(() => {
        console.log(`5 seconds passed. Triggering prompt repeat for field: ${field}`);
        
        // Call the prompt callback if it exists
        if (onPromptNeeded.current) {
          onPromptNeeded.current(field);
        } else {
          // Fallback: just restart listening
          console.log('No prompt callback, restarting listening directly');
          if (!isListening && voiceEnabled && currentFieldRef.current === field) {
            startListening(field, true);
          }
        }
      }, 5000); // Changed to 5 seconds for easier testing
    }
  };

  const clearAllTimeouts = () => {
    clearTimeout(timeoutRef.current);
    clearTimeout(restartTimeoutRef.current);
  };

  const startListening = (field, isRestart = false) => {
    console.log('startListening called');
    if (!speechSupported) {
      if (!isRestart) alert('Speech recognition is not supported in this browser.');
      return;
    }

    // Don't start listening if no field is provided (photo/review steps)
    if (!field) {
      console.log('No field provided, skipping speech recognition start');
      return;
    }

    // If already listening, stop first
    if (isListening && recognition) {
      recognition.abort();
    }

    // Clear any existing timeouts
    clearAllTimeouts();
    
    // Store current field reference
    currentFieldRef.current = field;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();
    
    newRecognition.continuous = true;
    newRecognition.interimResults = false;
    newRecognition.lang = language;
    
    newRecognition.onstart = () => {
      setIsListening(true);
      console.log(`Started listening for field: ${field}`);
    };
    
    newRecognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log(`Speech recognized: "${transcript}" for field: ${field}`);
      
      // Clear restart timeout since we got input
      clearAllTimeouts();
      
      // Mark that we got results
      newRecognition.gotResults = true;
      
      if (field && transcript) {
        await handleInputChange(field, transcript);
        // Call the input received callback if it exists
        if (onInputReceived.current) {
          onInputReceived.current(field, transcript);
        }
      }
      
      setIsListening(false);
      currentFieldRef.current = null;
    };
    
    newRecognition.onerror = (event) => {
      console.error(`Speech recognition error: ${event.error}`);
      
      // Handle different error types
      if (event.error === 'no-speech') {
        console.log('No speech detected, scheduling restart...');
        setIsListening(false);
        // Schedule restart for no-speech error
        if (field) {
          scheduleRestart(field);
        }
        return;
      }
      
      // For other errors, clear everything
      setIsListening(false);
      currentFieldRef.current = null;
      clearAllTimeouts();
      
      if (!isRestart && event.error !== 'aborted') {
        alert('Speech recognition error: ' + event.error);
      }
    };
    
    newRecognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      // Check if we got results
      const gotResults = newRecognition.gotResults || false;
      
      if (!gotResults && currentFieldRef.current === field && voiceEnabled) {
        console.log('Recognition ended without results, scheduling restart...');
        scheduleRestart(field);
      } else {
        console.log('Recognition ended with results or was stopped manually');
        currentFieldRef.current = null;
      }
    };
    
    // Start recognition with error handling
    try {
      // Reset the results flag
      newRecognition.gotResults = false;
      setRecognition(newRecognition);
      newRecognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      clearAllTimeouts();
    }
  };

  const stopListening = () => {
    console.log('stopListening called');
    
    // Clear all timeouts first
    clearAllTimeouts();
    
    // Clear current field to prevent restart
    currentFieldRef.current = null;
    
    if (recognition) {
      try {
        recognition.abort(); // Use abort() instead of stop() for immediate termination
      } catch (error) {
        console.log('Error aborting recognition:', error);
      }
      setRecognition(null);
    }
    
    setIsListening(false);
  };

  // Method to set a callback for when input is received
  const setOnInputReceived = (callback) => {
    onInputReceived.current = callback;
  };

  // Method to set a callback for when a prompt is needed (for restarts)
  const setOnPromptNeeded = (callback) => {
    onPromptNeeded.current = callback;
  };

  // Method to manually trigger restart (useful for voice assistant flow)
  const restartListening = () => {
    if (currentFieldRef.current) {
      startListening(currentFieldRef.current, true);
    }
  };

  return {
    isListening,
    voiceEnabled,
    speechSupported,
    setVoiceEnabled, // Keeping this for compatibility
    language,
    setLanguage,
    startListening,
    stopListening,
    restartListening, // New method
    setOnInputReceived, // Method to set input callback
    setOnPromptNeeded, // Method to set prompt needed callback
    currentField: currentFieldRef.current, // Expose current field
  };
};