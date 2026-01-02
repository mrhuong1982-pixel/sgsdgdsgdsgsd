
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIInsights = async (videoTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a very brief summary and 3 interesting facts about a video titled: "${videoTitle}". Focus on making it engaging for a viewer.`,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Insights currently unavailable.";
  }
};

export const getSmartSuggestions = async (searchQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the search query "${searchQuery}", suggest 5 relevant search terms that would help a user find high-quality YouTube content. Output as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
    });
    return JSON.parse(response.text) as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
