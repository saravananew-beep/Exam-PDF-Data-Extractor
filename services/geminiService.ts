
import { GoogleGenAI, Type } from "@google/genai";
import { ExamRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const extractTableData = async (imageBase64s: string[]): Promise<ExamRecord[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  // Use Gemini 3 Flash Preview for fast and accurate OCR
  const model = 'gemini-3-flash-preview';

  const prompt = `Extract all student exam records from these document pages. 
    The output must be an array of objects containing precisely these fields: 
    "slNo", "examDate", "batch", "subjectCode", "subjectName", "registerNumber", and "studentName".
    
    Instructions:
    1. Read every row carefully.
    2. If a field is missing, use an empty string.
    3. Ensure dates are consistently formatted if possible.
    4. "slNo" should be the serial number from the table.
    5. Return ONLY the JSON array.`;

  const contents = {
    parts: [
      { text: prompt },
      ...imageBase64s.map(base64 => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64.split(',')[1] || base64
        }
      }))
    ]
  };

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            slNo: { type: Type.STRING },
            examDate: { type: Type.STRING },
            batch: { type: Type.STRING },
            subjectCode: { type: Type.STRING },
            subjectName: { type: Type.STRING },
            registerNumber: { type: Type.STRING },
            studentName: { type: Type.STRING }
          },
          required: ["slNo", "examDate", "batch", "subjectCode", "subjectName", "registerNumber", "studentName"]
        }
      }
    }
  });

  try {
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as ExamRecord[];
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("The AI response was not in a valid format. Please try again.");
  }
};
