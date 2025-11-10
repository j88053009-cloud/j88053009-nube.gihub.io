
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

export const startChat = (history: ChatMessage[]) => {
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history,
  });
};

export const sendMessageStream = async (message: string) => {
  if (!chat) {
    startChat([]);
  }
  if (!chat) { // Check again after starting
    throw new Error("Chat not initialized");
  }
  return chat.sendMessageStream({ message });
};


export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Failed to generate image.");
  }
};


export const getGroundedResponse = async (prompt: string): Promise<{ text: string; sources: GroundingChunk[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{googleSearch: {}}],
        },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { text, sources: groundingChunks };
  } catch (error) {
    console.error("Search grounding error:", error);
    throw new Error("Failed to get grounded response.");
  }
};
