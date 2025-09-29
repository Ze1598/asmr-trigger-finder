import { GoogleGenAI } from "@google/genai";
import { Trigger, GroundingSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getTriggersFromVideo = async (url: string): Promise<{ triggers: Trigger[], sources: GroundingSource[] }> => {
  const prompt = `You are an ASMR video analyst. Your task is to analyze a YouTube video based on its publicly available text data. A user has provided this URL: "${url}".

Use the Google Search tool to find the video's title, description, comments, and any available transcripts.

Based ONLY on the text information you find, identify a diverse list of 5 to 10 distinct ASMR triggers. For each trigger, provide a timestamp if it is mentioned in the text you find.

IMPORTANT: You cannot 'watch' or 'listen' to the video. Your analysis must be strictly based on the text you can find on the web about this URL. If you cannot find specific triggers or timestamps in the search results, do not invent them.

Your response MUST be ONLY a valid JSON array of objects. Do not include any other text, explanations, or markdown formatting. Each object in the array must have exactly two keys:
1. "trigger": A string describing the trigger (e.g., "gentle tapping", "soft whispering", "crinkling sounds").
2. "timestamp": A string representing the time, STRICTLY formatted as "MM:SS" or "HH:MM:SS". Do NOT use only seconds.

Example of a valid response:
[
  {"trigger": "Tapping on glass", "timestamp": "01:23"},
  {"trigger": "Whispering affirmations", "timestamp": "05:41"},
  {"trigger": "Crinkling plastic wrap", "timestamp": "12:15"}
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