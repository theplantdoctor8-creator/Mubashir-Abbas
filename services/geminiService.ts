
import { GoogleGenAI, GenerateContentResponse, GroundingMetadata } from "@google/genai";
import type { MarketAnalysis, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzePlantDisease = async (imageFile: File): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: "Analyze this image of a plant leaf. Identify any diseases or pests. Provide a detailed analysis including the common name of the issue, potential causes, and suggested organic and chemical treatment options. Format the response in clear sections." },
          imagePart,
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing plant disease:", error);
    throw new Error("Failed to analyze the image. Please try again.");
  }
};

export const getMarketAnalysis = async (crop: string): Promise<MarketAnalysis> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a brief market analysis for ${crop}. Include recent price trends, outlook, and key factors affecting the market.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text;
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata as (GroundingMetadata | undefined);
        const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(chunk => 'web' in chunk) as GroundingChunk[] || [];

        return { summary, sources };
    } catch (error) {
        console.error(`Error fetching market analysis for ${crop}:`, error);
        throw new Error(`Failed to fetch market analysis for ${crop}. Please try again.`);
    }
};
