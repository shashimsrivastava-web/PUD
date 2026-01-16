
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartRemarks = async (tagNumber: string, fileRef: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short professional tracking remark for an asset with Tag Number: ${tagNumber} and File Reference: ${fileRef}. The remark should sound like a logistics entry.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 50,
      }
    });
    return response.text?.trim() || "No remarks generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating smart remark.";
  }
};

export const analyzeInventory = async (items: InventoryItem[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following inventory data and provide 3 key insights or risks (e.g., upcoming dispositions, data inconsistencies): ${JSON.stringify(items)}`,
      config: {
        temperature: 0.4,
      }
    });
    return response.text || "Unable to analyze inventory at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Inventory analysis failed.";
  }
};
