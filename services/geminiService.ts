import { GoogleGenAI } from "@google/genai";
import { Trigger, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getTriggersFromVideo = async (url: string): Promise<{ triggers: Trigger[], sources: GroundingSource[] }> => {
  const prompt = `You are a world-class expert at identifying ASMR triggers in YouTube videos. A user has provided this URL: "${url}".

Your task is to find a list of specific ASMR triggers and their timestamps from this video.

**Instructions:**
1.  **Use Google Search:** You MUST use the Google Search tool to find information about the provided YouTube video URL. Your goal is to find text that describes the triggers. Look for:
    *   The official video description (which often lists triggers).
    *   Pinned or top-voted user comments (which often have timestamped trigger lists).
    *   Online discussions, Reddit threads, or articles that mention the video's triggers.
2.  **Analyze Search Results:** Based *only* on the text you find through your search, identify 5-10 distinct ASMR triggers and their timestamps.
3.  **Format the Output:** Your response MUST be ONLY a valid JSON array of objects. Do not include any other text, explanations, or markdown. Each object must have two keys:
    *   "trigger": A string describing the trigger (e.g., "gentle tapping", "soft whispering").
    *   "timestamp": A string for the time, formatted as "MM:SS" or "HH:MM:SS".

**Important Rules:**
*   If your search does not yield any specific triggers or timestamps, you MUST return an empty JSON array \`[]\`.
*   Do not invent triggers or timestamps. Your answer must be grounded in the search results.

Example of a valid response:
[
  {"trigger": "Tapping on glass", "timestamp": "01:23"},
  {"trigger": "Whispering affirmations", "timestamp": "05:41"}
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
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