import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GeneratedImage } from "../types";
import { StyleOption } from "../components/StyleSelector";

// Initialize the API client
// Note: API_KEY is expected to be in the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Gemini 2.5 Flash Image model.
 */
export const generateImageWithGemini = async (
  prompt: string,
  styleOption: StyleOption,
  aspectRatio: AspectRatio
): Promise<GeneratedImage> => {
  try {
    // Construct the final prompt by appending the style description if applicable
    const finalPrompt = styleOption.value 
      ? `${prompt}, ${styleOption.value}` 
      : prompt;

    // According to guidelines, use gemini-2.5-flash-image for standard image generation tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
        // responseMimeType and responseSchema are NOT supported for this model.
      },
    });

    let imageUrl: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break; // Found the image, exit loop
        }
      }
    }

    if (!imageUrl) {
        // Fallback or error if no image data found in response
        // Sometimes the model might return text explaining why it couldn't generate the image.
        const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
        throw new Error(textPart?.text || "No image data returned from Gemini.");
    }

    return {
      id: crypto.randomUUID(),
      url: imageUrl,
      prompt: prompt, // Store user's original prompt
      styleId: styleOption.id,
      styleLabel: styleOption.label,
      aspectRatio,
      createdAt: Date.now(),
    };

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};
