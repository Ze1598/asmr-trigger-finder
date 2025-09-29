import { GoogleGenAI } from "@google/genai";
import { Trigger, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getTriggersFromVideo = async (url: string): Promise<{ triggers: Trigger[], sources: GroundingSource[] }> => {
  const prompt = `You are a world-class expert at identifying ASMR triggers in YouTube videos. A user has provided this URL: "${url}".

Your task is to find a list of specific ASMR triggers and their timestamps from this video.

Your response MUST be ONLY a valid JSON array of objects. Do not include any other text, explanations, or markdown. Each object must have two keys:
    *   "trigger": A string describing the trigger (e.g., "gentle tapping", "soft whispering").
    *   "timestamp": A string for the time, formatted as "MM:SS" or "HH:MM:SS".

**Important Rules:**
*   You can ONLY derive your answer from the analysis of this particular YouTube video, no other sources allowed.
*   If your analysis does not yield any specific triggers or timestamps, you MUST return an empty JSON array \`[]\`.
*   Do not invent triggers or timestamps. Your answer must be grounded in the video results.

Example of a valid response:
[
  {"trigger": "Tapping on glass", "timestamp": "01:23"},
  {"trigger": "Whispering affirmations", "timestamp": "05:41"}
]`;

  try {

    const ytVideo = {
      fileData: {
        fileUri: url,
        mimeType: 'video/mp4',
      },
    };

    const safetySettings = [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE",
    },
  ];


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [ytVideo, prompt],
    });

    let jsonString = response.text.trim();
    
    // Clean potential markdown fences
    if (jsonString.startsWith("```json")) {
        jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.slice(3, -3).trim();
    }

    const triggers = JSON.parse(jsonString);

    if (!Array.isArray(triggers)) {
        throw new Error("AI response was not a valid array.");
    }
    
    const validatedTriggers = triggers.filter(item => item && typeof item.trigger === 'string' && (typeof item.timestamp === 'string' || typeof item.timestamp === 'number'));
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    return { triggers: validatedTriggers, sources };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get triggers from Gemini API.");
  }
};
