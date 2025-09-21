const API_URL = '/api/ai';

export const detectLanguage = async (text, setProfileData, setIsProcessing) => {
  if (!text) return;

  setIsProcessing(true);
  try {
    const response = await fetch(`${API_URL}/detect-language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setProfileData(prev => ({
      ...prev,
      detectedLanguage: data.language
    }));
  } catch (error) {
    console.error('Language detection failed:', error);
  }
  setIsProcessing(false);
};

export const enhanceWithGemini = async (description, setProfileData, setIsProcessing) => {
  if (!description) return;

  setIsProcessing(true);
  try {
    const response = await fetch(`${API_URL}/enhance-with-gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    const data = await response.json();
    setProfileData(prev => ({
      ...prev,
      description: data.enhancedDescription
    }));
  } catch (error) {
    console.error('Gemini enhancement failed:', error);
  }
  setIsProcessing(false);
};

export const analyzePhotoWithVision = async (imageFile, setProfileData, setIsProcessing) => {
  if (!imageFile) return;

  setIsProcessing(true);
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/analyze-photo`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setProfileData(prev => ({
      ...prev,
      photoAnalysis: data.photoAnalysis
    }));
  } catch (error) {
    console.error('Photo analysis failed:', error);
  }
  setIsProcessing(false);
};