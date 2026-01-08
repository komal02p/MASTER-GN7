
import { GoogleGenAI, Type } from "@google/genai";
import { HealthMetrics, RiskAssessmentResult, DietDay, SymptomAnalysis, MedicalHistory, EducationalSource, Language } from "../types.ts";

// Initialize client securely using the environment variable directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a professional app logo for MASTER GN7
 */
export const generateAppLogo = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{
        parts: [{ text: "A professional, minimalist circular logo for a maternal health AI application called MASTER GN7. The logo should feature a stylised, elegant silhouette of a mother embracing a child. Primary color: Teal (#14b8a6). Clean lines, medical aesthetic, modern, trustworthy, high contrast, minimalist flat design, isolated on a white background." }]
      }],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return "https://img.icons8.com/ios-filled/100/14b8a6/mother-and-child.png"; // Fallback
  } catch (error) {
    console.error("Error generating app logo:", error);
    return "https://img.icons8.com/ios-filled/100/14b8a6/mother-and-child.png";
  }
};

// Using gemini-3-pro-preview for complex reasoning tasks like risk analysis
export const analyzeRisk = async (metrics: HealthMetrics, history?: MedicalHistory, lang: Language = 'English'): Promise<RiskAssessmentResult> => {
  let historyContext = "";
  if (history) {
    historyContext = `
    Patient Medical History:
    - Pre-existing Conditions: ${history.conditions || "None reported"}
    - Previous Surgeries: ${history.surgeries || "None reported"}
    - Allergies: ${history.allergies || "None reported"}
    `;
  }

  const prompt = `
    Analyze the following health metrics for a pregnant woman to detect antenatal complications:
    - Systolic BP: ${metrics.systolicBP} mmHg
    - Diastolic BP: ${metrics.diastolicBP} mmHg
    - Fasting Blood Sugar: ${metrics.bloodSugar} mg/dL
    - Hemoglobin: ${metrics.hemoglobin} g/dL
    - Weight: ${metrics.weight} kg
    - Age: ${metrics.age}
    - Pregnancy Week: ${metrics.weekOfPregnancy}
    - HIV Status: ${metrics.hivStatus}
    - Blood Group Rh Factor: ${metrics.rhFactor}
    
    ${historyContext}

    IMPORTANT: Provide the "reasoning" and "recommendations" in ${lang}.
    
    Perform a detailed multi-class classification.
    1. Classify Risk Level: "Low Risk", "Moderate Risk", "High Risk", "Critical".
    2. Calculate a Risk Score from 0 to 100.
    3. Identify Potential Conditions (Include considerations for Rh-isoimmunization if Rh- is present and HIV management if Positive).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ["Low Risk", "Moderate Risk", "High Risk", "Critical"] },
            riskScore: { type: Type.NUMBER },
            potentialConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskLevel", "riskScore", "potentialConditions", "reasoning", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text!) as RiskAssessmentResult;
  } catch (error) {
    console.error("Error analyzing risk:", error);
    return {
      riskLevel: "High Risk",
      riskScore: 85,
      potentialConditions: ["Error"],
      reasoning: "Analysis unavailable.",
      recommendations: ["Consult a doctor"]
    };
  }
};

// Using gemini-3-flash-preview for general text tasks
export const analyzeSymptoms = async (symptoms: string, lang: Language = 'English'): Promise<SymptomAnalysis> => {
    const prompt = `
      A pregnant woman is describing the following symptoms: "${symptoms}".
      Analyze severity and provide a response in ${lang}.
      1. Severity: "Self-Care", "Consult Doctor", "Immediate Emergency"
      2. Possible medical causes.
      3. Short action plan.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              severity: { type: Type.STRING, enum: ["Self-Care", "Consult Doctor", "Immediate Emergency"] },
              possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionRequired: { type: Type.STRING }
            },
            required: ["severity", "possibleCauses", "actionRequired"]
          }
        }
      });
      return JSON.parse(response.text!) as SymptomAnalysis;
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      return { severity: "Consult Doctor", possibleCauses: [], actionRequired: "Error" };
    }
};

export const generateDietPlan = async (metrics: HealthMetrics, foodPreference: string, lang: Language = 'English'): Promise<DietDay[]> => {
  const prompt = `
    Create a highly personalized 7-day weekly diet plan for a pregnant woman (Week ${metrics.weekOfPregnancy}) in ${lang}.
    Current Health Status:
    - Hemoglobin: ${metrics.hemoglobin} g/dL (Target: 11.0+)
    - Blood Pressure: ${metrics.systolicBP}/${metrics.diastolicBP} mmHg (Normal: 120/80)
    - Blood Sugar: ${metrics.bloodSugar} mg/dL (Normal fasting: 70-95 mg/dL)
    - Weight: ${metrics.weight} kg
    - HIV Status: ${metrics.hivStatus}
    - Rh Factor: ${metrics.rhFactor}
    
    Specific Clinical Guidance:
    1. If Hemoglobin is low (< 11.0), prioritize iron-rich local foods (e.g., green leafy vegetables, jaggery, beetroot).
    2. If Blood Pressure is high (> 130/85), suggest low-sodium, heart-healthy options and potassium-rich foods.
    3. If Blood Sugar is high (> 95 fasting), provide a low-glycemic diet to manage potential gestational diabetes.
    4. If HIV Positive, ensure high protein and calorie intake to maintain immunity, focusing on zinc and vitamin A/C.
    5. Ensure the diet is balanced for the current week of pregnancy.
    6. Focus on locally available foods in rural India.
    
    Return JSON array of 7 days.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              snack: { type: Type.STRING },
              dinner: { type: Type.STRING },
              calories: { type: Type.STRING }
            },
            required: ["day", "breakfast", "lunch", "snack", "dinner", "calories"]
          }
        }
      }
    });
    return JSON.parse(response.text!) as DietDay[];
  } catch (error) {
    console.error("Error generating diet:", error);
    return [];
  }
};

export const generateMealImage = async (mealDescription: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{
        parts: [{ text: `A vibrant, high-quality, professional food photography of a healthy, traditional Indian pregnancy meal: ${mealDescription}. Focus on nutrition, vibrant colors, and rural Indian setting. No people, just the plate of food.` }]
      }],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return "";
  } catch (error) {
    console.error("Error generating meal image:", error);
    return "";
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string, lang: Language = 'English'): Promise<string> => {
    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: history,
        config: {
            systemInstruction: `You are 'Janaki', a warm, helpful, and empathetic maternal health assistant. You must respond in ${lang}. Keep your advice simple, practical, and easy to understand for women in rural India. Always maintain a kind and supportive tone.`
        }
      });
      const result = await chat.sendMessage({ message });
      return result.text || "Error";
    } catch (error) {
      return "Error connecting.";
    }
  };

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
          { text: "Transcribe the spoken audio to text." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};

export const extractMetricsFromAudio = async (audioBase64: string): Promise<{ metrics: Partial<HealthMetrics>, history: Partial<MedicalHistory> }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: "audio/webm", data: audioBase64 } },
                    { text: "Extract numeric health metrics and history from dictation. Return JSON. Specifically look for HIV status (Positive/Negative) and Rh factor (+ or -)." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        metrics: {
                            type: Type.OBJECT,
                            properties: {
                                systolicBP: { type: Type.NUMBER },
                                diastolicBP: { type: Type.NUMBER },
                                bloodSugar: { type: Type.NUMBER },
                                hemoglobin: { type: Type.NUMBER },
                                weight: { type: Type.NUMBER },
                                age: { type: Type.NUMBER },
                                weekOfPregnancy: { type: Type.NUMBER },
                                hivStatus: { type: Type.STRING, enum: ['Positive', 'Negative', 'Unknown'] },
                                rhFactor: { type: Type.STRING, enum: ['Rh+', 'Rh-'] }
                            }
                        },
                        history: {
                            type: Type.OBJECT,
                            properties: {
                                conditions: { type: Type.STRING },
                                surgeries: { type: Type.STRING },
                                allergies: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text!);
    } catch (error) {
        return { metrics: {}, history: {} };
    }
}

export const getEducationalContent = async (query: string, lang: Language = 'English'): Promise<{ text: string, sources: EducationalSource[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide detailed maternal health advice in ${lang} for: "${query}".`,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources: EducationalSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title || "Source" }));
    return { text: response.text || "No info.", sources };
  } catch (error) {
    return { text: "Error fetching content.", sources: [] };
  }
};