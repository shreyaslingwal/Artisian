// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // // Debug: Check if API key is loaded
// // console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
// // console.log("API Key first 10 chars:", process.env.GEMINI_API_KEY?.substring(0, 10));

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is not set in the .env file.");
// }

// // Initialize the Gemini AI model
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const enhanceWithGemini = async (text) => {
//   console.log('Calling Gemini API to enhance description...');
//   console.log('Input text:', text);
  
//   try {
//     // Try different model names - use the most recent one
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-1.5-flash" // Changed from "gemini-pro"
//     });
    
//        const prompt = `
// You are a professional product description writer for an e-commerce platform. 
// Rewrite the following product description in a clear, concise, and natural style. 
// Make it engaging and customer-focused, but avoid markdown, headings, bold text, bullet points, or lists. 
// Return only the rewritten description as plain text.

// Original description: "${text}"

// Enhanced description:
// `;

//     console.log('Sending request to Gemini...');
//     const result = await model.generateContent(prompt);
    
//     console.log('Received response from Gemini');
//     const response = await result.response;
//     const enhancedText = response.text();
    
//     console.log('Successfully enhanced description with Gemini.');
//     console.log('Enhanced text preview:', enhancedText.substring(0, 100) + '...');
    
//     return enhancedText;
//   } catch (error) {
//     console.error("Detailed Gemini error:", {
//       message: error.message,
//       status: error.status,
//       statusText: error.statusText,
//       stack: error.stack
//     });
    
//     // Try with alternative model name if the first one fails
//     if (error.status === 404) {
//       console.log('Trying alternative model name...');
//       try {
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//         const result = await model.generateContent(`Enhance this product description: "${text}"`);
//         const response = await result.response;
//         return response.text();
//       } catch (altError) {
//         console.error("Alternative model also failed:", altError);
//       }
//     }
    
//     throw new Error("Failed to enhance description with Gemini AI.");
//   }
// };

// module.exports = { enhanceWithGemini };



const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the .env file.");
}

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const enhanceWithGemini = async (text, type = 'product') => {
  console.log(`Calling Gemini API to enhance ${type} description...`);
  console.log('Input text:', text);
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });
    
    // Different prompts based on type
    let prompt;
    
    if (type === 'profile') {
      prompt = `
You are a professional profile writer helping people create compelling personal descriptions. 
Rewrite the following profile description to be more engaging, professional, and authentic. 
Make it sound natural and personable while highlighting the person's strengths and uniqueness. 
Keep it concise and avoid overly promotional language. 
Do not use markdown, headings, bold text, bullet points, or lists. 
Return only the rewritten profile description as plain text.

Original profile description: "${text}"

Enhanced profile description:
`;
    } else {
      // Default product description prompt
      prompt = `
You are a professional product description writer for an e-commerce platform. 
Rewrite the following product description in a clear, concise, and natural style. 
Make it engaging and customer-focused, but avoid markdown, headings, bold text, bullet points, or lists. 
Return only the rewritten description as plain text.

Original description: "${text}"

Enhanced description:
`;
    }

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    
    console.log('Received response from Gemini');
    const response = await result.response;
    const enhancedText = response.text();
    
    console.log(`Successfully enhanced ${type} description with Gemini.`);
    console.log('Enhanced text preview:', enhancedText.substring(0, 100) + '...');
    
    return enhancedText;
  } catch (error) {
    console.error("Detailed Gemini error:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      stack: error.stack
    });
    
    // Try with alternative model name if the first one fails
    if (error.status === 404) {
      console.log('Trying alternative model name...');
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptText = type === 'profile' 
          ? `Enhance this profile description to be more professional and engaging: "${text}"`
          : `Enhance this product description: "${text}"`;
        const result = await model.generateContent(promptText);
        const response = await result.response;
        return response.text();
      } catch (altError) {
        console.error("Alternative model also failed:", altError);
      }
    }
    
    throw new Error(`Failed to enhance ${type} description with Gemini AI.`);
  }
};

// Specific functions for different types
const enhanceProductDescription = async (text) => {
  return enhanceWithGemini(text, 'product');
};

const enhanceProfileDescription = async (text) => {
  return enhanceWithGemini(text, 'profile');
};

module.exports = { 
  enhanceWithGemini, 
  enhanceProductDescription, 
  enhanceProfileDescription 
};